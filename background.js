// extension injects JS ONLY when icon is clicked
let status = false;

chrome.browserAction.onClicked.addListener(function (tab) {
    if (status === false) {
        status = true;
        // chrome.browserAction.setIcon({path: "images/icon-active.png"});
        chrome.tabs.executeScript(tab.id, {file: "highlighter.js"});
    } else {
        status = false;
    }
});