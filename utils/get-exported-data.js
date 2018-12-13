const fs = require('fs');
const { promisify } = require('util');
const readFile = promisify(fs.readFile);
const path = require('path');
const checkJsVersion = require('./check-version')
const { parseEs5 } = require('./es5')
const { parseEs6 } = require('./es6')

async function getExportedData(files, PATH_TO_DIR, VERSION) {
    let exportedData = [];
    for (let file in files) {
        let fileName = files[file];
        console.log(readFromFile(PATH_TO_DIR, fileName))
    }
    return exportedData
}


async function readFromFile(directory, fileName) {
    let fileCode = await readFile(path.join(directory, fileName), "utf-8");

    let version = checkJsVersion(fileCode);

    if(version == 'es5') {
        exportedData.push(parseEs5(fileCode, fileName, version));
    } else if (version == 'es6') {
        exportedData.push(parseEs6(fileCode, fileName, version));
    }
}
function getFileName(PATH_TO_DIR) {
    let newPath = PATH_TO_DIR.split("/").reverse();
    let fileName = newPath.shift();
    return fileName
}
module.exports = getExportedData;