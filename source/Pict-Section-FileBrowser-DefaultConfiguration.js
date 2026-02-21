module.exports = {
	"ViewIdentifier": "Pict-FileBrowser",

	"DefaultRenderable": "FileBrowser-Container",
	"DefaultDestinationAddress": "#Pict-FileBrowser-Container",

	"AutoRender": false,

	// --- FileBrowser State ---
	// These are the four core state values for the file browser.
	// They live in AppData at the addresses below.
	"StateAddresses":
	{
		"Layout": "AppData.PictFileBrowser.Layout",
		"RootLocation": "AppData.PictFileBrowser.RootLocation",
		"CurrentLocation": "AppData.PictFileBrowser.CurrentLocation",
		"CurrentFile": "AppData.PictFileBrowser.CurrentFile"
	},

	// Default state values
	"DefaultState":
	{
		"Layout": "browser-detail",
		"RootLocation": "/",
		"CurrentLocation": "",
		"CurrentFile": null
	},

	// --- File Data ---
	// The consuming application must populate this address with file/folder data.
	// Expected format: Array of objects with at minimum { Name, Type }
	// Type: "folder" or "file"
	// Additional properties: Size, Modified, Extension, MimeType, Path, Icon, ThumbnailURL
	"FileListAddress": "AppData.PictFileBrowser.FileList",
	"FolderTreeAddress": "AppData.PictFileBrowser.FolderTree",
	"ChildFolderCacheAddress": "AppData.PictFileBrowser.ChildFolderCache",

	// --- Templates ---
	"Templates":
	[
		{
			"Hash": "FileBrowser-Container-Template",
			"Template": /*html*/`
<div class="pict-filebrowser" id="Pict-FileBrowser-Wrap">
	<div class="pict-filebrowser-browse-pane" id="Pict-FileBrowser-BrowsePane"></div>
	<div class="pict-filebrowser-main-pane">
		<div class="pict-filebrowser-list-pane" id="Pict-FileBrowser-ListPane"></div>
		<div class="pict-filebrowser-view-pane" id="Pict-FileBrowser-ViewPane"></div>
	</div>
</div>
`
		}
	],

	"Renderables":
	[
		{
			"RenderableHash": "FileBrowser-Container",
			"TemplateHash": "FileBrowser-Container-Template",
			"DestinationAddress": "#Pict-FileBrowser-Container",
			"RenderMethod": "replace"
		}
	],

	// --- CSS ---
	"CSS": /*css*/`
		.pict-filebrowser {
			display: flex;
			height: 100%;
			font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
			font-size: 14px;
			color: #3D3229;
			border: 1px solid #DDD6CA;
			border-radius: 4px;
			overflow: hidden;
			background: #FAFAF8;
		}

		.pict-filebrowser-browse-pane {
			width: 240px;
			min-width: 180px;
			border-right: 1px solid #DDD6CA;
			overflow-y: auto;
			background: #F5F0E8;
			flex-shrink: 0;
		}

		.pict-filebrowser-main-pane {
			display: flex;
			flex-direction: column;
			flex: 1;
			min-width: 0;
		}

		.pict-filebrowser-list-pane {
			flex: 1;
			overflow-y: auto;
			overflow-x: hidden;
		}

		.pict-filebrowser-view-pane {
			border-top: 1px solid #DDD6CA;
			overflow-y: auto;
			background: #FAFAF8;
		}

		/* --- Browsing: Tree --- */
		.pict-fb-tree {
			padding: 8px 0;
		}
		.pict-fb-tree-node {
			display: flex;
			align-items: center;
			padding: 4px 8px 4px 0;
			cursor: pointer;
			user-select: none;
			white-space: nowrap;
		}
		.pict-fb-tree-node:hover {
			background: #EAE3D8;
		}
		.pict-fb-tree-node.selected {
			background: #DDD6CA;
			font-weight: 600;
		}
		.pict-fb-tree-toggle {
			display: inline-block;
			width: 16px;
			text-align: center;
			flex-shrink: 0;
			color: #8A7F72;
			font-size: 10px;
		}
		.pict-fb-tree-icon {
			margin-right: 6px;
			flex-shrink: 0;
			font-size: 14px;
		}
		.pict-fb-tree-label {
			overflow: hidden;
			text-overflow: ellipsis;
		}
		.pict-fb-tree-children {
			display: none;
		}
		.pict-fb-tree-children.expanded {
			display: block;
		}

		/* --- Browsing: Search --- */
		.pict-fb-search {
			padding: 8px;
		}
		.pict-fb-search-input {
			width: 100%;
			box-sizing: border-box;
			padding: 6px 10px;
			border: 1px solid #DDD6CA;
			border-radius: 4px;
			font-size: 13px;
			outline: none;
			background: #fff;
		}
		.pict-fb-search-input:focus {
			border-color: #2E7D74;
		}
		.pict-fb-search-results {
			margin-top: 4px;
		}
		.pict-fb-search-result {
			display: flex;
			align-items: center;
			padding: 5px 8px;
			cursor: pointer;
			border-radius: 3px;
		}
		.pict-fb-search-result:hover {
			background: #EAE3D8;
		}
		.pict-fb-search-result-icon {
			margin-right: 6px;
			flex-shrink: 0;
		}
		.pict-fb-search-result-name {
			overflow: hidden;
			text-overflow: ellipsis;
			white-space: nowrap;
		}
		.pict-fb-search-result-path {
			color: #8A7F72;
			font-size: 11px;
			margin-left: auto;
			padding-left: 8px;
			white-space: nowrap;
		}

		/* --- Listing: Detail --- */
		.pict-fb-detail {
			width: 100%;
		}
		.pict-fb-detail-header {
			display: flex;
			padding: 6px 12px;
			font-weight: 600;
			font-size: 12px;
			text-transform: uppercase;
			color: #8A7F72;
			border-bottom: 1px solid #DDD6CA;
			background: #F5F0E8;
			user-select: none;
		}
		.pict-fb-detail-header-cell {
			overflow: hidden;
			text-overflow: ellipsis;
			white-space: nowrap;
			cursor: pointer;
		}
		.pict-fb-detail-header-cell:hover {
			color: #3D3229;
		}
		.pict-fb-detail-col-name {
			flex: 1;
			min-width: 0;
		}
		.pict-fb-detail-col-size {
			width: 90px;
			text-align: right;
			flex-shrink: 0;
			padding-right: 12px;
		}
		.pict-fb-detail-col-modified {
			width: 150px;
			flex-shrink: 0;
		}
		.pict-fb-detail-row {
			display: flex;
			align-items: center;
			padding: 5px 12px;
			cursor: pointer;
			border-bottom: 1px solid #F0ECE4;
		}
		.pict-fb-detail-row:hover {
			background: #F0ECE4;
		}
		.pict-fb-detail-row.selected {
			background: #E0EDE9;
		}
		.pict-fb-detail-icon {
			margin-right: 8px;
			flex-shrink: 0;
			font-size: 16px;
		}
		.pict-fb-detail-name {
			flex: 1;
			min-width: 0;
			overflow: hidden;
			text-overflow: ellipsis;
			white-space: nowrap;
		}
		.pict-fb-detail-size {
			width: 90px;
			text-align: right;
			flex-shrink: 0;
			padding-right: 12px;
			color: #8A7F72;
			font-size: 12px;
		}
		.pict-fb-detail-modified {
			width: 150px;
			flex-shrink: 0;
			color: #8A7F72;
			font-size: 12px;
		}

		/* --- Listing: Icons --- */
		.pict-fb-icons {
			display: flex;
			flex-wrap: wrap;
			padding: 12px;
			gap: 8px;
		}
		.pict-fb-icon-item {
			display: flex;
			flex-direction: column;
			align-items: center;
			width: 96px;
			padding: 10px 6px;
			cursor: pointer;
			border-radius: 6px;
			text-align: center;
		}
		.pict-fb-icon-item:hover {
			background: #F0ECE4;
		}
		.pict-fb-icon-item.selected {
			background: #E0EDE9;
		}
		.pict-fb-icon-graphic {
			font-size: 36px;
			margin-bottom: 6px;
		}
		.pict-fb-icon-label {
			font-size: 12px;
			word-break: break-word;
			line-height: 1.3;
			max-height: 2.6em;
			overflow: hidden;
		}

		/* --- Viewing: FileInfo --- */
		.pict-fb-fileinfo {
			padding: 12px 16px;
		}
		.pict-fb-fileinfo-title {
			font-size: 15px;
			font-weight: 600;
			margin-bottom: 8px;
			color: #3D3229;
		}
		.pict-fb-fileinfo-table {
			width: 100%;
			font-size: 13px;
		}
		.pict-fb-fileinfo-table td {
			padding: 3px 0;
		}
		.pict-fb-fileinfo-label {
			color: #8A7F72;
			width: 100px;
			font-weight: 500;
		}
		.pict-fb-fileinfo-value {
			color: #423D37;
		}
		.pict-fb-fileinfo-none {
			color: #8A7F72;
			font-style: italic;
		}

		/* --- Viewing: Image --- */
		.pict-fb-image-viewer {
			display: flex;
			align-items: center;
			justify-content: center;
			padding: 16px;
			min-height: 200px;
		}
		.pict-fb-image-viewer img {
			max-width: 100%;
			max-height: 500px;
			object-fit: contain;
			border-radius: 4px;
			box-shadow: 0 1px 3px rgba(0,0,0,0.1);
		}
		.pict-fb-image-viewer-none {
			color: #8A7F72;
			font-style: italic;
		}

		/* --- Breadcrumb / Location Bar --- */
		.pict-fb-breadcrumb {
			display: flex;
			align-items: center;
			padding: 6px 12px;
			font-size: 13px;
			background: #F5F0E8;
			border-bottom: 1px solid #DDD6CA;
			overflow-x: auto;
			white-space: nowrap;
		}
		.pict-fb-breadcrumb-segment {
			cursor: pointer;
			color: #2E7D74;
			padding: 2px 4px;
			border-radius: 3px;
		}
		.pict-fb-breadcrumb-segment:hover {
			background: #EAE3D8;
		}
		.pict-fb-breadcrumb-separator {
			margin: 0 2px;
			color: #8A7F72;
		}
		.pict-fb-breadcrumb-current {
			color: #3D3229;
			font-weight: 500;
			padding: 2px 4px;
		}

		/* --- Empty state --- */
		.pict-fb-empty {
			display: flex;
			align-items: center;
			justify-content: center;
			padding: 32px;
			color: #8A7F72;
			font-style: italic;
		}
	`
};
