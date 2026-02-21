const libPictView = require('pict-view');

const _ViewConfiguration =
{
	"ViewIdentifier": "Pict-FileBrowser-BrowseTree",

	"DefaultRenderable": "BrowseTree-Container",
	"DefaultDestinationAddress": "#Pict-FileBrowser-BrowsePane",

	"AutoRender": false,

	"Templates":
	[
		{
			"Hash": "FileBrowser-BrowseTree-Container-Template",
			"Template": /*html*/`<div class="pict-fb-tree" id="Pict-FileBrowser-Tree"></div>`
		},
		{
			"Hash": "FileBrowser-BrowseTree-Node-Template",
			"Template": /*html*/`
<div class="pict-fb-tree-node{~D:Record.SelectedClass~}" style="padding-left: {~D:Record.Indent~}px;" data-path="{~D:Record.Path~}" onclick="{~D:Record.ClickHandler~}">
	<span class="{~D:Record.ToggleClass~}" onclick="{~D:Record.ToggleHandler~}">{~D:Record.ToggleIcon~}</span>
	<span class="pict-fb-tree-icon">{~D:Record.Icon~}</span>
	<span class="pict-fb-tree-label">{~D:Record.Name~}</span>
</div>
<div class="pict-fb-tree-children{~D:Record.ExpandedClass~}" id="Pict-FB-TreeChildren-{~D:Record.NodeID~}">
{~D:Record.ChildrenHTML~}
</div>
`
		}
	],

	"Renderables":
	[
		{
			"RenderableHash": "BrowseTree-Container",
			"TemplateHash": "FileBrowser-BrowseTree-Container-Template",
			"DestinationAddress": "#Pict-FileBrowser-BrowsePane",
			"RenderMethod": "replace"
		}
	]
};

/**
 * Browsing view that renders a lazy-loaded hierarchical tree of folders.
 *
 * Only loads one level of child folders at a time via the browse provider's
 * child folder cache.  When a node is expanded, its children are loaded
 * on demand rather than requiring the full tree upfront.
 */
class PictViewFileBrowserBrowseTree extends libPictView
{
	constructor(pFable, pOptions, pServiceHash)
	{
		let tmpOptions = Object.assign({}, _ViewConfiguration, pOptions);
		super(pFable, tmpOptions, pServiceHash);

		this.expandedPaths = {};
	}

	/**
	 * After rendering the container, populate it with the tree.
	 */
	onAfterRender(pRenderable)
	{
		this.rebuildTree();
		this.pict.CSSMap.injectCSS();
		return super.onAfterRender(pRenderable);
	}

	/**
	 * Rebuild the tree HTML from the cached child folders.
	 */
	rebuildTree()
	{
		let tmpBrowseProvider = this.pict.providers['Pict-FileBrowser-Browse'];
		if (!tmpBrowseProvider)
		{
			return;
		}

		let tmpCurrentLocation = this.getCurrentLocation();
		let tmpHTML = this.renderTreeLevel('', 0, tmpCurrentLocation);

		this.pict.ContentAssignment.assignContent('#Pict-FileBrowser-Tree', tmpHTML);
	}

	/**
	 * Render one level of the tree from the child folder cache.
	 *
	 * @param {string} pParentPath - The parent folder path ('' for root)
	 * @param {number} pDepth - Current depth for indentation
	 * @param {string} pCurrentLocation - The currently selected location
	 * @returns {string} HTML string
	 */
	renderTreeLevel(pParentPath, pDepth, pCurrentLocation)
	{
		let tmpBrowseProvider = this.pict.providers['Pict-FileBrowser-Browse'];
		if (!tmpBrowseProvider)
		{
			return '';
		}

		let tmpChildren = tmpBrowseProvider.getChildFolders(pParentPath);

		// Not yet loaded — show loading placeholder if expanded
		if (!tmpChildren)
		{
			if (this.expandedPaths[pParentPath])
			{
				return '<div class="pict-fb-tree-loading" style="padding-left: ' + (24 + pDepth * 16) + 'px;">Loading...</div>';
			}
			return '';
		}

		let tmpHTML = '';
		for (let i = 0; i < tmpChildren.length; i++)
		{
			let tmpChild = tmpChildren[i];
			let tmpPath = tmpChild.Path;
			let tmpNodeID = tmpPath.replace(/[^a-zA-Z0-9]/g, '_');
			let tmpIsExpanded = !!this.expandedPaths[tmpPath];
			let tmpIsSelected = (tmpPath === pCurrentLocation);

			// Determine if this node has children (from the HasChildren flag or from cache)
			let tmpCachedChildren = tmpBrowseProvider.getChildFolders(tmpPath);
			let tmpHasChildren = tmpChild.HasChildren || (tmpCachedChildren && tmpCachedChildren.length > 0);

			let tmpChildrenHTML = '';
			if (tmpIsExpanded)
			{
				tmpChildrenHTML = this.renderTreeLevel(tmpPath, pDepth + 1, pCurrentLocation);
			}

			// Use SVG icons if the icon provider is available
		let tmpIconProvider = this.pict.providers['Pict-FileBrowser-Icons'];
		let tmpFolderIcon = tmpIconProvider ? tmpIconProvider.getIcon('folder', 16) : '\uD83D\uDCC1';
		let tmpToggleIcon = '';
		if (tmpHasChildren)
		{
			if (tmpIconProvider)
			{
				tmpToggleIcon = tmpIsExpanded ? tmpIconProvider.getIcon('chevron-down', 10) : tmpIconProvider.getIcon('chevron-right', 10);
			}
			else
			{
				tmpToggleIcon = tmpIsExpanded ? '\u25BE' : '\u25B8';
			}
		}

		let tmpRecord =
			{
				Name: tmpChild.Name,
				Path: tmpPath,
				NodeID: tmpNodeID,
				Indent: 8 + (pDepth * 16),
				Icon: tmpFolderIcon,
				ToggleIcon: tmpToggleIcon,
				ToggleClass: tmpHasChildren ? 'pict-fb-tree-toggle' : 'pict-fb-tree-toggle-empty',
				ToggleHandler: tmpHasChildren ? "event.stopPropagation(); pict.views['" + this.Hash + "'].toggleNode('" + tmpPath + "')" : '',
				ClickHandler: "pict.views['" + this.Hash + "'].selectFolder('" + tmpPath + "')",
				SelectedClass: tmpIsSelected ? ' selected' : '',
				ExpandedClass: tmpIsExpanded ? ' expanded' : '',
				ChildrenHTML: tmpChildrenHTML
			};

			tmpHTML += this.pict.parseTemplateByHash('FileBrowser-BrowseTree-Node-Template', tmpRecord);
		}

		return tmpHTML;
	}

	/**
	 * Toggle a node's expanded/collapsed state.
	 *
	 * If expanding and children have not been loaded, emits an event
	 * so the consuming application can fetch them (e.g. via /children).
	 *
	 * @param {string} pPath - The folder path
	 */
	toggleNode(pPath)
	{
		this.expandedPaths[pPath] = !this.expandedPaths[pPath];

		// If expanding and children not yet loaded, signal that we need them
		if (this.expandedPaths[pPath])
		{
			let tmpBrowseProvider = this.pict.providers['Pict-FileBrowser-Browse'];
			if (tmpBrowseProvider)
			{
				let tmpCached = tmpBrowseProvider.getChildFolders(pPath);
				if (!tmpCached)
				{
					// Emit an event; the consuming app should listen and load children
					if (typeof(this.onRequestChildren) === 'function')
					{
						this.onRequestChildren(pPath);
					}
				}
			}
		}

		this.rebuildTree();
	}

	/**
	 * Override this callback to handle lazy loading of child folders.
	 *
	 * Called when a node is expanded but its children have not been cached.
	 * The consuming application should fetch children (e.g. via API) and call
	 * browseProvider.setChildFolders(pPath, children), then call rebuildTree().
	 *
	 * @param {string} pPath - The folder path that needs its children loaded
	 */
	onRequestChildren(pPath)
	{
		// Default: no-op.  Override in consuming application.
	}

	/**
	 * Select a folder, navigating the file browser to it.
	 *
	 * @param {string} pPath - The folder path
	 */
	selectFolder(pPath)
	{
		// Auto-expand the selected folder
		this.expandedPaths[pPath] = true;

		let tmpBrowseProvider = this.pict.providers['Pict-FileBrowser-Browse'];
		if (tmpBrowseProvider)
		{
			// If children not yet loaded, request them
			let tmpCached = tmpBrowseProvider.getChildFolders(pPath);
			if (!tmpCached)
			{
				if (typeof(this.onRequestChildren) === 'function')
				{
					this.onRequestChildren(pPath);
				}
			}

			tmpBrowseProvider.navigateToFolder(pPath);
		}

		this.rebuildTree();
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

module.exports = PictViewFileBrowserBrowseTree;

module.exports.default_configuration = _ViewConfiguration;
