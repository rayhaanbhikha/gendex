const checkJsVerson = fileCode => {
    let resEs5Expression = '((module.exports)|(exports.(\w+)))(\ .*|\t.*)='
    let resEs6Expression = '(export\ )'

    let regEs5 = RegExp(resEs5Expression,'g')
    let regEs6 = RegExp(resEs6Expression, 'g');
    
    if(regEs5.test(fileCode)) {
        return 'es5';
    } else if (regEs6.test(fileCode)) {
        return 'es6';
    } else {
        console.log(fileCode);
        throw new Error('file does not export');
    }
}

module.exports = checkJsVerson;