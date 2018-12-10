const path = require('path');
const { generateIndexFile } = require('./utils');

let config = {
    DEFAULT_VERSION: 'es6',
    DIRECTORY: 'test-cases',
    get PATH_TO_DIR() {
        return path.join(__dirname, this.DIRECTORY)
    },
    get VERSION() {
        return (process.argv[2] && process.argv[2] === 'es5') ? 'es5' : this.DEFAULT_VERSION
    }
};

(async () => {
    try {
        await generateIndexFile(
            config.PATH_TO_DIR, config.VERSION)

    } catch (error) {
        console.log(error);
    }
})();