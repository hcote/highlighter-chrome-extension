chrome.storage.local.get("active", results => {
  console.log(results.active);
  if (results.active) {
    // document.getElementsByTagName("body")[0].onmouseup = activateExtension();
    document.body.addEventListener("mouseup", () => {
      showTT();
    });
  }
});

var highlights = {};
var url = window.location.href.toString();
var text, range, hTag, savedText, key, querySelector, hex;

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
  console.log(storedColor);
  document.execCommand("HiliteColor", false, storedColor);
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
      storedColor = highlights[url]["color"] || "#CFFFDF";
    } else {
      storedColor = "#CFFFDF";
    }
    grabSelectedText();
    getBlockElementForQS();
    if (
      savedText.anchorNode.parentElement.style.backgroundColor == storedColor
    ) {
      removeHighlight();
    } else {
      executeHighlight();
      addClassToSelectedText();
      saveHighlight();
    }
    document.designMode = "off";
  });
}

// document.body.addEventListener("mouseup", showTT);

// // ////////////////////////////////////////////////
// function isActive() {
//   chrome.storage.local.get("active", results => {
//     return results.active.active;
//   });
// }
// // ////////////////////////////////////////////////

// function grabHighlightColor() {
// chrome.storage.local.get("highlights", results => {
//   if (results.highlights[url]) {
//     highlights = results.highlights;
//     storedColor = highlights[url]["color"] || "#CFFFDF";
//   }
// });
// }

function showTT() {
  var sel = window.getSelection(),
    range = sel.getRangeAt(0),
    s,
    e;
  if (range.toString().length > 0) {
    console.log("you highlighted text");
    console.log(range.innerHTML);
    function getBlockNode(r) {
      // if item is block element, grab it to compare
      if (
        r.startContainer.parentElement != "SPAN" ||
        r.startContainer.parentElement != "A" ||
        r.startContainer.parentElement != "CODE" ||
        r.startContainer.parentElement != "STRONG" ||
        r.startContainer.parentElement != "EM" ||
        r.startContainer.parentElement != "I"
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
  } else {
    console.log("no highlight found");
  }
  // var rect = sel.getRangeAt(0).getBoundingClientRect();

  // var div = document.createElement("span"); // make box
  // div.style.backgroundColor = "#000"; // with outline
  // div.style.color = "fff";
  // div.innerHTML = "Highlight";
  // div.style.position = "absolute";
  // div.style.bottom = rect.bottom + "px";
  // div.style.left = rect.left + "px";

  // document.body.appendChild(div);

  // var tt = document.createElement("DIV");
  // tt.innerHTML = "Highlight";
  // tt.classList.add("fa fa-pencil");
  // tt.style.textAlign = "center";
  // tt.style.borderRadius = "8px";
  // tt.style.padding = "5px";
  // tt.style.fontSize = "14px";
  // // tt.style.visibility = "hidden";
  // tt.style.backgroundColor = "rgba(38, 39, 41)";
  // tt.style.color = "aliceblue";
  // tt.style.position = "absolute";
  // tt.id = "tt";
  // document.getElementsByClassName("toHL")[0].appendChild(tt);
  // }
  // document.getElementById("tt").addEventListener("click", function() {
  //   this.style.visibility = "hidden";
  // });
}
