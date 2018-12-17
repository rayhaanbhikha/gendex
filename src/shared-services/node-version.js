module.exports = (() => {
    let versionRegex = /^v(\d+\.\d+)/; // v10.10.0
    let version = versionRegex.exec(process.version)[1]

    return Number(version)
})()