document.getElementsByTagName("body")[0].onmouseup = highlight();

var highlights = {};

function highlight() {

    document.designMode = "on";
    var url = window.location.href.toString();
    var text = window.getSelection();
    var range = window.getSelection().getRangeAt(0);
    text.removeAllRanges();
    text.addRange(range); // {Selection obj, anchorNode, focusNode, etc}
    var hTag = text.anchorNode.parentElement; // <span bg=(rgba)>...</span>
    var savedText = text;
    var qSelect;

    function assignQSelector() {
        if (!hTag.className) {
            qSelect = hTag.tagName.toLowerCase();
        } else {
            qSelect = hTag.tagName.toLowerCase() + "." + hTag.className;
        }
    }

    console.log(qSelect);
    
    
    // highlight / remove highlight
    if (hTag.style.backgroundColor == 'rgb(199, 255, 216)') {
        hTag.style.backgroundColor = 'transparent';
        chrome.storage.sync.get('highlights', (results) => {            
            highlights = results.highlights;
            delete highlights[savedText.anchorNode.textContent]


            // var index = highlights[url].indexOf(savedText.anchorNode.textContent);
            // var removedEl = highlights[url].splice(index, 1);
            chrome.storage.sync.set({highlights}, () => {
                console.log('element removed: ' + savedText.anchorNode.textContent); 
                console.log(highlights);
                       
            });
        });
    } else {
        document.execCommand("HiliteColor", false, '#C7FFD8');
        // async -- need this to access highlights object
        chrome.storage.sync.get('highlights', (results) => {            
            // if its the first time highlighting on this page,
            // results.highlights[url] will not exist, so we initialize
            // an empty array for new highlights to be stored on this page
            // where the url is the new key
            if (!results.highlights[url]) {
                highlights[url] = {};
            } else {
                highlights = results.highlights;
                console.log(highlights);
                
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

// highlights = {
//     googlecom: {
//         text1: ["query selector", indexOf]
//         text2: ["query selector", indexOf]
//     },
//     yahoocom: {
//         text3: ["query selector", indexOf],
//         text4: ["query selector", indexOf]
//     },
// }
