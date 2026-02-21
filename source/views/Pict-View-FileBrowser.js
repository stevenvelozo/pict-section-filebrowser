const libPictView = require('pict-view');

const _DefaultConfiguration = require('../Pict-Section-FileBrowser-DefaultConfiguration.js');

const libBrowseProvider = require('../providers/Pict-Provider-FileBrowserBrowse.js');
const libListProvider = require('../providers/Pict-Provider-FileBrowserList.js');
const libViewProvider = require('../providers/Pict-Provider-FileBrowserView.js');
const libLayoutProvider = require('../providers/Pict-Provider-FileBrowserLayout.js');
const libIconProvider = require('../providers/Pict-Provider-FileBrowserIcons.js');

/**
 * Main FileBrowser view.
 *
 * Renders the outer container layout (browse pane, list pane, view pane)
 * and manages the lifecycle of the three base providers.
 *
 * The consuming application registers this view and then adds whichever
 * browsing, listing, and viewing sub-views they want (tree, search,
 * detail list, icon grid, file info, image viewer, etc.).
 *
 * On initialization, this view ensures the three providers are registered
 * and that default state values are populated in AppData.
 */
class PictViewFileBrowser extends libPictView
{
	constructor(pFable, pOptions, pServiceHash)
	{
		let tmpOptions = Object.assign({}, JSON.parse(JSON.stringify(_DefaultConfiguration)), pOptions);
		super(pFable, tmpOptions, pServiceHash);

		// Register providers if not already registered
		if (!this.pict.providers['Pict-FileBrowser-Browse'])
		{
			this.pict.addProvider('Pict-FileBrowser-Browse', libBrowseProvider.default_configuration, libBrowseProvider);
		}
		if (!this.pict.providers['Pict-FileBrowser-List'])
		{
			this.pict.addProvider('Pict-FileBrowser-List', libListProvider.default_configuration, libListProvider);
		}
		if (!this.pict.providers['Pict-FileBrowser-View'])
		{
			this.pict.addProvider('Pict-FileBrowser-View', libViewProvider.default_configuration, libViewProvider);
		}
		if (!this.pict.providers['Pict-FileBrowser-Layout'])
		{
			this.pict.addProvider('Pict-FileBrowser-Layout', libLayoutProvider.default_configuration, libLayoutProvider);
		}
		if (!this.pict.providers['Pict-FileBrowser-Icons'])
		{
			this.pict.addProvider('Pict-FileBrowser-Icons', libIconProvider.default_configuration, libIconProvider);
		}

		// Ensure default state in AppData
		this.ensureDefaultState();
	}

	/**
	 * Populate AppData with default state values if not already set.
	 */
	ensureDefaultState()
	{
		let tmpDefaultState = this.options.DefaultState || {};
		let tmpStateAddresses = this.options.StateAddresses || {};
		let tmpScope = { AppData: this.pict.AppData, Pict: this.pict };

		// Ensure the PictFileBrowser namespace exists
		if (!this.pict.AppData.PictFileBrowser)
		{
			this.pict.AppData.PictFileBrowser = {};
		}

		for (let tmpKey in tmpStateAddresses)
		{
			let tmpAddress = tmpStateAddresses[tmpKey];
			let tmpCurrentValue = this.pict.manifest.getValueByHash(tmpScope, tmpAddress);

			if (tmpCurrentValue === undefined || tmpCurrentValue === null)
			{
				let tmpDefault = tmpDefaultState[tmpKey];
				if (tmpDefault !== undefined)
				{
					this.pict.manifest.setValueByHash(tmpScope, tmpAddress, tmpDefault);
				}
			}
		}

		// Ensure FileList and FolderTree arrays exist
		if (!this.pict.AppData.PictFileBrowser.FileList)
		{
			this.pict.AppData.PictFileBrowser.FileList = [];
		}
		if (!this.pict.AppData.PictFileBrowser.FolderTree)
		{
			this.pict.AppData.PictFileBrowser.FolderTree = [];
		}
	}

	/**
	 * After rendering the container, inject CSS.
	 */
	onAfterRender(pRenderable)
	{
		this.pict.CSSMap.injectCSS();
		return super.onAfterRender(pRenderable);
	}

	/**
	 * Get a state value by key.
	 *
	 * @param {string} pKey - One of: Layout, RootLocation, CurrentLocation, CurrentFile
	 * @returns {*} The state value
	 */
	getState(pKey)
	{
		let tmpStateAddresses = this.options.StateAddresses || {};
		let tmpAddress = tmpStateAddresses[pKey];
		if (!tmpAddress)
		{
			return undefined;
		}

		return this.pict.manifest.getValueByHash(
			{ AppData: this.pict.AppData, Pict: this.pict },
			tmpAddress);
	}

	/**
	 * Set a state value by key.
	 *
	 * @param {string} pKey - One of: Layout, RootLocation, CurrentLocation, CurrentFile
	 * @param {*} pValue - The value to set
	 */
	setState(pKey, pValue)
	{
		let tmpStateAddresses = this.options.StateAddresses || {};
		let tmpAddress = tmpStateAddresses[pKey];
		if (!tmpAddress)
		{
			return;
		}

		this.pict.manifest.setValueByHash(
			{ AppData: this.pict.AppData, Pict: this.pict },
			tmpAddress,
			pValue);
	}
}

module.exports = PictViewFileBrowser;

module.exports.default_configuration = _DefaultConfiguration;
