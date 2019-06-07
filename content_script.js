var url = window.location.href.toString();
var DOM = document.body;
var highlights;

function searchForHighlights() {
    chrome.storage.local.get('highlights', (results) => {
        if (objDoesNotExist(results)) {
            createHighlightObj();
        } else {
            if (doHighlightsForThisURLExist(results)) {
                return;
            } else {
                applyHighlights(results.highlights[url]);
                console.log(results);
            }
        }
    });
}

function objDoesNotExist(results) {
    if (results === 'undefined' || Object.entries(results).length === 0 && results.constructor === Object) {
        return true;
    }
}

function createHighlightObj() {
    highlights = {
        color: 'rgb(199, 255, 216)'
    };
    chrome.storage.local.set({highlights}, () => {        
    });
    return;
}

function doHighlightsForThisURLExist(results) {
    if (!results.highlights[url]) {
        return true;
    }
}

function applyHighlights(pageHighlights) {
    console.log('Highlights Found For This URL');
    for (key in pageHighlights) {
        var nodeList = document.body.querySelectorAll(pageHighlights[key][0]); // NodeList(4) [queryselector, ...]
        for (let i = 0; i < nodeList.length; i++) {
            // console.log();
            if (pageHighlights[key][1] === nodeList[i].innerText.indexOf(key)) {
                nodeList[i].innerHTML = nodeList[i].innerHTML.replace(key, '<span style="background-color: rgb(199, 255, 216);">'+key+'</span>');
            }
            if (pageHighlights[key][2] === nodeList[i].innerText.indexOf(key)) {                
                nodeList[i].innerHTML = nodeList[i].innerHTML.replace(key, '<span style="background-color: rgb(199, 255, 216);">'+key+'</span>');
            }
        }
    }
}


searchForHighlights();
