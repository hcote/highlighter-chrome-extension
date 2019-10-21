chrome.storage.local.get("active", results => {
  console.log(results.active);
  if (results.active) {
    document.getElementsByTagName("body")[0].onmouseup = grabText();
  }
});

var highlights = {};
var url = window.location.href.toString();
var text, range, hTag, savedText, key, querySelector, hex;

function rgbToHex(r, g, b) {
  var rgb = b | (g << 8) | (r << 16);
  return (0x1000000 | rgb).toString(16).substring(1);
}

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
  window.getSelection().anchorNode.parentElement.style.backgroundColor =
    "transparent";
  chrome.storage.local.get("highlights", results => {
    highlights = results.highlights;
    delete highlights[url][savedText.anchorNode.parentElement.innerHTML];
    chrome.storage.local.set({ highlights }, () => {});
  });
}

function executeHighlight(c) {
  document.execCommand("HiliteColor", false, c);
}

function addClassToSelectedText() {
  savedText.anchorNode.parentElement.className = "el";
}

// function activateExtension() {
//   document.designMode = "on";
//   grabSelectedText();
//   getBlockElementForQS();
//   if (
//     savedText.anchorNode.parentElement.style.backgroundColor ==
//     "rgb(199, 255, 216)"
//   ) {
//     removeHighlight();
//   } else {
//     executeHighlight();
//     addClassToSelectedText();
//     saveHighlight();
//   }
//   document.designMode = "off";
// }

// function executeHighlight() {
//   console.log(storedColor);
//   document.execCommand("HiliteColor", false, storedColor);
// }

// function addClassToSelectedText() {
//   savedText.anchorNode.parentElement.className = "el";
// }

function activateExtension() {
  document.designMode = "on";
  chrome.storage.local.get("highlights", results => {
    if (
      results.highlights != undefined &&
      results.highlights[url] != undefined &&
      results.highlights[url]["color"] != undefined
    ) {
      highlights = results.highlights;
      storedColor = highlights[url]["color"] || "rgb(207, 255, 223)";
    } else {
      storedColor = "rgb(207, 255, 223)";
    }
    var n = storedColor.replace(/^\D+/g, "");
    var c = n.split(")");
    var q = c[0];
    var rgbColor = q.split(",");
    hex = rgbToHex(...rgbColor);
    grabSelectedText();
    getBlockElementForQS();
    console.log(storedColor);
    console.log(savedText.anchorNode.parentElement.style.backgroundColor);
    if (savedText.anchorNode.parentElement.style.backgroundColor == hex) {
      console.log("removing hl");
      removeHighlight();
    } else {
      executeHighlight(hex);
      addClassToSelectedText();
      saveHighlight();
    }
    document.designMode = "off";
  });
}

function grabText() {
  var sel = window.getSelection(),
    range = sel.getRangeAt(0),
    s,
    e;
  // if (range.toString().length > 0) {
  function getBlockNode(r) {
    // if item is block element, grab it to compare
    if (
      (r.startContainer.parentElement != "SPAN" ||
        r.startContainer.parentElement != "A" ||
        r.startContainer.parentElement != "CODE" ||
        r.startContainer.parentElement != "STRONG" ||
        r.startContainer.parentElement != "EM" ||
        r.startContainer.parentElement != "I") &&
      (r.endContainer.parentElement != "SPAN" ||
        r.endContainer.parentElement != "A" ||
        r.endContainer.parentElement != "CODE" ||
        r.endContainer.parentElement != "STRONG" ||
        r.endContainer.parentElement != "EM" ||
        r.endContainer.parentElement != "I")
    ) {
      s = r.startContainer.parentElement;
      e = r.endContainer.parentElement;
    } else {
      // if item is inline, go again
      getBlockNode(r);
    }
  }
  getBlockNode(range);
  if (s.isSameNode(e)) {
    activateExtension();
  }
  // } else {
  // console.log("no highlight found");
}

// function showTT(r) {
//   var rect = r.getBoundingClientRect();
//   var span = document.createElement("SPAN");
//   span.id = "tooltip";
//   span.style.backgroundColor = "#000";
//   span.innerText = "highlight";
//   span.style.width = "70px";
//   span.style.textAlign = "center";
//   span.style.borderRadius = "8px";
//   span.style.color = "#FFF";
//   span.style.display = "inline-block";
//   span.style.padding = "8px";
//   span.style.top = rect.y - 35 + "px";
//   span.style.left = (rect.left - rect.right) / 2 + rect.right + "px";
//   document.body.appendChild(span);
// }
