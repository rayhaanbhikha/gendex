const path = require('path');
const {
    createIndexFileInDir
} = require('./utils');

let config = {
    DEFAULT_VERSION: 'es6',
    DIRECTORY: 'test-cases/test-2',
    get PATH_TO_DIR() {
        return path.join(__dirname, this.DIRECTORY)
    },
    get VERSION() {
        return (process.argv[2] && process.argv[2] === 'es5') ? 'es5' : this.DEFAULT_VERSION
    }
};

(async () => {
    try {
        await createIndexFileInDir(config)
    } catch (error) {
        console.log(error);
    }
})();
