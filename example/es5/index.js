const { a, b} = require("./file-1.js");
const { a: a_1, b: b_1, c} = require("./file-2.js");
const file3 = require("./file-3.js");


module.exports = {
	a,
	a_1,
	b,
	b_1,
	c,
	file3,
}