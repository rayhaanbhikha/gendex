const checkJsVersion = require('./check-version');
const { getFiles, getIndexFile } = require('./get-files');
const { parseEs6, parseExportedDataAsEs6 } = require('./es6');
const { parseEs5, parseExportedDataAsEs5 } = require('./es5');
const getExportedData = require('./get-exported-data')
const generateIndexFile = require('./create-index')
const generateNodeTree = require('./generate-file-node-tree');

module.exports = {
    checkJsVersion,
    getFiles,
    parseEs6,
    parseExportedDataAsEs6,
    parseEs5,
    parseExportedDataAsEs5,
    getExportedData,
    generateIndexFile,
    getIndexFile,
    generateNodeTree
}