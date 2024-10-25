/**
 * Create new Button in window
 * @param className
 * @param textContent - button displayed name or symbols
 * @param onClick
 * @constructor
 */
export class Button {
    private readonly _button: HTMLButtonElement;

    constructor(className: string, textContent: string, onclick: (this: GlobalEventHandlers, ev: MouseEvent) => any) {
        this._button = document.createElement('button');
        this._button.className = className;
        this._button.textContent = textContent;
        this._button.onclick = onclick;

        Object.freeze(this._button);
    }

    get button(): HTMLButtonElement {
        return this._button;
    }
}