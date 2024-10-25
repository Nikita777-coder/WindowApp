import { classWindows } from "./common";

class Menu {
    static addToMenu(windowId: string) {
        const listItem = document.createElement('li');
        listItem.id = `menu-${windowId}`;
        listItem.textContent = `Окно ${+(windowId.replace('window', '')) + 1}`;
        listItem.onclick = () => classWindows.get(windowId)?.restore();
        let el = document.getElementById('windowList');

        if (el) {
            el.appendChild(listItem);
        } else {
            throw new Error(`window with id ${windowId} didn't put to menu`);
        }
    }

    static removeFromMenu(windowId: string): void {
        const listItem = document.getElementById(`menu-${windowId}`);

        if (listItem) {
            listItem.remove();
        }
    }

    static isWindowInMenu(windowId: string): boolean {
        let menuItemId = `menu-${windowId}`;
        return document.getElementById(menuItemId) !== null;
    }
}

export {Menu}