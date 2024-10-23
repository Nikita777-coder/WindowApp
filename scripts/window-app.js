import { Window } from "./window.js";
import * as commons from "./common.js";
import { simulateFileUpload } from "./loadprocesses.js";
import * as storage from "./storage.js"

function createNewWindow() {
    const winId = `window${commons.windowCounter}`;
    commons.classWindows.set(winId, new Window(winId));

    let newWin = document.getElementById(winId);
    commons.windowsCash.push({ id: winId, isMinimized: false, isFullscreen: false, top: newWin.style.top, left: newWin.style.left, zIndex: newWin.style.zIndex});
    commons.increaseWindowCounter();
    storage.saveWindowState(winId)
}

document.getElementById('addWindowBtn').addEventListener('click', () => {
    createNewWindow();
});

function reboot() {
    let savedWindows = JSON.parse(localStorage.getItem('windows'));
    commons.classWindows.forEach(window => window.deepCloseWindow());

    if (savedWindows) {
        commons.setValue("windowCounter", JSON.parse(localStorage.getItem('windowCounter')));
        commons.setValue("windowsCash", savedWindows);
        let savedClosedWindows = commons.windowsCash.filter(window => window.isMinimized === true);
        let savedFullscreenWindow = commons.windowsCash.find(window => window.isFullscreen === true);

        commons.windowsCash.forEach(window => {
            commons.classWindows.set(window.id, new Window(window.id));

            let newWin = document.getElementById(window.id);
            newWin.style.top = window.top;
            newWin.style.left = window.left;
            newWin.style.zIndex = window.zIndex;
            commons.setValue("highestZIndex", Math.max(+newWin.style.zIndex, commons.highestZIndex));
        });
        
        savedClosedWindows.forEach(window => commons.classWindows.get(window.id).minimizeWindow());
        setTimeout(() => commons.classWindows.get(savedFullscreenWindow?.id)?.toggleFullscreen(), 0);
    } else {
        commons.setValue("windowcounter", 0);
    }
}

window.addEventListener('load', () => {
    simulateFileUpload("Получение окон с сервера: ", 1000).then((container) => {
        container.remove();
        reboot(); 
    });
});

window.addEventListener('unhandledrejection', function(event) {
    window.onbeforeunload = (event) => {};
    Array.from(document.querySelectorAll('#container')).forEach(el => el.remove());
    document.body.style.pointerEvents = 'auto';
});
