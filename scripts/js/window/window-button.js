/**
 * Create new Button in window
 * @param className
 * @param textContent - button displayed name or symbols
 * @param onClick
 * @constructor
 */
export function WindowButton(className, textContent, onClick) {
    this.button = document.createElement('button');
    this.button.className = className;
    this.button.textContent = textContent;
    this.button.onclick = onClick;

    Object.defineProperty(this, 'button', {
        configurable: false
    });
}