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
        this.included = true;
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

function createBucketFolder(dir, bucket) {
    if(!bucket.included) return;

    const bucketPath = path.join(dir, bucket.name);
    fs.mkdirSync(bucketPath);
    return bucketPath;
}

function moveBucketFiles(bucket, bucketPath) {
    for(const file of bucket.files) {
        const fileName = path.basename(file);
        fs.renameSync(file, path.join(bucketPath, fileName));

        const parentDir = path.dirname(file);
        if(parentDir !== bucketPath && getAllFiles(parentDir).length === 0) {
            console.log("Removing " + parentDir);
            fs.rmdirSync(parentDir);
        }
    }
}

module.exports = {
    Config, Bucket, 
    getAllFiles, isDirectory, getBucket, createBucketFolder, moveBucketFiles
};