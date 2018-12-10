const fs = require('fs');
const { promisify } = require('util');
const writeFile = promisify(fs.writeFile);
const path = require('path');
const { parseExportedDataAsEs5 } = require('./es5');
const { parseExportedDataAsEs6 } = require('./es6');
const getExportedData = require('./get-exported-data')
const { getFiles } = require('./get-files')

async function createIndexFileInDir(
    PATH_TO_DIR, VERSION, files, additionalExportData = null) {


    let exportedData = await getExportedData(files, PATH_TO_DIR);
    if (additionalExportData) {
        exportedData.push(...additionalExportData);
    }
    let data = null;
    if (VERSION === 'es5') {
        data = parseExportedDataAsEs5(exportedData)
    } else {
        data = parseExportedDataAsEs6(exportedData)
    }
    await createIndexFile(data, PATH_TO_DIR);
    return exportedData; // this data is what is used in the index.js file - we used this to put in the parent directory.
}


async function generateNodes(dir, fileNodeTree) {
    let files = await getFiles(dir); // get files + folders in directory.

    // loop through files, recursively calling this function if there is a nested directory.
    for (let fileIndex in files) {
        let file = files[fileIndex];
        if (file.isDirectory()) {
            await generateNodes(
                `${dir}/${file.name}`,
                fileNodeTree,
            )
        }
    }

    fileNodeTree.push({
        pathToDir: dir,
        files: files.filter(file => !file.isDirectory()).map(file => file.name),
    });
}

function compareDepth(a, b) {
    let aLength = a.pathToDir.split("/").length;
    let bLength = b.pathToDir.split("/").length;

    if (aLength < bLength) return 1;
    return 0
}

async function generateIndexFile(PATH_TO_DIR, VERSION) {

    let fileNodeTree = []
    // 1. generate node tree
    await generateNodes(PATH_TO_DIR, fileNodeTree, 1);

    // 2. sort nodes in reverse order, with most deep level node as the first item in array.
    fileNodeTree = fileNodeTree.sort(compareDepth);


    // 3. create index at each node.
    let fileNodeTreeLength = fileNodeTree.length;
    for (let nodeIndex in fileNodeTree) {
        let { pathToDir, files, additionalExportData } = fileNodeTree[nodeIndex];
        try {
            let data = await createIndexFileInDir(pathToDir, VERSION, files, additionalExportData);

            if (nodeIndex != fileNodeTreeLength - 1) {
                // 4. take generated exported data and pass to parent directory.
                let { fileName, parentDir } = getParentDirAndFileName(pathToDir)
                let newExportedData = mergeExportData(data, fileName, VERSION);
                fileNodeTree = fileNodeTree.map(node => {
                    if (node.pathToDir === parentDir) {
                        if (node.additionalExportData && node.additionalExportData.length > 0) {
                            node.additionalExportData.push(newExportedData);
                        } else {
                            node.additionalExportData = [newExportedData]
                        }
                    }
                    return node
                })
            }

        } catch (error) {
            console.log(error);
        }
    }
}


function mergeExportData(exportedData, fileName, version) {
    let newExportedData = {
        ExportDefaultDeclaration: null,
        ExportNamedDeclaration: [],
        version,
        source: `"./${fileName}"`
    }

    exportedData.forEach(({ ExportDefaultDeclaration, ExportNamedDeclaration }) => {
        if (ExportDefaultDeclaration && ExportNamedDeclaration.length > 0) {
            newExportedData.ExportNamedDeclaration.push(ExportDefaultDeclaration);
            newExportedData.ExportNamedDeclaration.push(...ExportNamedDeclaration);
        } else if (ExportDefaultDeclaration) {
            newExportedData.ExportNamedDeclaration.push(ExportDefaultDeclaration);
        } else if (ExportNamedDeclaration.length > 0) {
            newExportedData.ExportNamedDeclaration.push(...ExportNamedDeclaration);
        }
    })

    return newExportedData;
}



function createIndexFile(data, PATH_TO_DIR) {
    return writeFile(path.join(PATH_TO_DIR, 'index.js'), data, 'utf-8');
}

function getParentDirAndFileName(PATH_TO_DIR) {
    let newPath = PATH_TO_DIR.split("/").reverse();
    let fileName = newPath.shift();
    parentDir = newPath.reverse().join("/");
    return {
        parentDir,
        fileName
    }
}

module.exports = generateIndexFile;