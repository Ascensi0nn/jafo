let config = null;
const leftBox = document.getElementById("left-box");
const rightBox = document.getElementById("right-box");

async function loadConfig() {
    config = await window.electronAPI.getConfig();
}