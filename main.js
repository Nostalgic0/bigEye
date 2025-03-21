import {app, BrowserWindow, ipcMain, dialog, clipboard, nativeImage } from 'electron';
import path from 'path'
import sharp from 'sharp'
import Store from 'electron-store'
import fs from 'fs'
import clipboardy from 'clipboardy'
const store = new Store();

function createWindow() {
    const win = new BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false,
        },
    });

    win.loadFile('index.html');
}

app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});

app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
        createWindow();
    }
});

ipcMain.on('capture-screen', async (event) => {
    console.log("Evento capture-screen recibido");
    const primaryDisplay = require('electron').screen.getPrimaryDisplay();
    const { width, height } = primaryDisplay.workAreaSize;
    const screenshot = await require('electron').desktopCapturer.getSources({ types: ['screen'], thumbnailSize: { width: width, height: height } });
    const image = nativeImage.createFromDataURL(screenshot[0].thumbnail.toDataURL());
    const png = image.toPNG();
    clipboard.writeImage(image);
    event.sender.send('capture-complete', png);
});

ipcMain.on('save-image', async (event, imageBuffer) => {
    console.log("Evento save-image recibido");
    const filePath = await dialog.showSaveDialog({
        filters: [{ name: 'Images', extensions: ['png'] }],
    });
    if (filePath.canceled) return;
    fs.writeFile(filePath.filePath, imageBuffer, (err) => {
        if (err) {
            console.error('Error saving image:', err);
        }
    });
});
