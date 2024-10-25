import { classWindows } from "./common.js";
class Menu {
    static addToMenu(windowId) {
        const listItem = document.createElement('li');
        listItem.id = `menu-${windowId}`;
        listItem.textContent = `Окно ${+(windowId.replace('window', '')) + 1}`;
        listItem.onclick = () => classWindows.get(windowId)?.restore();
        let el = document.getElementById('windowList');
        if (el) {
            el.appendChild(listItem);
        }
        else {
            throw new Error(`window with id ${windowId} didn't put to menu`);
        }
    }
    static removeFromMenu(windowId) {
        const listItem = document.getElementById(`menu-${windowId}`);
        if (listItem) {
            listItem.remove();
        }
    }
    static isWindowInMenu(windowId) {
        let menuItemId = `menu-${windowId}`;
        return document.getElementById(menuItemId) !== null;
    }
}
export { Menu };
//# sourceMappingURL=menu.js.map