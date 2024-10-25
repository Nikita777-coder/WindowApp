import { Menu } from "../menu";

class WindowUtils {
    static findFirstWindowNotInMenu(excludeWindowId: string) {
        return Array.from(document.querySelectorAll<HTMLElement>(".window"))
            .reverse()
            .find((child) => child.id !== excludeWindowId && String(child.id)
            .includes("window") && !Menu.isWindowInMenu(child.id));
    }
    
    static isAnyWindowInDocument() {
        return Array.from(document.body.children).some((child) => String(child.id).includes("window"));
    }
}

export {WindowUtils};