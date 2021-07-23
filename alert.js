const ALERT_EMPTY_FIELD = 0;
const ALERT_CANCELLED = 1;

function alert_CreateElement(parent, tag, className, id, innerHTML, misc) {
    let elem = document.createElement(tag);
    if (className) elem.className = className;
    if (id) elem.id = id;
    if (innerHTML) elem.innerHTML = innerHTML;
    if (misc) {
        for (let x in misc) {
            elem[x] = misc[x];
        }
    }
    parent.appendChild(elem);
    return elem;
}

function initialiseAlert() {
    let mask = alert_CreateElement(document.body, 'div', 'v-flex-centered', 'alert-mask');
    let alert = alert_CreateElement(mask, 'div', 'v-flex-centered', 'alert');
    let alertH = alert_CreateElement(alert, 'div', '', 'alert-header');
    let alertB = alert_CreateElement(alert, 'div', '', 'alert-body');
    let alertF = alert_CreateElement(alert, 'div', '', 'alert-footer');
    let alertA = alert_CreateElement(alertF, 'button', '', 'alert-action', 'Action');
    let alertC = alert_CreateElement(alertF, 'button', '', 'alert-close', 'Close');
    document.getElementById('alert-close').onclick = hideAlert();
}

function createAlert(title, body, mode, callback, callbackLabel) {
    const mask = document.getElementById('alert-mask');
    const alert = document.getElementById('alert');
    // setting mask's display to flex makes every child visible
    mask.style.display = 'flex';
    mask.style.animation = '0.2s fade-out reverse';
    alert.style.animation = '0.2s ease-in pop';
    let close = document.getElementById('alert-close');
    // close button is only hidden in case of an error dialog, so we set this to block by default

    close.style.display = 'block';
    if (mode === 'error') {
        close.style.display = 'none'; // no point letting user continue on a broken site
        if (!callback) {
            // if no callback is supplied, this means there's no action and thus no buttons are present.
            // in such a case, we hide the footer
            document.getElementById('alert-footer').style.display = 'none';
        }
    } else {
        close.onclick = hideAlert;
    }

    let action = document.getElementById('alert-action');
    if (callback) { // if callback exists, enable the button for it and set the click action
        action.style.display = 'block';
        action.innerHTML = callbackLabel;
        action.onclick = function() {
            callback();
        }
    } else {
        action.style.display = 'none';
    }

    document.getElementById('alert-header').innerHTML = title; // set dialog title
    document.getElementById('alert-body').innerHTML = body; // set dialog body
}

function hideAlert() {
    document.getElementById('alert-mask').style.animation = '0.19s fade-out forwards';
    setTimeout(() => {
        document.getElementById('alert-mask').style.display = 'none';
    }, 200);
}

function createPrompt(title, msg, callback, callbackLabel, onErr) {
    const mask = document.getElementById('alert-mask');
    const alert = document.getElementById('alert');
    document.getElementById('alert-header').innerHTML = title; // set dialog title
    const body = document.getElementById('alert-body');
    const wrapper = document.createElement('div');
    wrapper.className = 'v-flex-centered';

    body.innerHTML = '';

    // setting mask's display to flex makes every child visible
    mask.style.display = 'flex';
    mask.style.animation = '0.2s fade-out reverse';
    alert.style.animation = '0.2s ease-in pop';

    let txt = document.createTextNode(msg);

    wrapper.appendChild(txt);

    let field = document.createElement('input');
    field.type = 'text';

    wrapper.appendChild(field);
    body.appendChild(wrapper);

    let action = document.getElementById('alert-action');
    action.style.display = 'block';
    action.innerHTML = callbackLabel || 'Submit';
    action.onclick = function() {
        if (field.value) {
            callback(field.value);
            hideAlert();
        } else {
            if (onErr) onErr(ALERT_EMPTY_FIELD);
        }
    }

    let close = document.getElementById('alert-close');
    close.onclick = function() {
        hideAlert();
        if (onErr) onErr(ALERT_CANCELLED);
    }
}

window.addEventListener('DOMContentLoaded', function() {
    initialiseAlert();
});