const fs = require('fs')
const { join, resolve } = require('path')

const htmlTest = /\.htm(l)?$/

module.exports.analyzeDir = function(dirname) {
    if(fs.existsSync(dirname)) {
        let dirData = {
            courses: {}
        }

        fs.readdirSync(dirname).forEach(file => {
            const course_dir = resolve(dirname, file);
            const stats = fs.lstatSync(course_dir);
            if(stats.isDirectory(course_dir)) {
                fs.readdirSync(course_dir).forEach((course_root) => {
                    if(htmlTest.test(course_root)) {
                        dirData.courses[join(dirname, file, course_root)] = {
                            name: file,
                            description: undefined,
                            directory: join(dirname, file, course_root)
                        }
                    }
                })
            }
        })

        return dirData;
    }
    return undefined;
}