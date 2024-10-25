import { Menu } from "../menu.js";
class WindowUtils {
    static findFirstWindowNotInMenu(excludeWindowId) {
        return Array.from(document.querySelectorAll(".window"))
            .reverse()
            .find((child) => child.id !== excludeWindowId && String(child.id)
            .includes("window") && !Menu.isWindowInMenu(child.id));
    }
    static isAnyWindowInDocument() {
        return Array.from(document.body.children).some((child) => String(child.id).includes("window"));
    }
}
export { WindowUtils };
//# sourceMappingURL=window-utils.js.map