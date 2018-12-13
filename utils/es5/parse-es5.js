const { extractCode } = require('../shared-services')


const getExports = (pathToFile) => {

    let fileName = pathToFile.split("/").reverse()[0]

    let ExportDefaultDeclaration = null,
        ExportNamedDeclaration = [];



    /**
     * 
     * extracting code in es5 return an array of nodes 
     *  where the export types are 'expression statements'
     * 
     */

    let code = extractCode(pathToFile);

    let nodesOfInterest = code.filter(node =>
        node.type == 'ExpressionStatement'
        && node.expression.type === 'AssignmentExpression'
    );

    for (let nodeIndex in nodesOfInterest) {
        let node = nodesOfInterest[nodeIndex];

        let { object, property } = node.expression.left
        let key = object.name
        let keyName = property.name


        if (key === 'exports') {
            ExportNamedDeclaration.push(keyName);
        } else if (key === 'module') {
            ExportNamedDeclaration = [] // any named exports get rid of them as module overrides them.


            // check if module.exports is an object
            let valueObject = node.expression.right;
            if (valueObject.type === 'ObjectExpression' && valueObject.properties.length > 0) { // is an object which is not empty.
                valueObject.properties.forEach(node => {
                    ExportNamedDeclaration.push(node.key.name);
                })
                break;
            }

            ExportDefaultDeclaration = sanitizeFileName(fileName);
            break;
        }
    }

    return {
        ExportDefaultDeclaration,
        ExportNamedDeclaration
    }
}

const sanitizeFileName = (fileName = "A") => {
    fileName = fileName.replace(/(.js|.jsx)$/g, '');
    fileName = fileName.split(/[-._]/)
    fileName = fileName.reduce(reducer);
    return fileName
}

let reducer = (a, b) => {
    return a + b.substring(0, 1).toUpperCase() + b.substring(1)
}

module.exports = getExports