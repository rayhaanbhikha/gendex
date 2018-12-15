const { checkVersion} = require("./check-version");
const { createIndex} = require("./create-index");
const { extractExports, getFileName} = require("./shared-services");
const { generateFileNodeTree} = require("./generate-file-node-tree");
const { getExportedData} = require("./get-exported-data");
const { getFiles} = require("./get-files");
const { parseEs5} = require("./es5");
const { parseEs6} = require("./es6");
const { parseExportedData} = require("./parse-exported-data");


module.exports = {
	checkVersion,
	createIndex,
	extractExports,
	generateFileNodeTree,
	getExportedData,
	getFiles,
	parseEs5,
	parseEs6,
	parseExportedData,
	getFileName,
}