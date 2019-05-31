document.getElementsByTagName("body")[0].onmouseup = highlight();

// must be outside og highlights scope or else elements are not added to [url] array
var highlights = {};

function highlight() {

    document.designMode = "on";
    var url = window.location.href.toString();
    var text = window.getSelection();
    var range = window.getSelection().getRangeAt(0);
    text.removeAllRanges();
    text.addRange(range); // {Selection obj, anchorNode, focusNode, etc}
    var hTag = text.anchorNode.parentElement; // <span bg=(rgba)>...</span>

    // highlight / remove highlight
    if (hTag.style.backgroundColor == 'rgb(199, 255, 216)') {
        hTag.style.backgroundColor = 'transparent';
        // TO DO: loop through highlights[url] to remove highlight
    } else {
        document.execCommand("HiliteColor", false, '#C7FFD8');
        // async
        // returns undefined but passes data as callback param
        chrome.storage.sync.get('highlights', (results) => {
            console.log(results.highlights);
            
            // if its the first time highlighting on this page,
            // results.highlights[url] will not exist, so we initialize
            // an empty array for new highlights to be stored on this page
            // where the url is the new key
            if (!results.highlights[url]) {
                highlights[url] = [];
            } else {
                highlights = results.highlights;
            }
            // (results.highlights[url] == 'undefined') ? highlights[url] = [] : highlights = results.highlights;

            highlights[url].push(hTag.innerText);
            console.log(highlights);
            chrome.storage.sync.set({highlights}, () => {
                console.log('data saved: ' + highlights[url]);        
            });
        });

        

    }

    document.designMode = "off";

    // NEED TO MAKE IT SO IF YOU UNHIGHLIGHT IT REMOVES THE STRING FROM 
    // SEARCH OBJECT FOR STRING AND IF YOU FIND IT AND IT'S ALONE REMOVE IT
    // BUT IF ITS IN THE MIDDLE OF OTHER STRINGS SPLIT THEM INTO THEIR OWN ARRAY ELEMENTS
        
};

//     "highlights" = {
//         googlecom: [text],
//         yahoocom: [text2, text3],
//     }
// }
