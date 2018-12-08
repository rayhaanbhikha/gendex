const checkJsVerson = file => {
    let regEs5 = RegExp('^(module.exports(\ .*|\t.*)=)','g')
    let regEs6 = RegExp('^(export\ |export\ default)', 'g');
    if(regEs5.test(file)) {
        return 'es5';
    } else if (regEs6.test(file)) {
        return 'es6';
    } else {
        throw new Error('file does not export');
    }
}

module.exports = checkJsVerson;