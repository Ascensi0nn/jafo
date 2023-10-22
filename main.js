const { app, BrowserWindow, ipcMain, dialog } = require('electron');
const path = require('path');
const utils = require('./utils');
const env = process.env.NODE_ENV || 'development'; 
  
// If development environment
if(env === 'development') { 
    require('electron-reload')(__dirname, { 
        electron: path.join(__dirname, 'node_modules', '.bin', 'electron'), 
        hardResetMethod: 'exit'
    });
}

/*
	IPC
*/

const global = {
	config: null
};

ipcMain.handle('chooseFolder', async (event) => {
	return dialog.showOpenDialog(BrowserWindow.fromWebContents(event.sender), {
        properties: ['openDirectory']
    });
});
ipcMain.handle('fillBuckets', async () => {
	if(global.config.mode === "manual") return;

	console.log(utils.getAllFiles(global.config.rootDir));
});
ipcMain.handle('getConfig', async () => {
	return global.config;
});
ipcMain.on('setConfig', (event, config) => {
	global.config = config;
	console.log('New config: ' + JSON.stringify(global.config));
});

/*
	WINDOW
*/

const createWindow = () => {
	const mainWindow = new BrowserWindow({
		width: 1000,
		height: 750,
		resizable: false,
		icon: 'public/icons/jafo_small.png',
		webPreferences: {
			preload: path.join(__dirname, 'preload.js'),
			nodeIntegration: true,
			contextIsolation: true
		}
	});

	mainWindow.menuBarVisible = false;
	mainWindow.loadFile('pages/home.html');
}

app.whenReady().then(() => {
	createWindow()

	app.on('activate', () => {
		if (BrowserWindow.getAllWindows().length === 0) {
			createWindow()
		}
	});
});

app.on('window-all-closed', () => {
  	if (process.platform !== 'darwin') {
		app.quit()
	}
});
