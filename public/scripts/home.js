let config = null;
const leftBox = document.getElementById("left-box");
const rightBox = document.getElementById("right-box");
const dragFolder = document.getElementById("drag-folder-holder");

function createBlankConfig(dir) {
    config = window.electronAPI.createConfig(dir, "manual", []);
    window.electronAPI.setConfig(config);
    leftBox.style.animation = "panLeft 1s forwards";
    rightBox.style.animation = "panRight 1s forwards";
    setTimeout(() => {
        window.location.href = "config.html";
    }, 1000);
}

/*
 Choose Folder
 */

async function handleChooseFolder() {
    const result = await window.electronAPI.chooseFolder();
    if(result.canceled) return;
    createBlankConfig(result.filePaths[0], "manual", []);
}

/*
 Drag Folder
 */

dragFolder.addEventListener('dragover', (e) => {
    e.preventDefault();
    e.stopPropagation();

    dragFolder.style.backgroundColor = "var(--background)";
    dragFolder.style.border = "5px dashed var(--accent)";
});
dragFolder.addEventListener('dragleave', (e) => {
    e.preventDefault();
    e.stopPropagation();

    dragFolder.style.backgroundColor = "var(--accent)";
    dragFolder.style.border = "5px solid var(--accent)";
});
dragFolder.addEventListener('drop', (event) => {
    event.preventDefault();
    event.stopPropagation();

    if(!event.dataTransfer.files) return;
    const file = event.dataTransfer.files[0];
    if(file.type !== "") return;

    createBlankConfig(file.path);
});