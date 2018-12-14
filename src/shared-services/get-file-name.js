const sanitizeFileName = (fileName = "A") => {
    fileName = fileName.replace(/(.js|.jsx)$/g, '');
    fileName = fileName.split(/[-._]/)
    fileName = fileName.reduce(reducer);
    return fileName
}

let reducer = (a, b) => {
    return a + b.substring(0, 1).toUpperCase() + b.substring(1)
}

module.exports = sanitizeFileName;