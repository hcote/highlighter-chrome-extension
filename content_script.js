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
            // applyHighlights(pageHighlights)
        }
    }
});

// search through text and wrap each matching string
// from pageHighlights in a span tag
function applyHighlights(pHls) {
    recurseDOM(DOM, pHls)
};

// replaces first instance only
function recurseDOM(node, pHls) {  
    // If node is a text node
    if (node.nodeType === 3) { 
        console.log(node);       
        // for (let i = 0; i < pHls.length; i++) {
        //     node.innerHTML = node.innerHTML.replace(i, '...');
        // }
    }
    // else recurse for each child node
    else {
      for(var i=0; i<node.childNodes.length; i++)
      recurseDOM(node.childNodes[i], pHls);
    }
  }

