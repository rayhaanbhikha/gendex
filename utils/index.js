const checkJsVersion = require('./check-version');
const getFiles = require('./get-files');
const parseEs6 = require('./es6/parse-es6');
const parseEs5 = require('./es5/parse-es5');
const parseExportedData = require('./parse-exported-data')
const getExportedData = require('./get-exported-data')
const createIndexFile = require('./create-index')

module.exports = {
    checkJsVersion,
    getFiles,
    parseEs6,
    parseEs5,
    parseExportedData,
    getExportedData,
    createIndexFile
}