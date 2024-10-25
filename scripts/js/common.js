export let highestZIndex = 1;

export let windowCounter = 0;
export let windowsCash = [];
export let classWindows = new Map();

export function increaseWindowCounter() {
    ++windowCounter;
}

export function setValue(key, value) {
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

export function makeElementCurrent(win) {
    win.style.zIndex = `${++highestZIndex}`;
}