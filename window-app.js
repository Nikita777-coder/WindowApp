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

function isWindowInMenu(windowId) {
    let menuItemId = `menu-${windowId}`;
    return document.getElementById(menuItemId) !== null;
}

function findFirstWindowNotInMenu(excludeWindowId) {
    return Array.from(document.body.children).reverse().find((child) => child.id !== excludeWindowId && String(child.id).includes("window") && !isWindowInMenu(child.id));
}

function isAnyWindowInDocument() {
    return Array.from(document.body.children).some((child) => String(child.id).includes("window"));
}

function defineStartWinCoordinates(win) {
    let lastWin = document.body.children[document.body.children.length - 2]; 
    let left = document.body.children[document.body.children.length - 1].getBoundingClientRect().left;
    let top = document.body.children[document.body.children.length - 1].getBoundingClientRect().top;

    if (isAnyWindowInDocument()) {
        if (!lastWin || isWindowInMenu(lastWin.id)) {
            lastWin = findFirstWindowNotInMenu(win.id);
        }

        if (lastWin) {
            let coordinates = lastWin.getBoundingClientRect();
            left = coordinates.left + 0.17 * lastWin.offsetWidth;  
            top = coordinates.top + 0.17 * lastWin.offsetWidth;    
        }
    }

    win.style.position = 'absolute';
    win.style.left = left + "px";
    win.style.top = top + "px";
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
    windowTitle.textContent = `Окно ${+(windowId.replace('window', '')) + 1}`;

    const windowControls = document.createElement('div');
    windowControls.className = 'window-controls';

    let baseWindowButtons = getBaseWindowButtons(win);

    baseWindowButtons.forEach(button => windowControls.appendChild(button));

    header.appendChild(windowTitle);
    header.appendChild(windowControls);

    // let maxBackgroundSizeOfButton = baseWindowButtons.reduce(
    //     (value, a) => {
    //         let aRect = a.getBoundingClientRect();
    //
    //         return Math.max(
    //             aRect.height, aRect.width, value
    //         )
    //     }, 0
    // );
    // baseWindowButtons.forEach(button => {
    //     button.style.height = `${maxBackgroundSizeOfButton}px`;
    //     button.style.width = `${maxBackgroundSizeOfButton}px`
    // })

    win.appendChild(header);

    document.body.appendChild(win);
    defineStartWinCoordinates(win);

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

function reboot() {
    let savedWindows = JSON.parse(localStorage.getItem('windows'));
    windows.forEach(window => deepCloseWindow(window.id));

    if (savedWindows) {
        windowCounter = JSON.parse(localStorage.getItem('windowCounter'));
        windows = savedWindows
        let savedClosedWindows = windows.filter(window => window.isMinimized === true);

        windows.forEach(window => createWindow(window.id));
        savedClosedWindows.forEach(window => minimizeWindow(window.id))
    } else {
        windowCounter = 0;
    }
}

window.addEventListener('beforeunload', () => {
    localStorage.setItem('windows', JSON.stringify(windows));
    localStorage.setItem('windowCounter', JSON.stringify(windowCounter));
});

/**
 * Restore elements from previous state and rollback page to this state
 */
window.addEventListener('keydown', (event) => {
    if (event.key === 'r' || event.key === 'R' || event.key === 'F5') {
        event.preventDefault();
        reboot();
    }
});