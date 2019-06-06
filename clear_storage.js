var highlights = {}
var url = window.location.href.toString();

highlights[url] = {};

chrome.storage.local.set({highlights}, () => {
  console.log('Storage Cleared');
  console.log(highlights);
});