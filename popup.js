var highlights;
var newColor = document.getElementById('colorPicker');

function setColor(e) {
  chrome.storage.local.get('highlights', (results) => {
    highlights = results.highlights;
    highlights[color] = newColor.value;
    chrome.storage.local.set({highlights}, () => {
      console.log('New Color Set');
      console.log(highlights);
    });
  })
}

// function log(e) {
//   console.log(e.target.value);
// }

window.onload = function() {
  document.getElementById('set').addEventListener('click', setColor);
}
