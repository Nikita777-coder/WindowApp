import { isWindowInMenu } from "../menu.js";

class WindowUtils {
    static findFirstWindowNotInMenu(excludeWindowId) {
        return Array.from(document.body.children).reverse().find((child) => child.id !== excludeWindowId && String(child.id).includes("window") && !isWindowInMenu(child.id));
    }
    
    static isAnyWindowInDocument() {
        return Array.from(document.body.children).some((child) => String(child.id).includes("window"));
    }
}

export {WindowUtils};