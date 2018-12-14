const babelParser = require("@babel/parser")

function extractExports(code) {

    const { program } = babelParser.parse(code, {
        sourceType: 'module',
        plugins: ['jsx', 'env', 'es6', 'classProperties']
    })

    return program.body;
}

module.exports = extractExports;



