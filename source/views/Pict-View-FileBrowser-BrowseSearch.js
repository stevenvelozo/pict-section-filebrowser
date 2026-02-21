const libPictView = require('pict-view');

const _ViewConfiguration =
{
	"ViewIdentifier": "Pict-FileBrowser-BrowseSearch",

	"DefaultRenderable": "BrowseSearch-Container",
	"DefaultDestinationAddress": "#Pict-FileBrowser-BrowsePane",

	"AutoRender": false,

	"Templates":
	[
		{
			"Hash": "FileBrowser-BrowseSearch-Container-Template",
			"Template": /*html*/`
<div class="pict-fb-search">
	<input type="text" class="pict-fb-search-input"
		id="Pict-FileBrowser-SearchInput"
		placeholder="Search files..."
		oninput="pict.views['{~D:Record.ViewHash~}'].onSearchInput(this.value)" />
	<div class="pict-fb-search-results" id="Pict-FileBrowser-SearchResults"></div>
</div>
`
		},
		{
			"Hash": "FileBrowser-BrowseSearch-Result-Template",
			"Template": /*html*/`
<div class="pict-fb-search-result" onclick="{~D:Record.ClickHandler~}">
	<span class="pict-fb-search-result-icon">{~D:Record.Icon~}</span>
	<span class="pict-fb-search-result-name">{~D:Record.Name~}</span>
	<span class="pict-fb-search-result-path">{~D:Record.Path~}</span>
</div>
`
		},
		{
			"Hash": "FileBrowser-BrowseSearch-Empty-Template",
			"Template": /*html*/`<div class="pict-fb-empty">{~D:Record.Message~}</div>`
		}
	],

	"Renderables":
	[
		{
			"RenderableHash": "BrowseSearch-Container",
			"TemplateHash": "FileBrowser-BrowseSearch-Container-Template",
			"DestinationAddress": "#Pict-FileBrowser-BrowsePane",
			"RenderMethod": "replace"
		}
	]
};

/**
 * Browsing view that provides a search input for filtering files by name.
 *
 * Renders a search box and a results list. As the user types, the results
 * are filtered from the file list using the browse provider's searchFiles method.
 */
class PictViewFileBrowserBrowseSearch extends libPictView
{
	constructor(pFable, pOptions, pServiceHash)
	{
		let tmpOptions = Object.assign({}, _ViewConfiguration, pOptions);
		super(pFable, tmpOptions, pServiceHash);

		this.lastQuery = '';
		this.debounceTimer = null;
	}

	/**
	 * Override render to inject the view hash into the template data.
	 */
	onAfterRender(pRenderable)
	{
		// Re-render the container with the view hash so onclick handlers work
		let tmpContainerHTML = this.pict.parseTemplateByHash(
			'FileBrowser-BrowseSearch-Container-Template',
			{ ViewHash: this.Hash });
		this.pict.ContentAssignment.assignContent('#Pict-FileBrowser-BrowsePane', tmpContainerHTML);

		this.pict.CSSMap.injectCSS();
		return super.onAfterRender(pRenderable);
	}

	/**
	 * Handle search input with debounce.
	 *
	 * @param {string} pQuery - The search query string
	 */
	onSearchInput(pQuery)
	{
		this.lastQuery = pQuery || '';

		if (this.debounceTimer)
		{
			clearTimeout(this.debounceTimer);
		}

		this.debounceTimer = setTimeout(
			() =>
			{
				this.performSearch(this.lastQuery);
			}, 150);
	}

	/**
	 * Execute the search and render results.
	 *
	 * @param {string} pQuery - The search query
	 */
	performSearch(pQuery)
	{
		let tmpResultsContainer = '#Pict-FileBrowser-SearchResults';

		if (!pQuery || pQuery.length < 1)
		{
			this.pict.ContentAssignment.assignContent(tmpResultsContainer, '');
			return;
		}

		let tmpBrowseProvider = this.pict.providers['Pict-FileBrowser-Browse'];
		if (!tmpBrowseProvider)
		{
			return;
		}

		let tmpResults = tmpBrowseProvider.searchFiles(pQuery);
		let tmpListProvider = this.pict.providers['Pict-FileBrowser-List'];

		if (tmpResults.length === 0)
		{
			let tmpEmptyHTML = this.pict.parseTemplateByHash(
				'FileBrowser-BrowseSearch-Empty-Template',
				{ Message: 'No results found' });
			this.pict.ContentAssignment.assignContent(tmpResultsContainer, tmpEmptyHTML);
			return;
		}

		let tmpHTML = '';
		let tmpMaxResults = 50;

		for (let i = 0; i < tmpResults.length && i < tmpMaxResults; i++)
		{
			let tmpEntry = tmpResults[i];
			let tmpIcon = tmpListProvider ? tmpListProvider.getEntryIcon(tmpEntry) : '\uD83D\uDCC4';
			let tmpPath = tmpEntry.Path || '';

			let tmpRecord =
			{
				Name: tmpEntry.Name,
				Path: tmpPath,
				Icon: tmpIcon,
				ClickHandler: "pict.views['" + this.Hash + "'].selectResult(" + i + ")"
			};

			tmpHTML += this.pict.parseTemplateByHash('FileBrowser-BrowseSearch-Result-Template', tmpRecord);
		}

		this.pict.ContentAssignment.assignContent(tmpResultsContainer, tmpHTML);

		// Cache results for selection
		this._lastResults = tmpResults;
	}

	/**
	 * Handle clicking a search result.
	 *
	 * @param {number} pIndex - The result index
	 */
	selectResult(pIndex)
	{
		if (!this._lastResults || pIndex >= this._lastResults.length)
		{
			return;
		}

		let tmpEntry = this._lastResults[pIndex];

		let tmpListProvider = this.pict.providers['Pict-FileBrowser-List'];
		if (tmpListProvider)
		{
			tmpListProvider.openEntry(tmpEntry);
		}
	}
}

module.exports = PictViewFileBrowserBrowseSearch;

module.exports.default_configuration = _ViewConfiguration;
