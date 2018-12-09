const checkJsVersion = require('./check-version');
const getFiles = require('./get-files');
const { parseEs6, parseExportedDataAsEs6 } = require('./es6');
const { parseEs5, parseExportedDataAsEs5 } = require('./es5');
const getExportedData = require('./get-exported-data')
const createIndexFileInDir = require('./create-index')

module.exports = {
    checkJsVersion,
    getFiles,
    parseEs6,
    parseExportedDataAsEs6,
    parseEs5,
    parseExportedDataAsEs5,
    getExportedData,
    createIndexFileInDir
}