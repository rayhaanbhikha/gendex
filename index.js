
const path = require('path');
const { getFiles, parseExportedData, getExportedData, createIndexFile } = require('./utils');


let DIRECTORY = 'test'
let PATH_TO_DIR = path.join(__dirname, DIRECTORY);

(async () => {
    try {
        let files = await getFiles(PATH_TO_DIR);
        let exportedData = await getExportedData(files, PATH_TO_DIR);
        let data = parseExportedData(exportedData)
        await createIndexFile(data, PATH_TO_DIR);
    } catch (error) {
        console.log(error);
    }
})();





