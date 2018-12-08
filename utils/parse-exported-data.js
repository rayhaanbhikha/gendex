const buildImportStatement = (name, source) => `import ${name} from ${source}`

let importStatementsUsed = {}
let importStatements = [];

function parseExportedData(data) {

    data.forEach(({ ExportDefaultDeclaration, ExportNamedDeclaration, source }, index) => {
        if(ExportDefaultDeclaration && ExportNamedDeclaration.length > 0) {


            let importDisplayName = checkImport(ExportDefaultDeclaration)
            let importStatement = null;


            if(Array.isArray(importDisplayName)) {

               let importByNames = checkImportArray(ExportNamedDeclaration)
                importByNames.unshift(importDisplayName[0]);
                importByNames = importByNames.join(", ");


                importStatement = buildImportStatement(
                    `{${importByNames}}`,
                    source
                )
            } else {
                importStatement = buildImportStatement(
                    `${importDisplayName}, {${checkImportArray(ExportNamedDeclaration).join(', ')} }`,
                    source
                )
            }

            importStatements.push(importStatement)
        } else if(ExportDefaultDeclaration) {
            let importStatement = buildImportStatement(checkImport(ExportDefaultDeclaration), source);
            importStatements.push(importStatement)
        }
    })

    return buildResponse()
}

const buildResponse = () => {
    let response = importStatements.join("\n");
    response += "\n\n\n"
    response += "export {\n"
    Object.keys(importStatementsUsed).forEach(exportItem => response += ` ${exportItem},\n`);
    response += "}"
    return response;
}

const checkImport = (importDefaultName) => {
    if(importStatementsUsed[importDefaultName]) {
        let newImportDefaultName = `${importDefaultName}${importDefaultName.length}`;
        let displayName = `default as ${newImportDefaultName}`;
        importStatementsUsed[newImportDefaultName] = displayName;
        return [displayName]
    }

    importStatementsUsed[importDefaultName] = importDefaultName;
    return importDefaultName
}

const checkImportArray = (importNames) => {
    return importNames.map(name => {
        if(importStatementsUsed[name]) {
            let newName = `${name}${name.length}`
            let displayName = `${name} as ${newName}`
            importStatementsUsed[newName] = newName
            return displayName
        }
        importStatementsUsed[name] = name
        return name
    })
}

module.exports = parseExportedData;