let windowCounter = 0;
let windows = [];

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

function getBaseWindowButtons(win) {
    return [
        new WindowButton(
            'fullscreen-btn',
            '[ ]',
            () => toggleFullscreen(win)
        ).button,
        new WindowButton(
            'minimize-btn',
            '-',
            () => minimizeWindow(win.id)
        ).button,
        new WindowButton(
            'close-btn',
            'X',
            () => closeWindow(win.id)
        ).button
    ];
}

/**
 * Create specified button without adding it to windows variable and without counting
 * @param windowId
 */
function createWindow(windowId) {
    const win = document.createElement('div');
    win.className = 'window';
    win.id = windowId;

    const header = document.createElement('div');
    header.className = 'window-header';

    const windowTitle = document.createElement('div');
    windowTitle.className = 'window-title';

    const windowControls = document.createElement('div');
    windowControls.className = 'window-controls';

    const title = document.createElement('span');
    title.textContent = `Окно ${+(windowId.replace('window', '')) + 1}`;
    windowTitle.appendChild(title);

    getBaseWindowButtons(win).forEach(button => windowControls.appendChild(button));

    header.appendChild(windowTitle);
    header.appendChild(windowControls);

    win.appendChild(header);

    document.body.appendChild(win);

    makeDraggable(win);
}

function createNewWindow() {
    const winId = `window${windowCounter}`;
    createWindow(winId);

    windows.push({ id: winId, isMinimized: false, isFullscreen: false });
    windowCounter++;
}

function closeWindow(windowId) {
    const win = document.getElementById(windowId);
    if (win) {
        win.remove();
        windows = windows.filter(w => w.id !== windowId);
    }
}

/**
 * Delete window from page
 * @param windowId
 */
function minimizeWindow(windowId) {
    const win = document.getElementById(windowId);
    if (win) {
        win.style.display = 'none';
        const windowInfo = windows.find(w => w.id === windowId);
        windowInfo.isMinimized = true;
        addToMenu(windowId);
    }
}

/**
 * Add window to menu
 * @param windowId
 */
function addToMenu(windowId) {
    const listItem = document.createElement('li');
    listItem.id = `menu-${windowId}`;
    listItem.textContent = `Окно ${+(windowId.replace('window', '')) + 1}`;
    listItem.onclick = () => restoreWindow(windowId);
    document.getElementById('windowList').appendChild(listItem);
}

/**
 * Delete button from menu and add it to page
 * @param windowId
 */
function restoreWindow(windowId) {
    const win = document.getElementById(windowId);
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
    }
}

function windowStyle(win, width, height, top, left) {
    win.style.width = width;
    win.style.height = height;
    win.style.top = top;
    win.style.left = left;
}

function toggleFullscreen(win) {
    const windowInfo = windows.find(w => w.id === win.id && w.isMinimized === false);

    windowInfo.isFullscreen ?
        windowStyle(win, '300px','200px', '100px', '100px') :
        windowStyle(win, '100vw', '100vh', '0', '0');

    windowInfo.isFullscreen = !windowInfo.isFullscreen;
}

function makeDraggable(win) {
    let offsetX = 0, offsetY = 0, initialX = 0, initialY = 0;
    const header = win.querySelector('.window-header');

    header.onmousedown = dragMouseDown;

    function dragMouseDown(e) {
        e.preventDefault();
        initialX = e.clientX;
        initialY = e.clientY;
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
        document.onmouseup = null;
        document.onmousemove = null;
    }
}

function deepCloseWindow(windowId) {
    closeWindow(windowId);

    const listItem = document.getElementById(`menu-${windowId}`);
    if (listItem) {
        listItem.remove();
    }
}

document.getElementById('addWindowBtn').addEventListener('click', () => {
    createNewWindow();
});

window.addEventListener('beforeunload', () => {
    localStorage.setItem('windows', JSON.stringify(windows));
    localStorage.setItem('windowCounter', JSON.stringify(windowCounter));
});

/**
 * Restore elements from previous state and rollback page to this state
 */
window.addEventListener('keydown', (event) => {
    if (event.key === 'r' || event.key === 'R') {
        let savedWindows = JSON.parse(localStorage.getItem('windows'));

        if (savedWindows) {
            windowCounter = JSON.parse(localStorage.getItem('windowCounter'));
            windows = savedWindows
            let savedClosedWindows = windows.filter(window => window.isMinimized === true);

            windows.forEach(window => createWindow(window.id));
            savedClosedWindows.forEach(window => minimizeWindow(window.id))
        } else {
            windows.forEach(window => deepCloseWindow(window.id));
            windowCounter = 0;
        }
    }
});