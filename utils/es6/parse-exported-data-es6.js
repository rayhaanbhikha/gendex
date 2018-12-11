function parseExportedData(data) {
    let importStatementsUsed = {}
    let importStatements = [];
    
    data = data.filter(file => file.version === 'es6');

    data.forEach(({ ExportDefaultDeclaration, ExportNamedDeclaration, source }) => {

        if (ExportDefaultDeclaration && ExportNamedDeclaration.length > 0) {


            let importDisplayName = checkImport(ExportDefaultDeclaration, importStatementsUsed)
            let importStatement = null;


            if (Array.isArray(importDisplayName)) {

                let importByNames = checkImportArray(ExportNamedDeclaration, importStatementsUsed)
                importByNames.unshift(importDisplayName[0]);
                importByNames = importByNames.join(", ");


                importStatement = buildImportStatement(
                    `{${importByNames}}`,
                    source
                )
            } else {
                importStatement = buildImportStatement(
                    `${importDisplayName}, {${checkImportArray(ExportNamedDeclaration, importStatementsUsed).join(', ')} }`,
                    source
                )
            }

            importStatements.push(importStatement)
        } else if (ExportDefaultDeclaration) {
            let importStatement = buildImportStatement(checkImport(ExportDefaultDeclaration, importStatementsUsed), source);
            importStatements.push(importStatement)
        } else if (ExportNamedDeclaration.length > 0) {
            let importStatement = buildImportStatement(
                `{ ${checkImportArray(ExportNamedDeclaration, importStatementsUsed).join(', ')} }`,
                source
            )
            importStatements.push(importStatement);
        }
    })
    return buildResponse(importStatements, importStatementsUsed)
}

const buildImportStatement = (name, source) => `import ${name} from ${source}`

const buildExportStatement = (exportStatements) => {
    let response = "export {\n"
    Object.keys(exportStatements).forEach(exportItem => response += `\t${exportItem},\n`);
    response += "}"
    return response;
}

const buildResponse = (importStatements, importStatementsUsed) => {
    let response = importStatements.join("\n");
    response += "\n\n\n"
    response += buildExportStatement(importStatementsUsed);
    return response;
}

const checkImport = (importDefaultName, importStatementsUsed) => {
    if (importStatementsUsed[importDefaultName]) {
        let newImportDefaultName = getNextIndex(importDefaultName, importStatementsUsed);
        let displayName = `default as ${newImportDefaultName}`;
        importStatementsUsed[newImportDefaultName] = displayName;
        return [displayName]
    }

    importStatementsUsed[importDefaultName] = importDefaultName;
    return importDefaultName
}

const checkImportArray = (importNames, importStatementsUsed) => {
    return importNames.map(name => {
        if (importStatementsUsed[name]) {
            let newName = getNextIndex(name, importStatementsUsed)
            let displayName = `${name} as ${newName}`
            importStatementsUsed[newName] = newName
            return displayName
        }
        importStatementsUsed[name] = name
        return name
    })
}

const getNextIndex = (name, importStatementsUsed) => {
    let importStatementsUsedArray = Object.getOwnPropertyNames(importStatementsUsed);

    let r = `^${name}\\_*\\d*$`
    let regex = RegExp(r, 'g');


    let matches = importStatementsUsedArray.filter(importName => importName.search(regex) > -1)

    let lastIndex = matches.reverse()[0]

    let newR = /(\w*_)(\d*)$/g
    let regexResult = newR.exec(lastIndex);

    let newIndex = regexResult ?
        `${regexResult[1]}${Number(regexResult[2]) + 1}`
        :
        `${lastIndex}_1`;

    return newIndex
}

module.exports = parseExportedData;