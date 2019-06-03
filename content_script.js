var url = window.location.href.toString();
var DOM = document.body;
var pageHighlights, highlights;

function applyHighlightsIfExist() {
    chrome.storage.sync.get('highlights', (results) => {
        if (objDoesNotExist(results)) {
            createHighlightObj();
        } else {
            if (doHighlightsForThisURLExist(results)) {
                console.log('Highlights Obj Found - No Highlights Stored for this URL');
                return;
            } else {
                console.log('Highlights Obj Found For This URL');
                pageHighlights = results.highlights;
                applyHighlights(pageHighlights, url);
            }
        }
    });
}

function createHighlightObj() {
    highlights = {};
    chrome.storage.sync.set({highlights}, () => {
        console.log('Highlights Obj Not Found - Storing Empty Obj "highlights"');        
    });
    return;
}

function applyHighlights(pHls, url) {
    for (key in pHls[url]) {
        var nodeList = document.body.querySelectorAll(pHls[url][key][0]); // NodeList(4) [queryselector, ...]
        for (let i = 0; i < nodeList.length; i++) {
            if (pHls[url][key][1] === nodeList[i].innerHTML.indexOf(key)) {                
                nodeList[i].innerHTML = nodeList[i].innerHTML.replace(key, '<span style="background-color: rgb(199, 255, 216);">'+key+'</span>');
            }
        }
    }
};

function objDoesNotExist(results) {
    if (results === 'undefined' || Object.entries(results).length === 0 && results.constructor === Object) {
        return true;
    }
}

function doHighlightsForThisURLExist(results) {
    if (!results.highlights[url]) {
        return true;
    }
}

applyHighlightsIfExist();
