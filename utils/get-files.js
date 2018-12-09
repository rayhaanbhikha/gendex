const fs = require('fs');
const { promisify } = require('util');
const readDir = promisify(fs.readdir);

let options = {
    withFileTypes: true,
    encoding: "utf-8"
}

function getFiles(dir) {
    return readDir(dir, options)
        .then(files => files.filter(file =>
            RegExp("(.js|.jsx)$").test(file.name) || file.isDirectory()
        ))
        .then(files => files.filter(file => file.name != "index.js"))
        .catch(error => error.message)
}

function getIndexFile(dir) {
    return readDir(dir, options)
        .then(files => files.filter(file =>
            RegExp("^(index.js)$").test(file.name)
        ))
        .then(files => files.map(file => file.name))
        .catch(error => error.message)
}

module.exports = {
    getFiles,
    getIndexFile
}

