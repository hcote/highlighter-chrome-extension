var nodes = document.getElementsByClassName("el");
var note, highlights;
var url = window.location.href.toString();

for (let i = 0; i < nodes.length; i++) {
  nodes[i].ondblclick = () => {
    note = prompt('Add a comment for this highlight: ', nodes[i].title);
    if (note != null) {
      chrome.storage.local.get('highlights', (results) => {
        highlights = results.highlights;
        highlight = highlights[url][nodes[i].innerHTML];
        highlight[3] = note;
        nodes[i].title = note;
        chrome.storage.local.set({highlights}, () => {
        });
      });
    }
  };
}