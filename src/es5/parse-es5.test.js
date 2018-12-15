const chai = require('chai');
const { expect } = chai;
const parseEs5 = require('./parse-es5');

let file1 = {
    fileCode: `
        exports.a = 1;
        exports.b = 2;
    `,
    fileName: 'file-1.js',
    version: 'es5'
}

let file2 = {
    fileCode: `
        module.exports = {
            c: 3,
            d: 4
        }
    `,
    fileName: 'file-2.js',
    version: 'es5'
}

let file3 = {
    fileCode: `
        exports.e = 5;
        exports.f = 6;
        module.exports = "hello"
    `,
    fileName: 'file-3.js',
    version: 'es5'
}

const getExtractedObject = ({ fileCode, fileName, version }) => {
    return parseEs5(fileCode, fileName, version)
}

describe("Extract exports from ES5 JS files", () => {

    it("extract named exports from js file-1", () => {
        expect(
            getExtractedObject(file1)
        ).to.deep.equal({
            ExportDefaultDeclaration: null,
            ExportNamedDeclaration: ['a', 'b'],
            source: `"./file-1.js"`,
            version: 'es5'
        })
    })

    it("extract named exports using module.exports from js file-2", () => {
        expect(
            getExtractedObject(file2)
        ).to.deep.equal({
            ExportDefaultDeclaration: null,
            ExportNamedDeclaration: ['c', 'd'],
            source: `"./file-2.js"`,
            version: 'es5'
        })
    })

    it("does default module.exports override named exports file-3", () => {
        expect(
            getExtractedObject(file3)
        ).to.deep.equal({
            ExportDefaultDeclaration: "file3",
            ExportNamedDeclaration: [],
            source: `"./file-3.js"`,
            version: 'es5'
        })
    })
})