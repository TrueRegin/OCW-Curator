const config = {
    directory: "",
    settings: {},
    courses: {},
    isDev: false,
}

module.exports = () => { return config };
module.exports.updateConfig = function(newData) {
    for(key in newData) {
        config[key] = newData[key];
    }
}