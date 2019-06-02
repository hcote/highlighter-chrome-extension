chrome.commands.onCommand.addListener((command) => {
    if (command === "highlight_text") {
        chrome.tabs.query({'active': true}, (tab) => {
            chrome.tabs.insertCSS(tab.id, {file: "highlighter.css"});
            chrome.tabs.executeScript(tab.id, {file: "injection_script.js"});
        })
    };
    if (command === "clear_storage") {
        chrome.tabs.query({'active': true}, (tab) => {
            chrome.tabs.executeScript(tab.id, {file: "clear_storage.js"});
        })
    }
});
