console.log('content_script loaded');

let url = window.location.href.toString();
let pageHighlights;

chrome.storage.sync.get('highlights', (results) => {
    pageHighlights = results.highlights[url];
    console.log(pageHighlights);
    if (!pageHighlights) {
        console.log('No highlights stored for this page');
    } else {
        console.log('There are highlights for this page');
    }
    // (pageHighlights == 'undefined') ? console.log('No highlights stored for this page') : console.log('error');
});

// search through text and wrap each matching string
// from pageHighlights in a span tag
function applyHighlights(pageHighlights) {
    let DOM = document.body;
    console.log(pageHighlights);
    
}

// chrome.storage.sync.get('key2', (result) => {
//     console.log(result);
// });