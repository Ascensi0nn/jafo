const { contextBridge, ipcRenderer } = require('electron')
const { Config, Bucket } = require('./utils');

contextBridge.exposeInMainWorld('electronAPI', {
    createConfig: (rootDir, buckets) => new Config(rootDir, buckets),
    getConfig: async () => await ipcRenderer.invoke('getConfig'),
    setConfig: (config) => ipcRenderer.send('setConfig', config),
    createBucket: (name, dir) => new Bucket(name, dir),
    chooseFolder: async () => await ipcRenderer.invoke('chooseFolder')
});
