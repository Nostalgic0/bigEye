document.addEventListener('DOMContentLoaded', () => {
    const captureBtn = document.getElementById('capture-btn');
    const chooseFolderBtn = document.getElementById('choose-folder-btn');
    const selectAreaBtn = document.getElementById('select-area-btn');

    // Capturar pantalla
    captureBtn.addEventListener('click', async () => {
        const result = await window.electronAPI.requestScreenshot();

        if (result.success) {
            const img = document.getElementById('screenshot-img');
            img.src = `file://${result.filePath}`;
            img.style.display = 'block';
        } else {
            alert(`Error: ${result.error}`);
        }
    });

    // Seleccionar carpeta
    chooseFolderBtn.addEventListener('click', async () => {
        const result = await window.electronAPI.chooseFolder();

        if (result.success) {
            alert(`Carpeta seleccionada: ${result.folder}`);
        } else {
            alert(`Error: ${result.error}`);
        }
    });

    // Seleccionar área
    selectAreaBtn.addEventListener('click', async () => {
        const result = await window.electronAPI.selectArea();

        if (result.success) {
            const img = document.getElementById('screenshot-img');
            img.src = `file://${result.filePath}`;
            img.style.display = 'block';
        } else {
            alert(`Error: ${result.error}`);
        }
    });
});
