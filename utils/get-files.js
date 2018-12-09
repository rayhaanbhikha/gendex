const fs = require('fs');
const { promisify } = require('util');
const readDir = promisify(fs.readdir);

// module.exports = dir => {
//     return readDir(dir, "utf-8")
//     .then(files => files.filter(file => RegExp("(.js|.jsx)$").test(file)))
//     .then(files => files.filter(file => file != "index.js"))
//     .catch(error => error.message)
// }

let options = {
    withFileTypes: true,
    encoding: "utf-8"
}

module.exports = dir => {
    return readDir(dir, options)
        .then(files => files.filter(file =>
            RegExp("(.js|.jsx)$").test(file.name) || file.isDirectory()
        ))
        .then(files => files.filter(file => file.name != "index.js"))
        .catch(error => error.message)
}

