let windowCounter = 0;
let windows = [];

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

function createWindow(windowId) {
    const win = document.createElement('div');
    win.className = 'window';
    win.id = windowId;

    const header = document.createElement('div');
    header.className = 'window-header';

    const title = document.createElement('span');
    title.textContent = `Окно ${+(windowId.replace('window', '')) + 1}`;
    header.appendChild(title);

    getBaseWindowButtons(win).forEach(button => header.appendChild(button));

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

function minimizeWindow(windowId) {
    const win = document.getElementById(windowId);
    if (win) {
        win.style.display = 'none';
        const windowInfo = windows.find(w => w.id === windowId);
        windowInfo.isMinimized = true;
        addToMenu(windowId);
    }
}

function addToMenu(windowId) {
    const listItem = document.createElement('li');
    listItem.id = `menu-${windowId}`;
    listItem.textContent = `Окно ${+(windowId.replace('window', '')) + 1}`;
    listItem.onclick = () => restoreWindow(windowId);
    document.getElementById('windowList').appendChild(listItem);
}

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

function toggleFullscreen(win) {
    const windowInfo = windows.find(w => w.id === win.id && w.isMinimized === false);
    if (windowInfo.isFullscreen) {
        win.style.width = '300px';
        win.style.height = '200px';
        win.style.top = '100px';
        win.style.left = '100px';
        windowInfo.isFullscreen = false;
    } else {
        win.style.width = '100vw';
        win.style.height = '100vh';
        win.style.top = '0';
        win.style.left = '0';
        windowInfo.isFullscreen = true;
    }
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