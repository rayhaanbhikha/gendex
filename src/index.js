const checkJsVersion = require('./check-version');
const { getFiles, getIndexFile } = require('./get-files');
const { parseEs6 } = require('./es6');
const { parseEs5 } = require('./es5');
const parseExportedData = require('./parse-exported-data');
const getExportedData = require('./get-exported-data')
const generateIndexFile = require('./create-index')
const generateNodeTree = require('./generate-file-node-tree');

module.exports = {
    checkJsVersion,
    getFiles,
    parseEs6,
    parseEs5,
    parseExportedData,
    getExportedData,
    generateIndexFile,
    getIndexFile,
    generateNodeTree
}