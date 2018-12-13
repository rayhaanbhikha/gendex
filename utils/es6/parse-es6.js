const {extractCode} = require('../shared-services')

const getExports = (pathToFile) => {

    /**
     * 
     * extracting code in es6 return an array of nodes 
     *  where the export types are either 'ExportNamedDeclaration or Export default Declaration"
     * 
     */

    let code = extractCode(pathToFile);

    let fileExports = {
        ExportDefaultDeclaration: null,
        ExportNamedDeclaration: []
    }

    code.filter(node => {
        switch (node.type) {
            case 'ExportDefaultDeclaration':
                fileExports[node.type] = getNameForExportDefaultDeclartion(node);
                break;
            case 'ExportNamedDeclaration':
                fileExports[node.type].push(...getNameForExportNamedDeclaration(node));
                break;
        }
    })

    return fileExports;
}



const getNameForExportDefaultDeclartion = node => {

    let { declaration } = node;
    switch (declaration.type) {
        case 'CallExpression':
            // FIXME: problem as you could have more arguments
            return declaration.arguments[0].name;
        case 'ClassDeclaration': // export default class
        case 'FunctionDeclaration': // export default function a()
            return declaration.id.name;
    }
    return declaration.name
}

const getNameForExportNamedDeclaration = node => {
    let { specifiers, declaration } = node

    if (specifiers.length > 0) { // specifies means there are more.
        /**
         * check to see if there exists an 
         * export {}
         */
        return specifiers.map(node => node.exported.name);
    } else if (declaration) {
        switch (declaration.type) {
            case 'VariableDeclaration': // export const/let
                return [declaration.declarations[0].id.name];
            case 'ClassDeclaration': // export class
            case 'FunctionDeclaration': // export function a()
                return [declaration.id.name];
        }
    } else {
        return []
    }

}





module.exports = getExports