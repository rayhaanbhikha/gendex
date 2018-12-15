const chai = require('chai');
chai.use(require('chai-string'));
const { expect } = chai;
const parseExportedData = require('./parse-exported-data');

let ES5Exports = [
    {
        ExportDefaultDeclaration: null,
        ExportNamedDeclaration: ['a', 'b'],
        source: `"./file-1.js"`,
        version: 'es5'
    },
    {
        ExportDefaultDeclaration: null,
        ExportNamedDeclaration: ['a', 'c'],
        source: `"./file-2.js"`,
        version: 'es5'
    },
    {
        ExportDefaultDeclaration: "file3",
        ExportNamedDeclaration: [],
        source: `"./file-3.js"`,
        version: 'es5'
    },
    {
        ExportDefaultDeclaration: "file4",
        ExportNamedDeclaration: [],
        source: `"./file-4.js"`,
        version: 'es5'
    }
]


let ES6Exports = [
    {
        ExportDefaultDeclaration: "file1",
        ExportNamedDeclaration: ['a', 'b'],
        source: `"./file-1.js"`,
        version: 'es6'
    },
    {
        ExportDefaultDeclaration: null,
        ExportNamedDeclaration: ['a', 'c'],
        source: `"./file-2.js"`,
        version: 'es6'
    },
    {
        ExportDefaultDeclaration: "file3",
        ExportNamedDeclaration: [],
        source: `"./file-3.js"`,
        version: 'es6'
    },
    {
        ExportDefaultDeclaration: "file4",
        ExportNamedDeclaration: [],
        source: `"./file-4.js"`,
        version: 'es6'
    }
]



describe("check if parser generates index file code correctly", () => {

    it("ES5 version (index.js) code", () => {
        let expectedOutput = `
            const { a, b} = require("./file-1.js");
            const { a: a_1, c} = require("./file-2.js");
            const file3 = require("./file-3.js");
            const file4 = require("./file-4.js");


            module.exports = {
                    a,
                    a_1,
                    b,
                    c,
                    file3,
                    file4,
            }
        `
        expect(
            parseExportedData(ES5Exports, 'es5')
        ).to.equalIgnoreSpaces(expectedOutput);
    })



    it("ES6 version (index.js) code", () => {
        let expectedOutput = `
            import file1 , { a, b} from "./file-1.js";
            import { a as a_1, c} from "./file-2.js";
            import file3 from "./file-3.js";
            import file4 from "./file-4.js";

            export {
                    a,
                    a_1,
                    b,
                    file1,
                    c,
                    file3,
                    file4,
            }
        `
        expect(
            parseExportedData(ES6Exports, 'es6')
        ).to.equalIgnoreSpaces(expectedOutput);
    })

})
