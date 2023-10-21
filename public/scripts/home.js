let config = null;

async function handleChooseFolder() {
    const result = await window.electronAPI.chooseFolder();
    if(result.cancelled) return;
    config = window.electronAPI.createConfig(result.filePaths[0], "manual", []);
    window.electronAPI.setConfig(config);
    console.log("New config: " + JSON.stringify(config));
}