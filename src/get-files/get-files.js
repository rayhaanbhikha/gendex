const fs = require('fs');
const { promisify } = require('util');
const {nodeVersion} = require("../shared-services")
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

        if(nodeVersion >= 10.10) {
            files = filterByFilesAndFolders(files);
        } else {
            files = filterByFilesAndFoldersV8(dir, files);
        }

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

function filterByFilesAndFoldersV8(dir, files) {
    return files.map(file => {

        // exclude files listed in 'general exclusions'
        // exclude test files)
        if( generalFileExclusions.indexOf(file) === -1  && regExExclusions.test(file) === false) {

            // the return object ensures other functions consuming this function can check if the file is a directory.
            // allows backwards compatibility between (fs.dirent >= v10.10.0) and (fs.statsync < v10.10.0)
            if(RegExp("(.js|.jsx)$").test(file)) {
                return {
                    name: file,
                    isDirectory: () => false
                }
            } else if(fs.statSync(`${dir}/${file}`).isDirectory()) {
                return {
                    name: file,
                    isDirectory: () => true
                }
            }
        }
    }).filter(fileObject => fileObject);
}

function filterByFilesOnly(files) {
    return files.filter(file => !file.isDirectory())
}

module.exports = getFiles

