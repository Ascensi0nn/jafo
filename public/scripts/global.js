let config = null;
const leftBox = document.getElementById("left-box");
const rightBox = document.getElementById("right-box");

async function loadConfig() {
    config = await window.electronAPI.getConfig();
}

function getBucket(buckets, name) {
    for(const bucket of buckets) {
        if(bucket.name === name) return bucket;
    }
    return null;
}