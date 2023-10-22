const fs = require('fs');
const path = require('path');

class Config {

    constructor(rootDir, mode, buckets) {
        this.rootDir = rootDir;
        this.mode = mode;
        this.buckets = buckets;
        this.automaticType = null;
    }

}

class Bucket {

    constructor(name) {
        this.name = name;
        this.files = [];
    }

}

function getAllFiles(dir) {
    const files = fs.readdirSync(dir);
    const totalFiles = [];

    files.forEach((file) => {
        const filePath = path.join(dir, file);
        if(isDirectory(filePath)) {
            totalFiles.push(...getAllFiles(filePath));
        } else {
            totalFiles.push(filePath);
        }
	});

    return totalFiles;
}

function isDirectory(path) {
    return fs.lstatSync(path).isDirectory();
}

function getBucket(buckets, name) {
    for(const bucket of buckets) {
        if(bucket.name === name) return bucket;
    }
    return null;
}

module.exports = {
    Config, Bucket, 
    getAllFiles, isDirectory, getBucket 
};