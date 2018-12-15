const chai = require('chai');
const { expect } = chai;
const parseEs6 = require('./parse-es6');

let file1 = {
    fileCode: `
        export let a = 1;
        export let b = 2;
        export class Button extends Component {}
        export const myFunct = () => {}
        export function myFunct2() {}
    `,
    fileName: 'file-1.js',
    version: 'es6'
}

let file2 = {
    fileCode: `
        export const name = "John"
        export class Button extends Component {}
        export const myFunct = () => {}
        export function myFunct2() {}
        export default "default string"
    `,
    fileName: 'file-2.js',
    version: 'es6'
}

let file3 = {
    fileCode: `
        class A extends Component {

        }

        export default connect()(A)
    `,
    fileName: 'file-3.js',
    version: 'es6'
}

const getExtractedObject = ({ fileCode, fileName, version }) => {
    return parseEs6(fileCode, fileName, version)
}

describe("Extract exports from ES6 JS files", () => {

    it("extract named exports from js file-1", () => {
        expect(
            getExtractedObject(file1)
        ).to.deep.equal({
            ExportDefaultDeclaration: null,
            ExportNamedDeclaration: ['a', 'b', 'Button', 'myFunct', 'myFunct2'],
            source: `"./file-1.js"`,
            version: 'es6'
        })
    })

    it("extract named + default exports from js file-2", () => {
        expect(
            getExtractedObject(file2)
        ).to.deep.equal({
            ExportDefaultDeclaration: "file2",
            ExportNamedDeclaration: ['name', 'Button', 'myFunct', 'myFunct2'],
            source: `"./file-2.js"`,
            version: 'es6'
        })
    })

    it("extract react component connected to redux file-3", () => {
        expect(
            getExtractedObject(file3)
        ).to.deep.equal({
            ExportDefaultDeclaration: "file3",
            ExportNamedDeclaration: [],
            source: `"./file-3.js"`,
            version: 'es6'
        })
    })
})