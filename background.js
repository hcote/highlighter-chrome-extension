chrome.commands.onCommand.addListener((command) => {
    if (command === "highlight_text") {
        chrome.tabs.query({'active': true}, (tab) => {
            chrome.tabs.executeScript(tab.id, {file: "injection_script.js"});
            chrome.tabs.executeScript(tab.id, {file: "comment_script.js"});
        })
    };
    if (command === "clear_storage") {
        chrome.tabs.query({'active': true}, (tab) => {
            chrome.tabs.executeScript(tab.id, {file: "clear_storage.js"});
        })
    }
});

// chrome.tabs.getSelected(null, (tab) => {
// })

chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
    if (changeInfo.status == 'complete') {
        chrome.tabs.executeScript(tab.id, {file: "comment_script.js"}, () => {
            if (chrome.runtime.lastError) {
                console.log(chrome.runtime.lastError.message);
            }
        });        
    }
}); 