const fs = require('fs');
const { promisify } = require('util');
const readFile = promisify(fs.readFile);
const path = require('path');
const { checkJsVersion, getFiles, parseEs6, parseEs5, parseExportedData} = require('./utils');


let DIRECTORY = 'test'
let PATH_TO_DIR = path.join(__dirname, DIRECTORY);

(async () => {
    let files = await getFiles(PATH_TO_DIR);
    let exportedData = await getExportedData(files);
    console.log(parseExportedData(exportedData));
})();


let file = "example.txt";
let file1 = "example-es5.js";
let file2 = "example-es6.js";
let file3 = "example-es7.jsx";

async function getExportedData(files) {
    let exportedData = [];
    for (let file in files) {
        let fileName = files[file];
        let pathToFile = path.join(PATH_TO_DIR, fileName);
        let response = await readFromFile(pathToFile);
        response.source = `"./${fileName}"`;
        exportedData.push(response);
    }
    return exportedData
}


function readFromFile(pathToFile) {
    return readFile(pathToFile, "utf-8")
        .then(fileData => checkJsVersion(fileData))
        .then(version => {
            if (version == 'es5') {
                return parseEs5(pathToFile)
            } else {
                return parseEs6(pathToFile)
            }
        })
        .catch(error => error.message);
}

