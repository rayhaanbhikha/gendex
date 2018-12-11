const fs = require('fs');
const { promisify } = require('util');
const readFile = promisify(fs.readFile);
const path = require('path');
const checkJsVersion = require('./check-version')
const { parseEs5 } = require('./es5')
const { parseEs6 } = require('./es6')

async function getExportedData(files, PATH_TO_DIR, VERSION) {
    console.log(files, PATH_TO_DIR);
    let exportedData = [];
    for (let file in files) {
        let fileName = files[file];
        let pathToFile = path.join(PATH_TO_DIR, fileName);

        let response = await readFromFile(pathToFile, VERSION);

        response.source = `"./${fileName}"`;

        exportedData.push(response);
    }
    return exportedData
}


function readFromFile(pathToFile, VERSION) {
    return readFile(pathToFile, "utf-8")
        .then(fileData => checkJsVersion(fileData))
        .then(version => {
            if(version == VERSION) {
                if (version == 'es5') {
                    return {
                        ...parseEs5(pathToFile),
                        version: 'es5'
                    }
                } else {
                    return {
                        ...parseEs6(pathToFile),
                        version: 'es6'
                    }
                }
            } else {
                throw new Error(`file ${pathToFile} has version: ${version}, \nyou requested an 'index.js' file with version: ${VERSION}`)
            }
        });
}

module.exports = getExportedData;