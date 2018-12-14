const {extractExports, getFileName} = require('../shared-services')

const getExports = (fileCode, fileName, version) => {

    /**
     * 
     * extracting code in es6 return an array of nodes 
     *  where the export types are either 'ExportNamedDeclaration or Export default Declaration"
     * 
     */

    let code = extractExports(fileCode);

    let fileExports = {
        ExportDefaultDeclaration: null,
        ExportNamedDeclaration: [],
        source: `"./${fileName}"`,
        version
    }

    code.filter(node => {
        switch (node.type) {
            case 'ExportDefaultDeclaration':
                fileExports[node.type] = getFileName(fileName);
                break;
            case 'ExportNamedDeclaration':
                fileExports[node.type].push(...getNameForExportNamedDeclaration(node));
                break;
        }
    })

    return fileExports;
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