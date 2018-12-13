const babelParser = require("@babel/parser")
const fs = require('fs');
const path = require('path');

function extractCode(pathToFile) {
    let code = fs.readFileSync(path.resolve(pathToFile), 'utf-8');

    // const { program } = babelParser.parse(code);
    const { program } = babelParser.parse(code, {
        sourceType: 'module',
        plugins: ['jsx', 'env', 'es6', 'classProperties']
    })

    return program.body;
}

module.exports = extractCode;



