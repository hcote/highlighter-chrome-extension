var url = window.location.href.toString();

document.addEventListener("DOMContentLoaded", function() {
  var tab1 = document.getElementsByClassName("tablinks")[0];
  tab1.addEventListener("click", () => {
    openTab(event, "toggle");
  });
  var tab2 = document.getElementsByClassName("tablinks")[1];
  tab2.addEventListener("click", () => {
    openTab(event, "notes");
    chrome.storage.local.get("highlights", results => {
      // query for current tab URL
      var query = { active: true, currentWindow: true };
      function callback(tabs) {
        var notesDiv = document.getElementsByClassName("notesDiv")[0];
        notesDiv.style.display = "block";
        var loader = document.getElementsByClassName("loader")[0];
        loader.style.display = "none";
        var currentTab = tabs[0];
        var notesPs = Object.keys(results.highlights[currentTab.url])
          .reverse()
          .map(el => {
            return `<p>${el}</p>`;
          });
        Object.keys(results.highlights[currentTab.url]).length > 0
          ? (notesDiv.innerHTML = notesPs)
          : (notesDiv.innerHTML = `No notes stored for ${currentTab.url}`);
      }
      chrome.tabs.query(query, callback);
    });
  });
  var tab3 = document.getElementsByClassName("tablinks")[2];
  tab3.addEventListener("click", () => {
    openTab(event, "color");
  });
});

// CHANGE TABS
function openTab(evt, tabName) {
  var i, tabcontent, tablinks;
  tabcontent = document.getElementsByClassName("tabcontent");
  for (i = 0; i < tabcontent.length; i++) {
    tabcontent[i].style.display = "none";
  }
  tablinks = document.getElementsByClassName("tablinks");
  for (i = 0; i < tablinks.length; i++) {
    tablinks[i].className = tablinks[i].className.replace(" active", "");
  }
  document.getElementById(tabName).style.display = "block";
  evt.currentTarget.className += " active";
}

var t = document.getElementsByClassName("slider")[0];
t.addEventListener("click", () => {
  activate();
});

// TOGGLE
function activate() {
  chrome.storage.local.get("active", results => {
    if (results.active) {
      chrome.storage.local.set({ active: false }, () => {
        var on = document.getElementsByClassName("on")[0];
        on.style.display = "none";
        var off = document.getElementsByClassName("off")[0];
        off.style.display = "block";
      });
    } else {
      chrome.storage.local.set({ active: true }, () => {
        var on = document.getElementsByClassName("on")[0];
        on.style.display = "block";
        var off = document.getElementsByClassName("off")[0];
        off.style.display = "none";
      });
    }
  });
}

// GET NOTES
function getNotes() {
  console.log("got notes...");
}

// CHANGE COLOR
var highlights;
var newColor = document.getElementById("colorPicker");

function setColor(e) {
  chrome.storage.local.get("highlights", results => {
    highlights = results.highlights;
    highlights[color] = newColor.value;
    chrome.storage.local.set({ highlights }, () => {
      console.log("New Color Set");
      console.log(highlights);
    });
  });
}

// notes
// function log(e) {
//   console.log(e.target.value);
// }

// window.onload = function() {
//   document.getElementById('set').addEventListener('click', setColor);
//   this.console.log("fjrcj");
// };
