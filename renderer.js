import { ipcRenderer } from 'electron'

const captureBtn = document.getElementById('capture');
const saveBtn = document.getElementById('save');
let capturedImage;

captureBtn.addEventListener('click', () => {
    console.log("Botón de captura clicado");
    ipcRenderer.send('capture-screen');
});

ipcRenderer.on('capture-complete', (event, imageBuffer) => {
    capturedImage = imageBuffer;
});

saveBtn.addEventListener('click', () => {
    console.log("Botón de guardar clicado");
    if (capturedImage) {
        ipcRenderer.send('save-image', capturedImage);
    }
});
