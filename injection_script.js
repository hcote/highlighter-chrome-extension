document.getElementsByTagName("body")[0].onmouseup = activateExtension();

var highlights = {};
var url = window.location.href.toString();
var text, range, hTag, savedText, key, querySelector, hex;

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
};

function assignQuerySelector() {
    if (!hTag.className) {
        querySelector = hTag.tagName.toLowerCase();
    } else {
        // need to replace className string spaces with dots 
        // (that's how querySelectorAll grabs elements with multiple classes)
        querySelector = hTag.tagName.toLowerCase() + "." + hTag.className.split(' ').join('.');
    }
};

function saveHighlight() {
    chrome.storage.local.get('highlights', (results) => { 
        highlights = results.highlights
        // if no stored highlights for URL, initialize empty obj for text: qS value pairs
        if (!results.highlights[url]) {
            highlights[url] = {};            
        }
        assignQuerySelector();    
        highlights[url][savedText.anchorNode.parentElement.innerHTML] = [querySelector, hTag.innerText.indexOf(savedText.toString().trim()), hTag.innerHTML.indexOf(savedText.toString().trim())];
        chrome.storage.local.set({highlights}, () => {
        });
    });
};

function removeHighlight() {
    savedText.anchorNode.parentElement.style.backgroundColor = 'transparent';
        chrome.storage.local.get('highlights', (results) => {            
        highlights = results.highlights;
        delete highlights[url][savedText.anchorNode.parentElement.innerHTML]
        chrome.storage.local.set({highlights}, () => { 
        });
    });
};

function executeHighlight() {
    document.execCommand("HiliteColor", false, '#CFFFDF');
}

function addClassToSelectedText() {
    savedText.anchorNode.parentElement.className = "el";
};

function activateExtension() {
    document.designMode = "on";
    grabSelectedText();
    getBlockElementForQS();
    if (savedText.anchorNode.parentElement.style.backgroundColor == 'rgb(199, 255, 216)') {
        removeHighlight();
    } else {
        executeHighlight();
        addClassToSelectedText();
        saveHighlight();
    }
    document.designMode = "off";
};