const { app, BrowserWindow, ipcMain, desktopCapturer, dialog, clipboard, Tray, Menu, nativeImage, globalShortcut, screen } = require('electron');
const path = require('path');
const fs = require('fs');
const { create } = require('domain');

let screenshotsDir = path.join(__dirname, 'screenshots');
if (!fs.existsSync(screenshotsDir)) fs.mkdirSync(screenshotsDir);

let mainWindow;
let tray = null;

function createWindow() {
    const primaryDisplay = screen.getPrimaryDisplay();
    const { width, height } = primaryDisplay.workAreaSize;
    mainWindow = new BrowserWindow({
        width: width,
        height: height,
        show: false, // No mostrar la ventana al inicio
	frame: false,
	transparent: true,
	alwaysOnTop: true,
        webPreferences: {
            preload: path.join(__dirname, 'preload.js'),
            contextIsolation: true,
            nodeIntegration: false,
        },
    });

    mainWindow.loadFile('index.html');
    
    function restartCapture() {
        if (!mainWindow.isVisible()) {
            mainWindow.show();
        }
        mainWindow.webContents.send('restart-capture');
    }
    
    // Registrar la tecla PrintScreen
    globalShortcut.register('PrintScreen', () => {
        restartCapture();
    });
}

// Crear el ícono en la bandeja del sistema
function createTray() {
    const iconPath = path.join(__dirname, 'assets', 'icon.png'); // Ruta al ícono
    const trayIcon = nativeImage.createFromPath(iconPath);

    tray = new Tray(trayIcon);
    const contextMenu = Menu.buildFromTemplate([
        {
            label: 'Capturar Área',
            click: () => {
                if (!mainWindow) {
                    createWindow();
                }
                mainWindow.show();
                mainWindow.webContents.send('restart-capture');
            }
        },
        {
            label: 'Salir',
            click: () => {
                app.quit();
            }
        }
    ]);

    tray.setToolTip('Captura de Pantalla');
    tray.setContextMenu(contextMenu);
}

// Guardar la captura en una carpeta
ipcMain.handle('save-screenshot', async (event, area) => {
    try {
        const sources = await desktopCapturer.getSources({
            types: ['screen'],
            thumbnailSize: { width: 1920, height: 1080 },
        });

        if (sources.length === 0) throw new Error("No se encontraron pantallas");

        const screenshot = sources[0].thumbnail.crop(area);
        const buffer = Buffer.from(screenshot.toPNG());

        const timestamp = new Date().toISOString().replace(/[:.-]/g, '');
        const filePath = path.join(screenshotsDir, `screenshot-${timestamp}.png`);
        fs.writeFileSync(filePath, buffer);

        return { success: true, filePath };
    } catch (error) {
        return { success: false, error: error.message };
    }
});

// Copiar la captura al portapapeles
ipcMain.handle('copy-screenshot', async (event, area) => {
    try {
        const sources = await desktopCapturer.getSources({
            types: ['screen'],
            thumbnailSize: { width: 1920, height: 1080 },
        });

        if (sources.length === 0) throw new Error("No se encontraron pantallas");

        const screenshot = sources[0].thumbnail.crop(area);
        const buffer = Buffer.from(screenshot.toPNG());

        clipboard.writeImage(screenshot);
        return { success: true };
    } catch (error) {
        return { success: false, error: error.message };
    }
});

app.whenReady().then(() => {
    createTray();
    createWindow();
});

// app.on('window-all-closed', () => {
//     if (process.platform !== 'darwin') {
//         mainWindow = null;
//     }
// });
app.on('will-quit', () => {
    // Liberar el atajo global al salir
    globalShortcut.unregisterAll();
});

ipcMain.on('hide-window', () => {
    if (mainWindow) {
        mainWindow.hide();
    }
});