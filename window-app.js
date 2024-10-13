let windowCounter = 0;
let windows = [];

document.getElementById('addWindowBtn').addEventListener('click', () => {
    createWindow();
});

function createWindow() {
    const win = document.createElement('div');
    win.className = 'window';
    win.id = `window${windowCounter}`;

    const header = document.createElement('div');
    header.className = 'window-header';

    const title = document.createElement('span');
    title.textContent = `Окно ${windowCounter + 1}`;

    const closeButton = document.createElement('button');
    closeButton.className = 'close-btn';
    closeButton.textContent = 'X';
    closeButton.onclick = () => closeWindow(win.id);

    const minimizeButton = document.createElement('button');
    minimizeButton.className = 'minimize-btn';
    minimizeButton.textContent = '-';
    minimizeButton.onclick = () => minimizeWindow(win.id);

    const fullscreenButton = document.createElement('button');
    fullscreenButton.className = 'fullscreen-btn';
    fullscreenButton.textContent = '[ ]';
    fullscreenButton.onclick = () => toggleFullscreen(win);

    header.appendChild(title);
    header.appendChild(minimizeButton);
    header.appendChild(fullscreenButton);
    header.appendChild(closeButton);

    win.appendChild(header);

    document.body.appendChild(win);

    makeDraggable(win);

    windows.push({ id: win.id, isMinimized: false, isFullscreen: false });
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
    listItem.textContent = `Окно ${windowId.replace('window', '')}`;
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

function recreateWindow(windowId) {
    const win = document.createElement('div');
    win.className = 'window';
    win.id = windowId;

    const header = document.createElement('div');
    header.className = 'window-header';

    const title = document.createElement('span');
    let number = +(windowId.replace('window', '')) + 1;
    title.textContent = `Окно ${number}`;

    const closeButton = document.createElement('button');
    closeButton.className = 'close-btn';
    closeButton.textContent = 'X';
    closeButton.onclick = () => closeWindow(win.id);

    const minimizeButton = document.createElement('button');
    minimizeButton.className = 'minimize-btn';
    minimizeButton.textContent = '-';
    minimizeButton.onclick = () => minimizeWindow(win.id);

    const fullscreenButton = document.createElement('button');
    fullscreenButton.className = 'fullscreen-btn';
    fullscreenButton.textContent = '[ ]';
    fullscreenButton.onclick = () => toggleFullscreen(win);

    header.appendChild(title);
    header.appendChild(minimizeButton);
    header.appendChild(fullscreenButton);
    header.appendChild(closeButton);

    win.appendChild(header);

    document.body.appendChild(win);

    makeDraggable(win);
}

function deepCloseWindow(windowId) {
    closeWindow(windowId);

    const listItem = document.getElementById(`menu-${windowId}`);
    if (listItem) {
        listItem.remove();
    }
}

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

            windows.forEach(window => recreateWindow(window.id));
            savedClosedWindows.forEach(window => minimizeWindow(window.id))
        } else {
            windows.forEach(window => deepCloseWindow(window.id));
            windowCounter = 0;
        }
    }
});