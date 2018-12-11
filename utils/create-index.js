const fs = require('fs');
const { promisify } = require('util');
const writeFile = promisify(fs.writeFile);
const path = require('path');
const { parseExportedDataAsEs5 } = require('./es5');
const { parseExportedDataAsEs6 } = require('./es6');
const getExportedData = require('./get-exported-data')
const generateNodeTree = require('./generate-file-node-tree');

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



async function generateIndexFile(PATH_TO_DIR, VERSION) {

    let fileNodeTree = await generateNodeTree(PATH_TO_DIR);


    // 3. create index at each node.
    let fileNodeTreeLength = fileNodeTree.length;
    for (let pathToDirNode in fileNodeTree) {
        let {files, additionalExportData} = fileNodeTree[pathToDirNode];


        try {
            let data = await createIndexFileInDir(pathToDirNode, VERSION, files, additionalExportData);

            if (pathToDirNode != PATH_TO_DIR) {
                // 4. take generated exported data and pass to parent directory.
                let { fileName, parentDir: parentDirNode } = getParentDirAndFileName(pathToDirNode)
                let newExportedData = mergeExportData(data, fileName, VERSION);

                // 5. Pass newExportData to parent node.  
                fileNodeTree[parentDirNode].additionalExportData.push(newExportedData);
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