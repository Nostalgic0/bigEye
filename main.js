const { app, BrowserWindow, ipcMain, desktopCapturer, dialog, screen } = require('electron');
const path = require('path');
const fs = require('fs');

let screenshotsDir = path.join(__dirname, 'screenshots'); // Carpeta predeterminada
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

// Manejar la solicitud de captura de pantalla
ipcMain.handle('request-screenshot', async () => {
    try {
        const sources = await desktopCapturer.getSources({
            types: ['screen'],
            thumbnailSize: { width: 1920, height: 1080 },
        });

        if (sources.length === 0) throw new Error("No se encontraron pantallas");

        const screenshot = sources[0].thumbnail.toDataURL();
        const buffer = Buffer.from(screenshot.split(',')[1], 'base64');

        // Guardar la imagen en la carpeta seleccionada
        const timestamp = new Date().toISOString().replace(/[:.-]/g, '');
        const filePath = path.join(screenshotsDir, `screenshot-${timestamp}.png`);
        fs.writeFileSync(filePath, buffer);

        return { success: true, filePath };

    } catch (error) {
        return { success: false, error: error.message };
    }
});

// Manejar la selección de carpeta
ipcMain.handle('choose-folder', async () => {
    try {
        const result = await dialog.showOpenDialog({
            properties: ['openDirectory'], // Solo permite seleccionar carpetas
        });

        if (!result.canceled && result.filePaths.length > 0) {
            screenshotsDir = result.filePaths[0]; // Actualizar la carpeta de destino
            return { success: true, folder: screenshotsDir };
        } else {
            return { success: false, error: "No se seleccionó ninguna carpeta" };
        }
    } catch (error) {
        return { success: false, error: error.message };
    }
});

// Manejar la selección del área
ipcMain.handle('select-area', async () => {
    try {
        const { width, height } = screen.getPrimaryDisplay().workAreaSize;

        // Crear una ventana transparente para seleccionar el área
        const areaWindow = new BrowserWindow({
            width,
            height,
            transparent: true,
            frame: false,
            alwaysOnTop: true,
            webPreferences: {
                nodeIntegration: true,
                contextIsolation: false,
            },
        });

        areaWindow.loadFile('area-selector.html');

        // Esperar a que el usuario seleccione el área
        const area = await new Promise((resolve) => {
            areaWindow.webContents.on('did-finish-load', () => {
                areaWindow.webContents.send('request-area-selection');
            });

            ipcMain.once('area-selected', (event, area) => {
                areaWindow.close();
                resolve(area);
            });
        });

        // Capturar el área seleccionada
        const sources = await desktopCapturer.getSources({
            types: ['screen'],
            thumbnailSize: { width: 1920, height: 1080 },
        });

        if (sources.length === 0) throw new Error("No se encontraron pantallas");

        const screenshot = sources[0].thumbnail.crop(area);
        const buffer = Buffer.from(screenshot.toPNG());

        // Guardar la imagen en la carpeta seleccionada
        const timestamp = new Date().toISOString().replace(/[:.-]/g, '');
        const filePath = path.join(screenshotsDir, `screenshot-${timestamp}.png`);
        fs.writeFileSync(filePath, buffer);

        return { success: true, filePath };

    } catch (error) {
        return { success: false, error: error.message };
    }
});

app.whenReady().then(createWindow);
