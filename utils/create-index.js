const fs = require('fs');
const { promisify } = require('util');
const writeFile = promisify(fs.writeFile);
const path = require('path');
const { parseExportedDataAsEs5 } = require('./es5');
const { parseExportedDataAsEs6 } = require('./es6');
const getExportedData = require('./get-exported-data')
const { getFiles } = require('./get-files')

async function createIndexFileInDir(
    PATH_TO_DIR, VERSION, collectedData) {


    let files = await getFiles(PATH_TO_DIR); // get files + folders in directory.

    // loop through files, recursively calling this function if there is a nested directory.
    files.forEach(async (file) => {
        if (file.isDirectory()) {
            await createIndexFileInDir(
                `${PATH_TO_DIR}/${file.name}`,
                VERSION,
                collectedData,
            )
        }
    });

    // if in file list there is a directory remove and keep only file names.
    files = files.filter(file => !file.isDirectory()).map(file => file.name);

    console.log(files);
    // let exportedData = await getExportedData(files, PATH_TO_DIR);
    // collectedData.push(...exportedData);

    // let data = null;
    // if (VERSION === 'es5') {
    //     data = parseExportedDataAsEs5(exportedData)
    // } else {
    //     data = parseExportedDataAsEs6(exportedData)
    // }
    // return await createIndexFile(data, PATH_TO_DIR);
}

async function generateIndexFile(PATH_TO_DIR, VERSION) {
    let collectedData = []
    await createIndexFileInDir(PATH_TO_DIR, VERSION, collectedData);

    // let data = null;
    // if (VERSION === 'es5') {
    //     data = parseExportedDataAsEs5(collectedData)
    // } else {
    //     data = parseExportedDataAsEs6(collectedData)
    // }

    // return await createIndexFile(data, PATH_TO_DIR);
}

function createIndexFile(data, PATH_TO_DIR) {
    return writeFile(path.join(PATH_TO_DIR, 'index.js'), data, 'utf-8');
}

module.exports = generateIndexFile;