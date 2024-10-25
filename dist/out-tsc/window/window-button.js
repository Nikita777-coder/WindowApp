/**
 * Create new Button in window
 * @param className
 * @param textContent - button displayed name or symbols
 * @param onClick
 * @constructor
 */
export class Button {
    constructor(className, textContent, onclick) {
        this._button = document.createElement('button');
        this._button.className = className;
        this._button.textContent = textContent;
        this._button.onclick = onclick;
        Object.freeze(this._button);
    }
    get button() {
        return this._button;
    }
}
//# sourceMappingURL=window-button.js.map