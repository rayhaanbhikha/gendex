const fs = require('fs');
const { promisify } = require('util');
const readDir = promisify(fs.readdir);

let options = {
    withFileTypes: true,
    encoding: "utf-8"
}

/**
 * 
 * @param {*} dir 
 * @param {* Object} filterOptions - {
 *  filters: []
 * }
 */
async function getFiles(dir, filterOptions) {
    try {
        let files = await readDir(dir, options);

        //now apply filters.
        if (!filterOptions) { // only files
            files = filterByFilesOnly(files);
        } else {
            if (filterOptions.include === 'index') { // only index file
                files = filterByIndex(files);
            }

            if (filterOptions.include === 'folders') {// return files and folders
                files = filterByFilesAndFolders(files);
            }
        }

        // return files.map(file => file.name);

        return files;

    } catch (error) {
        console.log(error.message);
    }
}

function filterByFilesAndFolders(files) {
    return files.filter(file =>
        RegExp("(.js|.jsx)$").test(file.name) || file.isDirectory()
    )
}

let exclude = ['__snapshots__']

function filterByFilesOnly(files) {
    return files.filter(file =>
        (RegExp("(.js|.jsx)$").test(file.name) || file.isDirectory())
        && file.name != "index.js" && file.name.search(/.test.jsx/) === -1
        && exclude.indexOf(file.name) === -1
    )
}

function filterByIndex(files) {
    return files.filter(file => file.name == "index.js");
}

module.exports = getFiles

