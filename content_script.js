console.log('content_script loaded');

var url = window.location.href.toString();
var pageHighlights;
var highlights;

// grab highlights obj from storage
chrome.storage.sync.get('highlights', (results) => {
    // if one doesnt exist, create and store one (should only apply before first highlight)
    if (results === 'undefined' || Object.entries(results).length === 0 && results.constructor === Object) {
        highlights = {};
        chrome.storage.sync.set({highlights}, () => {
            console.log('Highlights Obj Not Found - Storing Empty Obj "highlights"');        
        });
        return;
    } else {
        // if it does exist, see if highlights stored for this url
        if (!results.highlights[url]) {
            console.log('Highlights Obj Found - No Highlights Stored for this URL');
            return;
        } else {
            // if there are, load & apply highlights
            pageHighlights = results.highlights[url];
            console.log('Highlights Obj Found For This URL');
            console.log(pageHighlights);
        }
    }
});

// search through text and wrap each matching string
// from pageHighlights in a span tag
function applyHighlights(pageHighlights) {
    let DOM = document.body;
    console.log(pageHighlights);
    
};