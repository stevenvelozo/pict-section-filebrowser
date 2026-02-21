const libPictProvider = require('pict-provider');

const _DefaultProviderConfiguration =
{
	"ProviderIdentifier": "Pict-FileBrowser-List",
	"AutoInitialize": true,
	"AutoInitializeOrdinal": 0,
	"AutoSolveWithApp": true,
	"AutoSolveOrdinal": 0
};

/**
 * Base provider for listing-type views (detail list, icon grid).
 *
 * Handles file list retrieval, sorting, filtering, and selection.
 * Subclass to customize sort behavior, grouping, or filtering logic.
 */
class PictFileBrowserListProvider extends libPictProvider
{
	constructor(pFable, pOptions, pServiceHash)
	{
		super(pFable, pOptions, pServiceHash);

		this.sortField = 'Name';
		this.sortAscending = true;
	}

	/**
	 * Get the file list from AppData, optionally filtered to current location.
	 *
	 * @returns {Array} Array of file entry objects for the current folder
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
	 * Get a sorted copy of the file list.
	 * Folders are always sorted before files.
	 *
	 * @param {Array} [pFileList] - Optional list to sort (defaults to getFileList())
	 * @returns {Array} Sorted file list (new array)
	 */
	getSortedFileList(pFileList)
	{
		let tmpList = (pFileList || this.getFileList()).slice();
		let tmpField = this.sortField;
		let tmpAscending = this.sortAscending;

		tmpList.sort(
			(pA, pB) =>
			{
				// Folders first
				let tmpAIsFolder = (pA.Type === 'folder') ? 0 : 1;
				let tmpBIsFolder = (pB.Type === 'folder') ? 0 : 1;
				if (tmpAIsFolder !== tmpBIsFolder)
				{
					return tmpAIsFolder - tmpBIsFolder;
				}

				let tmpValA = pA[tmpField];
				let tmpValB = pB[tmpField];

				// Null-safe comparison
				if (tmpValA == null && tmpValB == null) return 0;
				if (tmpValA == null) return 1;
				if (tmpValB == null) return -1;

				let tmpResult = 0;
				if (typeof tmpValA === 'string')
				{
					tmpResult = tmpValA.localeCompare(tmpValB);
				}
				else
				{
					tmpResult = tmpValA < tmpValB ? -1 : (tmpValA > tmpValB ? 1 : 0);
				}

				return tmpAscending ? tmpResult : -tmpResult;
			});

		return tmpList;
	}

	/**
	 * Set the sort field and toggle direction if same field.
	 *
	 * @param {string} pField - The field name to sort by
	 */
	setSortField(pField)
	{
		if (this.sortField === pField)
		{
			this.sortAscending = !this.sortAscending;
		}
		else
		{
			this.sortField = pField;
			this.sortAscending = true;
		}
	}

	/**
	 * Select a file entry by updating CurrentFile in AppData.
	 *
	 * @param {Object} pFileEntry - The file entry to select
	 */
	selectFile(pFileEntry)
	{
		let tmpStateAddresses = this.getFileBrowserOption('StateAddresses', {});
		let tmpFileAddress = tmpStateAddresses.CurrentFile || 'AppData.PictFileBrowser.CurrentFile';

		this.pict.manifest.setValueByHash(
			{ AppData: this.pict.AppData, Pict: this.pict },
			tmpFileAddress,
			pFileEntry || null);
	}

	/**
	 * Get the currently selected file entry.
	 *
	 * @returns {Object|null} The current file entry or null
	 */
	getSelectedFile()
	{
		let tmpStateAddresses = this.getFileBrowserOption('StateAddresses', {});
		let tmpFileAddress = tmpStateAddresses.CurrentFile || 'AppData.PictFileBrowser.CurrentFile';

		return this.pict.manifest.getValueByHash(
			{ AppData: this.pict.AppData, Pict: this.pict },
			tmpFileAddress) || null;
	}

	/**
	 * Open a file or folder entry.
	 * Folders navigate into them; files select them.
	 *
	 * @param {Object} pEntry - The entry to open
	 */
	openEntry(pEntry)
	{
		if (!pEntry)
		{
			return;
		}

		if (pEntry.Type === 'folder')
		{
			// Navigate into folder
			let tmpBrowseProvider = this.pict.providers['Pict-FileBrowser-Browse'];
			if (tmpBrowseProvider)
			{
				let tmpStateAddresses = this.getFileBrowserOption('StateAddresses', {});
				let tmpLocationAddress = tmpStateAddresses.CurrentLocation || 'AppData.PictFileBrowser.CurrentLocation';
				let tmpCurrentLocation = this.pict.manifest.getValueByHash(
					{ AppData: this.pict.AppData, Pict: this.pict },
					tmpLocationAddress) || '';

				let tmpNewPath = tmpCurrentLocation ? (tmpCurrentLocation + '/' + pEntry.Name) : pEntry.Name;
				tmpBrowseProvider.navigateToFolder(tmpNewPath);
			}
		}
		else
		{
			this.selectFile(pEntry);
		}
	}

	/**
	 * Format a file size in bytes to a human-readable string.
	 *
	 * @param {number} pSize - Size in bytes
	 * @returns {string} Formatted size string
	 */
	formatFileSize(pSize)
	{
		if (pSize == null || isNaN(pSize))
		{
			return '--';
		}
		if (pSize < 1024)
		{
			return pSize + ' B';
		}
		if (pSize < 1048576)
		{
			return (pSize / 1024).toFixed(1) + ' KB';
		}
		if (pSize < 1073741824)
		{
			return (pSize / 1048576).toFixed(1) + ' MB';
		}
		return (pSize / 1073741824).toFixed(1) + ' GB';
	}

	/**
	 * Format a date value to a display string.
	 *
	 * @param {string|number|Date} pDate - The date value
	 * @returns {string} Formatted date string
	 */
	formatDate(pDate)
	{
		if (!pDate)
		{
			return '--';
		}

		try
		{
			let tmpDate = new Date(pDate);
			if (isNaN(tmpDate.getTime()))
			{
				return '--';
			}
			return tmpDate.toLocaleDateString() + ' ' + tmpDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
		}
		catch (pError)
		{
			return '--';
		}
	}

	/**
	 * Get an icon string for a file entry.
	 * Returns the entry's Icon property if set, otherwise a default based on type/extension.
	 *
	 * @param {Object} pEntry - The file entry
	 * @returns {string} Icon character or emoji
	 */
	getEntryIcon(pEntry)
	{
		if (!pEntry)
		{
			return '';
		}

		if (pEntry.Icon)
		{
			return pEntry.Icon;
		}

		// Use the SVG icon provider if available
		let tmpIconProvider = this.pict.providers['Pict-FileBrowser-Icons'];
		if (tmpIconProvider)
		{
			return tmpIconProvider.getIconForEntry(pEntry, 16);
		}

		// Fallback to emoji icons when icon provider is not registered
		if (pEntry.Type === 'folder')
		{
			return '\uD83D\uDCC1';
		}

		let tmpExt = (pEntry.Extension || '').toLowerCase();
		switch (tmpExt)
		{
			case '.jpg': case '.jpeg': case '.png': case '.gif': case '.svg': case '.webp': case '.bmp':
				return '\uD83D\uDDBC';
			case '.pdf':
				return '\uD83D\uDCC4';
			case '.doc': case '.docx': case '.txt': case '.md': case '.rtf':
				return '\uD83D\uDCC3';
			case '.xls': case '.xlsx': case '.csv':
				return '\uD83D\uDCCA';
			case '.zip': case '.tar': case '.gz': case '.rar': case '.7z':
				return '\uD83D\uDCE6';
			case '.js': case '.ts': case '.py': case '.rb': case '.java': case '.c': case '.cpp': case '.go': case '.rs':
				return '\uD83D\uDCBB';
			case '.html': case '.css': case '.json': case '.xml': case '.yaml': case '.yml':
				return '\uD83C\uDF10';
			case '.mp3': case '.wav': case '.flac': case '.ogg': case '.aac':
				return '\uD83C\uDFB5';
			case '.mp4': case '.avi': case '.mov': case '.mkv': case '.webm':
				return '\uD83C\uDFA5';
			default:
				return '\uD83D\uDCC4';
		}
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

module.exports = PictFileBrowserListProvider;

module.exports.default_configuration = _DefaultProviderConfiguration;
