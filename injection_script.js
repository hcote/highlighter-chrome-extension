

// chrome.runtime.sendMessage({greeting: "hello"}, function(response) {
//     console.log(response.farewell);
//   }
// );

document.getElementsByTagName("body")[0].onmouseup = highlight();

function highlight() {
    document.designMode = "on";
    // Im reinitializing highlights var every highlight
    // which is why its always being overridden
    var highlights = {};
    var url = window.location.href.toString();
    highlights[url] = [];
    var text = window.getSelection();
    var range = window.getSelection().getRangeAt(0);
    text.removeAllRanges();
    text.addRange(range);

    if (text.anchorNode.parentElement.style.backgroundColor == 'rgb(199, 255, 216)') {
        text.anchorNode.parentElement.style.backgroundColor = 'transparent';
        // THIS CANNOT BE TACKLED UNTIL I GET THE GLOBAL VARIABLE SETTLED
        // highlights[url].forEach(element => {
        //     console.log(element);
            
        // });
    } else {
        document.execCommand("HiliteColor", false, '#C7FFD8');
        highlights[url].push(text.anchorNode.parentElement.innerText);
    }

    document.designMode = "off";

    // NEED TO MAKE IT SO IF YOU UNHIGHLIGHT IT REMOVES THE STRING FROM 
    // SEARCH OBJECT FOR STRING AND IF YOU FIND IT AND IT'S ALONE REMOVE IT
    // BUT IF ITS IN THE MIDDLE OF OTHER STRINGS SPLIT THEM INTO THEIR OWN ARRAY ELEMENTS

    chrome.storage.sync.set({highlights}, () => {
        console.log('data saved: ' + highlights[url][0]);        
    });

};




// function highlight() {
//     let span = document.createElement('span');
//     window.getSelection().getRangeAt(0).surroundContents(span);
//     span.className = "highlighted";
// };

//     "highlights" = {
//         googlecom: [text],
//         yahoocom: [text2, text3],
//     }
// }
