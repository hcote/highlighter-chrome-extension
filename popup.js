var url = window.location.href.toString();
var notes, hlights;

// EXPAND NOTES VIEW
var exp = document.getElementById("expand");

function expand() {
  var faExp = document.getElementsByClassName("fa-expand")[0];
  var faCom = document.getElementsByClassName("fa-compress")[0];
  // var sb = document.getElementsByClassName("searchBar")[0];
  // sb.classList.add("wide-search");
  faExp.style.display = "none";
  faCom.style.display = "block";
  document.body.classList.add("wide-body");
}

exp.addEventListener("click", expand);

var com = document.getElementById("compress");
function compress() {
  var faExp = document.getElementsByClassName("fa-expand")[0];
  var faCom = document.getElementsByClassName("fa-compress")[0];
  faExp.style.display = "block";
  faCom.style.display = "none";
  document.body.classList.remove("wide-body");
}

com.addEventListener("click", compress);

// function toggle() {
//   var checkbox = document.getElementsByClassName("checkbox")[0];
//   chrome.storage.local.get("active", results => {
//     // alert(`${JSON.stringify(results.active)}`);
//     if (results.active.active || results.active) {
//       var on = document.getElementsByClassName("on")[0];
//       on.style.display = "none";
//       var off = document.getElementsByClassName("off")[0];
//       off.style.display = "block";
//       var msg = document.getElementsByClassName("toggle-msg")[0];
//       msg.style.display = "block";
//       var headerMsgOn = document.getElementsByClassName("on-header")[0];
//       headerMsgOn.style.display = "none";
//       var headerMsgOff = document.getElementsByClassName("off-header")[0];
//       headerMsgOff.style.display = "block";
//       chrome.storage.local.set({ active: false }, () => {});
//       checkbox.removeAttribute("checked");
//     } else {
//       var on = document.getElementsByClassName("on")[0];
//       on.style.display = "block";
//       var off = document.getElementsByClassName("off")[0];
//       off.style.display = "none";
//       var msg = document.getElementsByClassName("toggle-msg")[0];
//       msg.style.display = "block";
//       var headerMsgOn = document.getElementsByClassName("on-header")[0];
//       headerMsgOn.style.display = "block";
//       var headerMsgOff = document.getElementsByClassName("off-header")[0];
//       headerMsgOff.style.display = "none";
//       chrome.storage.local.set({ active: true }, () => {});
//       checkbox.setAttribute("checked", true);
//     }
//   });
// }

// function toggle2() {
//   var checkbox = document.getElementsByClassName("checkbox")[0];
//   chrome.storage.local.get("active", results => {
//     if (results.active.active || results.active) {
//       var on = document.getElementsByClassName("on")[0];
//       on.style.display = "block";
//       var off = document.getElementsByClassName("off")[0];
//       off.style.display = "none";
//       var headerMsgOn = document.getElementsByClassName("on-header")[0];
//       headerMsgOn.style.display = "block";
//       var headerMsgOff = document.getElementsByClassName("off-header")[0];
//       headerMsgOff.style.display = "none";
//       checkbox.setAttribute("checked", true);
//     } else {
//       var on = document.getElementsByClassName("on")[0];
//       on.style.display = "none";
//       var off = document.getElementsByClassName("off")[0];
//       off.style.display = "block";
//       var headerMsgOn = document.getElementsByClassName("on-header")[0];
//       headerMsgOn.style.display = "none";
//       var headerMsgOff = document.getElementsByClassName("off-header")[0];
//       headerMsgOff.style.display = "block";
//       checkbox.removeAttribute("checked");
//     }
//   });
// }

document.addEventListener("DOMContentLoaded", function() {
  var footer = document.getElementsByClassName("footer")[0];
  var instructions = document.getElementsByClassName("instructions")[0];
  footer.addEventListener("click", () => {
    if (
      instructions.style.display == "none" ||
      instructions.style.display == ""
    ) {
      instructions.style.display = "block";
      footer.style.height = "510px";
      footer.style.transition = "1s";
      document.getElementsByClassName("instructions-up")[0].style.display =
        "none";
      document.getElementsByClassName("instructions-down")[0].style.display =
        "inline-block";
    } else {
      instructions.style.display = "none";
      footer.style.height = "40px";
      footer.style.transition = "1s";
      document.getElementsByClassName("instructions-up")[0].style.display =
        "inline-block";
      document.getElementsByClassName("instructions-down")[0].style.display =
        "none";
    }
  });

  // toggle2();
  // var checkbox = document.getElementsByClassName("checkbox")[0];

  // checkbox.addEventListener("click", () => {
  //   toggle();
  // });

  // var tab1 = document.getElementsByClassName("tablinks")[0];
  // tab1.addEventListener("click", () => {
  //   openTab(event, "toggle");
  // });

  var tab2 = document.getElementsByClassName("tablinks")[0];
  tab2.addEventListener("click", () => {
    openTab(event, "notes");
    chrome.storage.local.get("highlights", results => {
      var notesDiv = document.getElementsByClassName("notesDiv")[0];
      notesDiv.style.display = "block";

      var searchDiv = document.getElementsByClassName("searchDiv")[0];
      searchDiv.style.display = "block";

      // var urlHeader = document.getElementsByClassName("url-header")[0];
      // urlHeader.style.display = "block";
      // urlHeader.innerHTML = `${currentTab.url}`;
      // all URLs listed as details
      // current URL styled as a color with a tooltip saying current URL
      var loader = document.getElementsByClassName("loader")[0];
      loader.style.display = "none";

      // var notesPs = Object.keys(results.highlights[currentTab.url])
      var sites = Object.keys(results.highlights).map(el => {
        hlights = Object.keys(results.highlights[el]).map(elem => {
          if (!(elem.trim() == "color")) {
            if (results.highlights[el][elem][3]) {
              return `<p class="wrap highlights" style="text-align: left">- ${elem} <em>(note: ${
                results.highlights[el][elem][3]
              })</em></p>`;
            }
            return `<p class="wrap highlights" style="text-align: left">- ${elem}</p>`;
          }
        });
        // ${el.substr( 0, 25)}
        if (
          !(
            results.highlights[el]["color"] &&
            Object.keys(results.highlights[el]).length == 1
          ) &&
          Object.keys(results.highlights[el]).length > 0
        ) {
          if (results.highlights[el]["color"]) {
            return `<details class="detail"> 
                  <summary class="notes-url wrap">${el}<i class='fa fa-chevron-down' style='display: inline-block; margin-right: 6px'></i><a class="url" target="_blank" href="${el}">Link</a><span class="num">${hlights.length -
              1}</span></summary>
                  ${hlights.join("")}
                </details>
                <hr />`;
          } else {
            return `<details class="detail"> 
                  <summary class="notes-url wrap">${el}<i class='fa fa-chevron-down' style='display: inline-block; margin-right: 6px'></i><a class="url" target="_blank" href="${el}">Link</a><span class="num">${
              hlights.length
            }</span></summary>
                  ${hlights.join("")}
                </details>
                <hr />`;
          }
        }
      });
      if (Object.keys(results.highlights).length > 0 && hlights.length > 0) {
        notesDiv.innerHTML = sites.join("");
      } else {
        notesDiv.innerHTML = `No highlights stored yet. Click Instructions to learn how to use it.`;
      }
    });

    // SEARCH FUNCTIONS
    // var search = document.getElementsByClassName("searchBar")[0];

    // search.addEventListener("keyup", () => {
    //   var val = search.value;
    //   alert(val);
    // });
  });

  var tab3 = document.getElementsByClassName("tablinks")[1];
  tab3.addEventListener("click", () => {
    openTab(event, "color");

    // change highlight color in example text
    var colorPicker = document.getElementsByClassName("colorPicker")[0];
    colorPicker.value = "#CFFFDF";
    colorPicker.addEventListener("change", e => {
      var example = document.getElementsByClassName("example-text")[0];
      example.style.backgroundColor = colorPicker.value;
    });

    // make color picker input default value set to the highlight color for current url
    var query = { active: true, currentWindow: true };
    function callback(tabs) {
      var currentTab = tabs[0];
      chrome.storage.local.get("highlights", results => {
        highlights = results.highlights;
        if (highlights[currentTab.url] && highlights[currentTab.url]["color"]) {
          colorPicker.value = highlights[currentTab.url]["color"];
        }
        var example = document.getElementsByClassName("example-text")[0];
        example.style.backgroundColor = colorPicker.value;
      });
    }
    chrome.tabs.query(query, callback);

    // reset color picker value AND update stored current url highlight color
    var resetColor = document.getElementsByClassName("reset")[0];
    resetColor.addEventListener("click", e => {
      e.preventDefault();
      colorPicker.value = "#CFFFDF";
      var example = document.getElementsByClassName("example-text")[0];
      example.style.backgroundColor = colorPicker.value;
      var query = { active: true, currentWindow: true };
      function callback(tabs) {
        var currentTab = tabs[0];
        chrome.storage.local.get("highlights", results => {
          highlights = results.highlights;
          highlights[currentTab.url]["color"] = colorPicker.value;
          chrome.storage.local.set({ highlights }, () => {});
          document.getElementsByClassName(
            "success-msg-reset"
          )[0].style.display = "block";
          document.getElementsByClassName("success-msg")[0].style.display =
            "none";
        });
      }
      chrome.tabs.query(query, callback);
    });

    // change color picker value AND update stored current url highlight color
    var submitNewColor = document.getElementsByClassName("thisWebsite")[0];
    submitNewColor.addEventListener("click", e => {
      e.preventDefault();
      var newColor = document.getElementsByClassName("colorPicker")[0].value;
      var query = { active: true, currentWindow: true };
      function callback(tabs) {
        var currentTab = tabs[0];
        chrome.storage.local.get("highlights", results => {
          highlights = results.highlights;
          if (!highlights[currentTab.url]) {
            highlights[currentTab.url] = {};
            highlights[currentTab.url]["color"] = newColor;
          } else {
            highlights[currentTab.url]["color"] = newColor;
          }
          chrome.storage.local.set({ highlights }, () => {});
          document.getElementsByClassName(
            "success-msg-reset"
          )[0].style.display = "none";
          document.getElementsByClassName("success-msg")[0].style.display =
            "block";
        });
      }
      chrome.tabs.query(query, callback);
    });
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

// CHANGE COLOR
var highlights;
var newColor = document.getElementById("colorPicker");

function setColor(e) {
  chrome.storage.local.get("highlights", results => {
    highlights = results.highlights;
    highlights[color] = newColor.value;
    chrome.storage.local.set({ highlights }, () => {});
  });
}
