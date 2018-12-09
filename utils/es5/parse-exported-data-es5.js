let importStatementsUsed = {}
let importStatements = [];

function parseExportedData(data) {
    data = data.filter(({ version }) => version === 'es5');
    data.forEach(({ ExportDefaultDeclaration, ExportNamedDeclaration, source }) => {

        if (ExportDefaultDeclaration) {
            let importStatement = buildImportStatement(checkImport(ExportDefaultDeclaration), source);
            importStatements.push(importStatement)
        } else if (ExportNamedDeclaration.length > 0) {
            let importStatement = buildImportStatement(
                `{ ${checkImportArray(ExportNamedDeclaration).join(', ')} }`,
                source
            )
            importStatements.push(importStatement);
        }
    })
    return buildResponse()
}

const buildImportStatement = (name, source) => `const ${name} = require(${source});`

const buildExportStatement = (exportStatements) => {
    let response = "module.exports = {\n"
    Object.keys(exportStatements).forEach(exportItem => response += ` ${exportItem},\n`);
    response += "}"
    return response;
}

const buildResponse = () => {
    let response = importStatements.join("\n");
    response += "\n\n\n"
    response += buildExportStatement(importStatementsUsed);
    return response;
}

const checkImport = (importDefaultName) => {
    if (importStatementsUsed[importDefaultName]) {
        let newImportDefaultName = getNextIndex(importDefaultName);
        let displayName = `default as ${newImportDefaultName}`;
        importStatementsUsed[newImportDefaultName] = displayName;
        return [displayName]
    }

    importStatementsUsed[importDefaultName] = importDefaultName;
    return importDefaultName
}

const checkImportArray = (importNames) => {
    return importNames.map(name => {
        if (importStatementsUsed[name]) {
            let newName = getNextIndex(name)
            let displayName = `${name} as ${newName}`
            importStatementsUsed[newName] = newName
            return displayName
        }
        importStatementsUsed[name] = name
        return name
    })
}

const getNextIndex = (name) => {
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