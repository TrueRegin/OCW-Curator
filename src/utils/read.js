const fs = require('fs');
const { join } = require('path');
const CONFIG = require('../CONFIG')

module.exports.settings = function() {
    const settingsFile = join(CONFIG().directory, "ocw.settings.data");
    if(fs.existsSync(settingsFile)) {
        return JSON.parse(fs.readFileSync(settingsFile).toString());
    }
    else {
        return {}
    }
}

module.exports.courses = function() {
    const coursesFile = join(CONFIG().directory, "ocw.courses.data");
    if(fs.existsSync(coursesFile)) {
        return JSON.parse(fs.readFileSync(coursesFile).toString()).courses;
    } else {
        return {}
    }
}