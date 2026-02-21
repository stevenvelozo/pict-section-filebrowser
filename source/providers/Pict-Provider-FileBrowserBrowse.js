const libPictProvider = require('pict-provider');

const _DefaultProviderConfiguration =
{
	"ProviderIdentifier": "Pict-FileBrowser-Browse",
	"AutoInitialize": true,
	"AutoInitializeOrdinal": 0,
	"AutoSolveWithApp": true,
	"AutoSolveOrdinal": 0
};

/**
 * Base provider for browsing-type views (tree navigation, search).
 *
 * Subclass or override to customize how folder structures are resolved,
 * how search matching works, or where tree data is sourced.
 */
class PictFileBrowserBrowseProvider extends libPictProvider
{
	constructor(pFable, pOptions, pServiceHash)
	{
		super(pFable, pOptions, pServiceHash);
	}

	/**
	 * Get the folder tree data from AppData.
	 *
	 * Expected tree node format:
	 *   { Name: string, Path: string, Children: [ ...nodes ] }
	 *
	 * @returns {Array} Array of root tree nodes
	 */
	getFolderTree()
	{
		let tmpAddress = this.getFileBrowserOption('FolderTreeAddress', 'AppData.PictFileBrowser.FolderTree');
		let tmpTree = this.pict.manifest.getValueByHash(
			{ AppData: this.pict.AppData, Pict: this.pict },
			tmpAddress);
		return Array.isArray(tmpTree) ? tmpTree : [];
	}

	/**
	 * Flatten the tree into a list of all folders for search purposes.
	 *
	 * @param {Array} [pTree] - Optional tree to flatten (defaults to getFolderTree())
	 * @returns {Array} Flat array of { Name, Path } objects
	 */
	flattenTree(pTree)
	{
		let tmpTree = pTree || this.getFolderTree();
		let tmpResult = [];

		let fWalk = (pNodes, pParentPath) =>
		{
			for (let i = 0; i < pNodes.length; i++)
			{
				let tmpNode = pNodes[i];
				let tmpPath = pParentPath ? (pParentPath + '/' + tmpNode.Name) : tmpNode.Name;
				tmpResult.push({ Name: tmpNode.Name, Path: tmpPath });
				if (Array.isArray(tmpNode.Children) && tmpNode.Children.length > 0)
				{
					fWalk(tmpNode.Children, tmpPath);
				}
			}
		};

		fWalk(tmpTree, '');
		return tmpResult;
	}

	/**
	 * Get the cached child folders for a given path.
	 *
	 * This supports lazy-loaded trees where only one level of children
	 * is fetched at a time via the /children endpoint.  The cache is
	 * stored in AppData at the ChildFolderCacheAddress.
	 *
	 * Expected child entry format:
	 *   { Name: string, Path: string, HasChildren: boolean }
	 *
	 * @param {string} pPath - The parent folder path ('' for root)
	 * @returns {Array|null} Array of child entries, or null if not yet loaded
	 */
	getChildFolders(pPath)
	{
		let tmpAddress = this.getFileBrowserOption('ChildFolderCacheAddress', 'AppData.PictFileBrowser.ChildFolderCache');
		let tmpCache = this.pict.manifest.getValueByHash(
			{ AppData: this.pict.AppData, Pict: this.pict },
			tmpAddress);

		if (!tmpCache || typeof(tmpCache) !== 'object')
		{
			return null;
		}

		let tmpKey = pPath || '_root_';
		return Array.isArray(tmpCache[tmpKey]) ? tmpCache[tmpKey] : null;
	}

	/**
	 * Store child folders for a given path in the cache.
	 *
	 * @param {string} pPath - The parent folder path ('' for root)
	 * @param {Array} pChildren - Array of child folder entries
	 */
	setChildFolders(pPath, pChildren)
	{
		let tmpAddress = this.getFileBrowserOption('ChildFolderCacheAddress', 'AppData.PictFileBrowser.ChildFolderCache');
		let tmpCache = this.pict.manifest.getValueByHash(
			{ AppData: this.pict.AppData, Pict: this.pict },
			tmpAddress);

		if (!tmpCache || typeof(tmpCache) !== 'object')
		{
			tmpCache = {};
		}

		let tmpKey = pPath || '_root_';
		tmpCache[tmpKey] = Array.isArray(pChildren) ? pChildren : [];

		this.pict.manifest.setValueByHash(
			{ AppData: this.pict.AppData, Pict: this.pict },
			tmpAddress,
			tmpCache);
	}

	/**
	 * Search files and folders by name substring.
	 *
	 * @param {string} pQuery - The search query
	 * @param {Array} [pFileList] - Optional file list to search (defaults to AppData)
	 * @returns {Array} Matching file/folder entries
	 */
	searchFiles(pQuery, pFileList)
	{
		if (!pQuery || typeof pQuery !== 'string')
		{
			return [];
		}

		let tmpFileList = pFileList || this.getFileList();
		let tmpQuery = pQuery.toLowerCase();

		return tmpFileList.filter(
			(pEntry) =>
			{
				return pEntry.Name && pEntry.Name.toLowerCase().indexOf(tmpQuery) >= 0;
			});
	}

	/**
	 * Navigate to a folder path by updating CurrentLocation in AppData.
	 *
	 * @param {string} pPath - The folder path relative to root
	 */
	navigateToFolder(pPath)
	{
		let tmpStateAddresses = this.getFileBrowserOption('StateAddresses', {});
		let tmpLocationAddress = tmpStateAddresses.CurrentLocation || 'AppData.PictFileBrowser.CurrentLocation';
		let tmpFileAddress = tmpStateAddresses.CurrentFile || 'AppData.PictFileBrowser.CurrentFile';

		this.pict.manifest.setValueByHash(
			{ AppData: this.pict.AppData, Pict: this.pict },
			tmpLocationAddress,
			pPath || '');

		// Clear current file when navigating
		this.pict.manifest.setValueByHash(
			{ AppData: this.pict.AppData, Pict: this.pict },
			tmpFileAddress,
			null);
	}

	/**
	 * Get the current file list from AppData.
	 *
	 * @returns {Array} Array of file/folder entry objects
	 */
	getFileList()
	{
		let tmpAddress = this.getFileBrowserOption('FileListAddress', 'AppData.PictFileBrowser.FileList');
		let tmpList = this.pict.manifest.getValueByHash(
			{ AppData: this.pict.AppData, Pict: this.pict },
			tmpAddress);
		return Array.isArray(tmpList) ? tmpList : [];
	}

	/**
	 * Get a filebrowser option from the main filebrowser view configuration.
	 *
	 * @param {string} pKey - The option key
	 * @param {*} pDefault - Default value
	 * @returns {*} The option value
	 */
	getFileBrowserOption(pKey, pDefault)
	{
		if (this.pict.views && this.pict.views['Pict-FileBrowser'])
		{
			let tmpOptions = this.pict.views['Pict-FileBrowser'].options;
			if (tmpOptions && (pKey in tmpOptions))
			{
				return tmpOptions[pKey];
			}
		}
		return pDefault;
	}
}

module.exports = PictFileBrowserBrowseProvider;

module.exports.default_configuration = _DefaultProviderConfiguration;
