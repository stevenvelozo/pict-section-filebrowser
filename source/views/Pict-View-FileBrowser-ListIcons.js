const libPictView = require('pict-view');

const _ViewConfiguration =
{
	"ViewIdentifier": "Pict-FileBrowser-ListIcons",

	"DefaultRenderable": "ListIcons-Container",
	"DefaultDestinationAddress": "#Pict-FileBrowser-ListPane",

	"AutoRender": false,

	"Templates":
	[
		{
			"Hash": "FileBrowser-ListIcons-Container-Template",
			"Template": /*html*/`
<div id="Pict-FileBrowser-IconList">
	<div class="pict-fb-breadcrumb" id="Pict-FileBrowser-IconBreadcrumb"></div>
	<div class="pict-fb-icons" id="Pict-FileBrowser-IconGrid"></div>
</div>
`
		},
		{
			"Hash": "FileBrowser-ListIcons-Item-Template",
			"Template": /*html*/`
<div class="pict-fb-icon-item{~D:Record.SelectedClass~}" data-index="{~D:Record.Index~}" onclick="{~D:Record.ClickHandler~}" ondblclick="{~D:Record.DblClickHandler~}">
	<div class="pict-fb-icon-graphic">{~D:Record.Icon~}</div>
	<div class="pict-fb-icon-label">{~D:Record.Name~}</div>
</div>
`
		},
		{
			"Hash": "FileBrowser-ListIcons-Empty-Template",
			"Template": /*html*/`<div class="pict-fb-empty">{~D:Record.Message~}</div>`
		}
	],

	"Renderables":
	[
		{
			"RenderableHash": "ListIcons-Container",
			"TemplateHash": "FileBrowser-ListIcons-Container-Template",
			"DestinationAddress": "#Pict-FileBrowser-ListPane",
			"RenderMethod": "replace"
		}
	]
};

/**
 * Listing view that shows files as an icon grid.
 *
 * Each file or folder is displayed as a large icon with a label beneath it.
 * Single-click selects, double-click opens folders or selects files.
 */
class PictViewFileBrowserListIcons extends libPictView
{
	constructor(pFable, pOptions, pServiceHash)
	{
		let tmpOptions = Object.assign({}, _ViewConfiguration, pOptions);
		super(pFable, tmpOptions, pServiceHash);

		this._cachedFileList = [];
	}

	/**
	 * After rendering the container, populate the icon grid.
	 */
	onAfterRender(pRenderable)
	{
		this.rebuildGrid();
		this.rebuildBreadcrumb();

		this.pict.CSSMap.injectCSS();
		return super.onAfterRender(pRenderable);
	}

	/**
	 * Rebuild the icon grid.
	 */
	rebuildGrid()
	{
		let tmpListProvider = this.pict.providers['Pict-FileBrowser-List'];
		if (!tmpListProvider)
		{
			return;
		}

		let tmpFileList = tmpListProvider.getSortedFileList();
		this._cachedFileList = tmpFileList;

		let tmpSelectedFile = tmpListProvider.getSelectedFile();

		if (tmpFileList.length === 0)
		{
			let tmpEmptyHTML = this.pict.parseTemplateByHash(
				'FileBrowser-ListIcons-Empty-Template',
				{ Message: 'This folder is empty' });
			this.pict.ContentAssignment.assignContent('#Pict-FileBrowser-IconGrid', tmpEmptyHTML);
			return;
		}

		let tmpHTML = '';

		for (let i = 0; i < tmpFileList.length; i++)
		{
			let tmpEntry = tmpFileList[i];
			let tmpIsSelected = tmpSelectedFile && tmpSelectedFile.Name === tmpEntry.Name && tmpSelectedFile.Path === tmpEntry.Path;

			let tmpRecord =
			{
				Index: i,
				Name: tmpEntry.Name,
				Icon: tmpListProvider.getEntryIcon(tmpEntry),
				SelectedClass: tmpIsSelected ? ' selected' : '',
				ClickHandler: "pict.views['" + this.Hash + "'].selectEntry(" + i + ")",
				DblClickHandler: "pict.views['" + this.Hash + "'].openEntry(" + i + ")"
			};

			tmpHTML += this.pict.parseTemplateByHash('FileBrowser-ListIcons-Item-Template', tmpRecord);
		}

		this.pict.ContentAssignment.assignContent('#Pict-FileBrowser-IconGrid', tmpHTML);
	}

	/**
	 * Rebuild the breadcrumb navigation bar.
	 */
	rebuildBreadcrumb()
	{
		let tmpCurrentLocation = this.getCurrentLocation();
		let tmpHTML = '';

		// Root segment
		tmpHTML += this.pict.parseTemplateByHash(
			'FileBrowser-Breadcrumb-Segment-Template',
			{
				Label: '\uD83C\uDFE0',
				ClickHandler: "pict.views['" + this.Hash + "'].navigateToPath('')"
			});

		if (tmpCurrentLocation)
		{
			let tmpParts = tmpCurrentLocation.split('/');
			let tmpAccumulatedPath = '';

			for (let i = 0; i < tmpParts.length; i++)
			{
				tmpAccumulatedPath = tmpAccumulatedPath ? (tmpAccumulatedPath + '/' + tmpParts[i]) : tmpParts[i];

				tmpHTML += this.pict.parseTemplateByHash('FileBrowser-Breadcrumb-Separator-Template', {});

				if (i === tmpParts.length - 1)
				{
					tmpHTML += this.pict.parseTemplateByHash(
						'FileBrowser-Breadcrumb-Current-Template',
						{ Label: tmpParts[i] });
				}
				else
				{
					let tmpPath = tmpAccumulatedPath;
					tmpHTML += this.pict.parseTemplateByHash(
						'FileBrowser-Breadcrumb-Segment-Template',
						{
							Label: tmpParts[i],
							ClickHandler: "pict.views['" + this.Hash + "'].navigateToPath('" + tmpPath + "')"
						});
				}
			}
		}

		this.pict.ContentAssignment.assignContent('#Pict-FileBrowser-IconBreadcrumb', tmpHTML);
	}

	/**
	 * Select a file entry by index.
	 *
	 * @param {number} pIndex - The index in the cached file list
	 */
	selectEntry(pIndex)
	{
		if (pIndex < 0 || pIndex >= this._cachedFileList.length)
		{
			return;
		}

		let tmpListProvider = this.pict.providers['Pict-FileBrowser-List'];
		if (tmpListProvider)
		{
			tmpListProvider.selectFile(this._cachedFileList[pIndex]);
		}

		this.rebuildGrid();
	}

	/**
	 * Open an entry (navigate into folder or select file).
	 *
	 * @param {number} pIndex - The index in the cached file list
	 */
	openEntry(pIndex)
	{
		if (pIndex < 0 || pIndex >= this._cachedFileList.length)
		{
			return;
		}

		let tmpListProvider = this.pict.providers['Pict-FileBrowser-List'];
		if (tmpListProvider)
		{
			tmpListProvider.openEntry(this._cachedFileList[pIndex]);
		}

		this.rebuildGrid();
		this.rebuildBreadcrumb();
	}

	/**
	 * Navigate to a path via breadcrumb.
	 *
	 * @param {string} pPath - The target path
	 */
	navigateToPath(pPath)
	{
		let tmpBrowseProvider = this.pict.providers['Pict-FileBrowser-Browse'];
		if (tmpBrowseProvider)
		{
			tmpBrowseProvider.navigateToFolder(pPath);
		}

		this.rebuildGrid();
		this.rebuildBreadcrumb();
	}

	/**
	 * Get the current location from state.
	 *
	 * @returns {string} The current location path
	 */
	getCurrentLocation()
	{
		let tmpStateAddresses = this.options.StateAddresses || {};
		let tmpAddress = tmpStateAddresses.CurrentLocation || 'AppData.PictFileBrowser.CurrentLocation';
		return this.pict.manifest.getValueByHash(
			{ AppData: this.pict.AppData, Pict: this.pict },
			tmpAddress) || '';
	}
}

module.exports = PictViewFileBrowserListIcons;

module.exports.default_configuration = _ViewConfiguration;
