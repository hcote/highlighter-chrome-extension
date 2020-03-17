## MarkIt Highlighter
This is a chrome extension <a href="https://chrome.google.com/webstore/detail/markit-highlighter-and-no/oilpcbohncpdjdadofhbldfmojneciop?hl=en-US" target="_blank">link</a> that lets you highlight important text on any web page. Revisit the page in 1 minute, 1 week, or 1 year - your data will always be there.

## Technologies
1. (Vanilla) JavaScript
2. Google API

## Features
1. Highlight any text and hit Command+K to save it automatically
2. User can clear the stored highlights for any URL with one simple command, Command+Shift+A
3. Syncs across all devices - if you highlight text from a laptop, then look at the same web page from your phone, your highlights will be there (if you are logged in to Chrome on both). 

## My Stored Data Structure (Object)
```
highlights = {
    google.com: {
        text1: ["query selector", index, note, color]
        text2: ["query selector", index, note, color]
    },
    yahoo.com: {
        text3: ["query selector", index, note, color],
        text4: ["query selector", index, note, color]
    },
    https://developer.mozilla.org/en-US/docs/Web/API/document/execCommand: {
        "When an HTML document has been switched to designMode, its document object exposes an execCommand": ["p.summary", 20],
        "A DOMString specifying the name of the command to execute. See Commands for a list of possible commands.": ["p", 0, "example note", #CFFFDF]
    }
}
```

## How It Works

I have two scripts that load on every page. The first is background.js which listens for a specific event. The event Command+K triggers a function that injects a script into the browser (injection_script.js), which highlights selected text. 

To highlight, drag your mouse over some text, and hit Command+K. This triggers a function which calls several others. Sequence of events:
1. Grabs selected text
2. Turns Design Mode "on", allowing us to make temporary changes to the DOM
3. If the background is already highlighted, then we need to remove the highlight:
    1. Selects the < span > tag surrounding text and sets style.backgroundColor = transparent (remove the highlight)
    2. Gets the 'highlights' object from storage - <code>chrome.storage.get()</code>
    3. Loops through all keys (which is the saved highlights) to look for a match, and deletes it from storage
4. Else, wrap the text in a < span > and apply the background color 
5. On page refresh: Retrieve 'highlights' from storage
    1. If there is no data for the active URL, set the key to the current URL and value to an empty object (aol.com: {})
    2. If there is, grab the highlights data structure from storage (chrome.storage.get())
6. Retrieve and assign a valid query selector value for the selected text (this will be used to query the DOM and apply the highlights later. Refer to the object structure above for clarification)
    1. If the parent element of the highlighted text has a class name, store a string "element.className" ("p.firstParagraph", "h2.sectionHeader", etc)
    2. If there is no class name, store the string "element" ("p", "h2", "li", etc)
7. Give the key (highlighted text) a value (an array containing 2 values - first, the query selector & second, the index of where the selected text occured in the parent element)
    1. I store the index of the string because if I only stored the text and query selector, say you highlighted "the" under a "p" tag, when applying the highlights if you refresh the page, every single occurence of "the" in a "p" tag will get highlighted. Adding the indexOf value lets me verify that the indexes match the DOM and only then apply the highlight, so I'm applying the highlight to the correct word.
8. Store the updated highlights variable containing the new highlighted text using chrome.storage.set()
9. Turn Design Mode "off"

The second JavaScript file that runs on each page is content_script.js. It checks if there is a stored object called 'highlights'. If there isn't, that means the user has never highlighted anything. It then created an empty object and stores it in Chrome. 

If it finds a 'highlights' object, it checks if there is stored data for the active URL. If there isn't, the script returns.

If there are highlights stored for the URL:
1. applyHighlights() function runs
  1. It takes two parameters, the 'highlights' object and active URL
  2. Loops through the keys of the stored object (the keys are the stored highlights, whereas the values of those keys are an array contianing the querySelector and indexOf values)
  3. Runs document.body.querySelectorAll() to get an array of all matching nodes
  4. Loops through each returned node and if the innerHTML contains a "string" matching the object key (highlighted text) AND at the same indexOf value:
    1. Runs a .replace() function wrapping the matching text in a < span > tag with an inline style attribute for the background color

- side note: I originally went through every DOM node recursively to check for matches, but storing the querySelector value and comparing the HTML values of only the matching nodes to my stored values is significantly faster.

## Upgrades for Next Version
1. Store the specific string you highlighted 
  - "Download the jQuery library from jQuery.com".
  - If you highlight the second "jQuery", the stored value will be of the first instance.
  - This is because the indexOf value that I store returns after the first match
  - PLAN - start counting index of after the span tag
2. cannot highlight across block elements (if you drag highlight from an h2 into a p tag only the h2 will register)
3. IN PROGRESS: Allow users to choose the highlight color
  - Currently hard-coded
4. Have the number of highlights & actual highlights for a page show up in the extension popup.html
5. Limitations/edge cases: email, PDFs
6. I request permissions for every site. which some sites block '*' access to (cnn.com)
7. If you highlight "jQuery" in one element, anxd highlight it again in another, the second one overrides the first (because the key is the same)
8. If the parent element is an inline tag the innertext/html indexOf does not register (-1) or it ends the highlight at the end of the inline tag
    Find the index of the span tag and start the indexOf there
9. Collapse mode - collapse the document to only the parent elements of the stored highlights

## Solved Problems
1. Storing Highlights spanning inline element tags (a, em, st, etc.)
- Before, only the text before the inline tag was saved, because I stored the innerText
- I solved it by storing the innerHTML instead
- The problem that arose from this change was that I was storing the indexOf the innerText, which would re-apply the highlights to standard text inside a text element, like a "p" tag. But the indexOf is different for items arround inline elements because the indexOf counts each character in the tags.
- To solve this, I compare the innerText.indexOf AND the innerHTML.indexOf values and compare each to matching nodes when applying highlights to pages a user is visiting again.
2. If you double clicked to highlight a section, the indexOf values would not register, and therefore my app was unable to re-apply highlights
- To solve it I added the .toString() and .trim() methods to the indexOf(...)
3. Highlighting an < a > tag would remove the link on page load.
## Future Upgrades

<br />
## Example Image

<img width="965" alt="Screen Shot 2019-06-03 at 12 35 23 PM" src="https://user-images.githubusercontent.com/34493689/58818550-304b3a00-85fc-11e9-86ea-2f3dac84f50b.png">

## Edge Cases
1. If class names change
    - Solution: if the class name does not exist in the DOM, strip the class name from the query selector and just search the element tag nodes
2. If the content is hidden by a button, my highlights will not register bc it searches on_load and the content is only revealed after a browser event (this is why it does not work on email)


Allow someone to access all highlights on the popup.html
Allow users to change highlighter color
Fix inline element highlight bug
