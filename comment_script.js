var nodes = document.getElementsByClassName("el");
var note, highlights;
var url = window.location.href.toString();

for (let i = 0; i < nodes.length; i++) {
  nodes[i].ondblclick = () => {
    note = prompt('Add a comment for this highlight: ')
    chrome.storage.local.get('highlights', (results) => {
      highlights = results.highlights;
      highlight = highlights[url][nodes[i].innerHTML];
      highlight[3] = note;
      nodes[i].title = note;
      console.log(highlights);
      chrome.storage.local.set({highlights}, () => {
      });
    });
  };
}

// document.getElementsByTagName("body")[0].ondblclick = () => {prompt('clicked a body')};