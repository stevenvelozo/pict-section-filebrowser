const libPictView = require('pict-view');

const _ViewConfiguration =
{
	"ViewIdentifier": "Pict-FileBrowser-ListDetail",

	"DefaultRenderable": "ListDetail-Container",
	"DefaultDestinationAddress": "#Pict-FileBrowser-ListPane",

	"AutoRender": false,

	"Templates":
	[
		{
			"Hash": "FileBrowser-ListDetail-Container-Template",
			"Template": /*html*/`
<div class="pict-fb-detail" id="Pict-FileBrowser-DetailList">
	<div class="pict-fb-breadcrumb" id="Pict-FileBrowser-Breadcrumb"></div>
	<div class="pict-fb-detail-header">
		<div class="pict-fb-detail-header-cell pict-fb-detail-col-name" onclick="pict.views['{~D:Record.ViewHash~}'].sortBy('Name')">Name</div>
		<div class="pict-fb-detail-header-cell pict-fb-detail-col-size" onclick="pict.views['{~D:Record.ViewHash~}'].sortBy('Size')">Size</div>
		<div class="pict-fb-detail-header-cell pict-fb-detail-col-modified" onclick="pict.views['{~D:Record.ViewHash~}'].sortBy('Modified')">Modified</div>
	</div>
	<div id="Pict-FileBrowser-DetailRows"></div>
</div>
`
		},
		{
			"Hash": "FileBrowser-ListDetail-Row-Template",
			"Template": /*html*/`
<div class="pict-fb-detail-row{~D:Record.SelectedClass~}" data-index="{~D:Record.Index~}" onclick="{~D:Record.ClickHandler~}" ondblclick="{~D:Record.DblClickHandler~}">
	<span class="pict-fb-detail-icon">{~D:Record.Icon~}</span>
	<span class="pict-fb-detail-name">{~D:Record.Name~}</span>
	<span class="pict-fb-detail-size">{~D:Record.SizeFormatted~}</span>
	<span class="pict-fb-detail-modified">{~D:Record.ModifiedFormatted~}</span>
</div>
`
		},
		{
			"Hash": "FileBrowser-ListDetail-Empty-Template",
			"Template": /*html*/`<div class="pict-fb-empty">{~D:Record.Message~}</div>`
		},
		{
			"Hash": "FileBrowser-Breadcrumb-Segment-Template",
			"Template": /*html*/`<span class="pict-fb-breadcrumb-segment" onclick="{~D:Record.ClickHandler~}">{~D:Record.Label~}</span>`
		},
		{
			"Hash": "FileBrowser-Breadcrumb-Separator-Template",
			"Template": /*html*/`<span class="pict-fb-breadcrumb-separator">/</span>`
		},
		{
			"Hash": "FileBrowser-Breadcrumb-Current-Template",
			"Template": /*html*/`<span class="pict-fb-breadcrumb-current">{~D:Record.Label~}</span>`
		}
	],

	"Renderables":
	[
		{
			"RenderableHash": "ListDetail-Container",
			"TemplateHash": "FileBrowser-ListDetail-Container-Template",
			"DestinationAddress": "#Pict-FileBrowser-ListPane",
			"RenderMethod": "replace"
		}
	]
};

/**
 * Listing view that shows files in a detailed table with columns for
 * name, size, and modified date.
 *
 * Supports sorting by column header click and single-click selection
 * with double-click to open folders.
 */
class PictViewFileBrowserListDetail extends libPictView
{
	constructor(pFable, pOptions, pServiceHash)
	{
		let tmpOptions = Object.assign({}, _ViewConfiguration, pOptions);
		super(pFable, tmpOptions, pServiceHash);

		this._cachedFileList = [];
	}

	/**
	 * After rendering the container shell, populate the rows.
	 */
	onAfterRender(pRenderable)
	{
		// Render the container with the view hash
		let tmpContainerHTML = this.pict.parseTemplateByHash(
			'FileBrowser-ListDetail-Container-Template',
			{ ViewHash: this.Hash });
		this.pict.ContentAssignment.assignContent('#Pict-FileBrowser-ListPane', tmpContainerHTML);

		this.rebuildList();
		this.rebuildBreadcrumb();

		this.pict.CSSMap.injectCSS();
		return super.onAfterRender(pRenderable);
	}

	/**
	 * Rebuild the file list rows.
	 */
	rebuildList()
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
				'FileBrowser-ListDetail-Empty-Template',
				{ Message: 'This folder is empty' });
			this.pict.ContentAssignment.assignContent('#Pict-FileBrowser-DetailRows', tmpEmptyHTML);
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
				SizeFormatted: tmpEntry.Type === 'folder' ? '--' : tmpListProvider.formatFileSize(tmpEntry.Size),
				ModifiedFormatted: tmpListProvider.formatDate(tmpEntry.Modified),
				SelectedClass: tmpIsSelected ? ' selected' : '',
				ClickHandler: "pict.views['" + this.Hash + "'].selectEntry(" + i + ")",
				DblClickHandler: "pict.views['" + this.Hash + "'].openEntry(" + i + ")"
			};

			tmpHTML += this.pict.parseTemplateByHash('FileBrowser-ListDetail-Row-Template', tmpRecord);
		}

		this.pict.ContentAssignment.assignContent('#Pict-FileBrowser-DetailRows', tmpHTML);
	}

	/**
	 * Rebuild the breadcrumb navigation bar.
	 */
	rebuildBreadcrumb()
	{
		let tmpCurrentLocation = this.getCurrentLocation();
		let tmpHTML = '';

		// Root segment — use SVG home icon if provider is available
		let tmpIconProvider = this.pict.providers['Pict-FileBrowser-Icons'];
		let tmpHomeLabel = tmpIconProvider ? tmpIconProvider.getIcon('home', 16) : '\uD83C\uDFE0';

		tmpHTML += this.pict.parseTemplateByHash(
			'FileBrowser-Breadcrumb-Segment-Template',
			{
				Label: tmpHomeLabel,
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
					// Last segment — not clickable
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

		this.pict.ContentAssignment.assignContent('#Pict-FileBrowser-Breadcrumb', tmpHTML);
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

		this.rebuildList();
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

		this.rebuildList();
		this.rebuildBreadcrumb();
	}

	/**
	 * Sort by a column field.
	 *
	 * @param {string} pField - The field name
	 */
	sortBy(pField)
	{
		let tmpListProvider = this.pict.providers['Pict-FileBrowser-List'];
		if (tmpListProvider)
		{
			tmpListProvider.setSortField(pField);
		}

		this.rebuildList();
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

		this.rebuildList();
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

module.exports = PictViewFileBrowserListDetail;

module.exports.default_configuration = _ViewConfiguration;
