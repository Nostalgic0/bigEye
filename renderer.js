document.addEventListener('DOMContentLoaded', () => {
    const captureBtn = document.getElementById('capture-btn');
    const chooseFolderBtn = document.getElementById('choose-folder-btn');

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

    chooseFolderBtn.addEventListener('click', async () => {
        const result = await window.electronAPI.chooseFolder();

        if (result.success) {
            alert(`Carpeta seleccionada: ${result.folder}`);
        } else {
            alert(`Error: ${result.error}`);
        }
    });
    
});
