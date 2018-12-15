function parseExportedData(data, version) {
    let importStatements = [];
    let importStatementsUsed = {}

    data.forEach(node => {
        let { ExportDefaultDeclaration, ExportNamedDeclaration, source, version: fileVersion } = node;

        if (version === 'es5' && fileVersion === 'es6') {
            throw new Error(`Cannot create ${version} index.js, as ${source} is ${fileVersion}`);
        }

        // default exports
        if (ExportDefaultDeclaration) {
            let newImport = {
                name: ExportDefaultDeclaration,
                alias: ExportDefaultDeclaration,
                source,
                type: 'default'
            };
            // default statements should be unique as they rely on file name
            importStatements.push(newImport);
        }

        // named exports.
        if (ExportNamedDeclaration) {
            ExportNamedDeclaration.forEach(namedExport => {
                let newImport = getImport({
                    name: namedExport,
                    source,
                    type: 'named',
                }, importStatements);
                importStatements.push(newImport);
            })
        }
    })


    importStatements.forEach(importStatement => {
        switch (importStatement.type) {
            case 'named':
                if (importStatementsUsed[importStatement.source]) {
                    importStatementsUsed[importStatement.source].named.push(importStatement);
                } else {
                    importStatementsUsed[importStatement.source] = {
                        named: [importStatement],
                        default: null
                    }
                }
                break;
            case 'default':
                if (importStatementsUsed[importStatement.source]) {
                    importStatementsUsed[importStatement.source].default = importStatement;
                } else {
                    importStatementsUsed[importStatement.source] = {
                        named: [],
                        default: importStatement
                    }
                }
                break;
        }
    })


    return buildResponse(importStatements, importStatementsUsed, version);

}

const buildResponse = (importStatements, importStatementsUsed, version) => {
    let response = '';

    // build import statments.
    for (let source in importStatementsUsed) {
        let { named: namedImports, default: defaultImport } = importStatementsUsed[source];
        if (version === 'es5') {
            response += buildImportStatementEs5(defaultImport, namedImports, source)
        } else if (version === 'es6') {
            response += buildImportStatementEs6(defaultImport, namedImports, source);
        }
        response += "\n";
    }

    response += "\n\n";
    response += buildExportStatement(importStatements, version);
    return response;
}


const buildExportStatement = (importStatements, version) => {
    let exportStatments = importStatements.map(({ alias }) => alias);

    let response = null;
    if (version == 'es5') {
        response = "module.exports = {\n"
    } else if (version == 'es6') {
        response = "export {\n"
    }
    exportStatments.forEach(exportItem => response += `\t${exportItem},\n`);
    response += "}"
    return response;
}

const buildImportStatementEs5 = (defaultImport, namedImports, source) => {

    if (defaultImport) {
        return `const ${defaultImport.name} = require(${source});`;
    }

    let namedImportsLength = namedImports.length;
    if (namedImportsLength > 0) {
        let importString = `const {`;
        namedImports.forEach(({ name, alias }, index) => {
            if (alias !== name) {
                importString += ` ${name}: ${alias}`
            } else {
                importString += ` ${name}`
            }
            if (index !== namedImportsLength - 1) importString += ',';
        })
        importString += `} = require(${source});`
        return importString;
    }

    return '';
}

const buildImportStatementEs6 = (defaultImport, namedImports, source) => {
    let importString = 'import ';

    if (defaultImport) {
        importString += `${defaultImport.name} `;
    }

    let namedImportsLength = namedImports.length;

    if (defaultImport && namedImportsLength > 0) importString += ', '

    if (namedImportsLength > 0) {
        importString += `{`;
        namedImports.forEach(({ name, alias }, index) => {
            if (alias !== name) {
                importString += ` ${name} as ${alias}`
            } else {
                importString += ` ${name} `
            }
            if (index !== namedImportsLength - 1) importString += ',';
        })
        importString += '}'
    }

    importString += ` from ${source};`
    return importString;
}

const customSorter = (firstImport, secondImport) => {
    let { alias: firstAlias } = firstImport;
    let { alias: secondAlias } = secondImport;

    if (firstAlias > secondAlias) {
        return 1;
    }
    if (firstAlias < secondAlias) return -1;
}

const getImport = (newImport, importStatements) => {

    let { name, source, type } = newImport

    importStatements = importStatements.sort(customSorter)

    let r = `^${name}\\_*\\d*$`
    let regex = RegExp(r, 'g');


    let matches = importStatements.filter(importName => importName.name.search(regex) > -1)

    if (matches.length === 0) return {
        name,
        alias: name,
        type,
        source
    }

    let { alias } = matches.reverse()[0]

    let newR = /(\w*_)(\d*)$/g
    let regexResult = newR.exec(alias);

    let newAlias = regexResult ?
        `${regexResult[1]}${Number(regexResult[2]) + 1}`
        :
        `${alias}_1`;

    return {
        name,
        alias: newAlias,
        source,
        type
    }
}

module.exports = parseExportedData;