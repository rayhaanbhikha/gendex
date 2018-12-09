const path = require('path');
const {
    getFiles,
    getExportedData,
    parseExportedDataAsEs6,
    parseExportedDataAsEs5,
    createIndexFile
} = require('./utils');

let config = {
    DEFAULT_VERSION: 'es6',
    DIRECTORY: 'test',
    get PATH_TO_DIR() {
        return path.join(__dirname, this.DIRECTORY)
    },
    get VERSION() {
        return (process.argv[2] && process.argv[2] === 'es5') ? 'es5' : this.DEFAULT_VERSION
    }
};

(async () => {
    try {
        let files = await getFiles(config.PATH_TO_DIR);
        let exportedData = await getExportedData(files, config.PATH_TO_DIR);
        let data = null;
        if (config.VERSION === 'es5') {
            data = parseExportedDataAsEs5(exportedData)
        } else {
            data = parseExportedDataAsEs6(exportedData)
        }
        await createIndexFile(data, config.PATH_TO_DIR);
    } catch (error) {
        console.log(error);
    }
})();
