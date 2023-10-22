const { app, BrowserWindow, ipcMain, dialog } = require('electron');
const path = require('path');
const utils = require('./utils');
const env = process.env.NODE_ENV || 'development'; 
  
/*
	HOT RELOAD
*/

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
	if(global.config.mode !== "automatic") return;
	global.config.buckets = [];

	const files = utils.getAllFiles(global.config.rootDir);
	files.forEach((file) => {
		let bucketName = null;
		if(global.config.automaticType === "dateCreated") {
			bucketName = utils.getMonthCreated(file);
		} else if(global.config.automaticType === "fileType") {
			bucketName = path.extname(file).substring(1);
		}

		let bucket = utils.getBucket(global.config.buckets, bucketName);
	
		if(bucket === null) {
			bucket = new utils.Bucket(bucketName);
			global.config.buckets.push(bucket);
		}

		bucket.files.push(file);
	});
});
ipcMain.handle('sortBuckets', async () => {
	for(const bucket of global.config.buckets) {
		if(!bucket.included) continue;
		if(bucket.files.length === 0) continue;

		const bucketPath = utils.createBucketFolder(global.config.rootDir, bucket);
		utils.moveBucketFiles(bucket, bucketPath);
	}
	utils.removeDeleteDir(global.config);
});
ipcMain.handle('getAllFiles', async () => {
	const files = utils.getAllFiles(global.config.rootDir);
	const result = [];
	
	for(const file of files) {
		result.push({
			name: path.basename(file),
			path: file,
			base64: utils.getFileAsBase64(file)
		});
	}

	return result;
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
