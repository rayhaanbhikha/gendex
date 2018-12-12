#!/usr/bin/env node

const { generateIndexFile } = require('./utils');
const fs = require('fs');
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
        // check directory.
        if (!directory) helperMessage("Please specifiy a directory")
        fs.statSync(directory).isDirectory(); // throws error if not a directory.

        // make ecmaScript version => es6 by default if wrong argument is passed.
        if (ecmaScript !== 'es5' && ecmaScript !== 'es6') ecmaScript = 'es6';

        console.log(ecmaScript, directory);

        await generateIndexFile(directory, ecmaScript);
    } catch (error) {
        console.log(error.message);
    }
})();

function helperMessage(message) {
    console.log(`\n${message}\n`);
    console.log(program.help());
    process.exit();
}