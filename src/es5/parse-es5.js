const { extractExports, getFileName } = require('../shared-services')


const getExports = (fileCode, fileName, version) => {


    let ExportDefaultDeclaration = null,
        ExportNamedDeclaration = [];

    /**
     * 
     * extracting code in es5 return an array of nodes 
     *  where the export types are 'expression statements'
     * 
     */

    let code = extractExports(fileCode);

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

            ExportDefaultDeclaration = getFileName(fileName);
            break;
        }
    }

    return {
        ExportDefaultDeclaration,
        ExportNamedDeclaration,
        source: `"./${fileName}"`,
        version
    }
}

module.exports = getExports