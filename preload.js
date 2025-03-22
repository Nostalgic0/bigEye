const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
    requestScreenshot: () => ipcRenderer.invoke('request-screenshot'),
    chooseFolder: () => ipcRenderer.invoke('choose-folder'),
    selectArea: () => ipcRenderer.invoke('select-area'),
});
