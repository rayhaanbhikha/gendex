const { transformSync } = require("@babel/core/lib/transform")
const fs = require('fs');

const getExports = (pathToFile) => {

    let code = fs.readFileSync(pathToFile, 'utf-8');
    const { ast } = transformSync(code, { ast: true, code: false });

    let { body } = ast.program

    let fileExports = {
        ExportDefaultDeclaration: null,
        ExportNamedDeclaration: []
    }

    body.filter(node => {
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
    return node.declaration.name
}

const getNameForExportNamedDeclaration = node => {
    let { specifiers, declaration } = node

    if (specifiers.length > 0) {

        /**
         * check to see if there exists an 
         * export {}
         */
        return node.specifiers.map(node => node.exported.name);
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