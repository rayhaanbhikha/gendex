const { getFiles } = require('./get-files')

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

module.exports = async (PATH_TO_DIR) => {
    let fileNodeTree = []
    // 1. generate node tree
    await generateNodes(PATH_TO_DIR, fileNodeTree, 1);

    // 2. sort nodes in reverse order, with most deep level node as the first item in array.
    fileNodeTree = fileNodeTree.sort(compareDepth);

    // 3. change structure of filenodetree so we have keys which are paths and values which are files.
    let keyValueNodeStructure = {};

    fileNodeTree.forEach(({files, pathToDir}) => keyValueNodeStructure[pathToDir] = { files, additionalExportData: []});

    return keyValueNodeStructure;
}