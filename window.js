/**
 * Create new Button in window
 * @param className
 * @param textContent - button displayed name or symbols
 * @param onClick
 * @constructor
 */
function WindowButton(className, textContent, onClick) {
    this.button = document.createElement('button');
    this.button.className = className;
    this.button.textContent = textContent;
    this.button.onclick = onClick;

    Object.defineProperty(this, 'button', {
        configurable: false
    });
}

class Window {
    win

    constructor(windowId) {
        win = document.createElement('div');
        this.#createWindow(windowId);
    }

    closeWindow() {
        if (win) {
            win.remove();
            windows = windows.filter(w => w.id !== windowId);
            windowCounter = Math.max(...windows.map(child => {
                return extractNumFromWinId(child.id);
            }))
            windowCounter++;
        }
    }

    minimizeWindow() {
        if (win) {
            win.style.display = 'none';
            const windowInfo = windows.find(w => w.id === windowId);
            windowInfo.isMinimized = true;
            addToMenu(windowId);
        }
    }

    restoreWindow() {
        if (win) {
            win.style.display = 'block';
            const windowInfo = windows.find(w => w.id === windowId && w.isMinimized === true);
    
            if (windowInfo) {
                windowInfo.isMinimized = false;
            }
    
            const listItem = document.getElementById(`menu-${windowId}`);
            if (listItem) {
                listItem.remove();
            }
            
            saveWindowState(windowId);
        }
    }

    toggleFullscreen() {
        const windowInfo = windows.find(w => w.id === win.id && w.isMinimized === false);

        windowInfo.isFullscreen ?
            this.#windowStyle('300px','200px', '100px', '100px') :
            this.#windowStyle('100vw', '100vh', '0', '0');

        windowInfo.isFullscreen = !windowInfo.isFullscreen;
    }

    #createWindow(windowId) {
        win.className = 'window';
        win.id = windowId;

        const header = document.createElement('div');
        header.className = 'window-header';

        const windowTitle = document.createElement('div');
        windowTitle.className = 'window-title';
        windowTitle.textContent = `Окно ${+(windowId.replace('window', '')) + 1}`;

        const windowControls = document.createElement('div');
        windowControls.className = 'window-controls';

        let baseWindowButtons = this.#getBaseWindowButtons(win);

        baseWindowButtons.forEach(button => windowControls.appendChild(button));

        header.appendChild(windowTitle);
        header.appendChild(windowControls);

        win.appendChild(header);
        win.addEventListener('mousedown', () => makeElementCurrent(win));

        document.body.appendChild(win);
        defineStartWinCoordinates();
        makeElementCurrent(win);
        this.#makeDraggable();
    }

    #makeDraggable() {
        let offsetX = 0, offsetY = 0, initialX = 0, initialY = 0;

        win.addEventListener('mousedown', (e) => dragMouseDown(e)); 

        function dragMouseDown(e) {
            e.preventDefault();
            initialX = e.clientX;
            initialY = e.clientY;
            console.log(e.clientX, e.clientY)
            console.log(e)
            document.onmouseup = closeDragElement;
            document.onmousemove = elementDrag;
        }

        function elementDrag(e) {
            e.preventDefault();
            offsetX = initialX - e.clientX;
            offsetY = initialY - e.clientY;
            initialX = e.clientX;
            initialY = e.clientY;

            win.style.top = (win.offsetTop - offsetY) + "px";
            win.style.left = (win.offsetLeft - offsetX) + "px";
        }

        function closeDragElement() {
            saveWindowState(win.id);
            document.onmouseup = null;
            document.onmousemove = null;
        }
    }

    #windowStyle(width, height, top, left) {
        win.style.width = width;
        win.style.height = height;
        win.style.top = top;
        win.style.left = left;
    }

    #getBaseWindowButtons() {
        return [
            new WindowButton(
                'fullscreen-btn',
                '[ ]',
                () => toggleFullscreen(win)
            ).button,
            new WindowButton(
                'minimize-btn',
                '-',
                () => {
                    minimizeWindow(win.id)
                    saveWindowState(win.id)
                }
            ).button,
            new WindowButton(
                'close-btn',
                'X',
                () => {
                    let winId = win.id;
                    closeWindow(win.id)
                    saveWindowState(winId);
                }
            ).button
        ];
    }
}