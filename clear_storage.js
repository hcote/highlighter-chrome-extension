var highlights = {}
var url = window.location.href.toString();

highlights[url] = {};

chrome.storage.sync.set({highlights}, () => {
  console.log('storage cleared');
  console.log(highlights[url]);       
});