import * as commons from "../common.js";
import { Menu } from "../menu.js";
import { saveWindowState } from "../storage.js";
import { WindowUtils } from "./window-utils.js";
import { Button } from "./window-button.js";
class Win {
    constructor(windowId) {
        this.dragMouseDown = (ev) => { };
        this.win = document.createElement('div');
        this.createWindow(windowId);
    }
    close() {
        if (this.win) {
            this.win.remove();
            commons.setValue("windowsCash", commons.windowsCash.filter(w => w.id !== this.win.id));
            commons.setValue("windowcounter", Math.max(...commons.windowsCash.map(child => {
                return this.extractNumFromWinId(child.id);
            })));
            commons.increaseWindowCounter();
        }
    }
    minimize() {
        if (this.win) {
            this.win.style.display = 'none';
            const windowInfo = commons.windowsCash.find(w => w.id === this.win.id);
            if (windowInfo) {
                windowInfo.isMinimized = true;
            }
            Menu.addToMenu(this.win.id);
        }
    }
    restore() {
        if (this.win) {
            this.win.style.display = 'block';
            const windowInfo = commons.windowsCash.find(w => w.id === this.win.id && w.isMinimized === true);
            if (windowInfo) {
                windowInfo.isMinimized = false;
            }
            Menu.removeFromMenu(this.win.id);
            saveWindowState(this.win.id);
        }
    }
    deepCloseWindow() {
        this.close();
        Menu.removeFromMenu(this.win.id);
    }
    toggleFullscreen() {
        const windowInfo = commons.windowsCash.find(w => w.id === this.win.id && w.isMinimized === false);
        if (windowInfo?.isFullscreen) {
            this.windowStyle('300px', '200px', '100px', '100px');
            this.makeDraggable();
        }
        else {
            this.windowStyle('100vw', '100vh', '0', '0');
            this.removeDraggable();
        }
        if (windowInfo) {
            windowInfo.isFullscreen = !windowInfo.isFullscreen;
        }
    }
    createWindow(windowId) {
        this.win.className = 'window';
        this.win.id = windowId;
        const header = document.createElement('div');
        header.className = 'window-header';
        const windowTitle = document.createElement('div');
        windowTitle.className = 'window-title';
        windowTitle.textContent = `Окно ${+(windowId.replace('window', '')) + 1}`;
        const windowControls = document.createElement('div');
        windowControls.className = 'window-controls';
        let baseWindowButtons = this.getBaseWindowButtons();
        baseWindowButtons.forEach(button => windowControls.appendChild(button));
        header.appendChild(windowTitle);
        header.appendChild(windowControls);
        this.win.appendChild(header);
        this.win.addEventListener('mousedown', () => commons.makeElementCurrent(this.win));
        document.body.appendChild(this.win);
        this.defineStartWinCoordinates();
        commons.makeElementCurrent(this.win);
        this.makeDraggable();
    }
    defineStartWinCoordinates() {
        let wins = document.querySelectorAll(".window");
        let lastWin = wins[wins.length - 2];
        let left = document.body.children[document.body.children.length - 1].getBoundingClientRect().left;
        let top = document.body.children[document.body.children.length - 1].getBoundingClientRect().top;
        if (WindowUtils.isAnyWindowInDocument()) {
            if (!lastWin || Menu.isWindowInMenu(lastWin.id)) {
                lastWin = WindowUtils.findFirstWindowNotInMenu(this.win.id);
            }
            if (lastWin) {
                let coordinates = lastWin.getBoundingClientRect();
                left = coordinates.left + 0.17 * lastWin.offsetWidth;
                top = coordinates.top + 0.17 * lastWin.offsetWidth;
            }
        }
        this.win.style.position = 'absolute';
        this.win.style.left = left + "px";
        this.win.style.top = top + "px";
    }
    removeDraggable() {
        this.win.removeEventListener('mousedown', this.dragMouseDown);
        saveWindowState(this.win.id);
    }
    makeDraggable() {
        const self = this;
        let offsetX = 0, offsetY = 0, initialX = 0, initialY = 0;
        this.win.addEventListener('mousedown', (e) => this.dragMouseDown.call(this.win, e));
        this.dragMouseDown = (e) => {
            e.preventDefault();
            initialX = e.clientX;
            initialY = e.clientY;
            document.onmouseup = closeDragElement;
            document.onmousemove = elementDrag;
        };
        const elementDrag = (e) => {
            e.preventDefault();
            offsetX = initialX - e.clientX;
            offsetY = initialY - e.clientY;
            initialX = e.clientX;
            initialY = e.clientY;
            self.win.style.top = (self.win.offsetTop - offsetY) + "px";
            self.win.style.left = (self.win.offsetLeft - offsetX) + "px";
        };
        const closeDragElement = () => {
            saveWindowState(self.win.id);
            document.onmouseup = null;
            document.onmousemove = null;
        };
        this.win.addEventListener('mousedown', this.dragMouseDown);
    }
    windowStyle(width, height, top, left) {
        this.win.style.width = width;
        this.win.style.height = height;
        this.win.style.top = top;
        this.win.style.left = left;
    }
    getBaseWindowButtons() {
        return [
            new Button('fullscreen-btn', '[ ]', () => this.toggleFullscreen()).button,
            new Button('minimize-btn', '-', () => {
                this.minimize();
                saveWindowState(this.win.id);
            }).button,
            new Button('close-btn', 'X', () => {
                let winId = this.win.id;
                this.close();
                saveWindowState(winId);
            }).button
        ];
    }
    extractNumFromWinId(winId) {
        if (winId) {
            let ex = winId.match(/\d+(\.\d+)?/);
            if (ex) {
                return Number(ex[0]);
            }
            return -1;
        }
        return -1;
    }
}
export { Win };
//# sourceMappingURL=window.js.map