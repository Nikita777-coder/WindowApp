import { Win } from "./window/window.js";
import * as commons from "./common.js";
import { simulateFileUpload } from "./loadprocesses.js";
import * as storage from "./storage.js";
function createNewWindow() {
    const winId = `window${commons.windowCounter}`;
    commons.classWindows.set(winId, new Win(winId));
    let newWin = document.getElementById(winId);
    if (newWin) {
        commons.windowsCash.push({ id: winId, isMinimized: false, isFullscreen: false, top: newWin.style.top, left: newWin.style.left, zIndex: newWin.style.zIndex });
    }
    commons.increaseWindowCounter();
    storage.saveWindowState(winId);
}
let addWindowBtn = document.getElementById('addWindowBtn');
if (addWindowBtn) {
    addWindowBtn.addEventListener('click', () => {
        createNewWindow();
    });
}
function reboot() {
    let savedWindows = undefined;
    let windows = localStorage.getItem('windows');
    let windowCounter = localStorage.getItem('windowCounter');
    if (!windows || !windowCounter) {
        throw new Error("bruh");
    }
    savedWindows = JSON.parse(windows);
    commons.classWindows.forEach(window => window.deepCloseWindow());
    if (savedWindows) {
        commons.setValue("windowCounter", JSON.parse(windowCounter));
        commons.setValue("windowsCash", savedWindows);
        let savedClosedWindows = commons.windowsCash.filter(window => window.isMinimized === true);
        let savedFullscreenWindow = commons.windowsCash.find(window => window.isFullscreen === true);
        commons.windowsCash.forEach(window => {
            commons.classWindows.set(window.id, new Win(window.id));
            let newWin = document.getElementById(window.id);
            if (!newWin) {
                throw new Error("bruh");
            }
            newWin.style.top = window.top;
            newWin.style.left = window.left;
            newWin.style.zIndex = window.zIndex;
            commons.setValue("highestZIndex", Math.max(+newWin.style.zIndex, commons.highestZIndex));
        });
        savedClosedWindows.forEach(window => commons.classWindows.get(window.id)?.minimize());
        if (savedFullscreenWindow) {
            commons.classWindows.get(savedFullscreenWindow?.id)?.toggleFullscreen();
        }
    }
    else {
        commons.setValue("windowcounter", 0);
    }
}
window.addEventListener('load', () => {
    simulateFileUpload("Получение окон с сервера: ", 1000).then((container) => {
        container.remove();
        reboot();
    });
});
window.addEventListener('unhandledrejection', function (event) {
    window.onbeforeunload = (event) => { };
    Array.from(document.querySelectorAll('#container')).forEach(el => el.remove());
    document.body.style.pointerEvents = 'auto';
});
//# sourceMappingURL=window-app.js.map