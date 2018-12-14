gendex
===

```gendex requires node v10.10.0```

gendex is a cli tool that allows developers to organise `exports` from several JavaScript files in a given directory, into one 'master' `index.js` file.

gendex works with jsx files as well and by default uses **ES6** when generating the `index.js` file. But can be configured to use **ES5** (Explained in Usage section).

gendex can be used in nested directories and will recursively build an `index.js` file at each level.

Installation
===

1) Either installing gendex globally using npm or yarn:
    ```sh
    npm install -g gendex
    ```

    This will install gendex globally to your system path.

2) Installing gendex as dev dependency:
    ```sh
    npm install --save-dev gendex
    ```
    With a local installation, gendex will not be available in your system path. Instead, the local installation of gendex can be run by calling it from within an npm script.

    <strong>For example:</strong>

    In your package.json you could add the following script command:

    ```json
    {
        "main": "index.js",
        "license": "MIT",
        "scripts": {
            "gendex": "gendex -d <directory>",
            "test": "echo \"Error: no test specified\" && exit 1"
        }
    }

    ```

    Then simply run: 

    ```sh
    npm run gendex
    ```

Options
===

gendex has the following options:

```
Usage: gendex [options]

Options:
  -v, --version                   output the version number
  -d, --directory <directory>     choose directory
  -e, --ecma-script [js-version]  choose ECMAScript version (default: "es6")
  -h, --help                      output usage information
```

NOTE: `-d, --directory` option is required.

Usage
===

In the [`examples`](https://github.com/rayhaanbhikha/gendex/tree/master/examples "examples") directory we have two nested directories `es5` and `es6`. If you look through the JavaScript files you can see they export variables, functions, classes etc.

I will provide two examples, one will use **ES5** and the other will use **ES6**.

Please note, gendex will generate an **ES6** `index.js` from **ES6 and ES5** JS files. But, cannot generate an **ES5** `index.js` from **ES6** JS files. The diagram below explains this further.

```
(EcmaScript -v)   
JS-file                     index.js
ES6         ---------->     ES6
ES5         ---------->     ES6
ES5         ---------->     ES5

ES6         --xxxxxxx->     ES5
```


ES5 example
---

We have the following tree structure.

```
.
+-- examples
|   +--es5
|   |   +--file-1.js // named exports {a, b}
|   |   +--file-2.js // named exports {a, b, c}
|   |   +--file-3.js // default export

```
By running the following command (using CLI or npm run script):

```sh
gendex -d ./examples/es5 -e es5
```

The following **ES5** `index.js` file will be generated in the given directory:

```js
// ES5

const { a, b} = require("./file-1.js");
const { a: a_1, b: b_1, c} = require("./file-2.js"); // duplicate exports changed
const file3 = require("./file-3.js"); // default export uses fileName.


module.exports = {
	a,
	a_1,
	b,
	b_1,
	c,
	file3,
}
```
NOTE: we could also generate an ES6 `index.js`, by removing the `-e` option from the previous command.

```js
// ES6

import { a , b } from "./file-1.js";
import { a as a_1, b as b_1, c } from "./file-2.js";
import file3  from "./file-3.js";


export {
	a,
	a_1,
	b,
	b_1,
	c,
	file3,
}
```

The `index.js` file will take into account any duplicate exports and generate an alias. Additionally, any default exports are given the name of the file.

ES6 example
---

Inside the `examples/es6` directory, I have a **JSX** and a combination of **ES5** and **ES6** files.

We have the following tree structure.

```
.
+-- examples
|   +--es6
|   |   +--file-1-es6.js // named exports {a, b}
|   |   +--file-2-es5.js // named exports {a, b, c}
|   |   +--file-3-es6.jsx // default export, named export App (component)
```
By running the following command (using CLI or npm run script):

NOTE: we can only generate **ES6** `index.js` in this directory (as mentioned previously).

```sh
gendex -d ./examples/es6
```


The following **ES6** `index.js` file will be generated in the given directory:

```js
// ES6

import file1Es6 , { a } from "./file-1-es6.js";
import { a as a_1, b , c } from "./file-2-es5.js";
import file3Es6 , { App } from "./file-3-es6.jsx";


export {
	a,
	a_1,
	b,
	c,
	file1Es6,
	file3Es6,
	App,
}
```

**__Please note__**: Attempting to generate an **ES5** `index.js` from **ES6** JS files will result in an error.