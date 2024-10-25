import { Window } from "./window/window";

export let highestZIndex: number = 1;

export type WindowCash = {
    id: string,
    isMinimized: boolean,
    isFullscreen: boolean,
    top: string,
    left: string,
    zIndex: string,
};

export let windowCounter: number = 0;
export let windowsCash: Array<WindowCash> = [];
export let classWindows: Map<string, Window> = new Map<string, Window>();

export function increaseWindowCounter(): void {
    ++windowCounter;
}

export function setValue(key: string, value: any) {
    switch (key.toLowerCase()) {
        case "windowcounter":
            windowCounter = value;
            break;
        case "windowscash":
            windowsCash = value;
            break;
        case "classwindows":
            classWindows = value;
            break;
        case "highestzindex":
            highestZIndex = value;
            break;
        default:
            throw new Error(`there is no property with name ${key}`);
    }
}

export function makeElementCurrent(win: HTMLDivElement): void {
    win.style.zIndex = `${++highestZIndex}`;
}