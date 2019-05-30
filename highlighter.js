
// function highlight() {
//     let span = document.createElement('span');
//     window.getSelection().getRangeAt(0).surroundContents(span);
//     span.className = "highlighted";
// };

document.getElementsByTagName("body")[0].onmouseup = highlight();

function highlight() {
    document.designMode = "on";
    var text = window.getSelection();
    var range = window.getSelection().getRangeAt(0);
    text.removeAllRanges();
    text.addRange(range);
    if (text.anchorNode.parentElement.style.backgroundColor == 'rgb(199, 255, 216)') {
        text.anchorNode.parentElement.style.backgroundColor = 'transparent';        
    } else {
        document.execCommand("HiliteColor", false, '#C7FFD8');
    }
    
    document.designMode = "off";
};