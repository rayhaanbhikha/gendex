#!/usr/bin/env node

const { generateIndexFile } = require('./utils');
const program = require('commander');

program
    .version('0.0.1', '-v, --version')
    .option('-d, --directory <directory>', 'choose directory')
    .option('-e, --ecma-script [js-version]', 'choose ECMAScript version', 'es6')
    .parse(process.argv);


if (!program.directory) {
    console.log("Need to specifiy directory")
    console.log(program.help())
} else {
    let { directory: DIRECTORY, ecmaScript: ECMAScript_VERSION } = program;

    (async () => {
        try {
            await generateIndexFile(DIRECTORY, ECMAScript_VERSION)
        } catch (error) {
            console.log(error);
        }
    })();
}