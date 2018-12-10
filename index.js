const path = require('path');
const {
    generateIndexFile,
    getFiles,
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

let fileTreeMap = {};

(async () => {
    try {
        await generateIndexFile(
            config.PATH_TO_DIR, config.VERSION)

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