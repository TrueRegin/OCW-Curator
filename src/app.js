const { app, BrowserWindow, ipcMain, dialog } = require('electron')
const { join } = require('path');
const { execSync } = require('child_process');
const CONFIG = require("./CONFIG")
const { updateConfig } = require("./CONFIG")
const { parseInput } = require('./utils/cli')
const dotenv = require('dotenv');
const { analyzeDir } = require('./utils/analyze.js');
const { saveSettings, addCourse, addCourses } = require('./utils/save');
const { settings, courses } = require('./utils/read');

dotenv.config();


let window = undefined;
function createRoot() {
    // Create the browser window. 
    window = new BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: {
            webviewTag: true,
            nodeIntegration: true
        },
        icon: join(__dirname, "assets/icon.ico"),
        autoHideMenuBar: true
    })

    // Load the index.html of the app. 
    window.loadFile(__dirname + '/client/index.html')
}

updateConfig(parseInput(CONFIG()));
app.on('ready', async () => {
    if (!CONFIG().directory) {
        const dir = await dialog.showOpenDialog({
            properties: ['openDirectory']
        }, function (files) {
            if (files) event.sender.send('selected-file', files)
        })

        if(dir && dir.filePaths && dir.filePaths.length === 1) {
            updateConfig({ directory: dir.filePaths[0] })
        };
    }
    const dirData = CONFIG().isDev ? analyzeDir(process.env.DEV_CONTENT) : analyzeDir(CONFIG().directory);

    if (dirData) {
        app.addRecentDocument(CONFIG().directory);
        if (CONFIG().isDev) { updateConfig({ directory: process.env.DEV_CONTENT }) }

        updateConfig({ settings: settings() })

        ipcMain.on('get-settings', (event) => {
            event.returnValue = CONFIG().settings;
        })

        ipcMain.on('save-settings', (event, data) => {
            saveSettings(data);
            event.returnValue = true;
        })

        ipcMain.on('get-courses', (event) => {
            updateConfig({ courses: courses() });
            event.returnValue = { ...dirData.courses, ...CONFIG().courses };
        })

        ipcMain.on('update-course', (event, course) => {
            addCourse(course);
            event.returnValue = true;
        })

        createRoot();
    } else {
        app.quit();
    }

    // else {
    //     ipcMain.on('select-folder', (event) => {
    //         execSync(`start "" "C:\\"`)
    //     })
    //     createBrowser();
    // }
})

app.on('window-all-closed', app.quit);
app.on('before-quit', () => {
    if (window) {
        window.removeAllListeners('close');
        window.close();
    }
});