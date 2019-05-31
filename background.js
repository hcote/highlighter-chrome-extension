chrome.browserAction.onClicked.addListener(function (tab) {
    chrome.tabs.insertCSS(tab.id, {file: "highlighter.css"});
    chrome.tabs.executeScript(tab.id, {file: "injection_script.js"});
});
