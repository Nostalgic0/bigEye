const { app, BrowserWindow, ipcMain, desktopCapturer, dialog } = require('electron');
const path = require('path');
const fs = require('fs');

// Crear la carpeta "screenshots"
let screenshotsDir = path.join(__dirname, 'screenshots');
if (!fs.existsSync(screenshotsDir)) fs.mkdirSync(screenshotsDir);

function createWindow() {
    const mainWindow = new BrowserWindow({
        webPreferences: {
            preload: path.join(__dirname, 'preload.js'),
            contextIsolation: true,
            nodeIntegration: false,
        },
    });

    mainWindow.loadFile('index.html');
}

// Escuchar la solicitud de captura desde el renderer
ipcMain.handle('request-screenshot', async () => {
    try {
        // Capturar fuentes de pantalla (desde el main)
        const sources = await desktopCapturer.getSources({
            types: ['screen'],
            thumbnailSize: { width: 1920, height: 1080 },
        });

        if (sources.length === 0) throw new Error("No se encontraron pantallas");

        const screenshot = sources[0].thumbnail.toDataURL();
        const buffer = Buffer.from(screenshot.split(',')[1], 'base64');

        // Guardar la imagen
        const timestamp = new Date().toISOString().replace(/[:.-]/g, '');
        const filePath = path.join(screenshotsDir, `screenshot-${timestamp}.png`);
        fs.writeFileSync(filePath, buffer);

        return { success: true, filePath };

    } catch (error) {
        return { success: false, error: error.message };
    }
});

ipcMain.handle('choose-folder', async () => {
    const result = await dialog.showOpenDialog({
        properties: ['openDirectory'], // Solo permite seleccionar carpetas
    });

    if (!result.canceled && result.filePaths.length > 0) {
        screenshotsDir = result.filePaths[0]; // Actualizar la carpeta de destino
        return { success: true, folder: screenshotsDir };
    } else {
        return { success: false, error: "No se seleccionó ninguna carpeta" };
    }
});

app.whenReady().then(createWindow);
