const libPictProvider = require('pict-provider');

const _DefaultProviderConfiguration =
{
	"ProviderIdentifier": "Pict-FileBrowser-Icons",
	"AutoInitialize": true,
	"AutoInitializeOrdinal": 0,
	"AutoSolveWithApp": true,
	"AutoSolveOrdinal": 0
};

// ---- Color palette (matches filebrowser CSS) ----
const _Colors =
{
	Primary: '#3D3229',
	Accent: '#2E7D74',
	Muted: '#8A7F72',
	Light: '#F5F0E8',
	WarmBeige: '#EAE3D8',
	TealTint: '#E0EDE9',
	Lavender: '#E8E0F0',
	AmberTint: '#F0E8D0'
};

// ====================================================================
// RETRO / HAND-DRAWN SVG ICON SET
//
// Slightly irregular coordinates, warm fills, organic character.
// Uses 1.8px stroke, skewed coords, and varying stroke widths.
// Each icon function returns an SVG string for a given pixel size.
// ====================================================================
const _BuiltInIcons =
{
	// ---- Folder icons ----
	'folder': (pSize) =>
	{
		return '<svg width="' + pSize + '" height="' + pSize + '" viewBox="0 0 24 24" fill="none">' +
			'<path d="M3.2 7.1V17.2C3.2 18.2 4 19.1 5.1 18.9L19.1 19.1C20 19.1 20.9 18.2 20.8 17.1V9.1C20.9 8 20.1 7.1 19 7.1H12.1L10.1 4.9H5.1C3.9 5 3.1 5.9 3.2 7.1Z" fill="' + _Colors.WarmBeige + '" stroke="' + _Colors.Primary + '" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" />' +
			'<path d="M3.2 9H20.8" stroke="' + _Colors.Primary + '" stroke-width="1" opacity="0.3" />' +
		'</svg>';
	},

	'folder-open': (pSize) =>
	{
		return '<svg width="' + pSize + '" height="' + pSize + '" viewBox="0 0 24 24" fill="none">' +
			'<path d="M3.2 7.1V17.2C3.2 18.2 4 19.1 5.1 18.9L19.1 19.1C20 19.1 20.9 18.2 20.8 17.1V9.1C20.9 8 20.1 7.1 19 7.1H12.1L10.1 4.9H5.1C3.9 5 3.1 5.9 3.2 7.1Z" fill="' + _Colors.WarmBeige + '" stroke="' + _Colors.Primary + '" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" />' +
			'<path d="M3.2 10.2L5.8 17.8C6 18.4 6.6 18.9 7.2 18.9H19.8L22.1 11.2C22.3 10.6 21.8 10 21.2 10H5.2C4.6 10 4 10.4 3.8 11" stroke="' + _Colors.Primary + '" stroke-width="1.5" fill="' + _Colors.Light + '" stroke-linecap="round" stroke-linejoin="round" opacity="0.7" />' +
		'</svg>';
	},

	// ---- Generic file ----
	'file': (pSize) =>
	{
		return '<svg width="' + pSize + '" height="' + pSize + '" viewBox="0 0 24 24" fill="none">' +
			'<path d="M14.1 2.1H6.2C5 2.2 4.1 3 4.1 4.1V20.1C4 21.2 5 22 6.1 21.9H18C19.1 22 20 21.1 19.9 19.9V8.1L14.1 2.1Z" fill="' + _Colors.Light + '" stroke="' + _Colors.Primary + '" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" />' +
			'<path d="M13.9 2.1V8.2H20" stroke="' + _Colors.Primary + '" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" />' +
		'</svg>';
	},

	// ---- Text / document file ----
	'file-text': (pSize) =>
	{
		return '<svg width="' + pSize + '" height="' + pSize + '" viewBox="0 0 24 24" fill="none">' +
			'<path d="M14.1 2.1H6.2C5 2.2 4.1 3 4.1 4.1V20.1C4 21.2 5 22 6.1 21.9H18C19.1 22 20 21.1 19.9 19.9V8.1L14.1 2.1Z" fill="' + _Colors.Light + '" stroke="' + _Colors.Primary + '" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" />' +
			'<path d="M13.9 2.1V8.2H20" stroke="' + _Colors.Primary + '" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" />' +
			'<line x1="8.1" y1="12.8" x2="15.9" y2="12.8" stroke="' + _Colors.Muted + '" stroke-width="1.2" stroke-linecap="round" />' +
			'<line x1="8.1" y1="15.8" x2="15.9" y2="15.8" stroke="' + _Colors.Muted + '" stroke-width="1.2" stroke-linecap="round" />' +
			'<line x1="8.1" y1="18.8" x2="12.2" y2="18.8" stroke="' + _Colors.Muted + '" stroke-width="1.2" stroke-linecap="round" />' +
		'</svg>';
	},

	// ---- Code file ----
	'file-code': (pSize) =>
	{
		return '<svg width="' + pSize + '" height="' + pSize + '" viewBox="0 0 24 24" fill="none">' +
			'<path d="M14.1 2.1H6.2C5 2.2 4.1 3 4.1 4.1V20.1C4 21.2 5 22 6.1 21.9H18C19.1 22 20 21.1 19.9 19.9V8.1L14.1 2.1Z" fill="' + _Colors.Light + '" stroke="' + _Colors.Primary + '" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" />' +
			'<path d="M13.9 2.1V8.2H20" stroke="' + _Colors.Primary + '" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" />' +
			'<path d="M8.5 13.2L6.8 15.1L8.6 16.8" stroke="' + _Colors.Accent + '" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round" />' +
			'<path d="M15.5 13.2L17.2 15.1L15.4 16.8" stroke="' + _Colors.Accent + '" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round" />' +
			'<line x1="12.8" y1="12" x2="11.2" y2="18" stroke="' + _Colors.Muted + '" stroke-width="1.2" stroke-linecap="round" />' +
		'</svg>';
	},

	// ---- Image file ----
	'file-image': (pSize) =>
	{
		return '<svg width="' + pSize + '" height="' + pSize + '" viewBox="0 0 24 24" fill="none">' +
			'<rect x="3.1" y="3.2" width="17.8" height="17.7" rx="2" fill="' + _Colors.Lavender + '" stroke="' + _Colors.Primary + '" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" />' +
			'<circle cx="8.3" cy="8.7" r="1.8" fill="' + _Colors.Accent + '" />' +
			'<path d="M20.8 15.2L15.9 10.1L5.2 20.8" stroke="' + _Colors.Primary + '" stroke-width="1.8" fill="none" stroke-linecap="round" stroke-linejoin="round" />' +
		'</svg>';
	},

	// ---- PDF file ----
	'file-pdf': (pSize) =>
	{
		return '<svg width="' + pSize + '" height="' + pSize + '" viewBox="0 0 24 24" fill="none">' +
			'<path d="M14.1 2.1H6.2C5 2.2 4.1 3 4.1 4.1V20.1C4 21.2 5 22 6.1 21.9H18C19.1 22 20 21.1 19.9 19.9V8.1L14.1 2.1Z" fill="#F0DDDD" stroke="' + _Colors.Primary + '" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" />' +
			'<path d="M13.9 2.1V8.2H20" stroke="' + _Colors.Primary + '" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" />' +
			'<text x="8.2" y="16.8" font-family="sans-serif" font-weight="700" font-size="6.5" fill="#C04040" letter-spacing="-0.3">PDF</text>' +
		'</svg>';
	},

	// ---- Spreadsheet file ----
	'file-spreadsheet': (pSize) =>
	{
		return '<svg width="' + pSize + '" height="' + pSize + '" viewBox="0 0 24 24" fill="none">' +
			'<path d="M14.1 2.1H6.2C5 2.2 4.1 3 4.1 4.1V20.1C4 21.2 5 22 6.1 21.9H18C19.1 22 20 21.1 19.9 19.9V8.1L14.1 2.1Z" fill="' + _Colors.TealTint + '" stroke="' + _Colors.Primary + '" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" />' +
			'<path d="M13.9 2.1V8.2H20" stroke="' + _Colors.Primary + '" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" />' +
			'<rect x="7.2" y="11.1" width="9.8" height="7.8" rx="0.5" fill="none" stroke="' + _Colors.Accent + '" stroke-width="1.2" />' +
			'<line x1="7.2" y1="13.7" x2="17" y2="13.7" stroke="' + _Colors.Accent + '" stroke-width="1" />' +
			'<line x1="7.2" y1="16.3" x2="17" y2="16.3" stroke="' + _Colors.Accent + '" stroke-width="1" />' +
			'<line x1="10.9" y1="11.1" x2="10.9" y2="18.9" stroke="' + _Colors.Accent + '" stroke-width="1" />' +
		'</svg>';
	},

	// ---- Archive file ----
	'file-archive': (pSize) =>
	{
		return '<svg width="' + pSize + '" height="' + pSize + '" viewBox="0 0 24 24" fill="none">' +
			'<path d="M14.1 2.1H6.2C5 2.2 4.1 3 4.1 4.1V20.1C4 21.2 5 22 6.1 21.9H18C19.1 22 20 21.1 19.9 19.9V8.1L14.1 2.1Z" fill="' + _Colors.WarmBeige + '" stroke="' + _Colors.Primary + '" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" />' +
			'<path d="M13.9 2.1V8.2H20" stroke="' + _Colors.Primary + '" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" />' +
			'<rect x="8.8" y="11.2" width="2.5" height="2" rx="0.4" fill="' + _Colors.Primary + '" />' +
			'<rect x="8.8" y="14.2" width="2.5" height="2" rx="0.4" fill="' + _Colors.Primary + '" />' +
			'<rect x="8.8" y="17.2" width="2.5" height="2" rx="0.4" fill="' + _Colors.Primary + '" />' +
		'</svg>';
	},

	// ---- Audio file ----
	'file-audio': (pSize) =>
	{
		return '<svg width="' + pSize + '" height="' + pSize + '" viewBox="0 0 24 24" fill="none">' +
			'<path d="M14.1 2.1H6.2C5 2.2 4.1 3 4.1 4.1V20.1C4 21.2 5 22 6.1 21.9H18C19.1 22 20 21.1 19.9 19.9V8.1L14.1 2.1Z" fill="' + _Colors.AmberTint + '" stroke="' + _Colors.Primary + '" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" />' +
			'<path d="M13.9 2.1V8.2H20" stroke="' + _Colors.Primary + '" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" />' +
			'<circle cx="10.2" cy="16.8" r="2.1" fill="none" stroke="' + _Colors.Accent + '" stroke-width="1.5" />' +
			'<path d="M12.2 16.8V11.2L16.1 10.1" stroke="' + _Colors.Accent + '" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" fill="none" />' +
			'<circle cx="16.1" cy="15.3" r="1.4" fill="none" stroke="' + _Colors.Accent + '" stroke-width="1.2" />' +
		'</svg>';
	},

	// ---- Video file ----
	'file-video': (pSize) =>
	{
		return '<svg width="' + pSize + '" height="' + pSize + '" viewBox="0 0 24 24" fill="none">' +
			'<path d="M14.1 2.1H6.2C5 2.2 4.1 3 4.1 4.1V20.1C4 21.2 5 22 6.1 21.9H18C19.1 22 20 21.1 19.9 19.9V8.1L14.1 2.1Z" fill="' + _Colors.Lavender + '" stroke="' + _Colors.Primary + '" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" />' +
			'<path d="M13.9 2.1V8.2H20" stroke="' + _Colors.Primary + '" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" />' +
			'<path d="M9.8 12.2V18.2L15.8 15.2L9.8 12.2Z" fill="' + _Colors.Accent + '" stroke="' + _Colors.Accent + '" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round" />' +
		'</svg>';
	},

	// ---- Web / markup file ----
	'file-web': (pSize) =>
	{
		return '<svg width="' + pSize + '" height="' + pSize + '" viewBox="0 0 24 24" fill="none">' +
			'<circle cx="12" cy="12" r="8.9" fill="' + _Colors.TealTint + '" stroke="' + _Colors.Primary + '" stroke-width="1.8" />' +
			'<ellipse cx="12" cy="12" rx="4.1" ry="8.9" fill="none" stroke="' + _Colors.Primary + '" stroke-width="1.2" />' +
			'<line x1="3.1" y1="12" x2="20.9" y2="12" stroke="' + _Colors.Primary + '" stroke-width="1" />' +
			'<path d="M4.8 7.8C7 8.5 9.4 8.9 12 8.9C14.6 8.9 17 8.5 19.2 7.8" stroke="' + _Colors.Primary + '" stroke-width="1" fill="none" />' +
			'<path d="M4.8 16.2C7 15.5 9.4 15.1 12 15.1C14.6 15.1 17 15.5 19.2 16.2" stroke="' + _Colors.Primary + '" stroke-width="1" fill="none" />' +
		'</svg>';
	},

	// ---- Config / settings file ----
	'file-config': (pSize) =>
	{
		return '<svg width="' + pSize + '" height="' + pSize + '" viewBox="0 0 24 24" fill="none">' +
			'<path d="M14.1 2.1H6.2C5 2.2 4.1 3 4.1 4.1V20.1C4 21.2 5 22 6.1 21.9H18C19.1 22 20 21.1 19.9 19.9V8.1L14.1 2.1Z" fill="' + _Colors.Light + '" stroke="' + _Colors.Primary + '" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" />' +
			'<path d="M13.9 2.1V8.2H20" stroke="' + _Colors.Primary + '" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" />' +
			'<circle cx="12" cy="15" r="2.8" fill="none" stroke="' + _Colors.Muted + '" stroke-width="1.5" />' +
			'<line x1="12" y1="11" x2="12" y2="12.2" stroke="' + _Colors.Muted + '" stroke-width="1.3" stroke-linecap="round" />' +
			'<line x1="12" y1="17.8" x2="12" y2="19" stroke="' + _Colors.Muted + '" stroke-width="1.3" stroke-linecap="round" />' +
			'<line x1="14.8" y1="13.2" x2="15.8" y2="12.6" stroke="' + _Colors.Muted + '" stroke-width="1.3" stroke-linecap="round" />' +
			'<line x1="8.2" y1="17" x2="9.2" y2="16.4" stroke="' + _Colors.Muted + '" stroke-width="1.3" stroke-linecap="round" />' +
			'<line x1="14.8" y1="16.8" x2="15.8" y2="17.4" stroke="' + _Colors.Muted + '" stroke-width="1.3" stroke-linecap="round" />' +
			'<line x1="8.2" y1="13" x2="9.2" y2="13.6" stroke="' + _Colors.Muted + '" stroke-width="1.3" stroke-linecap="round" />' +
		'</svg>';
	},

	// ---- UI Icons ----
	'home': (pSize) =>
	{
		return '<svg width="' + pSize + '" height="' + pSize + '" viewBox="0 0 24 24" fill="none">' +
			'<path d="M3.1 9.6L12 3.1L20.9 9.6V19.9C20.9 20.5 20.5 21 19.9 20.9H4.1C3.5 21 3 20.5 3.1 19.9V9.6Z" fill="' + _Colors.TealTint + '" stroke="' + _Colors.Accent + '" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" />' +
			'<rect x="9.2" y="14.1" width="5.6" height="6.9" rx="0.5" fill="' + _Colors.Accent + '" />' +
		'</svg>';
	},

	'arrow-up': (pSize) =>
	{
		return '<svg width="' + pSize + '" height="' + pSize + '" viewBox="0 0 24 24" fill="none">' +
			'<path d="M12.1 19.1V5.1" stroke="' + _Colors.Muted + '" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />' +
			'<path d="M5.2 11.9L12.1 5.1L18.9 11.9" stroke="' + _Colors.Muted + '" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round" />' +
		'</svg>';
	},

	'chevron-right': (pSize) =>
	{
		return '<svg width="' + pSize + '" height="' + pSize + '" viewBox="0 0 24 24" fill="none">' +
			'<path d="M9.2 6.1L14.8 12.1L9.1 17.9" stroke="' + _Colors.Muted + '" stroke-width="2.5" fill="none" stroke-linecap="round" stroke-linejoin="round" />' +
		'</svg>';
	},

	'chevron-down': (pSize) =>
	{
		return '<svg width="' + pSize + '" height="' + pSize + '" viewBox="0 0 24 24" fill="none">' +
			'<path d="M6.1 9.2L12.1 14.8L17.9 9.1" stroke="' + _Colors.Muted + '" stroke-width="2.5" fill="none" stroke-linecap="round" stroke-linejoin="round" />' +
		'</svg>';
	},

	'search': (pSize) =>
	{
		return '<svg width="' + pSize + '" height="' + pSize + '" viewBox="0 0 24 24" fill="none">' +
			'<circle cx="10.8" cy="10.8" r="6.8" stroke="' + _Colors.Primary + '" stroke-width="1.8" />' +
			'<line x1="15.9" y1="16.1" x2="20.8" y2="20.8" stroke="' + _Colors.Primary + '" stroke-width="2" stroke-linecap="round" />' +
		'</svg>';
	},

	'sort-asc': (pSize) =>
	{
		return '<svg width="' + pSize + '" height="' + pSize + '" viewBox="0 0 24 24" fill="none">' +
			'<path d="M12 4.2L7.2 10.8H16.8L12 4.2Z" fill="' + _Colors.Primary + '" />' +
			'<path d="M12 19.8L7.2 13.2H16.8L12 19.8Z" fill="' + _Colors.Muted + '" opacity="0.35" />' +
		'</svg>';
	},

	'sort-desc': (pSize) =>
	{
		return '<svg width="' + pSize + '" height="' + pSize + '" viewBox="0 0 24 24" fill="none">' +
			'<path d="M12 4.2L7.2 10.8H16.8L12 4.2Z" fill="' + _Colors.Muted + '" opacity="0.35" />' +
			'<path d="M12 19.8L7.2 13.2H16.8L12 19.8Z" fill="' + _Colors.Primary + '" />' +
		'</svg>';
	}
};

// ====================================================================
// EXTENSION-TO-ICON MAP
// Maps file extensions to icon names.
// ====================================================================
const _ExtensionMap =
{
	// Images
	'.jpg': 'file-image', '.jpeg': 'file-image', '.png': 'file-image',
	'.gif': 'file-image', '.svg': 'file-image', '.webp': 'file-image',
	'.bmp': 'file-image', '.ico': 'file-image',

	// Documents / text
	'.txt': 'file-text', '.md': 'file-text', '.rtf': 'file-text',
	'.doc': 'file-text', '.docx': 'file-text',

	// PDF
	'.pdf': 'file-pdf',

	// Spreadsheets
	'.xls': 'file-spreadsheet', '.xlsx': 'file-spreadsheet',
	'.csv': 'file-spreadsheet', '.ods': 'file-spreadsheet',

	// Code
	'.js': 'file-code', '.ts': 'file-code', '.jsx': 'file-code',
	'.tsx': 'file-code', '.py': 'file-code', '.rb': 'file-code',
	'.java': 'file-code', '.c': 'file-code', '.cpp': 'file-code',
	'.h': 'file-code', '.go': 'file-code', '.rs': 'file-code',
	'.swift': 'file-code', '.kt': 'file-code', '.scala': 'file-code',
	'.sh': 'file-code', '.bash': 'file-code', '.zsh': 'file-code',
	'.php': 'file-code', '.lua': 'file-code', '.r': 'file-code',
	'.sql': 'file-code', '.pl': 'file-code',

	// Web / markup
	'.html': 'file-web', '.htm': 'file-web', '.css': 'file-web',
	'.scss': 'file-web', '.less': 'file-web', '.xml': 'file-web',

	// Config
	'.json': 'file-config', '.yaml': 'file-config', '.yml': 'file-config',
	'.toml': 'file-config', '.ini': 'file-config', '.env': 'file-config',
	'.conf': 'file-config', '.cfg': 'file-config',

	// Archives
	'.zip': 'file-archive', '.tar': 'file-archive', '.gz': 'file-archive',
	'.rar': 'file-archive', '.7z': 'file-archive', '.bz2': 'file-archive',
	'.xz': 'file-archive', '.tgz': 'file-archive',

	// Audio
	'.mp3': 'file-audio', '.wav': 'file-audio', '.flac': 'file-audio',
	'.ogg': 'file-audio', '.aac': 'file-audio', '.wma': 'file-audio',
	'.m4a': 'file-audio',

	// Video
	'.mp4': 'file-video', '.avi': 'file-video', '.mov': 'file-video',
	'.mkv': 'file-video', '.webm': 'file-video', '.wmv': 'file-video',
	'.flv': 'file-video', '.m4v': 'file-video'
};


/**
 * Icon provider for the file browser.
 *
 * Provides SVG icon strings in a retro hand-drawn style for file types,
 * folders, and UI elements (chevrons, home, sort indicators, etc.).
 *
 * Icons are scalable — pass the desired pixel size when retrieving them.
 *
 * Usage:
 *   let tmpIconProvider = pict.providers['Pict-FileBrowser-Icons'];
 *   let tmpSVG = tmpIconProvider.getIcon('folder', 16);
 *   let tmpFileSVG = tmpIconProvider.getIconForEntry(fileEntry, 24);
 */
class PictFileBrowserIconProvider extends libPictProvider
{
	constructor(pFable, pOptions, pServiceHash)
	{
		super(pFable, pOptions, pServiceHash);

		// Copy built-in icons so custom registrations don't mutate the module-level object
		this._icons = Object.assign({}, _BuiltInIcons);
		this._extensionMap = Object.assign({}, _ExtensionMap);

		this._cssInjected = false;
	}

	/**
	 * Get an SVG icon string by name.
	 *
	 * @param {string} pName - Icon name (e.g. 'folder', 'file-code', 'chevron-right')
	 * @param {number} [pSize=16] - Pixel size
	 * @returns {string} SVG string, or empty string if not found
	 */
	getIcon(pName, pSize)
	{
		let tmpSize = pSize || 16;
		let tmpIconFn = this._icons[pName];

		if (typeof tmpIconFn === 'function')
		{
			return tmpIconFn(tmpSize);
		}

		return '';
	}

	/**
	 * Get an SVG icon string for a file entry based on its type and extension.
	 *
	 * @param {Object} pEntry - File entry object with Type, Extension, Icon properties
	 * @param {number} [pSize=16] - Pixel size
	 * @returns {string} SVG string
	 */
	getIconForEntry(pEntry, pSize)
	{
		if (!pEntry)
		{
			return '';
		}

		// If the entry has an explicit Icon that looks like SVG, use it directly
		if (pEntry.Icon && typeof pEntry.Icon === 'string' && pEntry.Icon.indexOf('<svg') === 0)
		{
			return pEntry.Icon;
		}

		let tmpSize = pSize || 16;

		// Folder
		if (pEntry.Type === 'folder')
		{
			return this.getIcon('folder', tmpSize);
		}

		// Lookup by extension
		let tmpExt = (pEntry.Extension || '').toLowerCase();
		if (tmpExt && this._extensionMap[tmpExt])
		{
			return this.getIcon(this._extensionMap[tmpExt], tmpSize);
		}

		// Default: generic file
		return this.getIcon('file', tmpSize);
	}

	/**
	 * Get a UI icon (home, chevron, sort, etc.) by name.
	 *
	 * @param {string} pName - UI icon name
	 * @param {number} [pSize=16] - Pixel size
	 * @returns {string} SVG string
	 */
	getUIIcon(pName, pSize)
	{
		return this.getIcon(pName, pSize || 16);
	}

	/**
	 * Register a custom icon.
	 *
	 * @param {string} pName - Icon name
	 * @param {Function} pIconFunction - Function(pSize) => SVG string
	 * @returns {boolean} True if registered successfully
	 */
	registerIcon(pName, pIconFunction)
	{
		if (!pName || typeof pIconFunction !== 'function')
		{
			return false;
		}

		this._icons[pName] = pIconFunction;
		return true;
	}

	/**
	 * Register a file extension mapping.
	 *
	 * @param {string} pExtension - Extension including dot (e.g. '.vue')
	 * @param {string} pIconName - Icon name to use
	 * @returns {boolean} True if registered successfully
	 */
	registerExtension(pExtension, pIconName)
	{
		if (!pExtension || !pIconName)
		{
			return false;
		}

		this._extensionMap[pExtension.toLowerCase()] = pIconName;
		return true;
	}

	/**
	 * Get the full list of registered icon names.
	 *
	 * @returns {Array<string>} Array of icon names
	 */
	getIconNames()
	{
		return Object.keys(this._icons);
	}

	/**
	 * Get the extension map.
	 *
	 * @returns {Object} Extension-to-icon name map
	 */
	getExtensionMap()
	{
		return Object.assign({}, this._extensionMap);
	}

	/**
	 * Inject CSS classes for icon sizing into the pict CSSMap.
	 * Called automatically by views that use icons.
	 */
	injectCSS()
	{
		if (this._cssInjected)
		{
			return;
		}

		if (this.pict && this.pict.CSSMap)
		{
			this.pict.CSSMap.addCSS('PictFileBrowserIcons',
				'.pict-fb-svg-icon { display: inline-flex; align-items: center; justify-content: center; vertical-align: middle; }\n' +
				'.pict-fb-svg-icon svg { display: block; }\n' +
				'.pict-fb-tree-icon svg { width: 16px; height: 16px; }\n' +
				'.pict-fb-detail-icon svg { width: 16px; height: 16px; }\n' +
				'.pict-fb-icon-graphic svg { width: 36px; height: 36px; }\n' +
				'.pict-fb-tree-toggle svg { width: 10px; height: 10px; }\n'
			);
			this._cssInjected = true;
		}
	}
}

module.exports = PictFileBrowserIconProvider;

module.exports.default_configuration = _DefaultProviderConfiguration;

module.exports.BuiltInIcons = _BuiltInIcons;

module.exports.ExtensionMap = _ExtensionMap;

module.exports.Colors = _Colors;
