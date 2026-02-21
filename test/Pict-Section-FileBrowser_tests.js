/**
* Unit tests for Pict Section FileBrowser
*
* @license     MIT
*
* @author      Steven Velozo <steven@velozo.com>
*/

var Chai = require("chai");
var Expect = Chai.expect;

var libPath = require('path');
var libPict = require('pict');
var libPictSectionFileBrowser = require('../source/Pict-Section-FileBrowser.js');
var libFileBrowserService = libPictSectionFileBrowser.FileBrowserService;

// Provider references
var libBrowseProvider = libPictSectionFileBrowser.PictFileBrowserBrowseProvider;
var libListProvider = libPictSectionFileBrowser.PictFileBrowserListProvider;
var libViewProvider = libPictSectionFileBrowser.PictFileBrowserViewProvider;
var libLayoutProvider = libPictSectionFileBrowser.PictFileBrowserLayoutProvider;
var libIconProvider = libPictSectionFileBrowser.PictFileBrowserIconProvider;

// Test data
var _SampleFileList =
[
	{ Name: 'Documents', Type: 'folder', Path: 'Documents', Modified: '2025-01-15T10:30:00Z' },
	{ Name: 'Images', Type: 'folder', Path: 'Images', Modified: '2025-02-20T14:00:00Z' },
	{ Name: 'readme.md', Type: 'file', Extension: '.md', Size: 2048, Path: 'readme.md', Modified: '2025-03-01T09:00:00Z' },
	{ Name: 'photo.jpg', Type: 'file', Extension: '.jpg', Size: 1536000, Path: 'photo.jpg', Modified: '2025-01-10T08:15:00Z', MimeType: 'image/jpeg', URL: 'https://example.com/photo.jpg' },
	{ Name: 'app.js', Type: 'file', Extension: '.js', Size: 4096, Path: 'app.js', Modified: '2025-04-05T16:45:00Z' },
	{ Name: 'data.csv', Type: 'file', Extension: '.csv', Size: 512000, Path: 'data.csv', Modified: '2025-02-28T12:00:00Z' },
	{ Name: 'archive.zip', Type: 'file', Extension: '.zip', Size: 10485760, Path: 'archive.zip', Modified: '2025-01-05T06:30:00Z' }
];

var _SampleFolderTree =
[
	{
		Name: 'Documents',
		Path: 'Documents',
		Children:
		[
			{ Name: 'Work', Path: 'Documents/Work', Children: [] },
			{
				Name: 'Personal',
				Path: 'Documents/Personal',
				Children:
				[
					{ Name: 'Taxes', Path: 'Documents/Personal/Taxes', Children: [] }
				]
			}
		]
	},
	{
		Name: 'Images',
		Path: 'Images',
		Children:
		[
			{ Name: 'Photos', Path: 'Images/Photos', Children: [] },
			{ Name: 'Screenshots', Path: 'Images/Screenshots', Children: [] }
		]
	}
];

/**
 * Create a test Pict instance with providers registered.
 */
var createTestPict = () =>
{
	let tmpPict = new libPict();
	let tmpEnvironment = new libPict.EnvironmentLog(tmpPict);

	// Set up file browser data
	tmpPict.AppData.PictFileBrowser =
	{
		Layout: 'browser-detail',
		RootLocation: '/',
		CurrentLocation: '',
		CurrentFile: null,
		FileList: JSON.parse(JSON.stringify(_SampleFileList)),
		FolderTree: JSON.parse(JSON.stringify(_SampleFolderTree))
	};

	return tmpPict;
};

/**
 * Create a provider by type with a test pict instance.
 */
var createProvider = (pProviderClass) =>
{
	let tmpPict = createTestPict();
	return tmpPict.addProvider(pProviderClass.default_configuration.ProviderIdentifier, pProviderClass.default_configuration, pProviderClass);
};

suite
(
	'Pict Section FileBrowser',
	function()
	{
		setup
		(
			() =>
			{
			}
		);

		suite
		(
			'Object Sanity',
			function()
			{
				test
				(
					'The module should export the main view class and all sub-components.',
					(fDone) =>
					{
						Expect(libPictSectionFileBrowser).to.be.a('function', 'Module should export the main view class.');
						Expect(libPictSectionFileBrowser.default_configuration).to.be.an('object', 'Module should export a default configuration.');

						// Providers
						Expect(libPictSectionFileBrowser.PictFileBrowserBrowseProvider).to.be.a('function');
						Expect(libPictSectionFileBrowser.PictFileBrowserListProvider).to.be.a('function');
						Expect(libPictSectionFileBrowser.PictFileBrowserViewProvider).to.be.a('function');
						Expect(libPictSectionFileBrowser.PictFileBrowserLayoutProvider).to.be.a('function');
						Expect(libPictSectionFileBrowser.PictFileBrowserIconProvider).to.be.a('function');

						// Browsing Views
						Expect(libPictSectionFileBrowser.PictViewBrowseTree).to.be.a('function');
						Expect(libPictSectionFileBrowser.PictViewBrowseSearch).to.be.a('function');

						// Listing Views
						Expect(libPictSectionFileBrowser.PictViewListDetail).to.be.a('function');
						Expect(libPictSectionFileBrowser.PictViewListIcons).to.be.a('function');

						// Viewing Views
						Expect(libPictSectionFileBrowser.PictViewFileInfo).to.be.a('function');
						Expect(libPictSectionFileBrowser.PictViewImageViewer).to.be.a('function');

						fDone();
					}
				);
				test
				(
					'All providers should have default_configuration.',
					(fDone) =>
					{
						Expect(libBrowseProvider.default_configuration).to.be.an('object');
						Expect(libBrowseProvider.default_configuration.ProviderIdentifier).to.equal('Pict-FileBrowser-Browse');

						Expect(libListProvider.default_configuration).to.be.an('object');
						Expect(libListProvider.default_configuration.ProviderIdentifier).to.equal('Pict-FileBrowser-List');

						Expect(libViewProvider.default_configuration).to.be.an('object');
						Expect(libViewProvider.default_configuration.ProviderIdentifier).to.equal('Pict-FileBrowser-View');

						Expect(libLayoutProvider.default_configuration).to.be.an('object');
						Expect(libLayoutProvider.default_configuration.ProviderIdentifier).to.equal('Pict-FileBrowser-Layout');

						Expect(libIconProvider.default_configuration).to.be.an('object');
						Expect(libIconProvider.default_configuration.ProviderIdentifier).to.equal('Pict-FileBrowser-Icons');

						fDone();
					}
				);
				test
				(
					'All views should have default_configuration.',
					(fDone) =>
					{
						Expect(libPictSectionFileBrowser.PictViewBrowseTree.default_configuration).to.be.an('object');
						Expect(libPictSectionFileBrowser.PictViewBrowseSearch.default_configuration).to.be.an('object');
						Expect(libPictSectionFileBrowser.PictViewListDetail.default_configuration).to.be.an('object');
						Expect(libPictSectionFileBrowser.PictViewListIcons.default_configuration).to.be.an('object');
						Expect(libPictSectionFileBrowser.PictViewFileInfo.default_configuration).to.be.an('object');
						Expect(libPictSectionFileBrowser.PictViewImageViewer.default_configuration).to.be.an('object');
						fDone();
					}
				);
			}
		);

		suite
		(
			'Browse Provider',
			function()
			{
				test
				(
					'Should retrieve the folder tree from AppData.',
					(fDone) =>
					{
						var tmpProvider = createProvider(libBrowseProvider);
						var tmpTree = tmpProvider.getFolderTree();
						Expect(tmpTree).to.be.an('array');
						Expect(tmpTree.length).to.equal(2);
						Expect(tmpTree[0].Name).to.equal('Documents');
						Expect(tmpTree[1].Name).to.equal('Images');
						fDone();
					}
				);
				test
				(
					'Should flatten the tree into a list of all folders.',
					(fDone) =>
					{
						var tmpProvider = createProvider(libBrowseProvider);
						var tmpFlat = tmpProvider.flattenTree();
						Expect(tmpFlat).to.be.an('array');
						// Documents, Work, Personal, Taxes, Images, Photos, Screenshots = 7
						Expect(tmpFlat.length).to.equal(7);
						// Check a nested path
						var tmpTaxes = tmpFlat.find((pItem) => { return pItem.Name === 'Taxes'; });
						Expect(tmpTaxes).to.be.an('object');
						Expect(tmpTaxes.Path).to.equal('Documents/Personal/Taxes');
						fDone();
					}
				);
				test
				(
					'Should search files by name substring.',
					(fDone) =>
					{
						var tmpProvider = createProvider(libBrowseProvider);
						var tmpResults = tmpProvider.searchFiles('app');
						Expect(tmpResults).to.be.an('array');
						Expect(tmpResults.length).to.equal(1);
						Expect(tmpResults[0].Name).to.equal('app.js');
						fDone();
					}
				);
				test
				(
					'Should search case-insensitively.',
					(fDone) =>
					{
						var tmpProvider = createProvider(libBrowseProvider);
						var tmpResults = tmpProvider.searchFiles('README');
						Expect(tmpResults.length).to.equal(1);
						Expect(tmpResults[0].Name).to.equal('readme.md');
						fDone();
					}
				);
				test
				(
					'Should return empty array for empty query.',
					(fDone) =>
					{
						var tmpProvider = createProvider(libBrowseProvider);
						Expect(tmpProvider.searchFiles('')).to.have.length(0);
						Expect(tmpProvider.searchFiles(null)).to.have.length(0);
						fDone();
					}
				);
				test
				(
					'Should navigate to a folder path.',
					(fDone) =>
					{
						var tmpProvider = createProvider(libBrowseProvider);
						tmpProvider.navigateToFolder('Documents/Work');
						var tmpLocation = tmpProvider.pict.AppData.PictFileBrowser.CurrentLocation;
						Expect(tmpLocation).to.equal('Documents/Work');
						// CurrentFile should be cleared
						Expect(tmpProvider.pict.AppData.PictFileBrowser.CurrentFile).to.be.null;
						fDone();
					}
				);
				test
				(
					'Should handle empty tree gracefully.',
					(fDone) =>
					{
						var tmpPict = createTestPict();
						tmpPict.AppData.PictFileBrowser.FolderTree = [];
						var tmpProvider = tmpPict.addProvider('Pict-FileBrowser-Browse', libBrowseProvider.default_configuration, libBrowseProvider);
						var tmpTree = tmpProvider.getFolderTree();
						Expect(tmpTree).to.have.length(0);
						var tmpFlat = tmpProvider.flattenTree();
						Expect(tmpFlat).to.have.length(0);
						fDone();
					}
				);
				test
				(
					'Should return null for child folders when cache is empty.',
					(fDone) =>
					{
						var tmpProvider = createProvider(libBrowseProvider);
						var tmpChildren = tmpProvider.getChildFolders('');
						Expect(tmpChildren).to.be.null;
						var tmpChildren2 = tmpProvider.getChildFolders('some/path');
						Expect(tmpChildren2).to.be.null;
						fDone();
					}
				);
				test
				(
					'Should store and retrieve child folders from cache.',
					(fDone) =>
					{
						var tmpProvider = createProvider(libBrowseProvider);
						var tmpSampleChildren =
						[
							{ Name: 'Docs', Path: 'Docs', HasChildren: true },
							{ Name: 'Images', Path: 'Images', HasChildren: false }
						];

						tmpProvider.setChildFolders('', tmpSampleChildren);
						var tmpResult = tmpProvider.getChildFolders('');
						Expect(tmpResult).to.be.an('array');
						Expect(tmpResult.length).to.equal(2);
						Expect(tmpResult[0].Name).to.equal('Docs');
						Expect(tmpResult[1].HasChildren).to.be.false;

						// Different path should still be null
						Expect(tmpProvider.getChildFolders('other')).to.be.null;

						// Store children for a nested path
						var tmpNestedChildren = [{ Name: 'Work', Path: 'Docs/Work', HasChildren: false }];
						tmpProvider.setChildFolders('Docs', tmpNestedChildren);
						var tmpNested = tmpProvider.getChildFolders('Docs');
						Expect(tmpNested).to.be.an('array');
						Expect(tmpNested.length).to.equal(1);
						Expect(tmpNested[0].Name).to.equal('Work');

						// Root cache should still be intact
						Expect(tmpProvider.getChildFolders('').length).to.equal(2);
						fDone();
					}
				);
			}
		);

		suite
		(
			'List Provider',
			function()
			{
				test
				(
					'Should retrieve the file list from AppData.',
					(fDone) =>
					{
						var tmpProvider = createProvider(libListProvider);
						var tmpList = tmpProvider.getFileList();
						Expect(tmpList).to.be.an('array');
						Expect(tmpList.length).to.equal(7);
						fDone();
					}
				);
				test
				(
					'Should sort with folders first by default.',
					(fDone) =>
					{
						var tmpProvider = createProvider(libListProvider);
						var tmpSorted = tmpProvider.getSortedFileList();
						// First two should be folders
						Expect(tmpSorted[0].Type).to.equal('folder');
						Expect(tmpSorted[1].Type).to.equal('folder');
						// Rest are files
						Expect(tmpSorted[2].Type).to.equal('file');
						fDone();
					}
				);
				test
				(
					'Should sort by name alphabetically.',
					(fDone) =>
					{
						var tmpProvider = createProvider(libListProvider);
						var tmpSorted = tmpProvider.getSortedFileList();
						// Folders: Documents, Images (alphabetical)
						Expect(tmpSorted[0].Name).to.equal('Documents');
						Expect(tmpSorted[1].Name).to.equal('Images');
						// Files: app.js, archive.zip, data.csv, photo.jpg, readme.md
						Expect(tmpSorted[2].Name).to.equal('app.js');
						fDone();
					}
				);
				test
				(
					'Should toggle sort direction when sorting by same field.',
					(fDone) =>
					{
						var tmpProvider = createProvider(libListProvider);
						Expect(tmpProvider.sortAscending).to.be.true;
						tmpProvider.setSortField('Name');
						Expect(tmpProvider.sortAscending).to.be.false;
						tmpProvider.setSortField('Name');
						Expect(tmpProvider.sortAscending).to.be.true;
						fDone();
					}
				);
				test
				(
					'Should switch to ascending when sorting by a different field.',
					(fDone) =>
					{
						var tmpProvider = createProvider(libListProvider);
						tmpProvider.sortAscending = false;
						tmpProvider.setSortField('Size');
						Expect(tmpProvider.sortField).to.equal('Size');
						Expect(tmpProvider.sortAscending).to.be.true;
						fDone();
					}
				);
				test
				(
					'Should format file sizes correctly.',
					(fDone) =>
					{
						var tmpProvider = createProvider(libListProvider);
						Expect(tmpProvider.formatFileSize(500)).to.equal('500 B');
						Expect(tmpProvider.formatFileSize(2048)).to.equal('2.0 KB');
						Expect(tmpProvider.formatFileSize(1536000)).to.equal('1.5 MB');
						Expect(tmpProvider.formatFileSize(1073741824)).to.equal('1.0 GB');
						Expect(tmpProvider.formatFileSize(null)).to.equal('--');
						fDone();
					}
				);
				test
				(
					'Should format dates correctly.',
					(fDone) =>
					{
						var tmpProvider = createProvider(libListProvider);
						var tmpFormatted = tmpProvider.formatDate('2025-01-15T10:30:00Z');
						Expect(tmpFormatted).to.not.equal('--');
						Expect(tmpFormatted).to.be.a('string');
						Expect(tmpProvider.formatDate(null)).to.equal('--');
						Expect(tmpProvider.formatDate('invalid')).to.equal('--');
						fDone();
					}
				);
				test
				(
					'Should return appropriate icons for different file types.',
					(fDone) =>
					{
						var tmpProvider = createProvider(libListProvider);
						// Folder icon
						var tmpFolderIcon = tmpProvider.getEntryIcon({ Type: 'folder', Name: 'Test' });
						Expect(tmpFolderIcon).to.be.a('string');
						Expect(tmpFolderIcon.length).to.be.greaterThan(0);
						// Image file icon
						var tmpImgIcon = tmpProvider.getEntryIcon({ Type: 'file', Extension: '.jpg' });
						Expect(tmpImgIcon).to.be.a('string');
						// Code file icon
						var tmpCodeIcon = tmpProvider.getEntryIcon({ Type: 'file', Extension: '.js' });
						Expect(tmpCodeIcon).to.be.a('string');
						// Custom icon
						var tmpCustomIcon = tmpProvider.getEntryIcon({ Type: 'file', Icon: 'X' });
						Expect(tmpCustomIcon).to.equal('X');
						// Null entry
						Expect(tmpProvider.getEntryIcon(null)).to.equal('');
						fDone();
					}
				);
				test
				(
					'Should select and retrieve a file.',
					(fDone) =>
					{
						var tmpProvider = createProvider(libListProvider);
						Expect(tmpProvider.getSelectedFile()).to.be.null;
						var tmpFile = { Name: 'test.txt', Type: 'file' };
						tmpProvider.selectFile(tmpFile);
						var tmpSelected = tmpProvider.getSelectedFile();
						Expect(tmpSelected).to.be.an('object');
						Expect(tmpSelected.Name).to.equal('test.txt');
						fDone();
					}
				);
				test
				(
					'Should handle empty file list.',
					(fDone) =>
					{
						var tmpPict = createTestPict();
						tmpPict.AppData.PictFileBrowser.FileList = [];
						var tmpProvider = tmpPict.addProvider('Pict-FileBrowser-List', libListProvider.default_configuration, libListProvider);
						var tmpSorted = tmpProvider.getSortedFileList();
						Expect(tmpSorted).to.have.length(0);
						fDone();
					}
				);
			}
		);

		suite
		(
			'View Provider',
			function()
			{
				test
				(
					'Should return null when no file is selected.',
					(fDone) =>
					{
						var tmpProvider = createProvider(libViewProvider);
						Expect(tmpProvider.getCurrentFile()).to.be.null;
						fDone();
					}
				);
				test
				(
					'Should detect image files by MimeType.',
					(fDone) =>
					{
						var tmpProvider = createProvider(libViewProvider);
						Expect(tmpProvider.isImage({ MimeType: 'image/jpeg' })).to.be.true;
						Expect(tmpProvider.isImage({ MimeType: 'image/png' })).to.be.true;
						Expect(tmpProvider.isImage({ MimeType: 'text/plain' })).to.be.false;
						fDone();
					}
				);
				test
				(
					'Should detect image files by extension.',
					(fDone) =>
					{
						var tmpProvider = createProvider(libViewProvider);
						Expect(tmpProvider.isImage({ Extension: '.jpg' })).to.be.true;
						Expect(tmpProvider.isImage({ Extension: '.PNG' })).to.be.true;
						Expect(tmpProvider.isImage({ Extension: '.gif' })).to.be.true;
						Expect(tmpProvider.isImage({ Extension: '.txt' })).to.be.false;
						Expect(tmpProvider.isImage(null)).to.be.false;
						fDone();
					}
				);
				test
				(
					'Should return image URL from entry.',
					(fDone) =>
					{
						var tmpProvider = createProvider(libViewProvider);
						Expect(tmpProvider.getImageURL({ URL: 'https://example.com/img.jpg' })).to.equal('https://example.com/img.jpg');
						Expect(tmpProvider.getImageURL({ ThumbnailURL: 'https://example.com/thumb.jpg' })).to.equal('https://example.com/thumb.jpg');
						Expect(tmpProvider.getImageURL({ Name: 'test.jpg' })).to.be.null;
						Expect(tmpProvider.getImageURL(null)).to.be.null;
						fDone();
					}
				);
				test
				(
					'Should return file type descriptions.',
					(fDone) =>
					{
						var tmpProvider = createProvider(libViewProvider);
						Expect(tmpProvider.getFileTypeDescription({ Type: 'folder' })).to.equal('Folder');
						Expect(tmpProvider.getFileTypeDescription({ Extension: '.js' })).to.equal('JavaScript File');
						Expect(tmpProvider.getFileTypeDescription({ Extension: '.pdf' })).to.equal('PDF Document');
						Expect(tmpProvider.getFileTypeDescription({ Extension: '.mp3' })).to.equal('MP3 Audio');
						Expect(tmpProvider.getFileTypeDescription({ Extension: '.xyz' })).to.equal('XYZ File');
						Expect(tmpProvider.getFileTypeDescription({ Extension: '' })).to.equal('File');
						Expect(tmpProvider.getFileTypeDescription(null)).to.equal('Unknown');
						fDone();
					}
				);
			}
		);

		suite
		(
			'Layout Provider',
			function()
			{
				test
				(
					'Should have default_configuration and BuiltInLayouts exported.',
					(fDone) =>
					{
						Expect(libLayoutProvider.default_configuration).to.be.an('object');
						Expect(libLayoutProvider.default_configuration.ProviderIdentifier).to.equal('Pict-FileBrowser-Layout');
						Expect(libLayoutProvider.BuiltInLayouts).to.be.an('object');
						fDone();
					}
				);
				test
				(
					'Should instantiate with the built-in layouts registered.',
					(fDone) =>
					{
						var tmpProvider = createProvider(libLayoutProvider);
						var tmpLayouts = tmpProvider.getLayouts();
						Expect(tmpLayouts).to.be.an('object');
						Expect(Object.keys(tmpLayouts).length).to.be.greaterThan(0);
						// The six built-in layout keys
						Expect(tmpLayouts).to.have.property('list-only');
						Expect(tmpLayouts).to.have.property('tree-list');
						Expect(tmpLayouts).to.have.property('list-detail');
						Expect(tmpLayouts).to.have.property('tree-detail');
						Expect(tmpLayouts).to.have.property('browser-detail');
						Expect(tmpLayouts).to.have.property('browser-columns');
						fDone();
					}
				);
				test
				(
					'getLayoutList should return an array sorted by PaneCount then Key.',
					(fDone) =>
					{
						var tmpProvider = createProvider(libLayoutProvider);
						var tmpList = tmpProvider.getLayoutList();
						Expect(tmpList).to.be.an('array');
						Expect(tmpList.length).to.equal(6);

						// First entry should have PaneCount === 1
						Expect(tmpList[0].PaneCount).to.equal(1);
						Expect(tmpList[0].Key).to.equal('list-only');

						// All 2-pane entries come before all 3-pane entries
						for (var i = 1; i < tmpList.length; i++)
						{
							Expect(tmpList[i].PaneCount).to.be.greaterThanOrEqual(tmpList[i - 1].PaneCount);
						}

						// Verify each entry has required fields
						for (var j = 0; j < tmpList.length; j++)
						{
							Expect(tmpList[j].Key).to.be.a('string');
							Expect(tmpList[j].Label).to.be.a('string');
							Expect(tmpList[j].Description).to.be.a('string');
							Expect(tmpList[j].Panes).to.be.an('array');
							Expect(tmpList[j].PaneCount).to.be.a('number');
							Expect(tmpList[j].CSSClass).to.be.a('string');
						}

						fDone();
					}
				);
				test
				(
					'getLayout should return a single layout by key.',
					(fDone) =>
					{
						var tmpProvider = createProvider(libLayoutProvider);

						var tmpLayout = tmpProvider.getLayout('browser-detail');
						Expect(tmpLayout).to.be.an('object');
						Expect(tmpLayout.Key).to.equal('browser-detail');
						Expect(tmpLayout.Panes).to.include('browse');
						Expect(tmpLayout.Panes).to.include('list');
						Expect(tmpLayout.Panes).to.include('view');
						Expect(tmpLayout.PaneCount).to.equal(3);

						// Non-existent key returns null
						Expect(tmpProvider.getLayout('does-not-exist')).to.be.null;

						fDone();
					}
				);
				test
				(
					'getCurrentLayoutKey should read from AppData.',
					(fDone) =>
					{
						var tmpPict = createTestPict();
						// AppData is pre-populated with Layout = browser-detail
						var tmpProvider = tmpPict.addProvider(libLayoutProvider.default_configuration.ProviderIdentifier, libLayoutProvider.default_configuration, libLayoutProvider);

						var tmpKey = tmpProvider.getCurrentLayoutKey();
						Expect(tmpKey).to.equal('browser-detail');

						fDone();
					}
				);
				test
				(
					'getCurrentLayoutKey should fall back to browser-detail when unset.',
					(fDone) =>
					{
						var tmpPict = new libPict();
						var tmpEnvironment = new libPict.EnvironmentLog(tmpPict);
						// No Layout set in AppData
						tmpPict.AppData.PictFileBrowser = {};
						var tmpProvider = tmpPict.addProvider(libLayoutProvider.default_configuration.ProviderIdentifier, libLayoutProvider.default_configuration, libLayoutProvider);

						var tmpKey = tmpProvider.getCurrentLayoutKey();
						Expect(tmpKey).to.equal('browser-detail');

						fDone();
					}
				);
				test
				(
					'setLayout should update the current layout key and return true.',
					(fDone) =>
					{
						var tmpPict = createTestPict();
						var tmpProvider = tmpPict.addProvider(libLayoutProvider.default_configuration.ProviderIdentifier, libLayoutProvider.default_configuration, libLayoutProvider);
						// Also add the main view so getFileBrowserOption can find StateAddresses
						tmpPict.addView('Pict-FileBrowser', libPictSectionFileBrowser.default_configuration, libPictSectionFileBrowser);

						var tmpResult = tmpProvider.setLayout('list-only');
						Expect(tmpResult).to.be.true;
						Expect(tmpProvider.getCurrentLayoutKey()).to.equal('list-only');

						// Non-existent key returns false and doesn't change the layout
						var tmpBadResult = tmpProvider.setLayout('nonexistent-layout');
						Expect(tmpBadResult).to.be.false;
						Expect(tmpProvider.getCurrentLayoutKey()).to.equal('list-only');

						fDone();
					}
				);
				test
				(
					'getCurrentLayout should return the full layout object.',
					(fDone) =>
					{
						var tmpPict = createTestPict();
						var tmpProvider = tmpPict.addProvider(libLayoutProvider.default_configuration.ProviderIdentifier, libLayoutProvider.default_configuration, libLayoutProvider);
						tmpPict.addView('Pict-FileBrowser', libPictSectionFileBrowser.default_configuration, libPictSectionFileBrowser);

						// Default is browser-detail
						var tmpLayout = tmpProvider.getCurrentLayout();
						Expect(tmpLayout).to.be.an('object');
						Expect(tmpLayout.Key).to.equal('browser-detail');

						// After switching
						tmpProvider.setLayout('tree-list');
						var tmpNewLayout = tmpProvider.getCurrentLayout();
						Expect(tmpNewLayout.Key).to.equal('tree-list');
						Expect(tmpNewLayout.Panes).to.include('browse');
						Expect(tmpNewLayout.Panes).to.include('list');

						fDone();
					}
				);
				test
				(
					'isPaneVisible should return true for panes in the current layout.',
					(fDone) =>
					{
						var tmpPict = createTestPict();
						var tmpProvider = tmpPict.addProvider(libLayoutProvider.default_configuration.ProviderIdentifier, libLayoutProvider.default_configuration, libLayoutProvider);
						tmpPict.addView('Pict-FileBrowser', libPictSectionFileBrowser.default_configuration, libPictSectionFileBrowser);

						// browser-detail has all three panes
						Expect(tmpProvider.isPaneVisible('browse')).to.be.true;
						Expect(tmpProvider.isPaneVisible('list')).to.be.true;
						Expect(tmpProvider.isPaneVisible('view')).to.be.true;

						// Switch to list-only
						tmpProvider.setLayout('list-only');
						Expect(tmpProvider.isPaneVisible('list')).to.be.true;
						Expect(tmpProvider.isPaneVisible('browse')).to.be.false;
						Expect(tmpProvider.isPaneVisible('view')).to.be.false;

						// Switch to tree-list
						tmpProvider.setLayout('tree-list');
						Expect(tmpProvider.isPaneVisible('browse')).to.be.true;
						Expect(tmpProvider.isPaneVisible('list')).to.be.true;
						Expect(tmpProvider.isPaneVisible('view')).to.be.false;

						fDone();
					}
				);
				test
				(
					'registerLayout should add a custom layout.',
					(fDone) =>
					{
						var tmpProvider = createProvider(libLayoutProvider);

						var tmpCustomLayout =
						{
							Key: 'custom-two-pane',
							Label: 'Custom',
							Description: 'A custom two-pane layout',
							Panes: ['list', 'view'],
							PaneCount: 2,
							CSSClass: 'pict-fb-layout-custom-two-pane'
						};

						var tmpResult = tmpProvider.registerLayout(tmpCustomLayout);
						Expect(tmpResult).to.be.true;

						var tmpFetched = tmpProvider.getLayout('custom-two-pane');
						Expect(tmpFetched).to.be.an('object');
						Expect(tmpFetched.Label).to.equal('Custom');

						// Invalid registration returns false
						Expect(tmpProvider.registerLayout(null)).to.be.false;
						Expect(tmpProvider.registerLayout({})).to.be.false;

						fDone();
					}
				);
				test
				(
					'All built-in layouts should have valid Panes arrays.',
					(fDone) =>
					{
						var tmpProvider = createProvider(libLayoutProvider);
						var tmpValidRoles = ['browse', 'list', 'view'];

						var tmpList = tmpProvider.getLayoutList();
						for (var i = 0; i < tmpList.length; i++)
						{
							var tmpLayout = tmpList[i];
							Expect(tmpLayout.Panes.length).to.equal(tmpLayout.PaneCount,
								'PaneCount should match Panes array length for ' + tmpLayout.Key);
							for (var j = 0; j < tmpLayout.Panes.length; j++)
							{
								Expect(tmpValidRoles).to.include(tmpLayout.Panes[j],
									'Pane role should be valid for ' + tmpLayout.Key);
							}
						}

						fDone();
					}
				);
				test
				(
					'Should have layouts covering 1, 2 and 3 viewports.',
					(fDone) =>
					{
						var tmpProvider = createProvider(libLayoutProvider);
						var tmpList = tmpProvider.getLayoutList();

						var tmpPaneCounts = tmpList.map((pLayout) => { return pLayout.PaneCount; });
						Expect(tmpPaneCounts).to.include(1, 'Should have a 1-pane layout');
						Expect(tmpPaneCounts).to.include(2, 'Should have a 2-pane layout');
						Expect(tmpPaneCounts).to.include(3, 'Should have a 3-pane layout');

						fDone();
					}
				);
			}
		);

		suite
		(
			'Icon Provider',
			function()
			{
				test
				(
					'Should have default_configuration and exported statics.',
					(fDone) =>
					{
						Expect(libIconProvider.default_configuration).to.be.an('object');
						Expect(libIconProvider.default_configuration.ProviderIdentifier).to.equal('Pict-FileBrowser-Icons');
						Expect(libIconProvider.BuiltInIcons).to.be.an('object');
						Expect(libIconProvider.ExtensionMap).to.be.an('object');
						Expect(libIconProvider.Colors).to.be.an('object');
						fDone();
					}
				);
				test
				(
					'Should instantiate with all built-in icons registered.',
					(fDone) =>
					{
						var tmpProvider = createProvider(libIconProvider);
						var tmpNames = tmpProvider.getIconNames();
						Expect(tmpNames).to.be.an('array');
						Expect(tmpNames.length).to.be.greaterThan(15);
						Expect(tmpNames).to.include('folder');
						Expect(tmpNames).to.include('file');
						Expect(tmpNames).to.include('file-code');
						Expect(tmpNames).to.include('file-image');
						Expect(tmpNames).to.include('file-archive');
						Expect(tmpNames).to.include('home');
						Expect(tmpNames).to.include('chevron-right');
						Expect(tmpNames).to.include('chevron-down');
						Expect(tmpNames).to.include('search');
						fDone();
					}
				);
				test
				(
					'getIcon should return SVG strings for known icons.',
					(fDone) =>
					{
						var tmpProvider = createProvider(libIconProvider);

						var tmpFolder = tmpProvider.getIcon('folder', 16);
						Expect(tmpFolder).to.be.a('string');
						Expect(tmpFolder).to.contain('<svg');
						Expect(tmpFolder).to.contain('width="16"');

						var tmpCode = tmpProvider.getIcon('file-code', 24);
						Expect(tmpCode).to.contain('<svg');
						Expect(tmpCode).to.contain('width="24"');

						// Non-existent icon returns empty string
						Expect(tmpProvider.getIcon('nonexistent', 16)).to.equal('');

						// Default size
						var tmpHome = tmpProvider.getIcon('home');
						Expect(tmpHome).to.contain('width="16"');

						fDone();
					}
				);
				test
				(
					'getIconForEntry should return correct icons based on type and extension.',
					(fDone) =>
					{
						var tmpProvider = createProvider(libIconProvider);

						// Folder
						var tmpFolderIcon = tmpProvider.getIconForEntry({ Type: 'folder', Name: 'Docs' });
						Expect(tmpFolderIcon).to.contain('<svg');

						// Code file
						var tmpCodeIcon = tmpProvider.getIconForEntry({ Type: 'file', Extension: '.js' });
						Expect(tmpCodeIcon).to.contain('<svg');

						// Image file
						var tmpImgIcon = tmpProvider.getIconForEntry({ Type: 'file', Extension: '.jpg' });
						Expect(tmpImgIcon).to.contain('<svg');

						// Archive file
						var tmpArchiveIcon = tmpProvider.getIconForEntry({ Type: 'file', Extension: '.zip' });
						Expect(tmpArchiveIcon).to.contain('<svg');

						// Unknown extension falls back to generic file
						var tmpUnknown = tmpProvider.getIconForEntry({ Type: 'file', Extension: '.xyz' });
						Expect(tmpUnknown).to.contain('<svg');

						// Null entry returns empty string
						Expect(tmpProvider.getIconForEntry(null)).to.equal('');

						// Entry with explicit SVG Icon property
						var tmpCustomEntry = { Type: 'file', Icon: '<svg>custom</svg>' };
						Expect(tmpProvider.getIconForEntry(tmpCustomEntry)).to.equal('<svg>custom</svg>');

						fDone();
					}
				);
				test
				(
					'getUIIcon should be an alias for getIcon.',
					(fDone) =>
					{
						var tmpProvider = createProvider(libIconProvider);
						var tmpChevron = tmpProvider.getUIIcon('chevron-right', 10);
						Expect(tmpChevron).to.contain('<svg');
						Expect(tmpChevron).to.contain('width="10"');

						// Default size
						var tmpSearch = tmpProvider.getUIIcon('search');
						Expect(tmpSearch).to.contain('width="16"');

						fDone();
					}
				);
				test
				(
					'registerIcon should add a custom icon.',
					(fDone) =>
					{
						var tmpProvider = createProvider(libIconProvider);

						// Register a custom icon
						var tmpResult = tmpProvider.registerIcon('custom-star', (pSize) =>
						{
							return '<svg width="' + pSize + '" height="' + pSize + '"><star /></svg>';
						});
						Expect(tmpResult).to.be.true;

						// Retrieve it
						var tmpIcon = tmpProvider.getIcon('custom-star', 20);
						Expect(tmpIcon).to.contain('<star />');
						Expect(tmpIcon).to.contain('width="20"');

						// Invalid registration
						Expect(tmpProvider.registerIcon(null, function() {})).to.be.false;
						Expect(tmpProvider.registerIcon('foo', null)).to.be.false;
						Expect(tmpProvider.registerIcon('foo', 'not-a-function')).to.be.false;

						fDone();
					}
				);
				test
				(
					'registerExtension should add a custom extension mapping.',
					(fDone) =>
					{
						var tmpProvider = createProvider(libIconProvider);

						// Register a new extension
						var tmpResult = tmpProvider.registerExtension('.vue', 'file-code');
						Expect(tmpResult).to.be.true;

						// Now .vue files should use file-code icon
						var tmpIcon = tmpProvider.getIconForEntry({ Type: 'file', Extension: '.vue' });
						Expect(tmpIcon).to.contain('<svg');

						// Invalid registration
						Expect(tmpProvider.registerExtension(null, 'file-code')).to.be.false;
						Expect(tmpProvider.registerExtension('.xyz', null)).to.be.false;

						fDone();
					}
				);
				test
				(
					'getExtensionMap should return a copy of the extension map.',
					(fDone) =>
					{
						var tmpProvider = createProvider(libIconProvider);
						var tmpMap = tmpProvider.getExtensionMap();
						Expect(tmpMap).to.be.an('object');
						Expect(tmpMap['.js']).to.equal('file-code');
						Expect(tmpMap['.jpg']).to.equal('file-image');
						Expect(tmpMap['.zip']).to.equal('file-archive');
						Expect(tmpMap['.pdf']).to.equal('file-pdf');
						Expect(tmpMap['.mp3']).to.equal('file-audio');
						Expect(tmpMap['.mp4']).to.equal('file-video');
						Expect(tmpMap['.html']).to.equal('file-web');
						Expect(tmpMap['.json']).to.equal('file-config');

						// Modifying the copy should not affect the provider
						tmpMap['.test'] = 'file-test';
						var tmpMap2 = tmpProvider.getExtensionMap();
						Expect(tmpMap2['.test']).to.be.undefined;

						fDone();
					}
				);
				test
				(
					'All built-in icons should produce valid SVG at different sizes.',
					(fDone) =>
					{
						var tmpProvider = createProvider(libIconProvider);
						var tmpNames = tmpProvider.getIconNames();
						var tmpSizes = [10, 16, 24, 36];

						for (var i = 0; i < tmpNames.length; i++)
						{
							for (var j = 0; j < tmpSizes.length; j++)
							{
								var tmpSVG = tmpProvider.getIcon(tmpNames[i], tmpSizes[j]);
								Expect(tmpSVG).to.be.a('string',
									tmpNames[i] + ' at ' + tmpSizes[j] + 'px should be a string');
								Expect(tmpSVG).to.contain('<svg',
									tmpNames[i] + ' at ' + tmpSizes[j] + 'px should contain SVG');
								Expect(tmpSVG).to.contain('width="' + tmpSizes[j] + '"',
									tmpNames[i] + ' at ' + tmpSizes[j] + 'px should have correct width');
							}
						}

						fDone();
					}
				);
				test
				(
					'List provider getEntryIcon should return SVG when icon provider is registered.',
					(fDone) =>
					{
						var tmpPict = createTestPict();
						var tmpView = tmpPict.addView('Pict-FileBrowser', libPictSectionFileBrowser.default_configuration, libPictSectionFileBrowser);

						var tmpListProvider = tmpPict.providers['Pict-FileBrowser-List'];
						Expect(tmpListProvider).to.be.an('object');

						// The icon provider should now be registered
						Expect(tmpPict.providers['Pict-FileBrowser-Icons']).to.be.an('object');

						// getEntryIcon should return SVG
						var tmpFolderIcon = tmpListProvider.getEntryIcon({ Type: 'folder', Name: 'Test' });
						Expect(tmpFolderIcon).to.contain('<svg');

						var tmpCodeIcon = tmpListProvider.getEntryIcon({ Type: 'file', Extension: '.js' });
						Expect(tmpCodeIcon).to.contain('<svg');

						// Custom icon still works
						var tmpCustomIcon = tmpListProvider.getEntryIcon({ Type: 'file', Icon: 'X' });
						Expect(tmpCustomIcon).to.equal('X');

						fDone();
					}
				);
			}
		);

		suite
		(
			'Default Configuration',
			function()
			{
				test
				(
					'Should have required configuration properties.',
					(fDone) =>
					{
						var tmpConfig = libPictSectionFileBrowser.default_configuration;
						Expect(tmpConfig.ViewIdentifier).to.equal('Pict-FileBrowser');
						Expect(tmpConfig.DefaultRenderable).to.be.a('string');
						Expect(tmpConfig.DefaultDestinationAddress).to.be.a('string');
						Expect(tmpConfig.StateAddresses).to.be.an('object');
						Expect(tmpConfig.StateAddresses.Layout).to.be.a('string');
						Expect(tmpConfig.StateAddresses.RootLocation).to.be.a('string');
						Expect(tmpConfig.StateAddresses.CurrentLocation).to.be.a('string');
						Expect(tmpConfig.StateAddresses.CurrentFile).to.be.a('string');
						Expect(tmpConfig.DefaultState).to.be.an('object');
						Expect(tmpConfig.FileListAddress).to.be.a('string');
						Expect(tmpConfig.FolderTreeAddress).to.be.a('string');
						Expect(tmpConfig.ChildFolderCacheAddress).to.be.a('string');
						Expect(tmpConfig.Templates).to.be.an('array');
						Expect(tmpConfig.Renderables).to.be.an('array');
						Expect(tmpConfig.CSS).to.be.a('string');
						fDone();
					}
				);
			}
		);

		suite
		(
			'Main View Initialization',
			function()
			{
				test
				(
					'Should instantiate and register providers on init.',
					(fDone) =>
					{
						var tmpPict = createTestPict();
						var tmpView = tmpPict.addView('Pict-FileBrowser', libPictSectionFileBrowser.default_configuration, libPictSectionFileBrowser);

						Expect(tmpView).to.be.an('object');
						Expect(tmpPict.providers['Pict-FileBrowser-Browse']).to.be.an('object');
						Expect(tmpPict.providers['Pict-FileBrowser-List']).to.be.an('object');
						Expect(tmpPict.providers['Pict-FileBrowser-View']).to.be.an('object');
						Expect(tmpPict.providers['Pict-FileBrowser-Layout']).to.be.an('object');
						Expect(tmpPict.providers['Pict-FileBrowser-Icons']).to.be.an('object');
						fDone();
					}
				);
				test
				(
					'Should ensure default state values in AppData.',
					(fDone) =>
					{
						var tmpPict = new libPict();
						var tmpEnvironment = new libPict.EnvironmentLog(tmpPict);
						// Start with empty AppData
						tmpPict.AppData.PictFileBrowser = {};

						var tmpView = tmpPict.addView('Pict-FileBrowser', libPictSectionFileBrowser.default_configuration, libPictSectionFileBrowser);

						Expect(tmpPict.AppData.PictFileBrowser.Layout).to.equal('browser-detail');
						Expect(tmpPict.AppData.PictFileBrowser.RootLocation).to.equal('/');
						Expect(tmpPict.AppData.PictFileBrowser.CurrentLocation).to.equal('');
						Expect(tmpPict.AppData.PictFileBrowser.CurrentFile).to.be.null;
						Expect(tmpPict.AppData.PictFileBrowser.FileList).to.be.an('array');
						Expect(tmpPict.AppData.PictFileBrowser.FolderTree).to.be.an('array');
						fDone();
					}
				);
				test
				(
					'Should get and set state values.',
					(fDone) =>
					{
						var tmpPict = createTestPict();
						var tmpView = tmpPict.addView('Pict-FileBrowser', libPictSectionFileBrowser.default_configuration, libPictSectionFileBrowser);

						tmpView.setState('CurrentLocation', 'Documents/Work');
						Expect(tmpView.getState('CurrentLocation')).to.equal('Documents/Work');

						tmpView.setState('Layout', 'browser-icons');
						Expect(tmpView.getState('Layout')).to.equal('browser-icons');

						fDone();
					}
				);
				test
				(
					'Should not overwrite existing state values.',
					(fDone) =>
					{
						var tmpPict = createTestPict();
						tmpPict.AppData.PictFileBrowser.Layout = 'custom-layout';

						var tmpView = tmpPict.addView('Pict-FileBrowser', libPictSectionFileBrowser.default_configuration, libPictSectionFileBrowser);

						Expect(tmpPict.AppData.PictFileBrowser.Layout).to.equal('custom-layout');
						fDone();
					}
				);
			}
		);

		suite
		(
			'Cross-Provider Integration',
			function()
			{
				test
				(
					'Browse provider should access the same file list as List provider.',
					(fDone) =>
					{
						var tmpPict = createTestPict();
						var tmpBrowse = tmpPict.addProvider('Pict-FileBrowser-Browse', libBrowseProvider.default_configuration, libBrowseProvider);
						var tmpList = tmpPict.addProvider('Pict-FileBrowser-List', libListProvider.default_configuration, libListProvider);

						var tmpBrowseFiles = tmpBrowse.getFileList();
						var tmpListFiles = tmpList.getFileList();

						Expect(tmpBrowseFiles.length).to.equal(tmpListFiles.length);
						Expect(tmpBrowseFiles[0].Name).to.equal(tmpListFiles[0].Name);
						fDone();
					}
				);
				test
				(
					'List provider selectFile should be readable by View provider.',
					(fDone) =>
					{
						var tmpPict = createTestPict();
						var tmpList = tmpPict.addProvider('Pict-FileBrowser-List', libListProvider.default_configuration, libListProvider);
						var tmpView = tmpPict.addProvider('Pict-FileBrowser-View', libViewProvider.default_configuration, libViewProvider);

						var tmpFile = { Name: 'photo.jpg', Type: 'file', Extension: '.jpg', MimeType: 'image/jpeg' };
						tmpList.selectFile(tmpFile);

						var tmpCurrentFile = tmpView.getCurrentFile();
						Expect(tmpCurrentFile).to.be.an('object');
						Expect(tmpCurrentFile.Name).to.equal('photo.jpg');
						Expect(tmpView.isImage(tmpCurrentFile)).to.be.true;
						fDone();
					}
				);
			}
		);

		suite
		(
			'FileBrowser Service',
			function()
			{
				test
				(
					'The service should export correctly.',
					(fDone) =>
					{
						Expect(libFileBrowserService).to.be.a('function');
						Expect(libFileBrowserService.default_configuration).to.be.an('object');
						Expect(libFileBrowserService.default_configuration.BasePath).to.be.a('string');
						Expect(libFileBrowserService.default_configuration.APIRoutePrefix).to.be.a('string');
						fDone();
					}
				);
				test
				(
					'The service should instantiate with a fable instance.',
					(fDone) =>
					{
						var tmpFable = require('fable');
						var tmpFableInstance = new tmpFable({});
						var tmpService = new libFileBrowserService(tmpFableInstance, { BasePath: __dirname });
						Expect(tmpService).to.be.an('object');
						Expect(tmpService.serviceType).to.equal('PictFileBrowserService');
						Expect(tmpService.basePath).to.equal(__dirname);
						fDone();
					}
				);
				test
				(
					'resolveSafePath should resolve paths within the base.',
					(fDone) =>
					{
						var tmpFable = require('fable');
						var tmpFableInstance = new tmpFable({});
						var tmpService = new libFileBrowserService(tmpFableInstance, { BasePath: __dirname });

						var tmpResolved = tmpService.resolveSafePath('');
						Expect(tmpResolved).to.equal(__dirname);

						// Should block path traversal attempts
						var tmpTraversal = tmpService.resolveSafePath('../../etc/passwd');
						Expect(tmpTraversal).to.be.null;

						// A valid relative path should resolve within the base
						var tmpValid = tmpService.resolveSafePath('subdir');
						Expect(tmpValid).to.not.be.null;
						Expect(tmpValid.indexOf(__dirname)).to.equal(0);
						fDone();
					}
				);
				test
				(
					'listDirectory should list files in the test directory.',
					(fDone) =>
					{
						var tmpFable = require('fable');
						var tmpFableInstance = new tmpFable({});
						// Browse the source directory (which has known contents)
						var tmpSourceDir = libPath.join(__dirname, '..', 'source');
						var tmpService = new libFileBrowserService(tmpFableInstance, { BasePath: tmpSourceDir });

						tmpService.listDirectory('',
							(pError, pFileList) =>
							{
								Expect(pError).to.be.null;
								Expect(pFileList).to.be.an('array');
								Expect(pFileList.length).to.be.greaterThan(0);

								// Should contain the known entry point file
								var tmpEntryFile = pFileList.find((pItem) => { return pItem.Name === 'Pict-Section-FileBrowser.js'; });
								Expect(tmpEntryFile).to.be.an('object');
								Expect(tmpEntryFile.Type).to.equal('file');
								Expect(tmpEntryFile.Extension).to.equal('.js');
								Expect(tmpEntryFile.Size).to.be.a('number');

								// Should contain the providers folder
								var tmpProvidersDir = pFileList.find((pItem) => { return pItem.Name === 'providers'; });
								Expect(tmpProvidersDir).to.be.an('object');
								Expect(tmpProvidersDir.Type).to.equal('folder');

								fDone();
							});
					}
				);
				test
				(
					'listDirectory should list a subdirectory.',
					(fDone) =>
					{
						var tmpFable = require('fable');
						var tmpFableInstance = new tmpFable({});
						var tmpSourceDir = libPath.join(__dirname, '..', 'source');
						var tmpService = new libFileBrowserService(tmpFableInstance, { BasePath: tmpSourceDir });

						tmpService.listDirectory('providers',
							(pError, pFileList) =>
							{
								Expect(pError).to.be.null;
								Expect(pFileList).to.be.an('array');
								Expect(pFileList.length).to.equal(5);

								var tmpNames = pFileList.map((pItem) => { return pItem.Name; }).sort();
								Expect(tmpNames).to.include('Pict-Provider-FileBrowserBrowse.js');
								Expect(tmpNames).to.include('Pict-Provider-FileBrowserList.js');
								Expect(tmpNames).to.include('Pict-Provider-FileBrowserView.js');
								Expect(tmpNames).to.include('Pict-Provider-FileBrowserLayout.js');
								Expect(tmpNames).to.include('Pict-Provider-FileBrowserIcons.js');

								fDone();
							});
					}
				);
				test
				(
					'listDirectory should return error for non-existent path.',
					(fDone) =>
					{
						var tmpFable = require('fable');
						var tmpFableInstance = new tmpFable({});
						var tmpService = new libFileBrowserService(tmpFableInstance, { BasePath: __dirname });

						tmpService.listDirectory('nonexistent_dir_xyz',
							(pError, pFileList) =>
							{
								Expect(pError).to.be.an('error');
								Expect(pError.message).to.equal('Path not found');
								fDone();
							});
					}
				);
				test
				(
					'listDirectory should skip hidden files by default.',
					(fDone) =>
					{
						var tmpFable = require('fable');
						var tmpFableInstance = new tmpFable({});
						// Use the module root which has dotfiles (.gulpfile-quackage.js, etc.)
						var tmpModuleDir = libPath.join(__dirname, '..');
						var tmpService = new libFileBrowserService(tmpFableInstance, { BasePath: tmpModuleDir });

						tmpService.listDirectory('',
							(pError, pFileList) =>
							{
								Expect(pError).to.be.null;
								// Should not contain any dotfiles
								var tmpHiddenFiles = pFileList.filter((pItem) => { return pItem.Name.charAt(0) === '.'; });
								Expect(tmpHiddenFiles.length).to.equal(0);
								fDone();
							});
					}
				);
				test
				(
					'listDirectory should include hidden files when configured.',
					(fDone) =>
					{
						var tmpFable = require('fable');
						var tmpFableInstance = new tmpFable({});
						var tmpModuleDir = libPath.join(__dirname, '..');
						var tmpService = new libFileBrowserService(tmpFableInstance, { BasePath: tmpModuleDir, IncludeHiddenFiles: true });

						tmpService.listDirectory('',
							(pError, pFileList) =>
							{
								Expect(pError).to.be.null;
								var tmpHiddenFiles = pFileList.filter((pItem) => { return pItem.Name.charAt(0) === '.'; });
								Expect(tmpHiddenFiles.length).to.be.greaterThan(0);
								fDone();
							});
					}
				);
				test
				(
					'buildFolderTree should return a recursive tree.',
					(fDone) =>
					{
						var tmpFable = require('fable');
						var tmpFableInstance = new tmpFable({});
						var tmpSourceDir = libPath.join(__dirname, '..', 'source');
						var tmpService = new libFileBrowserService(tmpFableInstance, { BasePath: tmpSourceDir });

						tmpService.buildFolderTree('', 5,
							(pError, pTree) =>
							{
								Expect(pError).to.be.null;
								Expect(pTree).to.be.an('array');
								Expect(pTree.length).to.be.greaterThan(0);

								// Should contain providers, views, services, www
								var tmpNames = pTree.map((pItem) => { return pItem.Name; });
								Expect(tmpNames).to.include('providers');
								Expect(tmpNames).to.include('views');

								// Each node should have Children array
								for (var i = 0; i < pTree.length; i++)
								{
									Expect(pTree[i].Children).to.be.an('array');
									Expect(pTree[i].Path).to.be.a('string');
								}

								fDone();
							});
					}
				);
				test
				(
					'getFileInfo should return metadata for a file.',
					(fDone) =>
					{
						var tmpFable = require('fable');
						var tmpFableInstance = new tmpFable({});
						var tmpSourceDir = libPath.join(__dirname, '..', 'source');
						var tmpService = new libFileBrowserService(tmpFableInstance, { BasePath: tmpSourceDir });

						tmpService.getFileInfo('Pict-Section-FileBrowser.js',
							(pError, pInfo) =>
							{
								Expect(pError).to.be.null;
								Expect(pInfo).to.be.an('object');
								Expect(pInfo.Name).to.equal('Pict-Section-FileBrowser.js');
								Expect(pInfo.Type).to.equal('file');
								Expect(pInfo.Extension).to.equal('.js');
								Expect(pInfo.Size).to.be.a('number');
								Expect(pInfo.Modified).to.be.an.instanceOf(Date);
								fDone();
							});
					}
				);
				test
				(
					'getFileInfo should return metadata for a directory.',
					(fDone) =>
					{
						var tmpFable = require('fable');
						var tmpFableInstance = new tmpFable({});
						var tmpSourceDir = libPath.join(__dirname, '..', 'source');
						var tmpService = new libFileBrowserService(tmpFableInstance, { BasePath: tmpSourceDir });

						tmpService.getFileInfo('providers',
							(pError, pInfo) =>
							{
								Expect(pError).to.be.null;
								Expect(pInfo).to.be.an('object');
								Expect(pInfo.Name).to.equal('providers');
								Expect(pInfo.Type).to.equal('folder');
								fDone();
							});
					}
				);
				test
				(
					'getFileInfo should return error for non-existent path.',
					(fDone) =>
					{
						var tmpFable = require('fable');
						var tmpFableInstance = new tmpFable({});
						var tmpService = new libFileBrowserService(tmpFableInstance, { BasePath: __dirname });

						tmpService.getFileInfo('does_not_exist.xyz',
							(pError, pInfo) =>
							{
								Expect(pError).to.be.an('error');
								Expect(pError.message).to.equal('Path not found');
								fDone();
							});
					}
				);
				test
				(
					'listChildFolders should return immediate child folders with HasChildren flag.',
					(fDone) =>
					{
						var tmpFable = require('fable');
						var tmpFableInstance = new tmpFable({});
						var tmpSourceDir = libPath.join(__dirname, '..', 'source');
						var tmpService = new libFileBrowserService(tmpFableInstance, { BasePath: tmpSourceDir });

						tmpService.listChildFolders('',
							(pError, pChildren) =>
							{
								Expect(pError).to.be.null;
								Expect(pChildren).to.be.an('array');
								Expect(pChildren.length).to.be.greaterThan(0);

								// Should contain known folders
								var tmpNames = pChildren.map((pItem) => { return pItem.Name; });
								Expect(tmpNames).to.include('providers');
								Expect(tmpNames).to.include('views');

								// Each entry should have Name, Path, HasChildren
								for (var i = 0; i < pChildren.length; i++)
								{
									Expect(pChildren[i].Name).to.be.a('string');
									Expect(pChildren[i].Path).to.be.a('string');
									Expect(pChildren[i]).to.have.property('HasChildren');
								}

								// Should be sorted alphabetically
								for (var j = 1; j < pChildren.length; j++)
								{
									Expect(pChildren[j].Name.localeCompare(pChildren[j - 1].Name)).to.be.greaterThan(-1);
								}

								fDone();
							});
					}
				);
				test
				(
					'listChildFolders should return only folders, not files.',
					(fDone) =>
					{
						var tmpFable = require('fable');
						var tmpFableInstance = new tmpFable({});
						var tmpSourceDir = libPath.join(__dirname, '..', 'source');
						var tmpService = new libFileBrowserService(tmpFableInstance, { BasePath: tmpSourceDir });

						tmpService.listChildFolders('',
							(pError, pChildren) =>
							{
								Expect(pError).to.be.null;
								// None of the results should be files
								var tmpFileNames = pChildren.map((pItem) => { return pItem.Name; });
								Expect(tmpFileNames).to.not.include('Pict-Section-FileBrowser.js');
								Expect(tmpFileNames).to.not.include('Pict-Section-FileBrowser-DefaultConfiguration.js');
								fDone();
							});
					}
				);
				test
				(
					'listChildFolders should skip hidden folders by default.',
					(fDone) =>
					{
						var tmpFable = require('fable');
						var tmpFableInstance = new tmpFable({});
						var tmpModuleDir = libPath.join(__dirname, '..');
						var tmpService = new libFileBrowserService(tmpFableInstance, { BasePath: tmpModuleDir });

						tmpService.listChildFolders('',
							(pError, pChildren) =>
							{
								Expect(pError).to.be.null;
								var tmpHidden = pChildren.filter((pItem) => { return pItem.Name.charAt(0) === '.'; });
								Expect(tmpHidden.length).to.equal(0);
								fDone();
							});
					}
				);
				test
				(
					'listChildFolders should return error for non-existent path.',
					(fDone) =>
					{
						var tmpFable = require('fable');
						var tmpFableInstance = new tmpFable({});
						var tmpService = new libFileBrowserService(tmpFableInstance, { BasePath: __dirname });

						tmpService.listChildFolders('nonexistent_dir_xyz',
							(pError, pChildren) =>
							{
								Expect(pError).to.be.an('error');
								Expect(pError.message).to.equal('Path not found');
								fDone();
							});
					}
				);
				test
				(
					'listChildFolders should return empty array for a leaf directory.',
					(fDone) =>
					{
						var tmpFable = require('fable');
						var tmpFS = require('fs');
						var tmpFableInstance = new tmpFable({});
						// Create a temporary empty directory
						var tmpEmptyDir = libPath.join(__dirname, '_empty_child_test_dir');
						if (!tmpFS.existsSync(tmpEmptyDir))
						{
							tmpFS.mkdirSync(tmpEmptyDir);
						}
						var tmpService = new libFileBrowserService(tmpFableInstance, { BasePath: tmpEmptyDir });

						tmpService.listChildFolders('',
							(pError, pChildren) =>
							{
								Expect(pError).to.be.null;
								Expect(pChildren).to.be.an('array');
								Expect(pChildren.length).to.equal(0);

								// Clean up
								tmpFS.rmdirSync(tmpEmptyDir);
								fDone();
							});
					}
				);
				test
				(
					'MaxTreeDepth default should be 2.',
					(fDone) =>
					{
						Expect(libFileBrowserService.default_configuration.MaxTreeDepth).to.equal(2);
						fDone();
					}
				);
				test
				(
					'listDirectory should handle an empty directory.',
					(fDone) =>
					{
						var tmpFable = require('fable');
						var tmpFS = require('fs');
						var tmpFableInstance = new tmpFable({});
						// Create a temporary empty directory
						var tmpEmptyDir = libPath.join(__dirname, '_empty_test_dir');
						if (!tmpFS.existsSync(tmpEmptyDir))
						{
							tmpFS.mkdirSync(tmpEmptyDir);
						}
						var tmpService = new libFileBrowserService(tmpFableInstance, { BasePath: tmpEmptyDir });

						tmpService.listDirectory('',
							(pError, pFileList) =>
							{
								Expect(pError).to.be.null;
								Expect(pFileList).to.be.an('array');
								Expect(pFileList.length).to.equal(0);

								// Clean up
								tmpFS.rmdirSync(tmpEmptyDir);
								fDone();
							});
					}
				);
			}
		);
	}
);
