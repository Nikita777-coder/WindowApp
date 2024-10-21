let windowCounter = 0;
let windows = [];
let previousCurrentElementZIndex;

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

    win.appendChild(header);
    win.addEventListener('mousedown', () => makeElementCurrent(win));

    document.body.appendChild(win);
    defineStartWinCoordinates(win);
    makeElementCurrent(win);
    makeDraggable(win);
}

function extractNumFromWinId(winId) {
    return Number(winId.match(/\d+(\.\d+)?/)[0]);
}

function makeElementCurrent(window) {
    window.style.zIndex = '1';

    if (previousCurrentElementZIndex) {
        window.style.zIndex = `${previousCurrentElementZIndex + 1}`;
    }

    previousCurrentElementZIndex = +window.style.zIndex;
}

function createNewWindow() {
    const winId = `window${windowCounter}`;
    createWindow(winId);

    let newWin = document.getElementById(winId);
    windows.push({ id: winId, isMinimized: false, isFullscreen: false, top: newWin.style.top, left: newWin.style.left, zIndex: newWin.style.zIndex});
    windowCounter++;
    saveWindowState(winId)
}

function closeWindow(windowId) {
    const win = document.getElementById(windowId);
    if (win) {
        win.remove();
        windows = windows.filter(w => w.id !== windowId);
        windowCounter = Math.max(...windows.map(child => {
            return extractNumFromWinId(child.id);
        }))
        windowCounter++;
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
        
        makeElementCurrent(win);
        saveWindowState(windowId);
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

    win.addEventListener('mousedown', (e) => dragMouseDown(e)); 

    function dragMouseDown(e) {
        e.preventDefault();
        initialX = e.clientX;
        initialY = e.clientY;
        console.log(e.clientX, e.clientY)
        console.log(e)
        makeElementCurrent(win);
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

        windows.forEach(window => {
            createWindow(window.id)

            let newWin = document.getElementById(window.id);
            newWin.style.top = window.top;
            newWin.style.left = window.left;
            newWin.style.zIndex = window.zIndex;
        });
        savedClosedWindows.forEach(window => minimizeWindow(window.id))
    } else {
        windowCounter = 0;
    }
}

function restoreWindowsParams() {
    windows.forEach(window => {
        let documentWinChildStyle = document.getElementById(window.id).style;

        window.top = documentWinChildStyle.top;
        window.left = documentWinChildStyle.left;
        window.zIndex = documentWinChildStyle.zIndex;
    })
}

function createProgressBar(text) {
    let progressBar = document.createElement('progress');
    progressBar.max = 100;
    progressBar.value = 0;

    let label = document.createElement('label');
    label.textContent = text;
    label.htmlFor = progressBar.id;

    let container = document.createElement('div');
    container.id = text;
    container.style.position = 'fixed';
    container.style.top = '50%';
    container.style.left = '50%';
    container.style.transform = 'translate(-50%, -50%)';  
    container.style.textAlign = 'center';  
    container.style.backgroundColor = 'rgba(0, 0, 0, 0.7)';  
    container.style.padding = '20px';
    container.style.borderRadius = '10px';
    container.style.color = 'white';  

    container.appendChild(label);
    container.appendChild(progressBar);
    document.body.appendChild(container);
}

function simulateFileUpload(text, ms) {
    return new Promise((resolve, reject) => {
        document.body.style.pointerEvents = 'none';

        createProgressBar(text)
        let container = document.getElementById(text)
        makeElementCurrent(container);

        let width = 0;
        let interval = setInterval(() => {
            width += Math.floor(Math.random() * 16 + 5);
            container.children[1].value = width;

            if (width >= 100) {
                clearInterval(interval);
                resolve(container);
                document.body.style.pointerEvents = 'auto';
            }
        }, ms);
    });
}

function restoreWindowParams(winId) {
    windows.filter(el => el.id === winId).forEach(window => {
        let documentWinChildStyle = document.getElementById(window.id).style;

        window.top = documentWinChildStyle.top;
        window.left = documentWinChildStyle.left;
        window.zIndex = documentWinChildStyle.zIndex;
    })
}

function saveWindowState(winId) {
    simulateFileUpload(`Информация об окне ${+(winId.replace('window', '')) + 1} сохраняется: `, 500).then((container) => {
        container.remove();
        restoreWindowParams(winId);
        localStorage.setItem('windows', JSON.stringify(windows));
        localStorage.setItem('windowCounter', JSON.stringify(windowCounter));
    });
}

window.addEventListener('load', () => {
    simulateFileUpload("Получение окон с сервера: ", 1000).then((container) => {
        container.remove();
        reboot(); 
    });
});

window.addEventListener('unhandledrejection', function(event) {
    document.body.style.pointerEvents = 'auto';
});
