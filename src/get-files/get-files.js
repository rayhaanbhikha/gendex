const fs = require('fs');
const { promisify } = require('util');
const readDir = promisify(fs.readdir);

let options = {
    withFileTypes: true,
    encoding: "utf-8"
}

/**
 * 
 * @param {string} dir - path to directory
 * @param {object} [filterOptions] - filterOptions
 * @param {boolean} filterOptions.excludeFolders - exclude folders
 */

async function getFiles(dir, filterOptions = {}) {
    try {
        let files = await readDir(dir, options);

        files = filterByFilesAndFolders(files);

        if (filterOptions.excludeFolders) files = filterByFilesOnly(files);

        return files;

    } catch (error) {
        console.log(error.message);
    }
}

let generalFileExclusions = ['index.js', 'index.jsx']
let regExExclusions = RegExp(/test/);

function filterByFilesAndFolders(files) {
    return files.filter(file =>
        (
            RegExp("(.js|.jsx)$").test(file.name)
            || file.isDirectory()
        )
        && generalFileExclusions.indexOf(file.name) === -1 // exclude files listed in 'general exclusions'
        && regExExclusions.test(file.name) === false // exclude test files
    )
}

function filterByFilesOnly(files) {
    return files.filter(file => !file.isDirectory())
}

module.exports = getFiles

