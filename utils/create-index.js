const fs = require('fs');
const { promisify } = require('util');
const writeFile = promisify(fs.writeFile);
const path = require('path');
const { parseExportedDataAsEs5 } = require('./es5');
const { parseExportedDataAsEs6 } = require('./es6');
const getExportedData = require('./get-exported-data')
const { getFiles } = require('./get-files')

async function createIndexFileInDir(PATH_TO_DIR, VERSION, files = null, PATH_TO_OUTPUT_DIR = null) {

    if (!files) {
        files = await getFiles(PATH_TO_DIR);
        files = files.map(file => file.name);
    }

    if (!PATH_TO_OUTPUT_DIR) {
        PATH_TO_OUTPUT_DIR = PATH_TO_DIR;
    }


    let exportedData = await getExportedData(files, PATH_TO_DIR);
    let data = null;
    if (VERSION === 'es5') {
        data = parseExportedDataAsEs5(exportedData)
    } else {
        data = parseExportedDataAsEs6(exportedData)
    }
    return await createIndexFile(data, PATH_TO_OUTPUT_DIR);
}

function createIndexFile(data, PATH_TO_DIR) {
    return writeFile(path.join(PATH_TO_DIR, 'index.js'), data, 'utf-8');
}

async function createMasterIndexFile(PATH_TO_DIR, VERSION, fileTreeMap) {
    let n = PATH_TO_DIR.split("/").length;
    let exportedData = []

    for (let pathToDir in fileTreeMap) {
        let files = ['index.js']
        let d = await getExportedData(files, pathToDir);

        exportedData.push({
            ...d[0],
            source: `"./${pathToDir.split("/").slice(n).join("/")}"`
        });
    }

    let data = null;
    if (VERSION === 'es5') {
        data = parseExportedDataAsEs5(exportedData)
    } else {
        data = parseExportedDataAsEs6(exportedData)
    }

    await createIndexFile(data, PATH_TO_DIR)
}

module.exports = {
    createIndexFileInDir,
    createMasterIndexFile,

}