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
        bucketLabel.innerText = bucket.files.length + " files in '" + bucket.name + "' bucket";
        radioHolder.appendChild(bucketLabel);

        for(const radio of radios) {
            const radioDiv = document.createElement("div");
            radioDiv.style.display = "flex";
            
            const radioInput = document.createElement("input");
            radioInput.classList.add("radio");
            radioInput.type = "radio";
            radioInput.name = "confirmation-" + bucket.name;
            radioInput.id = radio.toLowerCase();
            radioInput.value = true;
            if(radio === "Confirm") radioInput.checked = true;
            radioInput.onchange = () => {
                radioInput.value = !radioInput.value;
                bucket.included = radioInput.value === "true";
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