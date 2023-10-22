const os = require('os');
const fs = require('fs');
const path = require('path');

class Config {

    constructor(rootDir, mode, buckets) {
        this.rootDir = rootDir;
        this.mode = mode;
        this.buckets = buckets;
        this.automaticType = null;
    }}

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
            fs.rmdirSync(parentDir);
        }
    }
}

function removeDeleteDir(config) {
    const deleteBucket = getBucket(config.buckets, "__DELETE__");
    if(deleteBucket === null) return;

    const deleteBucketDir = path.join(config.rootDir, "__DELETE__");
    for(const file of deleteBucket.files) {
        fs.rmSync(path.join(deleteBucketDir, path.basename(file)));
    }
    fs.rmdirSync(deleteBucketDir);
}

const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
function getMonthCreated(file) {
    const created = fs.lstatSync(file).birthtime;
    return months[created.getMonth()] + " " + created.getFullYear();
}

function getFileAsBase64(file) {
    return fs.readFileSync(file, { "encoding": "base64" });
}

module.exports = {
    Config, Bucket, 
    getAllFiles, isDirectory, getBucket, createBucketFolder, moveBucketFiles, removeDeleteDir, getMonthCreated, getFileAsBase64
};