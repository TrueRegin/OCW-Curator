const { resolve } = require('path')

module.exports.parseInput = function (oldConfig) {
    const newConfig = oldConfig

    let currFlag = "";
    for (i in process.argv) {
        let fullArg = process.argv[i];

        if (fullArg.startsWith("--")) {
            currFlag = fullArg.substring(2);
            if (currFlag === "dev") newConfig.isDev = true;
        } else {
            switch (currFlag) {
                case "dir":
                    newConfig.directory = fullArg;
                    break;
            }
        }
    }

    return newConfig;
}