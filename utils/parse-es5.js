const getExports = (pathToFile) => {
    let fileExports = require(pathToFile);
    let fileName = pathToFile.split("/").reverse()[0]

    switch  (typeof fileExports) {
        case 'string':
        case 'function':
            return sanitizeFileName(fileName);
        case 'object':
            return fileExports;
    }
}

const sanitizeFileName = (fileName="A") => {
    fileName = fileName.replace(/(.js|.jsx)$/g, '');
    fileName = fileName.split(/[-._]/)
    fileName = fileName.reduce(reducer);
    return fileName
}

let reducer = (a, b) => {
    return a+b.substring(0,1).toUpperCase() + b.substring(1)
}

module.exports = getExports