let config = null;

async function loadConfig() {
    config = await window.electronAPI.getConfig();
}

/*
 Btn Clicks
 */

function handleBackClick() {
    window.location.href = "home.html";
}

function handleModeClick(mode) {
    if(config.mode === mode) return;
    config.mode = mode;
    window.electronAPI.setConfig(config);

    const clicked = document.getElementById(mode);
    clicked.classList.remove("unselected");
    clicked.classList.add("selected");
    const other = document.getElementById(mode === "manual" ? "automatic" : "manual");
    other.classList.remove("selected");
    other.classList.add("unselected");
}

/*
 Manual - Buckets
 */

function updateBuckets() {
    const bucketGrid = document.getElementById("bucket-grid");

    for(let i = 0; i < 6; i++) {
        const bucketDiv = document.createElement("div");
        bucketDiv.classList.add("bucket");

        if(i >= config.buckets.length) {
            // Unassigned
            bucketDiv.classList.add("unassigned");
        } else {
            // Assigned
            bucketDiv.classList.add("assigned");
            const bucketTxt = document.createElement("p");
            bucketTxt.classList.add("bucket-txt");
            bucketTxt.innerText = config.buckets[i].name;
            bucketDiv.appendChild(bucketTxt);
        }

        bucketGrid.appendChild(bucketDiv);
    }
}

async function init() {
    await loadConfig();
    updateBuckets();
}

init();