const checkJsVerson = file => {
    let resEs5Expression = '((module.exports)|(exports.(\w+)))(\ .*|\t.*)='
    let resEs6Expression = '^(export\ |export\ default)'

    let regEs5 = RegExp(resEs5Expression,'g')
    let regEs6 = RegExp(resEs6Expression, 'g');
    
    if(regEs5.test(file)) {
        return 'es5';
    } else if (regEs6.test(file)) {
        return 'es6';
    } else {
        throw new Error('file does not export');
    }
}

module.exports = checkJsVerson;