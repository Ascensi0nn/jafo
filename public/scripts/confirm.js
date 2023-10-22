/*
    Navigation
*/

function handleBackClick() {
    config.mode = "manual";
    config.buckets = [];
    config.automaticType = null;
    window.electronAPI.setConfig(config);
    window.location.href = "config.html";
}

function handleConfirmClick() {
    window.electronAPI.sortBuckets();
    document.getElementById("modal").style.display = "none";
    setTimeout(() => {
        window.location.href = "home.html";
    }, 3000);
}

/*
    Init
 */

function loadBuckets() {
    const modalContent = document.getElementById("modal-content");
    const confirmBtn = document.getElementById("confirm-btn");
    const radios = ["Confirm", "Deny"];

    for(let i = 0; i < config.buckets.length; i++) {
        const bucket = config.buckets[i];
        const radioHolder = document.createElement("div");
        radioHolder.classList.add("radio-holder");

        const bucketLabel = document.createElement("p");
        bucketLabel.classList.add("bucket-label");
        if(bucket.name === "__DELETE__") {
            bucketLabel.innerText = bucket.files.length + " files to be deleted";
        } else {
            bucketLabel.innerText = bucket.files.length + " files in '" + bucket.name + "' bucket";
        }
        radioHolder.appendChild(bucketLabel);

        for(const radio of radios) {
            const radioDiv = document.createElement("div");
            radioDiv.style.display = "flex";
            
            const radioInput = document.createElement("input");
            radioInput.classList.add("radio");
            radioInput.type = "radio";
            radioInput.name = "confirmation-" + bucket.name;
            radioInput.id = radio.toLowerCase();
            if(radio === "Confirm") radioInput.checked = true;
            radioInput.onchange = () => {
                bucket.included = !bucket.included;
                window.electronAPI.setConfig(config);
            };

            const radioLabel = document.createElement("label");
            radioLabel.classList.add("label");
            radioLabel.for = radio.toLowerCase();
            radioLabel.innerText = radio;

            radioDiv.appendChild(radioInput);
            radioDiv.appendChild(radioLabel);
            radioHolder.appendChild(radioDiv);
        }

        modalContent.insertBefore(radioHolder, confirmBtn);
    }
}

async function init() {
    await loadConfig();
    loadBuckets();
}

init();
setTimeout(() => {
    document.getElementById("elephant").style.display = "block";
}, 500);