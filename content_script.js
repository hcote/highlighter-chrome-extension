var url = window.location.href.toString();
var DOM = document.body;
var highlights, note;

function searchForHighlights() {
  chrome.storage.local.get("highlights", results => {
    if (objDoesNotExist(results)) {
      createHighlightObj();
    } else {
      if (doHighlightsForThisURLExist(results)) {
        return;
      } else {
        applyHighlights(results.highlights[url]);
        addPromptToTargets();
      }
    }
  });
}

function objDoesNotExist(results) {
  if (
    results === "undefined" ||
    (Object.entries(results).length === 0 && results.constructor === Object)
  ) {
    return true;
  }
}

function createHighlightObj() {
  highlights = {};
  // active = {
  //   active: true
  // };
  chrome.storage.local.set({ highlights }, () => {});
  // chrome.storage.local.get("active", results => {});
  return;
}

function doHighlightsForThisURLExist(results) {
  if (!results.highlights[url]) {
    return true;
  }
}

function applyHighlights(pageHighlights) {
  console.log("Highlights Found For This URL");
  for (key in pageHighlights) {
    if (!(pageHighlights[key].toString().charAt(0) === "#")) {
      var nodeList = document.body.querySelectorAll(pageHighlights[key][0]); // NodeList(4) [queryselector, ...]
      for (let i = 0; i < nodeList.length; i++) {
        if (
          pageHighlights[key][1] === nodeList[i].innerText.indexOf(key) ||
          pageHighlights[key][2] === nodeList[i].innerText.indexOf(key)
        ) {
          grabNoteIfExists(pageHighlights);
          nodeList[i].innerHTML = nodeList[i].innerHTML.replace(
            key,
            `<span style="background-color: ${pageHighlights["color"] ||
              "#CFFFDF"};" class="el" title="${note}">` +
              key +
              "</span>"
          );
        }
      }
    }
  }
}

function grabNoteIfExists(phls) {
  if (phls[key][3] != undefined) {
    note = phls[key][3].toString();
  } else {
    note = "";
  }
}

searchForHighlights();

function addPromptToTargets() {
  var nodes = document.getElementsByClassName("el");
  for (let i = 0; i < nodes.length; i++) {
    nodes[i].ondblclick = () => {
      note = prompt("Add a comment for this highlight: ", nodes[i].title);
      if (note != null) {
        chrome.storage.local.get("highlights", results => {
          highlights = results.highlights;
          highlight = highlights[url][nodes[i].innerHTML];
          highlight[3] = note;
          nodes[i].title = note;
          chrome.storage.local.set({ highlights }, () => {});
        });
      }
    };
  }
}
