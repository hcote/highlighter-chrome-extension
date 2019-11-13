// chrome.storage.local.get("active", results => {
//   if (results.active) {
document.getElementsByTagName("body")[0].onmouseup = grabText();
//   }
// });

var highlights = {};
var url = window.location.href.toString();
var text, range, hTag, savedText, key, querySelector, hex;

function rgbToHex(r, g, b) {
  var rgb = b | (g << 8) | (r << 16);
  return (
    "#" +
    (0x1000000 | rgb)
      .toString(16)
      .substring(1)
      .toUpperCase()
  );
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

function activateExtension() {
  document.designMode = "on";
  chrome.storage.local.get("highlights", results => {
    if (
      results.highlights != undefined &&
      results.highlights[url] != undefined &&
      results.highlights[url]["color"] != undefined
    ) {
      highlights = results.highlights;
      storedColor = highlights[url]["color"].toUpperCase() || "#CFFFDF";
    } else {
      storedColor = "#CFFFDF";
    }
    grabSelectedText();
    getBlockElementForQS();
    if (window.getSelection().anchorNode.parentElement.style.backgroundColor) {
      var n = window
        .getSelection()
        .anchorNode.parentElement.style.backgroundColor.replace(/^\D+/g, "");
      var c = n.split(")");
      var q = c[0];
      var rgbColor = q.split(",");
      hex = rgbToHex(...rgbColor);
      if (hex == storedColor.toUpperCase()) {
        removeHighlight();
      } else {
        executeHighlight(storedColor.toUpperCase());
        addClassToSelectedText();
        saveHighlight();
      }
    } else {
      executeHighlight(storedColor.toUpperCase());
      addClassToSelectedText();
      saveHighlight();
    }
    document.designMode = "off";
  });
}

function grabText() {
  var sel = window.getSelection(),
    range = sel.getRangeAt(0),
    sc = range.startContainer,
    ec = range.endContainer,
    s,
    e;
  function getStartNode(r) {
    // if item is block element, grab it to compare
    if (
      r.parentElement.tagName != "SPAN" &&
      r.parentElement.tagName != "A" &&
      r.parentElement.tagName != "CODE" &&
      r.parentElement.tagName != "STRONG" &&
      r.parentElement.tagName != "EM" &&
      r.parentElement.tagName != "I"
    ) {
      s = r.parentElement;
      console.log(`pE start: ${r.parentElement.tagName}`);
      console.log(`s: ${s}`);
    } else {
      s = r.parentElement;
      // if item is inline, go again
      getStartNode(s);
    }
  }
  function getEndNode(r) {
    // if item is block element, grab it to compare
    if (
      r.parentElement.tagName != "SPAN" &&
      r.parentElement.tagName != "A" &&
      r.parentElement.tagName != "CODE" &&
      r.parentElement.tagName != "STRONG" &&
      r.parentElement.tagName != "EM" &&
      r.parentElement.tagName != "I"
    ) {
      e = r.parentElement;
    } else {
      // if item is inline, go again
      e = r.parentElement;
      getEndNode(e);
    }
  }
  getStartNode(sc);
  getEndNode(ec);
  if (s.isSameNode(e) || s.isSameNode(ec.previousElementSibling)) {
    activateExtension();
  }
}
