# Pict-Section-FileBrowser

> A composable file browser section with modular browsing, listing, and viewing views for the Pict application platform

Pict-Section-FileBrowser provides a complete set of views and providers for building customizable file browsing interfaces.  It supports multiple layout modes, a lazy-loaded folder tree, full-text search, sortable detail lists, icon grids, file metadata display, and image preview -- all wired together through the Pict AppData pattern.

## Features

- **Composable Views** - Mix and match tree, list, search and detail views
- **Multiple Layouts** - Six built-in layout modes with custom layout support
- **Provider Architecture** - Five independent providers for browse, list, view, layout and icons
- **SVG Icon System** - Hand-drawn retro icons with automatic file type detection
- **REST API Service** - Built-in filesystem endpoints with path traversal protection
- **CLI Utility** - Instant file browser serving with `browse` command
- **Lazy Loading** - On-demand folder tree expansion with caching
- **Full-Text Search** - Case-insensitive file and folder search

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

// Register the main file browser view
let tmpFileBrowser = tmpPict.addView(
	'Pict-FileBrowser',
	libPictSectionFileBrowser.default_configuration,
	libPictSectionFileBrowser
);

// Register specific sub-views as needed
tmpPict.addView('BrowseTree', {}, libPictSectionFileBrowser.PictViewBrowseTree);
tmpPict.addView('ListDetail', {}, libPictSectionFileBrowser.PictViewListDetail);
tmpPict.addView('FileInfo', {}, libPictSectionFileBrowser.PictViewFileInfo);
```

## Installation

```bash
npm install pict-section-filebrowser
```

## CLI Usage

The module includes a `browse` command for serving a file browser instantly:

```bash
browse [path] [options]
  -p, --port <port>    Port to listen on (default: 8086)
  -a, --hidden         Include hidden files (dotfiles)
  -h, --help           Show help message
```

Examples:

```bash
browse ~/Documents -p 9876
browse . --hidden
npx pict-section-filebrowser /var/log
```

## Module Exports

The main entry point exports the container view as the default, plus all sub-components:

| Export | Description |
|--------|-------------|
| `default` | PictViewFileBrowser container view |
| `PictFileBrowserBrowseProvider` | Folder hierarchy and search provider |
| `PictFileBrowserListProvider` | File listing, sorting and selection provider |
| `PictFileBrowserViewProvider` | File viewing utilities provider |
| `PictFileBrowserLayoutProvider` | Layout mode management provider |
| `PictFileBrowserIconProvider` | SVG icon generation provider |
| `PictViewBrowseTree` | Lazy-loaded folder tree view |
| `PictViewBrowseSearch` | Full-text search view |
| `PictViewListDetail` | Sortable table listing view |
| `PictViewListIcons` | Icon grid listing view |
| `PictViewFileInfo` | File metadata display view |
| `PictViewImageViewer` | Image preview view |
| `FileBrowserService` | REST API service for filesystem access |

## Documentation

- [Providers](Providers.md) - Provider classes and their APIs
- [Views](Views.md) - View classes and rendering
- [Layouts](Layouts.md) - Built-in and custom layout modes
- [Icons](Icons.md) - SVG icon system and extension mapping
- [REST API](REST_API.md) - Filesystem service endpoints
- [Configuration](Configuration.md) - AppData state and file entry format

## Related Packages

- [pict](https://github.com/stevenvelozo/pict) - Core application framework
- [pict-view](https://github.com/stevenvelozo/pict-view) - View base class
- [pict-provider](https://github.com/stevenvelozo/pict-provider) - Provider base class
- [orator](https://github.com/stevenvelozo/orator) - API server framework
- [fable](https://github.com/stevenvelozo/fable) - Service infrastructure
