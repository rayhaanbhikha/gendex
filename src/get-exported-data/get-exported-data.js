const fs = require('fs');
const { promisify } = require('util');
const readFile = promisify(fs.readFile);
const path = require('path');
const { checkVersion: checkJsVersion } = require('../check-version')
const { parseEs5 } = require('../es5')
const { parseEs6 } = require('../es6')

async function getExportedData(files, PATH_TO_DIR, VERSION) {
    let exportedData = [];
    for (let file in files) {
        let fileName = files[file];
        let exportedDataFromFile = await readFromFile(PATH_TO_DIR, fileName);
        if (!exportedDataFromFile) continue;

        exportedData.push(exportedDataFromFile);
    }
    return exportedData
}


async function readFromFile(directory, fileName) {
    let fileCode = await readFile(path.join(directory, fileName), "utf-8");
    let version = checkJsVersion(fileCode, fileName);
    if (!version) return null;

    if (version == 'es5') {
        return parseEs5(fileCode, fileName, version);
    } else if (version == 'es6') {
        return parseEs6(fileCode, fileName, version);
    }
}

module.exports = getExportedData;