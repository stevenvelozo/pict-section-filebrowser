const libPictProvider = require('pict-provider');

const _DefaultProviderConfiguration =
{
	"ProviderIdentifier": "Pict-FileBrowser-View",
	"AutoInitialize": true,
	"AutoInitializeOrdinal": 0,
	"AutoSolveWithApp": true,
	"AutoSolveOrdinal": 0
};

/**
 * Base provider for viewing-type views (file info, image preview).
 *
 * Handles retrieval of the currently selected file's metadata and
 * provides helpers for type detection and display formatting.
 * Subclass to add custom viewing logic (e.g. code preview, video player).
 */
class PictFileBrowserViewProvider extends libPictProvider
{
	constructor(pFable, pOptions, pServiceHash)
	{
		super(pFable, pOptions, pServiceHash);
	}

	/**
	 * Get the currently selected file entry from AppData.
	 *
	 * @returns {Object|null} The current file entry or null
	 */
	getCurrentFile()
	{
		let tmpStateAddresses = this.getFileBrowserOption('StateAddresses', {});
		let tmpFileAddress = tmpStateAddresses.CurrentFile || 'AppData.PictFileBrowser.CurrentFile';

		return this.pict.manifest.getValueByHash(
			{ AppData: this.pict.AppData, Pict: this.pict },
			tmpFileAddress) || null;
	}

	/**
	 * Check if the current file is an image.
	 *
	 * @param {Object} [pFileEntry] - Optional file entry (defaults to getCurrentFile())
	 * @returns {boolean} True if the file is an image type
	 */
	isImage(pFileEntry)
	{
		let tmpEntry = pFileEntry || this.getCurrentFile();
		if (!tmpEntry)
		{
			return false;
		}

		// Check MimeType first
		if (tmpEntry.MimeType && tmpEntry.MimeType.indexOf('image/') === 0)
		{
			return true;
		}

		// Fall back to extension
		let tmpExt = (tmpEntry.Extension || '').toLowerCase();
		let tmpImageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.svg', '.webp', '.bmp', '.ico', '.tiff', '.tif'];
		return tmpImageExtensions.indexOf(tmpExt) >= 0;
	}

	/**
	 * Get the URL for an image file (for display in an <img> tag).
	 *
	 * If the entry has a ThumbnailURL or URL property, return that.
	 * Otherwise return null — the consuming application must provide URLs.
	 *
	 * @param {Object} [pFileEntry] - Optional file entry
	 * @returns {string|null} The image URL or null
	 */
	getImageURL(pFileEntry)
	{
		let tmpEntry = pFileEntry || this.getCurrentFile();
		if (!tmpEntry)
		{
			return null;
		}

		return tmpEntry.URL || tmpEntry.ThumbnailURL || null;
	}

	/**
	 * Get the file type description based on extension.
	 *
	 * @param {Object} [pFileEntry] - Optional file entry
	 * @returns {string} Human-readable file type
	 */
	getFileTypeDescription(pFileEntry)
	{
		let tmpEntry = pFileEntry || this.getCurrentFile();
		if (!tmpEntry)
		{
			return 'Unknown';
		}

		if (tmpEntry.Type === 'folder')
		{
			return 'Folder';
		}

		let tmpExt = (tmpEntry.Extension || '').toLowerCase();
		switch (tmpExt)
		{
			case '.jpg': case '.jpeg': return 'JPEG Image';
			case '.png': return 'PNG Image';
			case '.gif': return 'GIF Image';
			case '.svg': return 'SVG Image';
			case '.webp': return 'WebP Image';
			case '.bmp': return 'Bitmap Image';
			case '.pdf': return 'PDF Document';
			case '.doc': case '.docx': return 'Word Document';
			case '.xls': case '.xlsx': return 'Excel Spreadsheet';
			case '.csv': return 'CSV File';
			case '.txt': return 'Text File';
			case '.md': return 'Markdown File';
			case '.html': return 'HTML File';
			case '.css': return 'CSS Stylesheet';
			case '.js': return 'JavaScript File';
			case '.ts': return 'TypeScript File';
			case '.json': return 'JSON File';
			case '.xml': return 'XML File';
			case '.yaml': case '.yml': return 'YAML File';
			case '.py': return 'Python Script';
			case '.rb': return 'Ruby Script';
			case '.java': return 'Java File';
			case '.c': return 'C Source File';
			case '.cpp': return 'C++ Source File';
			case '.go': return 'Go Source File';
			case '.rs': return 'Rust Source File';
			case '.zip': return 'ZIP Archive';
			case '.tar': return 'TAR Archive';
			case '.gz': return 'GZip Archive';
			case '.rar': return 'RAR Archive';
			case '.mp3': return 'MP3 Audio';
			case '.wav': return 'WAV Audio';
			case '.mp4': return 'MP4 Video';
			case '.avi': return 'AVI Video';
			case '.mov': return 'QuickTime Video';
			default:
				if (tmpExt)
				{
					return tmpExt.substring(1).toUpperCase() + ' File';
				}
				return 'File';
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

module.exports = PictFileBrowserViewProvider;

module.exports.default_configuration = _DefaultProviderConfiguration;
