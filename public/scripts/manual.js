let files = null;

const cardHolder = document.getElementById("card-holder");
let prevFile = null;
let currentFile = null;
let nextFile = null;

async function loadFiles() {
    files = await window.electronAPI.getAllFiles();
    currentFile = 0;
    if(files.length > 1) nextFile = 1;
}

function createBuckets() {
    const bucketHolder = document.getElementById("bucket-holder");
    
    for(const bucket of config.buckets) {
        if(bucket.name === "__DELETE__") continue;

        const bucketDiv = document.createElement("div");
        bucketDiv.classList.add("filers");
        bucketDiv.classList.add("bucket");
        bucketDiv.innerHTML = bucket.name;
        bucketDiv.ondrop = (event) => {
            event.preventDefault();

            bucket.files.push(files[currentFile].path);
            window.electronAPI.setConfig(config);

            scrollCards();
        };
        bucketDiv.ondragover = (event) => {
            event.preventDefault();
        }
        bucketHolder.appendChild(bucketDiv);
    }
}

function createCards() {
    cardHolder.innerHTML = "";

    addCard(prevFile, false)
    addCard(currentFile, true);
    addCard(nextFile, false);
}

function scrollCards() {
    if(prevFile === null) {
        prevFile = 0;
    } else {
        prevFile++;
    }
    currentFile++;
    nextFile++;
    if(nextFile === files.length) {
        nextFile = null;
    }

    if(currentFile === files.length) {
        window.location.href = "confirm.html";
        return;
    }

    createCards();
}

function addCard(fileIndex, drag) {
    const file = fileIndex === null ? null : files[fileIndex];

    const card = document.createElement("div");
    card.classList.add("card");
    if(drag) {
        card.draggable = true;
        card.ondragstart = () => {
            handleDrag(true);
        };
        card.ondragend = () => {
            handleDrag(false);
        }
    }

    const cardImg = document.createElement("img");
    cardImg.classList.add("card-img");
    const cardTxt = document.createElement("p");
    cardTxt.classList.add("card-txt");

    if(file !== null) {
        cardImg.src = "data:image/png;base64," + file.base64;
        cardTxt.innerText = "File: " + file.name;
    }

    card.appendChild(cardImg);
    card.appendChild(cardTxt);
    cardHolder.appendChild(card);
}

function handleKeepClick() {
    scrollCards();
}

function handleDeleteClick() {
    const deleteBucket = getBucket(config.buckets, "__DELETE__");
    deleteBucket.files.push(files[currentFile].path);
    window.electronAPI.setConfig(config);

    scrollCards();
}

async function init() {
    await loadConfig();
    await loadFiles();
    createCards();
    createBuckets();
}

function handleDrag(start) {
    const check = document.getElementById("check");
    const uncheck = document.getElementById("uncheck");
    const buckets = document.getElementsByClassName("bucket");
    const leftBuckets = [];
    const rightBuckets = [];
    for(let i = 0; i < buckets.length; i++) {
        if(i % 2 == 0) {
            leftBuckets.push(buckets[i]);
        } else {
            rightBuckets.push(buckets[i]);  
        }
    }
    
    if(start) {
        for(leftBucket of leftBuckets) {
            leftBucket.classList.remove("disappearLeft");
            leftBucket.classList.add("appearLeft");
            leftBucket.style.display = "flex";
        }
        for(rightBucket of rightBuckets) {
            rightBucket.classList.remove("disappearRight");
            rightBucket.classList.add("appearRight");
            rightBucket.style.display = "flex";
        }

        check.classList.remove("appearRight");
        check.classList.add("disappearRight");
        uncheck.classList.remove("appearLeft");
        uncheck.classList.add("disappearLeft");
    } else {
        for(leftBucket of leftBuckets) {
            leftBucket.classList.remove("appearLeft");
            leftBucket.classList.add("disappearLeft");
        }
        for(rightBucket of rightBuckets) {
            rightBucket.classList.remove("appearRight");
            rightBucket.classList.add("disappearRight");
        }

        check.classList.add("appearRight");
        check.classList.remove("disappearRight");
        uncheck.classList.add("appearLeft");
        uncheck.classList.remove("disappearLeft");
    }
}

init();