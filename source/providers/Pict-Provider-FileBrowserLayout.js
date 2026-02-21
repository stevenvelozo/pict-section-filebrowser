const libPictProvider = require('pict-provider');

const _DefaultProviderConfiguration =
{
	"ProviderIdentifier": "Pict-FileBrowser-Layout",
	"AutoInitialize": true,
	"AutoInitializeOrdinal": 0,
	"AutoSolveWithApp": true,
	"AutoSolveOrdinal": 0
};

/**
 * Layout definitions.
 *
 * Each layout specifies:
 *   - Key: unique identifier string
 *   - Label: human-readable name
 *   - Description: short description of the arrangement
 *   - Panes: array of pane roles to render ('browse', 'list', 'view')
 *   - PaneCount: how many visible viewports in this layout
 *   - CSSClass: CSS class applied to .pict-filebrowser for this layout
 */
const _BuiltInLayouts =
{
	"list-only":
	{
		"Key": "list-only",
		"Label": "List Only",
		"Description": "Full-width file list",
		"Panes": ["list"],
		"PaneCount": 1,
		"CSSClass": "pict-fb-layout-list-only"
	},
	"tree-list":
	{
		"Key": "tree-list",
		"Label": "Tree + List",
		"Description": "Folder tree on the left, file list on the right",
		"Panes": ["browse", "list"],
		"PaneCount": 2,
		"CSSClass": "pict-fb-layout-tree-list"
	},
	"list-detail":
	{
		"Key": "list-detail",
		"Label": "List + Detail",
		"Description": "File list on top, file details on the bottom",
		"Panes": ["list", "view"],
		"PaneCount": 2,
		"CSSClass": "pict-fb-layout-list-detail"
	},
	"tree-detail":
	{
		"Key": "tree-detail",
		"Label": "Tree + Detail",
		"Description": "Folder tree on the left, file details on the right",
		"Panes": ["browse", "view"],
		"PaneCount": 2,
		"CSSClass": "pict-fb-layout-tree-detail"
	},
	"browser-detail":
	{
		"Key": "browser-detail",
		"Label": "Browser",
		"Description": "Folder tree on the left, file list top-right, details bottom-right",
		"Panes": ["browse", "list", "view"],
		"PaneCount": 3,
		"CSSClass": "pict-fb-layout-browser-detail"
	},
	"browser-columns":
	{
		"Key": "browser-columns",
		"Label": "Columns",
		"Description": "Three-column layout: folder tree, file list, and file details side-by-side",
		"Panes": ["browse", "list", "view"],
		"PaneCount": 3,
		"CSSClass": "pict-fb-layout-browser-columns"
	}
};

/**
 * Base provider for layout management.
 *
 * Maintains a registry of available layouts and the current active layout.
 * Provides helpers to switch layouts, get layout metadata, and
 * determine which panes should be visible.
 *
 * Consuming applications can register additional custom layouts via
 * registerLayout().
 */
class PictFileBrowserLayoutProvider extends libPictProvider
{
	constructor(pFable, pOptions, pServiceHash)
	{
		super(pFable, pOptions, pServiceHash);

		// Clone the built-in layouts into a mutable registry
		this.layouts = JSON.parse(JSON.stringify(_BuiltInLayouts));
	}

	/**
	 * Get all available layouts.
	 *
	 * @returns {Object} Map of layout key => layout definition
	 */
	getLayouts()
	{
		return this.layouts;
	}

	/**
	 * Get an ordered array of all layout definitions.
	 *
	 * @returns {Array} Array of layout objects sorted by PaneCount then Key
	 */
	getLayoutList()
	{
		let tmpList = [];
		for (let tmpKey in this.layouts)
		{
			tmpList.push(this.layouts[tmpKey]);
		}

		tmpList.sort(
			(pA, pB) =>
			{
				if (pA.PaneCount !== pB.PaneCount)
				{
					return pA.PaneCount - pB.PaneCount;
				}
				return pA.Key.localeCompare(pB.Key);
			});

		return tmpList;
	}

	/**
	 * Get a single layout definition by key.
	 *
	 * @param {string} pKey - Layout key (e.g. 'browser-detail')
	 * @returns {Object|null} The layout definition or null
	 */
	getLayout(pKey)
	{
		return this.layouts[pKey] || null;
	}

	/**
	 * Get the current active layout key from AppData.
	 *
	 * @returns {string} The current layout key
	 */
	getCurrentLayoutKey()
	{
		let tmpStateAddresses = this.getFileBrowserOption('StateAddresses', {});
		let tmpLayoutAddress = tmpStateAddresses.Layout || 'AppData.PictFileBrowser.Layout';

		let tmpKey = this.pict.manifest.getValueByHash(
			{ AppData: this.pict.AppData, Pict: this.pict },
			tmpLayoutAddress);

		return tmpKey || 'browser-detail';
	}

	/**
	 * Get the current active layout definition.
	 *
	 * @returns {Object} The current layout definition (falls back to browser-detail)
	 */
	getCurrentLayout()
	{
		let tmpKey = this.getCurrentLayoutKey();
		return this.layouts[tmpKey] || this.layouts['browser-detail'];
	}

	/**
	 * Set the active layout.
	 *
	 * @param {string} pKey - The layout key to activate
	 * @returns {boolean} True if the layout was found and set
	 */
	setLayout(pKey)
	{
		if (!this.layouts[pKey])
		{
			return false;
		}

		let tmpStateAddresses = this.getFileBrowserOption('StateAddresses', {});
		let tmpLayoutAddress = tmpStateAddresses.Layout || 'AppData.PictFileBrowser.Layout';

		this.pict.manifest.setValueByHash(
			{ AppData: this.pict.AppData, Pict: this.pict },
			tmpLayoutAddress,
			pKey);

		return true;
	}

	/**
	 * Check if a specific pane role is visible in the current layout.
	 *
	 * @param {string} pPaneRole - 'browse', 'list', or 'view'
	 * @returns {boolean} True if the pane is part of the current layout
	 */
	isPaneVisible(pPaneRole)
	{
		let tmpLayout = this.getCurrentLayout();
		return tmpLayout.Panes.indexOf(pPaneRole) >= 0;
	}

	/**
	 * Register a custom layout definition.
	 *
	 * @param {Object} pLayout - Layout definition with Key, Label, Description, Panes, PaneCount, CSSClass
	 * @returns {boolean} True if registered successfully
	 */
	registerLayout(pLayout)
	{
		if (!pLayout || !pLayout.Key)
		{
			return false;
		}

		this.layouts[pLayout.Key] = pLayout;
		return true;
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

module.exports = PictFileBrowserLayoutProvider;

module.exports.default_configuration = _DefaultProviderConfiguration;

module.exports.BuiltInLayouts = _BuiltInLayouts;
