const fs = require('fs');
const { promisify } = require('util');
const writeFile = promisify(fs.writeFile);
const path = require('path');

function createIndexFile(data, PATH_TO_DIR) {
    return writeFile(path.join(PATH_TO_DIR, 'index.js'), data, 'utf-8');
}

module.exports = createIndexFile