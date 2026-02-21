# Pict Section FileBrowser

A composable file browser section for the Pict application platform.  Provides
modular browsing, listing, and viewing views for building customizable file
system navigation interfaces.

## Features

- Composable views for tree browsing, search, detail lists, icon grids, file
  info and image preview
- Multiple layout modes (tree-list, list-detail, browser-detail, browser-columns
  and more)
- Five independent providers: Browse, List, View, Layout, Icons
- Hand-drawn SVG icon system with automatic file type detection
- Built-in REST API service for filesystem access
- CLI utility (`browse`) for instant file browser serving
- Lazy-loaded folder tree with caching
- Full-text file search
- Sortable columns, breadcrumb navigation, file metadata display

## Installation

```bash
npm install pict-section-filebrowser
```

## Quick Start

```javascript
const libPictSectionFileBrowser = require('pict-section-filebrowser');

// Create a Pict application
const tmpPict = new libPict();

// Populate AppData with file entries
tmpPict.AppData.PictFileBrowser = {
	FileList: [
		{ Name: 'Documents', Type: 'folder', Path: '/Documents' },
		{ Name: 'report.pdf', Type: 'file', Path: '/report.pdf', Size: 245000, Extension: '.pdf' }
	],
	FolderTree: [
		{ Name: 'Documents', Path: '/Documents', Children: [] }
	]
};

// Register the file browser view
let tmpFileBrowser = tmpPict.addView(
	'Pict-FileBrowser',
	libPictSectionFileBrowser.default_configuration,
	libPictSectionFileBrowser
);
```

## CLI Usage

```bash
browse [path] [options]
  -p, --port <port>    Port to listen on (default: 8086)
  -a, --hidden         Include hidden files (dotfiles)
  -h, --help           Show help message

Examples:
  browse ~/Documents -p 9876
  browse . --hidden
  npx pict-section-filebrowser /var/log
```

## Architecture

The module is organized into five provider types and six view types:

**Providers:**
- **BrowseProvider** - Folder hierarchy, tree navigation, search
- **ListProvider** - File listing, sorting, filtering, selection
- **ViewProvider** - Selected file utilities, image detection
- **LayoutProvider** - View layout modes and pane visibility
- **IconProvider** - SVG icon generation and file type mapping

**Views:**
- **FileBrowser** - Container view orchestrating the ecosystem
- **BrowseTree** - Lazy-loaded hierarchical folder tree
- **BrowseSearch** - Full-text search with results
- **ListDetail** - Table-style listing with sortable columns
- **ListIcons** - Icon grid layout
- **ViewFileInfo** - File metadata display
- **ViewImage** - Image preview

**Service:**
- **FileBrowserService** - REST API endpoints for filesystem access

## Testing

```bash
npm test
```

## Related Packages

- [pict](https://github.com/stevenvelozo/pict) - Core application framework
- [pict-view](https://github.com/stevenvelozo/pict-view) - View base class
- [pict-provider](https://github.com/stevenvelozo/pict-provider) - Provider base class
- [orator](https://github.com/stevenvelozo/orator) - API server framework
- [fable](https://github.com/stevenvelozo/fable) - Service infrastructure

## License

MIT
