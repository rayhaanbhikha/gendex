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


        return files.map(file => file.name);

    } catch (error) {
        console.log(error.message);
    }
}

function filterByFilesAndFolders(files) {
    return files.filter(file =>
        RegExp("(.js|.jsx)$").test(file.name) || file.isDirectory()
    )
}

function filterByFilesOnly(files) {
    return files.filter(file =>
        RegExp("(.js|.jsx)$").test(file.name) && file.name != "index.js"
    )
}

function filterByIndex(files) {
    return files.filter(file => file.name == "index.js");
}

module.exports = {
    getFiles,
}

