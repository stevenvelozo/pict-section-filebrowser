const libPictView = require('pict-view');

const _ViewConfiguration =
{
	"ViewIdentifier": "Pict-FileBrowser-ViewFileInfo",

	"DefaultRenderable": "ViewFileInfo-Container",
	"DefaultDestinationAddress": "#Pict-FileBrowser-ViewPane",

	"AutoRender": false,

	"Templates":
	[
		{
			"Hash": "FileBrowser-ViewFileInfo-Container-Template",
			"Template": /*html*/`<div class="pict-fb-fileinfo" id="Pict-FileBrowser-FileInfo"></div>`
		},
		{
			"Hash": "FileBrowser-ViewFileInfo-Detail-Template",
			"Template": /*html*/`
<div class="pict-fb-fileinfo-title">{~D:Record.Name~}</div>
<table class="pict-fb-fileinfo-table">
	<tr>
		<td class="pict-fb-fileinfo-label">Type</td>
		<td class="pict-fb-fileinfo-value">{~D:Record.TypeDescription~}</td>
	</tr>
	<tr>
		<td class="pict-fb-fileinfo-label">Size</td>
		<td class="pict-fb-fileinfo-value">{~D:Record.SizeFormatted~}</td>
	</tr>
	<tr>
		<td class="pict-fb-fileinfo-label">Modified</td>
		<td class="pict-fb-fileinfo-value">{~D:Record.ModifiedFormatted~}</td>
	</tr>
	<tr>
		<td class="pict-fb-fileinfo-label">Extension</td>
		<td class="pict-fb-fileinfo-value">{~D:Record.Extension~}</td>
	</tr>
	<tr>
		<td class="pict-fb-fileinfo-label">Path</td>
		<td class="pict-fb-fileinfo-value">{~D:Record.Path~}</td>
	</tr>
</table>
`
		},
		{
			"Hash": "FileBrowser-ViewFileInfo-Empty-Template",
			"Template": /*html*/`<div class="pict-fb-fileinfo-none">No file selected</div>`
		}
	],

	"Renderables":
	[
		{
			"RenderableHash": "ViewFileInfo-Container",
			"TemplateHash": "FileBrowser-ViewFileInfo-Container-Template",
			"DestinationAddress": "#Pict-FileBrowser-ViewPane",
			"RenderMethod": "replace"
		}
	]
};

/**
 * Viewing view that shows file metadata/stats for the currently selected file.
 *
 * Displays name, type description, size, modification date, extension, and path
 * in a simple table layout. Shows "No file selected" when nothing is selected.
 */
class PictViewFileBrowserViewFileInfo extends libPictView
{
	constructor(pFable, pOptions, pServiceHash)
	{
		let tmpOptions = Object.assign({}, _ViewConfiguration, pOptions);
		super(pFable, tmpOptions, pServiceHash);
	}

	/**
	 * After rendering the container, populate with file info.
	 */
	onAfterRender(pRenderable)
	{
		this.rebuildFileInfo();
		this.pict.CSSMap.injectCSS();
		return super.onAfterRender(pRenderable);
	}

	/**
	 * Rebuild the file info display.
	 */
	rebuildFileInfo()
	{
		let tmpViewProvider = this.pict.providers['Pict-FileBrowser-View'];
		let tmpListProvider = this.pict.providers['Pict-FileBrowser-List'];

		let tmpCurrentFile = tmpViewProvider ? tmpViewProvider.getCurrentFile() : null;

		if (!tmpCurrentFile)
		{
			let tmpEmptyHTML = this.pict.parseTemplateByHash(
				'FileBrowser-ViewFileInfo-Empty-Template', {});
			this.pict.ContentAssignment.assignContent('#Pict-FileBrowser-FileInfo', tmpEmptyHTML);
			return;
		}

		let tmpRecord =
		{
			Name: tmpCurrentFile.Name || 'Unknown',
			TypeDescription: tmpViewProvider ? tmpViewProvider.getFileTypeDescription(tmpCurrentFile) : 'File',
			SizeFormatted: tmpListProvider ? tmpListProvider.formatFileSize(tmpCurrentFile.Size) : (tmpCurrentFile.Size || '--'),
			ModifiedFormatted: tmpListProvider ? tmpListProvider.formatDate(tmpCurrentFile.Modified) : (tmpCurrentFile.Modified || '--'),
			Extension: tmpCurrentFile.Extension || '--',
			Path: tmpCurrentFile.Path || '--'
		};

		let tmpHTML = this.pict.parseTemplateByHash('FileBrowser-ViewFileInfo-Detail-Template', tmpRecord);
		this.pict.ContentAssignment.assignContent('#Pict-FileBrowser-FileInfo', tmpHTML);
	}
}

module.exports = PictViewFileBrowserViewFileInfo;

module.exports.default_configuration = _ViewConfiguration;
