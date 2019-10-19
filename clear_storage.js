var url = window.location.href.toString();

chrome.storage.local.get("highlights", results => {
  var highlights = results.highlights;
  if (highlights[url]) {
    highlights[url] = {};
    chrome.storage.local.set({ highlights }, () => {
      console.log(`Storage Cleared for ${url}`);
    });
  }
});
