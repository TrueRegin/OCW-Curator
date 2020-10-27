const fs = require('fs');
const { join } = require('path');
const CONFIG = require('../CONFIG');

module.exports.saveSettings = function(updSettings) {
    const settingsFile = join(CONFIG().directory, "/ocw.settings.data");
    const settings = fs.existsSync(settingsFile) ? JSON.parse(fs.readFileSync(settingsFile).toString()) : {};

    for(key in updSettings) {
        settings[key] = updSettings[key];
    }

    fs.writeFileSync(settingsFile, JSON.stringify(settings));
}

function addCourses(...updCourses) {
    const coursesFile = join(CONFIG().directory, "ocw.courses.data");
    const courses = fs.existsSync(coursesFile) ? JSON.parse(fs.readFileSync(coursesFile).toString()) : {courses: {}};

    for(key in updCourses) {
        const updCourse = updCourses[key];
        if(updCourse.directory) {
            courses.courses[updCourse.directory] = updCourse;
        } else {
            throw new Error("Error, trying to update a course but not inputting a directory!")
        }
    }

    fs.writeFileSync(coursesFile, JSON.stringify(courses));
}
module.exports.addCourses = addCourses;

module.exports.addCourse = function(updCourse) {
    addCourses(updCourse);
};