const chai = require('chai');
const { assert } = chai;
const checkJsVersion = require('./check-version');

let genericFileName = "test-input.js";
const createInput = (input) => {
    return checkJsVersion(input, genericFileName);
}


describe("check version output", () => {

    describe("ES5 scenarios", () => {

        it("named exports", () => {

            let input = `
                exports.funct = () => {
                    console.log("hello world");
                }
            `
            assert.equal(createInput(input), 'es5');
        })

        it("default export", () => {

            let input = `
                module.exports = () => {
                    console.log("hello world");
                }
            `
            assert.equal(createInput(input), 'es5');
        })

        it("not es5 export", () => {

            let input = `
                exports default () => {
                    console.log("hello world");
                }
            `
            assert.equal(createInput(input), null);

        })
    })

    describe("ES6 scenarios", () => {


        it("es6 named exports", () => {
            let input = `
            export const hello = () => {
                console.log("hello world");
            }
        `
            assert.equal(createInput(input), 'es6');
        })


        it("es6 default export", () => {
            let input = `
            export default hello = () => {
                console.log("hello world");
            }
        `
            assert.equal(createInput(input), 'es6');
        })

        it("not es6 export", () => {
            let input = `
            exports default hello = () => {
                console.log("hello world");
            }
        `
            assert.equal(createInput(input), null);
        })


    })
















})