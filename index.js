const fs = require('fs');
const {promisify} = require('util');
const readFile = promisify(fs.readFile);
const path = require('path');
const {checkJsVersion, getFiles, parseEs6, parseEs5}= require('./utils');



let PATH_TO_DIR = path.join(__dirname);

// (async () => {
//     let files = await getFiles(PATH_TO_DIR);
//     console.log(files);


// })();


let file = "example.txt";
let file1 = "example-es5.js";
let file2 = "example-es6.js";
let file3 = "example-es7.jsx";


let pathToFile = path.join(__dirname, file1);

// console.log(parseEs6(pathToFile))
console.log(parseEs5(pathToFile))

// readFile(pathToFile, "utf-8")
//     .then(fileData => checkJsVersion(fileData))
//     .then(version => {

//         if(version == 'es5') {
//             console.log(require(pathToFile))
//             console.log(typeof require(pathToFile))
//         } else {
//             console.log(`version: ${version}, `, pathToFile)
//         }
//     })
//     .catch(error => console.log("Error: ", error.message));

