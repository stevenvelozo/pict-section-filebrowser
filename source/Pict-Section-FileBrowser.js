// Pict Section FileBrowser
// A composable file browser section with browsing, listing, and viewing views.

// The main container view
module.exports = require('./views/Pict-View-FileBrowser.js');

// --- Providers (base classes for each view type) ---
module.exports.PictFileBrowserBrowseProvider = require('./providers/Pict-Provider-FileBrowserBrowse.js');
module.exports.PictFileBrowserListProvider = require('./providers/Pict-Provider-FileBrowserList.js');
module.exports.PictFileBrowserViewProvider = require('./providers/Pict-Provider-FileBrowserView.js');
module.exports.PictFileBrowserLayoutProvider = require('./providers/Pict-Provider-FileBrowserLayout.js');
module.exports.PictFileBrowserIconProvider = require('./providers/Pict-Provider-FileBrowserIcons.js');

// --- Browsing Views ---
module.exports.PictViewBrowseTree = require('./views/Pict-View-FileBrowser-BrowseTree.js');
module.exports.PictViewBrowseSearch = require('./views/Pict-View-FileBrowser-BrowseSearch.js');

// --- Listing Views ---
module.exports.PictViewListDetail = require('./views/Pict-View-FileBrowser-ListDetail.js');
module.exports.PictViewListIcons = require('./views/Pict-View-FileBrowser-ListIcons.js');

// --- Viewing Views ---
module.exports.PictViewFileInfo = require('./views/Pict-View-FileBrowser-ViewFileInfo.js');
module.exports.PictViewImageViewer = require('./views/Pict-View-FileBrowser-ViewImage.js');

// --- Service (Fable service with REST endpoints + static web app) ---
module.exports.FileBrowserService = require('./services/Pict-Service-FileBrowser.js');
