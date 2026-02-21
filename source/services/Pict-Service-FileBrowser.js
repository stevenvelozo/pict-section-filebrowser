/**
* Pict FileBrowser Service
*
* A Fable service that provides:
*   1. REST API endpoints for browsing a filesystem path
*   2. A static web app that uses the pict-section-filebrowser control
*
* Usage:
*   const libFable = require('fable');
*   const libOrator = require('orator');
*   const libOratorServiceServerRestify = require('orator-serviceserver-restify');
*   const libPictFileBrowser = require('pict-section-filebrowser');
*
*   let tmpFable = new libFable({ Product: 'MyApp', APIServerPort: 8080 });
*   tmpFable.serviceManager.addServiceType('OratorServiceServer', libOratorServiceServerRestify);
*   tmpFable.serviceManager.addServiceType('Orator', libOrator);
*
*   let tmpOrator = tmpFable.serviceManager.instantiateServiceProvider('Orator');
*   let tmpFileBrowser = new libPictFileBrowser.FileBrowserService(tmpFable,
*       { BasePath: '/path/to/browse', APIRoutePrefix: '/api/filebrowser' });
*
*   tmpOrator.startService(() =>
*   {
*       tmpFileBrowser.connectRoutes();
*       console.log('File browser ready at http://localhost:8080/filebrowser/');
*   });
*
* @license MIT
* @author Steven Velozo <steven@velozo.com>
*/

const libFableServiceProviderBase = require('fable-serviceproviderbase');
const libPath = require('path');
const libFS = require('fs');
const libUrl = require('url');

const _DefaultServiceConfiguration =
{
	// The root filesystem path to expose for browsing.
	"BasePath": ".",
	// Route prefix for the REST API endpoints.
	"APIRoutePrefix": "/api/filebrowser",
	// Route for the static web app.
	"WebAppRoute": "/filebrowser/*",
	// Route strip for static serving.
	"WebAppRouteStrip": "/filebrowser/",
	// Whether to serve the built-in web app.
	"ServeWebApp": true,
	// Whether hidden files (dotfiles) should be included.
	"IncludeHiddenFiles": false,
	// Maximum depth for recursive tree generation (0 = unlimited).
	"MaxTreeDepth": 2
};

class PictFileBrowserService extends libFableServiceProviderBase
{
	constructor(pFable, pOptions, pServiceHash)
	{
		super(pFable, pOptions, pServiceHash);

		this.serviceType = 'PictFileBrowserService';

		// Merge with defaults
		for (let tmpKey in _DefaultServiceConfiguration)
		{
			if (!(tmpKey in this.options))
			{
				this.options[tmpKey] = _DefaultServiceConfiguration[tmpKey];
			}
		}

		// Resolve the base path to an absolute path
		this.basePath = libPath.resolve(this.options.BasePath);
	}

	/**
	 * Connect all API routes and optionally the static web app to Orator.
	 *
	 * Call this after Orator has been initialized (typically after startService).
	 */
	connectRoutes()
	{
		if (!this.fable.Orator || !this.fable.Orator.serviceServer)
		{
			this.log.error('PictFileBrowserService: Orator service server is not available. Initialize Orator first.');
			return false;
		}

		let tmpServer = this.fable.Orator.serviceServer;
		let tmpPrefix = this.options.APIRoutePrefix;

		// GET /api/filebrowser/list?path=relative/path
		// Returns the file list for a directory
		tmpServer.get(tmpPrefix + '/list',
			(pRequest, pResponse, fNext) =>
			{
				let tmpQueryParams = this.parseQueryParams(pRequest);
				let tmpRelativePath = tmpQueryParams.path || '';

				this.listDirectory(tmpRelativePath,
					(pError, pFileList) =>
					{
						if (pError)
						{
							pResponse.send(400, { Error: pError.message });
							return fNext();
						}
						pResponse.send(pFileList);
						return fNext();
					});
			});

		// GET /api/filebrowser/tree?depth=N
		// Returns the full folder tree structure
		tmpServer.get(tmpPrefix + '/tree',
			(pRequest, pResponse, fNext) =>
			{
				let tmpQueryParams = this.parseQueryParams(pRequest);
				let tmpDepth = this.options.MaxTreeDepth;
				if (tmpQueryParams.depth)
				{
					tmpDepth = parseInt(tmpQueryParams.depth) || this.options.MaxTreeDepth;
				}

				this.buildFolderTree('', tmpDepth,
					(pError, pTree) =>
					{
						if (pError)
						{
							pResponse.send(400, { Error: pError.message });
							return fNext();
						}
						pResponse.send(pTree);
						return fNext();
					});
			});

		// GET /api/filebrowser/info?path=relative/path/to/file
		// Returns metadata for a single file or folder
		tmpServer.get(tmpPrefix + '/info',
			(pRequest, pResponse, fNext) =>
			{
				let tmpQueryParams = this.parseQueryParams(pRequest);
				let tmpRelativePath = tmpQueryParams.path || '';

				this.getFileInfo(tmpRelativePath,
					(pError, pInfo) =>
					{
						if (pError)
						{
							pResponse.send(400, { Error: pError.message });
							return fNext();
						}
						pResponse.send(pInfo);
						return fNext();
					});
			});

		// GET /api/filebrowser/children?path=relative/path
		// Returns the immediate child folders for a given path (for lazy tree loading)
		tmpServer.get(tmpPrefix + '/children',
			(pRequest, pResponse, fNext) =>
			{
				let tmpQueryParams = this.parseQueryParams(pRequest);
				let tmpRelativePath = tmpQueryParams.path || '';

				this.listChildFolders(tmpRelativePath,
					(pError, pChildren) =>
					{
						if (pError)
						{
							pResponse.send(400, { Error: pError.message });
							return fNext();
						}
						pResponse.send(pChildren);
						return fNext();
					});
			});

		// Serve the static web app
		if (this.options.ServeWebApp)
		{
			let tmpWebAppPath = libPath.join(__dirname, '..', 'www');
			this.fable.Orator.addStaticRoute(
				tmpWebAppPath,
				'index.html',
				this.options.WebAppRoute,
				this.options.WebAppRouteStrip);
		}

		this.log.info('PictFileBrowserService: Routes connected. Browsing path: ' + this.basePath);
		return true;
	}

	/**
	 * Parse query parameters from a request URL.
	 *
	 * Restify does not register its queryParser plugin by default, so
	 * pRequest.query may be undefined.  This helper reads query parameters
	 * directly from the request URL so our endpoints work regardless of
	 * whether the consuming application has registered the plugin.
	 *
	 * @param {Object} pRequest - The HTTP request object
	 * @returns {Object} A plain object with query parameter key/value pairs
	 */
	parseQueryParams(pRequest)
	{
		// If restify's queryParser plugin is active, use it directly
		if (pRequest.query && typeof(pRequest.query) === 'object')
		{
			return pRequest.query;
		}

		// Fall back to parsing from the URL
		let tmpParsed = libUrl.parse(pRequest.url, true);
		return tmpParsed.query || {};
	}

	/**
	 * Resolve a relative path against the base path, ensuring it doesn't escape.
	 *
	 * @param {string} pRelativePath - The user-supplied relative path
	 * @returns {string|null} The resolved absolute path, or null if it escapes the base
	 */
	resolveSafePath(pRelativePath)
	{
		let tmpClean = (pRelativePath || '').replace(/\.\./g, '').replace(/\/\//g, '/');
		let tmpResolved = libPath.resolve(this.basePath, tmpClean);

		// Ensure the resolved path is within the base path
		if (tmpResolved.indexOf(this.basePath) !== 0)
		{
			return null;
		}

		return tmpResolved;
	}

	/**
	 * List the contents of a directory.
	 *
	 * @param {string} pRelativePath - Path relative to basePath
	 * @param {Function} fCallback - Callback(pError, pFileList)
	 */
	listDirectory(pRelativePath, fCallback)
	{
		let tmpAbsolutePath = this.resolveSafePath(pRelativePath);
		if (!tmpAbsolutePath)
		{
			return fCallback(new Error('Invalid path'));
		}

		libFS.readdir(tmpAbsolutePath, { withFileTypes: true },
			(pError, pEntries) =>
			{
				if (pError)
				{
					if (pError.code === 'ENOENT')
					{
						return fCallback(new Error('Path not found'));
					}
					if (pError.code === 'ENOTDIR')
					{
						return fCallback(new Error('Path is not a directory'));
					}
					return fCallback(pError);
				}

				let tmpFileList = [];
				let tmpPending = pEntries.length;

				if (tmpPending === 0)
				{
					return fCallback(null, tmpFileList);
				}

				for (let i = 0; i < pEntries.length; i++)
				{
					let tmpEntry = pEntries[i];
					let tmpName = tmpEntry.name;

					// Skip hidden files if configured
					if (!this.options.IncludeHiddenFiles && tmpName.charAt(0) === '.')
					{
						tmpPending--;
						if (tmpPending === 0)
						{
							return fCallback(null, tmpFileList);
						}
						continue;
					}

					let tmpEntryPath = libPath.join(tmpAbsolutePath, tmpName);
					let tmpRelPath = pRelativePath ? (pRelativePath + '/' + tmpName) : tmpName;

					libFS.stat(tmpEntryPath,
						((pName, pRelPath, pIsDir) =>
						{
							return (pStatError, pStats) =>
							{
								let tmpFileEntry =
								{
									Name: pName,
									Path: pRelPath,
									Type: pIsDir ? 'folder' : 'file'
								};

								if (pStats && !pStatError)
								{
									tmpFileEntry.Size = pStats.size;
									tmpFileEntry.Modified = pStats.mtime;
									tmpFileEntry.Created = pStats.birthtime;

									if (!pIsDir)
									{
										tmpFileEntry.Extension = libPath.extname(pName);
									}
								}

								tmpFileList.push(tmpFileEntry);
								tmpPending--;

								if (tmpPending === 0)
								{
									return fCallback(null, tmpFileList);
								}
							};
						})(tmpName, tmpRelPath, tmpEntry.isDirectory()));
				}
			});
	}

	/**
	 * List the immediate child folders of a directory.
	 *
	 * Returns a flat array of folder entries (Name, Path, HasChildren) suitable
	 * for lazy tree loading — the client can call this again for any child
	 * to expand one level at a time.
	 *
	 * @param {string} pRelativePath - Path relative to basePath
	 * @param {Function} fCallback - Callback(pError, pChildFolders)
	 */
	listChildFolders(pRelativePath, fCallback)
	{
		let tmpAbsolutePath = this.resolveSafePath(pRelativePath);
		if (!tmpAbsolutePath)
		{
			return fCallback(new Error('Invalid path'));
		}

		libFS.readdir(tmpAbsolutePath, { withFileTypes: true },
			(pError, pEntries) =>
			{
				if (pError)
				{
					if (pError.code === 'ENOENT')
					{
						return fCallback(new Error('Path not found'));
					}
					if (pError.code === 'ENOTDIR')
					{
						return fCallback(new Error('Path is not a directory'));
					}
					return fCallback(pError);
				}

				// Collect only directories
				let tmpFolders = [];
				for (let i = 0; i < pEntries.length; i++)
				{
					if (!pEntries[i].isDirectory())
					{
						continue;
					}

					let tmpName = pEntries[i].name;

					// Skip hidden folders if configured
					if (!this.options.IncludeHiddenFiles && tmpName.charAt(0) === '.')
					{
						continue;
					}

					tmpFolders.push(tmpName);
				}

				// Sort alphabetically
				tmpFolders.sort((pA, pB) => { return pA.localeCompare(pB); });

				if (tmpFolders.length === 0)
				{
					return fCallback(null, []);
				}

				// For each folder, peek inside to see if it has any child folders
				// (so the UI knows whether to show an expand toggle)
				let tmpResults = [];
				let tmpPending = tmpFolders.length;

				for (let i = 0; i < tmpFolders.length; i++)
				{
					let tmpName = tmpFolders[i];
					let tmpChildAbs = libPath.join(tmpAbsolutePath, tmpName);
					let tmpChildRel = pRelativePath ? (pRelativePath + '/' + tmpName) : tmpName;

					libFS.readdir(tmpChildAbs, { withFileTypes: true },
						((pFolderName, pFolderRelPath) =>
						{
							return (pChildError, pChildEntries) =>
							{
								let tmpHasChildren = false;

								if (!pChildError && pChildEntries)
								{
									for (let j = 0; j < pChildEntries.length; j++)
									{
										if (pChildEntries[j].isDirectory())
										{
											let tmpChildName = pChildEntries[j].name;
											if (this.options.IncludeHiddenFiles || tmpChildName.charAt(0) !== '.')
											{
												tmpHasChildren = true;
												break;
											}
										}
									}
								}

								tmpResults.push(
								{
									Name: pFolderName,
									Path: pFolderRelPath,
									HasChildren: tmpHasChildren
								});

								tmpPending--;
								if (tmpPending === 0)
								{
									// Re-sort since callbacks may arrive out of order
									tmpResults.sort((pA, pB) => { return pA.Name.localeCompare(pB.Name); });
									return fCallback(null, tmpResults);
								}
							};
						})(tmpName, tmpChildRel));
				}
			});
	}

	/**
	 * Build a recursive folder tree.
	 *
	 * @param {string} pRelativePath - Path relative to basePath
	 * @param {number} pMaxDepth - Maximum recursion depth
	 * @param {Function} fCallback - Callback(pError, pTree)
	 */
	buildFolderTree(pRelativePath, pMaxDepth, fCallback)
	{
		let tmpAbsolutePath = this.resolveSafePath(pRelativePath);
		if (!tmpAbsolutePath)
		{
			return fCallback(new Error('Invalid path'));
		}

		this._buildTreeRecursive(tmpAbsolutePath, pRelativePath, pMaxDepth, 0, fCallback);
	}

	/**
	 * Recursive helper for tree building.
	 *
	 * @param {string} pAbsPath - Absolute filesystem path
	 * @param {string} pRelPath - Relative path for the response
	 * @param {number} pMaxDepth - Maximum depth
	 * @param {number} pCurrentDepth - Current depth
	 * @param {Function} fCallback - Callback(pError, pNodes)
	 */
	_buildTreeRecursive(pAbsPath, pRelPath, pMaxDepth, pCurrentDepth, fCallback)
	{
		if (pMaxDepth > 0 && pCurrentDepth >= pMaxDepth)
		{
			return fCallback(null, []);
		}

		libFS.readdir(pAbsPath, { withFileTypes: true },
			(pError, pEntries) =>
			{
				if (pError)
				{
					return fCallback(null, []);
				}

				let tmpFolders = [];
				for (let i = 0; i < pEntries.length; i++)
				{
					if (pEntries[i].isDirectory())
					{
						let tmpName = pEntries[i].name;

						// Skip hidden folders if configured
						if (!this.options.IncludeHiddenFiles && tmpName.charAt(0) === '.')
						{
							continue;
						}

						tmpFolders.push(tmpName);
					}
				}

				if (tmpFolders.length === 0)
				{
					return fCallback(null, []);
				}

				let tmpNodes = [];
				let tmpPending = tmpFolders.length;

				for (let i = 0; i < tmpFolders.length; i++)
				{
					let tmpName = tmpFolders[i];
					let tmpChildAbs = libPath.join(pAbsPath, tmpName);
					let tmpChildRel = pRelPath ? (pRelPath + '/' + tmpName) : tmpName;

					this._buildTreeRecursive(tmpChildAbs, tmpChildRel, pMaxDepth, pCurrentDepth + 1,
						((pNodeName, pNodeRelPath) =>
						{
							return (pChildError, pChildren) =>
							{
								tmpNodes.push(
								{
									Name: pNodeName,
									Path: pNodeRelPath,
									Children: pChildren || []
								});

								tmpPending--;
								if (tmpPending === 0)
								{
									// Sort folders alphabetically
									tmpNodes.sort((pA, pB) => { return pA.Name.localeCompare(pB.Name); });
									return fCallback(null, tmpNodes);
								}
							};
						})(tmpName, tmpChildRel));
				}
			});
	}

	/**
	 * Get metadata info for a single file or folder.
	 *
	 * @param {string} pRelativePath - Path relative to basePath
	 * @param {Function} fCallback - Callback(pError, pInfo)
	 */
	getFileInfo(pRelativePath, fCallback)
	{
		let tmpAbsolutePath = this.resolveSafePath(pRelativePath);
		if (!tmpAbsolutePath)
		{
			return fCallback(new Error('Invalid path'));
		}

		libFS.stat(tmpAbsolutePath,
			(pError, pStats) =>
			{
				if (pError)
				{
					if (pError.code === 'ENOENT')
					{
						return fCallback(new Error('Path not found'));
					}
					return fCallback(pError);
				}

				let tmpName = libPath.basename(tmpAbsolutePath);

				let tmpInfo =
				{
					Name: tmpName,
					Path: pRelativePath || tmpName,
					Type: pStats.isDirectory() ? 'folder' : 'file',
					Size: pStats.size,
					Modified: pStats.mtime,
					Created: pStats.birthtime
				};

				if (!pStats.isDirectory())
				{
					tmpInfo.Extension = libPath.extname(tmpName);
				}

				return fCallback(null, tmpInfo);
			});
	}
}

module.exports = PictFileBrowserService;

module.exports.default_configuration = _DefaultServiceConfiguration;
