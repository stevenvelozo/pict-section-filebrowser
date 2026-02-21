const libPictView = require('pict-view');

const _ViewConfiguration =
{
	"ViewIdentifier": "Pict-FileBrowser-ViewImage",

	"DefaultRenderable": "ViewImage-Container",
	"DefaultDestinationAddress": "#Pict-FileBrowser-ViewPane",

	"AutoRender": false,

	"Templates":
	[
		{
			"Hash": "FileBrowser-ViewImage-Container-Template",
			"Template": /*html*/`<div class="pict-fb-image-viewer" id="Pict-FileBrowser-ImageViewer"></div>`
		},
		{
			"Hash": "FileBrowser-ViewImage-Display-Template",
			"Template": /*html*/`<img src="{~D:Record.ImageURL~}" alt="{~D:Record.Name~}" />`
		},
		{
			"Hash": "FileBrowser-ViewImage-NoImage-Template",
			"Template": /*html*/`<div class="pict-fb-image-viewer-none">{~D:Record.Message~}</div>`
		}
	],

	"Renderables":
	[
		{
			"RenderableHash": "ViewImage-Container",
			"TemplateHash": "FileBrowser-ViewImage-Container-Template",
			"DestinationAddress": "#Pict-FileBrowser-ViewPane",
			"RenderMethod": "replace"
		}
	]
};

/**
 * Viewing view that displays an image preview for the currently selected file.
 *
 * If the selected file is an image and has a URL or ThumbnailURL, it renders
 * an <img> tag. Otherwise shows a "not an image" or "no file selected" message.
 */
class PictViewFileBrowserViewImage extends libPictView
{
	constructor(pFable, pOptions, pServiceHash)
	{
		let tmpOptions = Object.assign({}, _ViewConfiguration, pOptions);
		super(pFable, tmpOptions, pServiceHash);
	}

	/**
	 * After rendering the container, populate with the image or message.
	 */
	onAfterRender(pRenderable)
	{
		this.rebuildImageView();
		this.pict.CSSMap.injectCSS();
		return super.onAfterRender(pRenderable);
	}

	/**
	 * Rebuild the image viewer display.
	 */
	rebuildImageView()
	{
		let tmpViewProvider = this.pict.providers['Pict-FileBrowser-View'];
		let tmpCurrentFile = tmpViewProvider ? tmpViewProvider.getCurrentFile() : null;

		if (!tmpCurrentFile)
		{
			let tmpHTML = this.pict.parseTemplateByHash(
				'FileBrowser-ViewImage-NoImage-Template',
				{ Message: 'No file selected' });
			this.pict.ContentAssignment.assignContent('#Pict-FileBrowser-ImageViewer', tmpHTML);
			return;
		}

		let tmpIsImage = tmpViewProvider ? tmpViewProvider.isImage(tmpCurrentFile) : false;

		if (!tmpIsImage)
		{
			let tmpHTML = this.pict.parseTemplateByHash(
				'FileBrowser-ViewImage-NoImage-Template',
				{ Message: 'Selected file is not an image' });
			this.pict.ContentAssignment.assignContent('#Pict-FileBrowser-ImageViewer', tmpHTML);
			return;
		}

		let tmpImageURL = tmpViewProvider ? tmpViewProvider.getImageURL(tmpCurrentFile) : null;

		if (!tmpImageURL)
		{
			let tmpHTML = this.pict.parseTemplateByHash(
				'FileBrowser-ViewImage-NoImage-Template',
				{ Message: 'No image URL available' });
			this.pict.ContentAssignment.assignContent('#Pict-FileBrowser-ImageViewer', tmpHTML);
			return;
		}

		let tmpHTML = this.pict.parseTemplateByHash(
			'FileBrowser-ViewImage-Display-Template',
			{
				ImageURL: tmpImageURL,
				Name: tmpCurrentFile.Name || 'Image'
			});
		this.pict.ContentAssignment.assignContent('#Pict-FileBrowser-ImageViewer', tmpHTML);
	}
}

module.exports = PictViewFileBrowserViewImage;

module.exports.default_configuration = _ViewConfiguration;
