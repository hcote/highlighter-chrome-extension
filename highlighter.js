function highlight() {
        // text is an object of the element(s) you highlight
        var text = window.getSelection();
        console.log(text);
        
        // <span>...</span>
        let span = document.createElement('SPAN');
        console.log(span);
        
        // need to use the toString() to turn object into a string
        span.textContent = text.toString();
        console.log(span.textContent);
        
        // range now represents the range that was highlighted
        let range = text.getRangeAt(0);
        console.log(range);
        
        // delete contents of range
        range.deleteContents();

        // insert contents of highlighted values into highlighted range
        range.insertNode(span);

        // style it with a background color
        span.style.backgroundColor = "#C7FFD8";
};

console.log('highlighter turned on');
document.getElementsByTagName("body")[0].onmouseup = highlight();
if (document.getElementsByTagName("body")[0].onmouseup) {
    console.log(true);
    
}
// window.addEventListener('mouseup', highlight());

