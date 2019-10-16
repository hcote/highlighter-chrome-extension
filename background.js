chrome.commands.onCommand.addListener(command => {
  // if (command === "highlight_text") {
  //   chrome.tabs.query({ active: true }, tab => {
  //     chrome.tabs.executeScript(tab.id, { file: "injection_script.js" });
  //     chrome.tabs.executeScript(tab.id, { file: "comment_script.js" });
  //     chrome.tabs.insertCSS(tab.id, { file: "style.css" });
  //   });
  // }
  if (command === "clear_storage") {
    chrome.tabs.query({ active: true }, tab => {
      chrome.tabs.executeScript(tab.id, { file: "clear_storage.js" });
    });
  }
});

chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab) {
  if (changeInfo.status == "complete") {
    chrome.tabs.executeScript(tab.id, { file: "injection_script.js" });
    chrome.tabs.executeScript(tab.id, { file: "comment_script.js" });
    chrome.tabs.insertCSS(tab.id, { file: "style.css" });
  }
});
