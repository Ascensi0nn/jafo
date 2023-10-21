class Config {

    constructor(rootDir, mode, buckets) {
        this.rootDir = rootDir;
        this.mode = mode;
        this.buckets = buckets;
    }

}

class Bucket {

    constructor(name, dir) {
        this.name = name;
        this.dir = dir;
    }

}

module.exports = { Config, Bucket };