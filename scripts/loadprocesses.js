import { makeElementCurrent } from "./common.js";

function createProgressBar(text) {
    let progressBar = document.createElement('progress');
    progressBar.max = 100;
    progressBar.value = 0;

    let label = document.createElement('label');
    label.textContent = text;
    label.htmlFor = progressBar.id;

    let container = document.createElement('div');
    container.className = 'container-progress-bar';
    container.id = `container-${text}`;

    container.appendChild(label);
    container.appendChild(progressBar);
    document.body.appendChild(container);

    return container;
}

export function simulateFileUpload(text, ms) {
    return new Promise((resolve, reject) => {
        window.onbeforeunload = (event) => {
            event.preventDefault();
        };

        document.body.style.pointerEvents = 'none';

        let container = createProgressBar(text);
        makeElementCurrent(container);

        let width = 0;
        let interval = setInterval(() => {
            width += Math.floor(Math.random() * 16 + 5);
            container.children[1].value = width;

            if (width >= 100) {
                window.onbeforeunload = (event) => {};
                clearInterval(interval);
                resolve(container);
                document.body.style.pointerEvents = 'auto';
            }
        }, ms);
    });
}