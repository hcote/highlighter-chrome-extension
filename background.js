chrome.commands.onCommand.addListener((command) => {
    if (command === "clear_storage") {
    chrome.tabs.query({'active': true}, (tab) => {
            chrome.tabs.executeScript(tab.id, {file: "clear_storage.js"});  
            alert('made it')
        })
    }
});

chrome.browserAction.onClicked.addListener((tab) => {
    chrome.tabs.insertCSS(tab.id, {file: "highlighter.css"});
    chrome.tabs.executeScript(tab.id, {file: "injection_script.js"});
});

