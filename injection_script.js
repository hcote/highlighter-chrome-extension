document.getElementsByTagName("body")[0].onmouseup = activateExtension();

var highlights = {};
var url = window.location.href.toString();
var text, range, hTag, savedText, key, querySelector, hex, clonedContents;

function getBlockElementForQS() {
    if (hTag.tagName == "A" || hTag.tagName == "CODE" || hTag.tagName == "EM" || hTag.tagName == "STRONG" ||  hTag.tagName == "SPAN") {
        hTag = hTag.parentElement;
        getBlockElementForQS();
    }
}

function grabSelectedText() {
    text = window.getSelection();
    range = window.getSelection().getRangeAt(0);
    hTag = text.anchorNode.parentElement;
    savedText = text;
    text.removeAllRanges();
    text.addRange(range);
    clonedContents = range.cloneContents().childNodes;
    
    // console.log(range.cloneContents().childNodes);
    
};

function assignQuerySelector(i) {    
    if (!i.className) {
        querySelector = i.tagName.toLowerCase();
    } else {
        // need to replace className string spaces with dots 
        // (that's how querySelectorAll grabs elements with multiple classes)
        querySelector = i.tagName.toLowerCase() + "." + i.className.split(' ').join('.');
    }
};

function saveHighlight() {    
    chrome.storage.local.get('highlights', (results) => { 
        highlights = results.highlights
        // if no stored highlights for URL, initialize empty obj for text: qS value pairs
        if (!results.highlights[url]) {
            highlights[url] = {};            
        }
        clonedContents.forEach((i) => {
            if (i.nodeType === 1) {
                // console.log(i);
                // only 'el' gets added to class list on the first element
                assignQuerySelector(i);    
                addClassToSelectedText(i);
                highlights[url][i.innerHTML] = [querySelector, hTag.innerText.indexOf(savedText.toString().trim()), hTag.innerHTML.indexOf(savedText.toString().trim())];
                chrome.storage.local.set({highlights}, () => {
                });
            }
        })
        
    });
};

function removeHighlight() {
    savedText.anchorNode.parentElement.style.backgroundColor = 'transparent';
        chrome.storage.local.get('highlights', (results) => {            
        highlights = results.highlights;
        delete highlights[url][clonedContents]
        chrome.storage.local.set({highlights}, () => { 
        });
    });
};

function executeHighlight() {
    document.execCommand("HiliteColor", false, '#CFFFDF');
    
}

function addClassToSelectedText(i) {
    i.classList.add = "el";
};

function activateExtension() {
    document.designMode = "on";
    grabSelectedText();
    getBlockElementForQS();
    if (savedText.anchorNode.parentElement.style.backgroundColor == 'rgb(199, 255, 216)') {
        removeHighlight();
    } else {
        executeHighlight();
        // addClassToSelectedText();
        saveHighlight();
    }
    document.designMode = "off";
};