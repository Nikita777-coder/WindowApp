import { simulateFileUpload } from "./loadprocesses.js";
import { windowCounter, windowsCash } from "./common.js";

function restoreWindowParams(winId) {
    windowsCash.filter(el => el.id === winId).forEach(window => {
        let documentWinChildStyle = document.getElementById(window.id).style;

        window.top = documentWinChildStyle.top;
        window.left = documentWinChildStyle.left;
        window.zIndex = documentWinChildStyle.zIndex;
    })
}

export function saveWindowState(winId) {
    simulateFileUpload(`Информация об окне ${+(winId.replace('window', '')) + 1} сохраняется: `, 500).then((container) => {
        container.remove();
        restoreWindowParams(winId);
        localStorage.setItem('windows', JSON.stringify(windowsCash));
        localStorage.setItem('windowCounter', JSON.stringify(windowCounter));
    });
}

export function cleanStorage() {
    localStorage.removeItem('windows');
    localStorage.removeItem('windowCounter');
}