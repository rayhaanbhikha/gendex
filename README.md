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

Assume you have the following directory, with two JavaScript files. 

NOTE: gendex works with nested directories as well.

```sh
.
+-- example
|   +-- example-1.js // exports {a: 1, b: 2}
|   +-- example-2.js // exports {c: 3, d: 4}
|   +-- example-3.js // exports {a: 5, b: 6}

```
Then running

```
gendex -d ./example
```

The following index.js file will be generated in the given directory:

```js
// ES^

import { a, b } from './example-1.js';
import { c, d } from './example-2.js';
import { a as a_1, b as b_1 } from './example-3.js'; // takes care of duplicate exports

export {
    a,
    b,
    a_1,
    b_1
}
```

ES5 index.js file can also be generated:

```js
const { a, b } = require('./example-1.js');
const { c, d } = require('./example-2.js');
const { a: a_1, b: b_1 } = require('./example-3.js');

module.exports = {
    a,
    b,
    a_1,
    b_1
}
```

**__Please note__**: Attempting to generate an **ES5** `index.js` from **ES6** JS files will result in an error.
