#!/usr/bin/env node

const { generateIndexFile, parseEs5, parseEs6, parseExportedData, checkJsVersion, getExportedData, getFiles} = require('./utils');
const babel = require("@babel/core");
const babelParser = require("@babel/parser")
const { promisify } = require('util');
const fs = require('fs');
const readFile = promisify(fs.readFile);
const path = require('path');

const program = require('commander');

program
    .version('0.0.1', '-v, --version')
    .option('-d, --directory <directory>', 'choose directory')
    .option('-e, --ecma-script [js-version]', 'choose ECMAScript version', 'es6')
    .parse(process.argv);


//check input
let { directory, ecmaScript } = program;
(async () => {
    try {

        // for one file.
        let pathToDir = path.resolve(__dirname, 'test-cases/test-2');
        let files = await getFiles(pathToDir);
        files = files.filter
        console.log(files);


        // console.log(await getExportedData())
        // let exportedData = []

        // let filePaths = [
        //     './test-case-es5.js',
        //     // './test-case-es6.js',
        //     // "./test-cases/components/Section/Section.jsx",
        //     // './test-cases/components/Chart/Chart.jsx',
        //     // './test-cases/containers/FormPage/FormPage.jsx',
        //     // 'test-cases/containers/TeamPage/TeamPage.jsx'
        // ];

        // for(let filePathIndex in filePaths) {
        //     let filePath = filePaths[filePathIndex];


        // }




        // console.log(exportedData);
        // console.log(parseExportedData(exportedData, ecmaScript));

        // let code = fs.readFileSync(path.resolve(directory), 'utf-8');

        // const { program } = babelParser.parse(code);


        // let nodesOfInterest = program.body.filter(node =>
        //     node.type == 'ExpressionStatement'
        //     && node.expression.type === 'AssignmentExpression'
        // );

        // let ExportNamedDeclaration = []
        // let ExportDefaultDeclaration = [];



        // for(let nodeIndex in nodesOfInterest) {
        //     let node = nodesOfInterest[nodeIndex];

        //     let {object, property} = node.expression.left
        //     let key = object.name
        //     let keyName = property.name


        //     if(key === 'exports') {
        //         ExportNamedDeclaration.push(keyName);
        //     } else if(key === 'module') {
        //         ExportDefaultDeclaration.push('')
        //     }

        //     console.log(key, ".", keyName);
        //     // console.log(object, property);


        // }

        // console.log(ExportNamedDeclaration)



        // console.log(nodesOfInterest);
        // nodesOfInterest.forEach(node => {
        //     console.log(node.expression);
        // })























        // // check directory.
        // if (!directory) helperMessage("Please specifiy a directory")
        // fs.statSync(directory).isDirectory(); // throws error if not a directory.

        // // make ecmaScript version => es6 by default if wrong argument is passed.
        // if (ecmaScript !== 'es5' && ecmaScript !== 'es6') ecmaScript = 'es6';

        // console.log(ecmaScript, directory);

        // await generateIndexFile(directory, ecmaScript);
    } catch (error) {
        console.log(error.message);
    }
})();

function helperMessage(message) {
    console.log(`\n${message}\n`);
    console.log(program.help());
    process.exit();
}