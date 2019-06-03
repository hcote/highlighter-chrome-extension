## Elephant Highlighter
This is a chrome extension "link to google store" that lets you highlight important text on any web page. Revisit the page in 1 minute, 1 week, or 1 year - your data will always be there.

## Technologies
1. (Vanilla) JavaScript
2. Google API

## Features
1. Highlight any text and hit Command+E to save it automatically
2. User can clear the stored highlights for any URL with one simple command, Command+Shift+A
3. Syncs across all devices - if you highlight text from a laptop, then look at the same web page from your phone, your highlights will be there. 

## My Stored Data Structure (Object)
```
highlights = {
    google.com: {
        text1: ["query selector", index]
        text2: ["query selector", index]
    },
    yahoo.com: {
        text3: ["query selector", index],
        text4: ["query selector", index]
    },
    https://developer.mozilla.org/en-US/docs/Web/API/document/execCommand: {
        "When an HTML document has been switched to designMode, its document object exposes an execCommand": ["p.summary", 20],
        "A DOMString specifying the name of the command to execute. See Commands for a list of possible commands.": ["p", 0]
    }
}
```

## How It Works

I have two scripts that load on every page. The first is background.js which listens for a specific event. The event Command+E triggers a function that injects a script into the browser (injection_script.js), which highlights selected text. 

To highlight, drag your mouse over some text, and hit Command+E. This triggers my highlight() function which does several things. In order:
1. Grabs selected text
2. Turns Design Mode "on", allowing us to make changes to the DOM
3. If the background is already highlighted (need to remove highlight):
    1. Selects the < span > tag surrounding it and sets style.backgroundColor = transparent (remove the highlight)
    2. Gets the 'highlights' object from storage (chrome.storage.get())
    3. Loops through all keys (which is the highlighted text) to look for a match, and deletes it from storage
4. Otherwise, wrap the text in a < span > and change the background color 
5. Retrieve 'highlights' from storage
    1. If there is no data for the active URL, set the value to an empty object (aol.com: {})
    2. If there is, assign the highlights variable to the results from chrome.storage.get()
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
2. Save highlights spanning inline elements

  - <p>The <a href="...">getter function</a> created by the <code>public</code> keyword is a bit more complex in this case.</p>
  - Only the text before the first inline element (< a >) will be saved.
  
3. Allow users to choose the highlight color
  - Currently hard-coded

4. Have the number of highlights & actual highlights for a page show up in the extension popup.html

<!-- ## Solved Problems -->

<br />
## Example Image

<img width="965" alt="Screen Shot 2019-06-03 at 12 35 23 PM" src="https://user-images.githubusercontent.com/34493689/58818550-304b3a00-85fc-11e9-86ea-2f3dac84f50b.png">
