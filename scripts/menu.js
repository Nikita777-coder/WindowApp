import { classWindows } from "./common.js";

/**
 * Add window to menu
 * @param windowId
 */
export function addToMenu(windowId) {
    const listItem = document.createElement('li');
    listItem.id = `menu-${windowId}`;
    listItem.textContent = `Окно ${+(windowId.replace('window', '')) + 1}`;
    listItem.onclick = () => classWindows.get(windowId).restoreWindow();
    document.getElementById('windowList').appendChild(listItem);
}

export function removeFromMenu(windowId) {
    const listItem = document.getElementById(`menu-${windowId}`);

    if (listItem) {
        listItem.remove();
    }
}

export function isWindowInMenu(windowId) {
    let menuItemId = `menu-${windowId}`;
    return document.getElementById(menuItemId) !== null;
}