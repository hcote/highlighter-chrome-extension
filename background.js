
chrome.browserAction.onClicked.addListener(function (tab) {
        chrome.tabs.insertCSS(tab.id, {file: "highlighter.css"});
        chrome.tabs.executeScript(tab.id, {file: "injection_script.js"});
});

// chrome.runtime.onMessage.addListener(
//         function(request, sender, sendResponse) {
//           console.log(sender.tab ?
//                       "from a content script:" + sender.tab.url :
//                       "from the extension");
//           if (request.greeting == "hello")
//             sendResponse({farewell: "goodbye"});
//         }
// );
