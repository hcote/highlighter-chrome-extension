
function highlight() {
    if (window.getSelection()) {
        // text is an object of the element(s) you highlight
        var text = window.getSelection();

        // <span>...</span>
        let span = document.createElement('SPAN');

        // need to use the toString() to turn object into a string
        span.textContent = text.toString();

        // range now represents the range that was highlighted
        let range = text.getRangeAt(0);

        // delete contents of range
        range.deleteContents();

        // insert contents of highlighted values into highlighted range
        range.insertNode(span);

        // style it with a background color
        span.style.backgroundColor = "rgba(50, 171, 50, .2)";
    }
}

