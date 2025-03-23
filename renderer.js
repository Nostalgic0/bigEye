document.addEventListener('DOMContentLoaded', () => {
    const overlay = document.getElementById('overlay');
    const selectionBox = document.getElementById('selection-box');
    const actionButtons = document.getElementById('action-buttons');
    const saveBtn = document.getElementById('save-btn');
    const copyBtn = document.getElementById('copy-btn');

    let startX, startY, endX, endY;
    let isSelecting = false;

    // Iniciar la selección de área
    const startSelection = () => {
        isSelecting = true;
        selectionBox.style.display = 'block';
        actionButtons.classList.add('hidden');
    };

    // Manejar la selección del área
    document.addEventListener('mousedown', (e) => {
        if (isSelecting) {
            startX = e.clientX;
            startY = e.clientY;
            selectionBox.style.left = `${startX}px`;
            selectionBox.style.top = `${startY}px`;
            selectionBox.style.width = '0';
            selectionBox.style.height = '0';
        }
    });

    document.addEventListener('mousemove', (e) => {
        if (isSelecting && startX !== undefined && startY !== undefined) {
            endX = e.clientX;
            endY = e.clientY;
            selectionBox.style.width = `${endX - startX}px`;
            selectionBox.style.height = `${endY - startY}px`;
        }
    });

    document.addEventListener('mouseup', () => {
        if (isSelecting && startX !== undefined && startY !== undefined) {
            isSelecting = false;
            actionButtons.style.left = `${(startX + endX) / 2}px`;
            actionButtons.style.top = `${endY + 10}px`;
            actionButtons.classList.remove('hidden');
        }
    });

    // Guardar la captura en una carpeta
    saveBtn.addEventListener('click', async () => {
        const area = {
            x: Math.min(startX, endX),
            y: Math.min(startY, endY),
            width: Math.abs(endX - startX),
            height: Math.abs(endY - startY),
        };

        const result = await window.electronAPI.saveScreenshot(area);

        if (result.success) {
            alert(`Captura guardada en: ${result.filePath}`);
        } else {
            alert(`Error: ${result.error}`);
        }
    });

    // Copiar la captura al portapapeles
    copyBtn.addEventListener('click', async () => {
        const area = {
            x: Math.min(startX, endX),
            y: Math.min(startY, endY),
            width: Math.abs(endX - startX),
            height: Math.abs(endY - startY),
        };

        const result = await window.electronAPI.copyScreenshot(area);

        if (result.success) {
            alert('Captura copiada al portapapeles');
        } else {
            alert(`Error: ${result.error}`);
        }
    });

    // Iniciar la selección al cargar la ventana
    startSelection();
});
