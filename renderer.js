document.addEventListener('DOMContentLoaded', () => {
    const overlay = document.getElementById('overlay');
    const selectionBox = document.getElementById('selection-box');
    const actionButtons = document.getElementById('action-buttons');
    const saveBtn = document.getElementById('save-btn');
    const copyBtn = document.getElementById('copy-btn');

    let startX, startY, endX, endY;
    let isSelecting = false;
    
    actionButtons.style.display = 'none';
    // Iniciar la selección de área
    const startSelection = () => {
        isSelecting = true;
        selectionBox.style.display = 'block';
        overlay.style.display = 'block';
        //actionButtons.classList.add('hidden');
        actionButtons.style.display = 'none'; 
        // Reiniciar las variables de posición
        startX = undefined;
        startY = undefined;
        endX = undefined;
        endY = undefined;
        
        // Restablecer el tamaño y posición del selectionBox
        selectionBox.style.width = '0';
        selectionBox.style.height = '0';
        selectionBox.style.left = '0';
        selectionBox.style.top = '0';
    };

    // Escuchar evento de reinicio desde el proceso principal
    window.electronAPI.onRestartCapture(() => {
        startSelection();
    });

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
            overlay.style.display = 'none';

            const selectionWidth = Math.abs(endX - startX);
            const centerX = Math.min(startX, endX) + (selectionWidth / 2);
            
            actionButtons.style.left = `${centerX}px`;
            actionButtons.style.top = `${Math.max(startY, endY) + 10}px`;
            actionButtons.style.display = 'flex';
            actionButtons.style.transform = 'translateX(-50%)';
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
            window.electronAPI.hideWindow();
        } else {
            alert(`Error: ${result.error}`);
            window.electronAPI.hideWindow();
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
            window.electronAPI.hideWindow();
        } else {
            alert(`Error: ${result.error}`);
            window.electronAPI.hideWindow();
        }
    });

    // Iniciar la selección al cargar la ventana
    startSelection();
});
