const path = require('path');
const getExports = (pathToFile) => {

    let exportsInFile = require(path.resolve(pathToFile));
    let fileName = pathToFile.split("/").reverse()[0]

    let fileExports = {
        ExportDefaultDeclaration: null,
        ExportNamedDeclaration: []
    }

    switch (typeof exportsInFile) {
        case 'string':
        case 'function':
            fileExports.ExportDefaultDeclaration = sanitizeFileName(fileName);
            break;
        case 'object':
            for (let exportName in exportsInFile) {
                fileExports.ExportNamedDeclaration.push(exportName)
            }
            break;
    }
    return fileExports
}

const sanitizeFileName = (fileName = "A") => {
    fileName = fileName.replace(/(.js|.jsx)$/g, '');
    fileName = fileName.split(/[-._]/)
    fileName = fileName.reduce(reducer);
    return fileName
}

let reducer = (a, b) => {
    return a + b.substring(0, 1).toUpperCase() + b.substring(1)
}

module.exports = getExports