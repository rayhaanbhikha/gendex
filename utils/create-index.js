const fs = require('fs');
const { promisify } = require('util');
const writeFile = promisify(fs.writeFile);
const path = require('path');
const { parseExportedDataAsEs5 } = require('./es5');
const { parseExportedDataAsEs6 } = require('./es6');
const getExportedData = require('./get-exported-data')
const getFiles = require('./get-files')

async function createIndexFileInDir(PATH_TO_DIR, VERSION, files) {
    let exportedData = await getExportedData(files, PATH_TO_DIR);
    let data = null;
    if (VERSION === 'es5') {
        data = parseExportedDataAsEs5(exportedData)
    } else {
        data = parseExportedDataAsEs6(exportedData)
    }
    return await createIndexFile(data, PATH_TO_DIR);
}

function createIndexFile(data, PATH_TO_DIR) {
    return writeFile(path.join(PATH_TO_DIR, 'index.js'), data, 'utf-8');
}

module.exports = createIndexFileInDir