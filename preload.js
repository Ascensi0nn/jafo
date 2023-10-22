const { contextBridge, ipcRenderer } = require('electron')
const { Config, Bucket } = require('./utils');

contextBridge.exposeInMainWorld('electronAPI', {
    chooseFolder: async () => await ipcRenderer.invoke('chooseFolder'), 
    fillBuckets: async () => await ipcRenderer.invoke('fillBuckets'),
    sortBuckets: async () => await ipcRenderer.invoke('sortBuckets'),
    getAllFilesBase64: async () => await ipcRenderer.invoke('getAllFilesBase64'),
    createConfig: (rootDir, mode, buckets) => new Config(rootDir, mode, buckets),
    getConfig: async () => await ipcRenderer.invoke('getConfig'),
    setConfig: (config) => ipcRenderer.send('setConfig', config),
    createBucket: (name) => new Bucket(name)
});
