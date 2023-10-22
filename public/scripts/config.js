const titleHolder = document.getElementById("title-holder");
const bucketGrid = document.getElementById("bucket-grid");
const dropDownHolder = document.getElementById("drop-down-holder");
const modal = document.getElementById("modal"); 
/*
  Navigation
*/

function handleBackClick() {
    window.location.href = "home.html";
}

async function handleContinueClick() {
    await window.electronAPI.fillBuckets();
    leftBox.style.animation = "outToLeft var(--time) forwards";
    rightBox.style.animation = (config.mode === "automatic" ? "automaticOutToRight" : "manualOutToRight") + " var(--time) forwards";
    dropDownHolder.style.animation = (config.mode === "automatic" ? "absoluteOutLeft" : "automaticOutRight") + " var(--time) forwards";
    setTimeout(() => {
        if(config.mode === "manual") {
            config.buckets.push(window.electronAPI.createBucket("__DELETE__"));
            window.electronAPI.setConfig(config);
        }
        
        window.location.href = config.mode === "automatic" ? "confirm.html" : "manual.html";
    }, 500);
}

/*
    Manual
*/

function handleModeClick(mode) {
    if(config.mode === mode) return;

    const clicked = document.getElementById(mode);
    clicked.classList.remove("unselected");
    clicked.classList.add("selected");
    const other = document.getElementById(mode === "manual" ? "automatic" : "manual");
    other.classList.remove("selected");
    other.classList.add("unselected");

    rightBox.style.animation = (mode === "manual" ? "switchToManual" : "switchToAutomatic") + " var(--time) forwards";
    if(mode === "automatic") {
        config.automaticType = "dateCreated";
        titleHolder.style.animation = "outToLeft var(--time) forwards";
        bucketGrid.style.animation = "outToLeft var(--time) forwards";
        dropDownHolder.style.animation = "swoopLeft var(--time) forwards";
    } else {
        config.automaticType = null;
        titleHolder.style.animation = "inFromLeft var(--time) forwards";
        bucketGrid.style.animation = "inFromLeft var(--time) forwards";
        dropDownHolder.style.animation = "swoopRight var(--time) forwards";
    }

    config.mode = mode;
    window.electronAPI.setConfig(config);
}

function handleCreateBucket() {
    const name = document.getElementById("name-input").value.trim();
    if(getBucket(config.buckets, name) === null && config.buckets.length < 6 && name.length > 0) {
        config.buckets.push(window.electronAPI.createBucket(name));
        window.electronAPI.setConfig(config);
        updateBuckets();
    }

    handleCloseModal();
}

function updateBuckets() {
    bucketGrid.innerHTML = "";

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
            bucketDiv.onclick = (event) => {
                config.buckets.splice(i, 1);
                window.electronAPI.setConfig(config);
                updateBuckets();
            };
        }

        bucketGrid.appendChild(bucketDiv);
    }
}

/*
    Automatic
*/

function handleSortChange(radioBtn) {
    if(config.mode !== "automatic") return;
    config.automaticType = radioBtn.value;
    window.electronAPI.setConfig(config);
}

/*
    Modal
*/

function handleOpenModal() {
    modal.style.display = "block";
}

function handleCloseModal() {
    modal.style.display = "none";
}

window.onclick = () => {
    if(event.target !== modal) return;
    modal.style.display = "none";
}

/*
    Init
*/

async function init() {
    await loadConfig();
    updateBuckets();
}

init();