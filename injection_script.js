document.getElementsByTagName("body")[0].onmouseup = activateExtension();

var highlights = {};
var url = window.location.href.toString();
var text, range, hTag, savedText, qSelect;

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
        qSelect = hTag.tagName.toLowerCase();
    } else {
        qSelect = hTag.tagName.toLowerCase() + "." + hTag.className;
    }
};

function saveHighlight() {
    chrome.storage.sync.get('highlights', (results) => {            
        if (!results.highlights[url]) {
            highlights[url] = {};
        } else {
            highlights = results.highlights;
        }
        assignQuerySelector();
        highlights[url][savedText.anchorNode.textContent] = [qSelect, hTag.innerText.indexOf(savedText)];
        chrome.storage.sync.set({highlights}, () => {
        });
    });
};

function removeHighlight() {
    hTag.style.backgroundColor = 'transparent';
        chrome.storage.sync.get('highlights', (results) => {            
        highlights = results.highlights;        
        delete highlights[url][savedText.anchorNode.textContent]
        chrome.storage.sync.set({highlights}, () => { 
        });
    });
};

function executeHighlight() {
    document.execCommand("HiliteColor", false, '#C7FFD8');
}

function activateExtension() {
    document.designMode = "on";
    grabSelectedText();

    if (hTag.style.backgroundColor == 'rgb(199, 255, 216)') {
        removeHighlight();
    } else {
        executeHighlight();
        saveHighlight();
    }

    document.designMode = "off";
};