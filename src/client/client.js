const { ipcRenderer } = require('electron');

/**
 * Settings
 */

const NAME = document.getElementById('data-name')
const ICON = document.getElementById('data-icon')
const SAVE_BTN = document.getElementById('settings-save')

const COURSE_NAME = document.getElementById('course-name')
const COURSE_DESC = document.getElementById('course-desc')
const COURSE_DIR = document.getElementById('course-dir')

let CLIENT_SETTINGS = ipcRenderer.sendSync('get-settings');
let CLIENT_COURSES = ipcRenderer.sendSync('get-courses');

SAVE_BTN.addEventListener('click', () => {
    const updSettings = { name: NAME.value, icon: ICON.value };
    CLIENT_SETTINGS = { ...CLIENT_SETTINGS, ...updSettings }
    ipcRenderer.sendSync('save-settings', updSettings);
    applySettings(CLIENT_SETTINGS);
})


/**
 * Initialization
 */

const SUBTITLE_ICON = document.getElementById('subtitle-icon');
const SUBTITLE_TEXT = document.getElementById('subtitle-text');
const COURSE_SELECT = document.getElementById('course-select');
const COURSE_CONTEXT_MENU = document.getElementById('edit-course-details');
const COURSE_VIEW = document.getElementById("course-view");
const COLLAPSE_VIEW = document.getElementById("collapse-view");
const SETTINGS_TOGGLE = document.getElementById("settings-toggle");
const SETTINGS = document.getElementById("settings")
const STATE = {
    focused: false,
    settings: false
}
const updateState = function (changes) {
    for (change in changes) {
        STATE[change] = changes[change];
    }
    tick();
}

function applySettings(newSettings) {
    if (typeof newSettings.icon === 'string') {
        SUBTITLE_ICON.innerHTML = newSettings.icon;
        ICON.value = newSettings.icon;
    }
    if (typeof newSettings.name === 'string') {
        SUBTITLE_TEXT.innerText = newSettings.name;
        NAME.value = newSettings.name;
    }

    updateState({ settings: false });
}
applySettings(CLIENT_SETTINGS)

function loadCourseContextMenu(course, [x, y]) {
    if (course) {
        COURSE_CONTEXT_MENU.style.left = `${x}px`
        COURSE_CONTEXT_MENU.style.top = `${y}px`
        COURSE_NAME.value = course.name;
        COURSE_DESC.value = course.desc || "";
        COURSE_DIR.value = course.directory;
        COURSE_CONTEXT_MENU.classList.remove('hidden');
    }
}

function updateCourse(directory, updCourse) {
    ipcRenderer.sendSync('update-course', { name: COURSE_NAME.value, description: COURSE_DESC.value, directory: COURSE_DIR.value })
    CLIENT_COURSES[directory] = { ...CLIENT_COURSES[directory], ...updCourse };

    renderCourses();
}

function updateCourseCloseContextMenu() {
    if (COURSE_DIR.value != "") {
        const updatedCourse = { name: COURSE_NAME.value, description: COURSE_DESC.value, directory: COURSE_DIR.value };
        updateCourse(COURSE_DIR.value, updatedCourse)
    }
    COURSE_NAME.value = "";
    COURSE_DESC.value = "";
    COURSE_DIR.value = "";
    COURSE_CONTEXT_MENU.classList.add('hidden');
}

function renderCourses() {
    COURSE_SELECT.innerHTML = "";
    for (key in CLIENT_COURSES) {
        const course = CLIENT_COURSES[key];
        const button = document.createElement('div');
        button.className = "course-button";
        button.innerText = course.name;
        COURSE_SELECT.appendChild(button);

        button.addEventListener('click', () => {
            if (COURSE_VIEW.src === course.directory) {
                COURSE_VIEW.src = "";
            } else {
                COURSE_VIEW.src = course.directory;
            }
            updateState({ focused: true })
        })

        button.addEventListener('contextmenu', (event) => {
            event.preventDefault();
            loadCourseContextMenu(course, [event.clientX, event.clientY])
        })
    }
}

document.addEventListener('click', (e) => {
    let targetElement = e.target;
    do {
        if (targetElement == COURSE_CONTEXT_MENU) {
            return;
        }
        // Go up the DOM
        targetElement = targetElement.parentNode;
    } while (targetElement);

    updateCourseCloseContextMenu();
})







/**
 * Client Code
 */

window.addEventListener('resize', () => { tick() });

COURSE_VIEW.addEventListener('click', () => {
    updateState({ focused: true });
})

document.addEventListener('keydown', (event) => {
    if (event.key === "Escape") {
        event.preventDefault();
        updateState({ focused: false })
    }
})

COLLAPSE_VIEW.addEventListener('click', () => {
    updateState({ focused: false });
})

SETTINGS_TOGGLE.addEventListener('click', () => {
    updateState({ settings: !STATE.settings, focused: !STATE.SETTINGS ? false : STATE.focused })
})

function tick() {
    if (!STATE.focused) {
        COURSE_VIEW.style.width = 0;
        COURSE_VIEW.style.height = 0;
    } else {
        COURSE_VIEW.style.width = window.innerWidth + "px";
        COURSE_VIEW.style.height = window.innerHeight + "px";
    }

    if (STATE.settings) {
        SETTINGS.classList.remove('hidden')
    } else {
        SETTINGS.classList.add('hidden')
    }
}

function init() {
    renderCourses();
}

tick();
init();