const fs = require('fs');
const {promisify} = require('util');
const readDir = promisify(fs.readdir);

module.exports = dir => {
    return readDir(dir, "utf-8")
    .then(files => files.filter(file => RegExp("(.js|.jsx)$").test(file)))
    .then(files => files.filter(file => file != "index.js"))
    .catch(error => error.message)
}

