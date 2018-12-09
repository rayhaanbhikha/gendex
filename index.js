const path = require('path');
const {
    getFiles,
    getExportedData,
    parseExportedDataAsEs6,
    createIndexFile
} = require('./utils');


let DIRECTORY = 'test'
let PATH_TO_DIR = path.join(__dirname, DIRECTORY);
let VERSION = (process.argv[2] && process.argv[2] === 'es5') ? 'es5' : 'es6';

(async () => {
    try {
        let files = await getFiles(PATH_TO_DIR);
        let exportedData = await getExportedData(files, PATH_TO_DIR);
        let data = null;
        if (VERSION === 'es5') {
            data = parseExportedDataAsEs5(exportedData)
        } else {
            data = parseExportedDataAsEs6(exportedData)
        }
        console.log(data);
        // await createIndexFile(data, PATH_TO_DIR);
    } catch (error) {
        console.log(error);
    }
})();
