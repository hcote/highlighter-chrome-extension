console.log('content_script loaded');

let url = window.location.href.toString();
let pageHighlights;



chrome.storage.sync.get('highlights', (results) => {
    console.log('data retrieved');
    pageHighlights = results.highlights;
    console.log(results.highlights);
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