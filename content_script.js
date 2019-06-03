console.log('content_script loaded');

var url = window.location.href.toString();
var pageHighlights;
var highlights;
var DOM = document.body;

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
            pageHighlights = results.highlights;
            console.log('Highlights Obj Found For This URL');
            console.log(pageHighlights);
            applyHighlights(pageHighlights, url)
        }
    }
});

// search through text and wrap each matching string
// from pageHighlights in a span tag
function applyHighlights(pHls, url) {
    for (qS in pHls[url]) {
        console.log(qS); // key
        console.log(pHls[url][qS]); // value (queryselector)
        var nodeList = document.body.querySelectorAll(pHls[url][qS][0]); // NodeList(4) [queryselector, ...]
        for (let i = 0; i < nodeList.length; i++) {
            if (pHls[url][qS][1] === nodeList[i].innerHTML.indexOf(qS)) {
                console.log(pHls[url][qS][1]);
                console.log(nodeList[i].innerHTML.indexOf(qS));
                
                nodeList[i].innerHTML = nodeList[i].innerHTML.replace(qS, '<span style="background-color: rgb(199, 255, 216);">'+qS+'</span>');
            }
        }
    }
};


