document.getElementsByTagName("body")[0].onmouseup = highlight();
var highlights = {};

function highlight() {

    document.designMode = "on";
    var url = window.location.href.toString();
    var text = window.getSelection();
    var range = window.getSelection().getRangeAt(0);
    text.removeAllRanges();
    text.addRange(range); // {Selection obj, anchorNode, focusNode, etc}
    var hTag = text.anchorNode.parentElement; // <p>...</p>
    var savedText = text;
    var qSelect;

    function assignQSelector() {
        if (!hTag.className) {
            qSelect = hTag.tagName.toLowerCase();
        } else {
            qSelect = hTag.tagName.toLowerCase() + "." + hTag.className;
        }
    }    
    
    // highlight / remove highlight
    if (hTag.style.backgroundColor == 'rgb(199, 255, 216)') {
        hTag.style.backgroundColor = 'transparent';
        chrome.storage.sync.get('highlights', (results) => {            
            highlights = results.highlights;
            delete highlights[savedText.anchorNode.textContent]
            chrome.storage.sync.set({highlights}, () => {                       
            });
        });
    } else {
        document.execCommand("HiliteColor", false, '#C7FFD8');
        chrome.storage.sync.get('highlights', (results) => {            
            // if its the first time highlighting on this page,
            // results.highlights[url] will not exist, so we initialize
            // an empty array for new highlights to be stored on this page
            // where the url is the new key
            if (!results.highlights[url]) {
                highlights[url] = {};
            } else {
                highlights = results.highlights;
            }
            assignQSelector();
            highlights[url][savedText.anchorNode.textContent] = [qSelect, hTag.innerText.indexOf(savedText)];
            chrome.storage.sync.set({highlights}, () => {
                console.log(highlights);        
            });
        });
    }
    document.designMode = "off";
};