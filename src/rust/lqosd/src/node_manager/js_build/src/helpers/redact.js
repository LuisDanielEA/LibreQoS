export function initRedact() {
    let modeSwitch = document.getElementById("redactSwitch");
    modeSwitch.checked = isRedacted();
    modeSwitch.onclick = () => {
        let modeSwitch = document.getElementById("redactSwitch");
        if (modeSwitch.checked) {
            localStorage.setItem("redact", "true");
        } else {
            localStorage.setItem("redact", "false");
        }
        cssRedact();
    };
    cssRedact();
}

export function redactCell(cell) {
    cell.classList.add("redactable");
}

function cssRedact() {
    console.log("cssRedact called");
    if (isRedacted()) {
        let r = document.querySelector(':root');
        r.style.setProperty('--redact', 'blur(4px)');
    } else {
        let r = document.querySelector(':root');
        r.style.setProperty('--redact', 'none');
    }
}

function isRedacted() {
    let prefs = localStorage.getItem("redact");
    if (prefs === null) {
        localStorage.setItem("redact", "false");
        return false;
    }
    if (prefs === "false") {
        return false;
    }
    if (prefs === "true") {
        return true;
    }
}
