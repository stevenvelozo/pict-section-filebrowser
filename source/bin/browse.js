#!/usr/bin/env node

/**
* browse - Serve a file browser web app for any folder.
*
* Usage:
*   browse [path] [options]
*
* Options:
*   -p, --port <port>    Port to listen on (default: 8086)
*   -a, --hidden         Include hidden files (dotfiles)
*   -h, --help           Show this help message
*
* Examples:
*   browse ~/configurations -p 9876
*   browse .
*   browse /var/log --port 3000 --hidden
*   npx pict-section-filebrowser ~/Documents
*
* @license MIT
* @author Steven Velozo <steven@velozo.com>
*/

const libPath = require('path');

// ---- Parse command-line arguments ----
let _BrowsePath = '.';
let _Port = 8086;
let _IncludeHidden = false;
let _ShowHelp = false;

let tmpArgs = process.argv.slice(2);
let i = 0;

while (i < tmpArgs.length)
{
	let tmpArg = tmpArgs[i];

	if (tmpArg === '-h' || tmpArg === '--help')
	{
		_ShowHelp = true;
		i++;
	}
	else if (tmpArg === '-p' || tmpArg === '--port')
	{
		i++;
		if (i < tmpArgs.length)
		{
			_Port = parseInt(tmpArgs[i], 10);
			if (isNaN(_Port) || _Port < 1 || _Port > 65535)
			{
				console.error('Error: Invalid port number "' + tmpArgs[i] + '"');
				process.exit(1);
			}
		}
		i++;
	}
	else if (tmpArg === '-a' || tmpArg === '--hidden')
	{
		_IncludeHidden = true;
		i++;
	}
	else if (tmpArg.charAt(0) === '-')
	{
		console.error('Error: Unknown option "' + tmpArg + '"');
		console.error('Run "browse --help" for usage.');
		process.exit(1);
	}
	else
	{
		// Positional argument: the path to browse
		_BrowsePath = tmpArg;
		i++;
	}
}

if (_ShowHelp)
{
	console.log('');
	console.log('  browse - Serve a file browser web app for any folder.');
	console.log('');
	console.log('  Usage:');
	console.log('    browse [path] [options]');
	console.log('');
	console.log('  Arguments:');
	console.log('    path              Folder to browse (default: current directory)');
	console.log('');
	console.log('  Options:');
	console.log('    -p, --port <port> Port to listen on (default: 8086)');
	console.log('    -a, --hidden      Include hidden files (dotfiles)');
	console.log('    -h, --help        Show this help message');
	console.log('');
	console.log('  Examples:');
	console.log('    browse ~/configurations -p 9876');
	console.log('    browse .');
	console.log('    browse /var/log --port 3000 --hidden');
	console.log('');
	process.exit(0);
}

// ---- Resolve the path ----
let tmpResolvedPath = libPath.resolve(_BrowsePath);

// Verify the path exists
const libFS = require('fs');
if (!libFS.existsSync(tmpResolvedPath))
{
	console.error('Error: Path does not exist: ' + tmpResolvedPath);
	process.exit(1);
}

let tmpStats = libFS.statSync(tmpResolvedPath);
if (!tmpStats.isDirectory())
{
	console.error('Error: Path is not a directory: ' + tmpResolvedPath);
	process.exit(1);
}

// ---- Boot the server ----
const libFable = require('fable');
const libOrator = require('orator');
const libOratorServiceServerRestify = require('orator-serviceserver-restify');
const libFileBrowserService = require('../services/Pict-Service-FileBrowser.js');

let tmpFable = new libFable(
{
	Product: 'FileBrowser',
	ProductVersion: '0.0.1',
	APIServerPort: _Port,
	LogNoisiness: 0
});

// Register service types
tmpFable.serviceManager.addServiceType('OratorServiceServer', libOratorServiceServerRestify);
tmpFable.serviceManager.addServiceType('Orator', libOrator);

// Instantiate Orator
let tmpOrator = tmpFable.serviceManager.instantiateServiceProvider('Orator', {});

// Create the file browser service
let tmpFileBrowser = new libFileBrowserService(tmpFable,
{
	BasePath: tmpResolvedPath,
	IncludeHiddenFiles: _IncludeHidden
});

// Start the server
tmpOrator.startService(
	(pError) =>
	{
		if (pError)
		{
			console.error('Error starting server:', pError);
			process.exit(1);
		}

		tmpFileBrowser.connectRoutes();

		console.log('');
		console.log('  \uD83D\uDCC1 File Browser');
		console.log('  Browsing: ' + tmpResolvedPath);
		console.log('  Server:   http://localhost:' + _Port + '/filebrowser/');
		console.log('');
		console.log('  Press Ctrl+C to stop.');
		console.log('');
	});
