const path = require('path');
const {
    createIndexFileInDir,
    getFiles,
    getIndexFile
} = require('./utils');



let config = {
    DEFAULT_VERSION: 'es6',
    DIRECTORY: 'test-cases',
    get PATH_TO_DIR() {
        return path.join(__dirname, this.DIRECTORY)
    },
    get VERSION() {
        return (process.argv[2] && process.argv[2] === 'es5') ? 'es5' : this.DEFAULT_VERSION
    }
};

let config2 = {
    DEFAULT_VERSION: 'es6',
    DIRECTORY: 'test-cases',
    get PATH_TO_DIR() {
        return path.join(__dirname, this.DIRECTORY)
    },
    get VERSION() {
        return (process.argv[2] && process.argv[2] === 'es5') ? 'es5' : this.DEFAULT_VERSION
    }
};

let fileTreeMap = {};

(async () => {
    try {
        await traverseFileTreeInDir(config)

        for (let pathToDir in fileTreeMap) {
            let files = fileTreeMap[pathToDir];
            await createIndexFileInDir(
                pathToDir,
                config.VERSION,
                files
            )
        }

        // let files = await getIndexFile("/home/rayhaanbhikha/projects/clean-up/test-cases/test-2/es6");
        // console.log(files)
        // await createIndexFileInDir("/home/rayhaanbhikha/projects/clean-up/test-cases/test-2/es6", config.VERSION, files, config2.PATH_TO_DIR);
        // await createIndexFileInDir(config2)
    } catch (error) {
        console.log(error);
    }
})();


async function traverseFileTreeInDir({ PATH_TO_DIR }) {
    let files = await getFiles(PATH_TO_DIR);

    for (let fileIndex in files) {
        let file = files[fileIndex];
        if (file.isDirectory()) {
            await traverseFileTreeInDir({
                PATH_TO_DIR: `${PATH_TO_DIR}/${file.name}`
            })
        } else {
            if (fileTreeMap[PATH_TO_DIR]) {
                fileTreeMap[PATH_TO_DIR].push(file.name);
            } else {
                fileTreeMap[PATH_TO_DIR] = [file.name];
            }
        }
    }
}