const buildImportStatement = (name, source) => `import ${name} from ${source}`

let importStatementsUsed = {}
let importStatements = [];

function parseExportedData(data) {

    data.forEach(({ ExportDefaultDeclaration, ExportNamedDeclaration, source }, index) => {
        if(ExportDefaultDeclaration && ExportNamedDeclaration.length > 0) {
            let importStatement = buildImportStatement(
                `${checkImport(ExportDefaultDeclaration)}, { ${checkImportArray(ExportNamedDeclaration).join(', ')} }`,
                source
            )
            importStatements.push(importStatement)
        } else if(ExportDefaultDeclaration) {
            let importStatement = buildImportStatement(checkImport(ExportDefaultDeclaration), source);
            importStatements.push(importStatement)
        }
    })


    return {
        importStatements,
        exportStatement: importStatementsUsed
    }
}

const checkImport = (importDefaultName) => {
    if(importStatementsUsed[importDefaultName]) {
        let newImportDefaultName = `${importDefaultName} as ${importDefaultName}${importDefaultName.length}`;
        importStatementsUsed[`${importDefaultName}${importDefaultName.length}`] = newImportDefaultName;
        return newImportDefaultName
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