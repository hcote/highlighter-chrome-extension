document.body.onmouseup = activateExtension();
// document.body.onmouseup = showTT();

// ////////////////////////////////////////////////
function isActive() {
  chrome.storage.local.get("active", results => {
    return results.active.active;
  });
}
// ////////////////////////////////////////////////

var highlights = {};
var url = window.location.href.toString();
var text, range, hTag, savedText, key, querySelector, hex;

chrome.storage.local.get("active", res => {
  console.log(res);
});

function getBlockElementForQS() {
  if (
    hTag.tagName == "A" ||
    hTag.tagName == "CODE" ||
    hTag.tagName == "EM" ||
    hTag.tagName == "STRONG" ||
    hTag.tagName == "SPAN"
  ) {
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
}

function assignQuerySelector() {
  if (!hTag.className) {
    querySelector = hTag.tagName.toLowerCase();
  } else {
    // need to replace className string spaces with dots
    // (that's how querySelectorAll grabs elements with multiple classes)
    querySelector =
      hTag.tagName.toLowerCase() + "." + hTag.className.split(" ").join(".");
  }
}

function saveHighlight() {
  chrome.storage.local.get("highlights", results => {
    highlights = results.highlights;
    // if no stored highlights for URL, initialize empty obj for text: qS value pairs
    if (!results.highlights[url]) {
      highlights[url] = {};
    }
    assignQuerySelector();
    highlights[url][savedText.anchorNode.parentElement.innerHTML] = [
      querySelector,
      hTag.innerText.indexOf(savedText.toString().trim()),
      hTag.innerHTML.indexOf(savedText.toString().trim())
    ];
    chrome.storage.local.set({ highlights }, () => {});
  });
}

function removeHighlight() {
  savedText.anchorNode.parentElement.style.backgroundColor = "transparent";
  chrome.storage.local.get("highlights", results => {
    highlights = results.highlights;
    delete highlights[url][savedText.anchorNode.parentElement.innerHTML];
    chrome.storage.local.set({ highlights }, () => {});
  });
}

function executeHighlight() {
  document.execCommand("HiliteColor", false, "#CFFFDF");
}

function addClassToSelectedText() {
  savedText.anchorNode.parentElement.className = "el";
}
function activateExtension() {
  document.designMode = "on";
  grabSelectedText();
  getBlockElementForQS();
  if (
    savedText.anchorNode.parentElement.style.backgroundColor ==
    "rgb(199, 255, 216)"
  ) {
    removeHighlight();
  } else {
    executeHighlight();
    addClassToSelectedText();
    saveHighlight();
  }
  document.designMode = "off";
}

// function showTT() {
//   if (window.getSelection().getRangeAt(0)) {
//     var sel = window.getSelection();
//     var sel_text = sel.toString();
//     var span = document.createElement("SPAN");
//     span.classList.add("toHL");
//     span.innerText = sel_text;
//     var range = window.getSelection().getRangeAt(0);
//     range.deleteContents();
//     range.insertNode(span);

//     var tt = document.createElement("DIV");
//     tt.innerHTML = "Highlight";
//     tt.style.textAlign = "center";
//     tt.style.borderRadius = "8px";
//     tt.style.padding = "5px";
//     tt.style.fontSize = "14px";
//     // tt.style.visibility = "hidden";
//     tt.style.backgroundColor = "rgba(38, 39, 41)";
//     tt.style.color = "aliceblue";
//     tt.style.position = "absolute";
//     tt.id = "tt";
//     document.getElementsByClassName("toHL")[0].appendChild(tt);
//   }
//   document.getElementById("tt").addEventListener("click", function() {
//     this.style.visibility = "hidden";
//   });
// }
