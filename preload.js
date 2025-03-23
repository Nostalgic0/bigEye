const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
    saveScreenshot: (area) => ipcRenderer.invoke('save-screenshot', area),
    copyScreenshot: (area) => ipcRenderer.invoke('copy-screenshot', area),
});
