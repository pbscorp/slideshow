// voice.js
let textarea = document.getElementById('textEditor');
let voicePlayer = document.getElementById('player');
let voiceControls = document.getElementById('voiceControls');
let recordKeysText = document.getElementById('recordKeysText');
var recordKeyCtr = 0;
let voiceMenu = document.getElementById('contextMenu');
let currentFolder = "test";
let selectedText = '';
let longPressTimer;
let defaultPresenter = "default-wg3fvsjtsajw7wc-kn3k2a__mcfloon";
var recordKey = "voice";
var selectedTextArray = [];
var playListArry = [];
var playerStarted = false;

// Data source for the dropdown options
const presenters = ['Clive', 'default-wg3fvsjtsajw7wc-kn3k2a__mcfloon', 'Ashley', 'Hades'];

// Function to create and insert the dropdown
function createVoiceDropdown() {

  textarea.addEventListener('contextmenu', e => {
    e.preventDefault();
    showMenu(e.pageX, e.pageY);
  });
// Mobile long-press
  textarea.addEventListener('touchstart', e => {
    longPressTimer = setTimeout(() => {
      const touch = e.touches[0];
      showMenu(touch.pageX, touch.pageY);
    }, 600);
  });

  textarea.addEventListener('touchend', () => {
    clearTimeout(longPressTimer);
  });

  // Click outside closes menu
  document.addEventListener('click', hideMenu);

  // 1. Reference the container element
  const container = document.getElementById('voiceSelectionDropdown');

  // 2. Create the <select> element
  const selectElement = document.createElement('select');
  selectElement.id = 'voiceSelect'; // Assign an ID for potential future reference

  // 3. Create and add a default, disabled option (optional)
  const defaultOption = document.createElement('option');
  defaultOption.text = 'Select one';
  defaultOption.value = '';
  defaultOption.disabled = true;
  defaultOption.selected = true;
  selectElement.appendChild(defaultOption);

  // 4. Iterate over the data and create <option> elements
  presenters.forEach(presenter => {
    const presenterArray = presenter.split("_");
    const presenterName = presenterArray.findLast(word => word.length > 0).replace(/^./, char => char.toUpperCase());
    const option = document.createElement('option');
    option.value = presenter; // Set the value
    option.text = presenterName;         // Set the display text
    selectElement.appendChild(option);   // Add the option to the select element
  });

  // 5. Insert the <select> element into the paragraph's container
  container.appendChild(selectElement);

  // Optional: Add an event listener to handle changes
  selectElement.addEventListener('change', function() {
    console.log(`You selected: ${this.value}`);
    defaultPresenter = `${this.value}`;
    writeSoundFile(selectedText);
    // You can add further actions here
  });
}

// Call the function to generate the dropdown when the page loads (or at an appropriate time)

// Get selected text
function getSelectionText() {
  return textarea.value.substring(
    textarea.selectionStart,
    textarea.selectionEnd
  );
}

// Show voiceMenu
function showMenu(x, y) {
  selectedText = getSelectionText();
  if (!selectedText) return;
  voiceMenu.style.left = x + 'px';
  voiceMenu.style.top = y + 'px';
  voiceMenu.style.display = 'block';
  voiceControls.style.display = "none";
}

// Hide voiceMenu
function hideMenu() {
  voiceMenu.style.display = 'none';
}

/* Desktop right-click
window.addEventListener('load', (event) => {
  createVoiceDropdown();
});
*/
// Actions
function handleAction(action) {
  switch(action) {
    case 'copy':
      navigator.clipboard.writeText(selectedText);
      break;

    case 'paste':
      handlePaste();
      break;

    case 'uppercase':
      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;
      textarea.setRangeText(selectedText.toUpperCase(), start, end, 'end');
      break;

    case 'search':
      window.open(
        'https://www.google.com/search?tbm=isch&q=' + encodeURIComponent(selectedText),
        '_blank'
      );
      break;
      case 'writeSoundFile':
        voiceControls.style.display = "inline";
        writeSoundFile(selectedText);
        break;
  }
  hideMenu();
}

async function handlePaste() {
  try {
    const text = await navigator.clipboard.readText();
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;

    // Use setRangeText to replace selection or insert at cursor
    textarea.setRangeText(text, start, end, 'end'); 
    console.log('Text pasted from clipboard');
  } catch (err) {
    // Note: Some browsers will show a prompt the first time you try to read
    console.error('Failed to read clipboard: ', err);
  }
  textarea.focus();
}

async function saveVoice() {
  if (document.getElementById(`saveVoiceBtn`).innerText == "done") {
        document.getElementById(`voiceControls`).style.display = "none";
        return;
  };

  voiceFile = "voice.mp3";
  newBase = document.getElementById(`voiceName`).value;
  newFile = newBase + '.' + voiceFile.split('.')[1];
  //if (!confirm("renameMedia " + newFile + "?")) return;
  const res = await fetch(`filemanager.php?action=rename&proj=${currentFolder}&oldFile=${voiceFile}&newFile=${newFile}`);
  const txt = await res.text();

  try {
  console.log('text from rename request = ' + txt);
  document.getElementById(`saveVoiceBtn`).innerText = "done";
  document.getElementById(`voiceName`).style.display = "none";
  if (currentFolder != "test") {
      await loadMediaList(currentFolder);
      await hilightUnused();
  }
  } catch (err) {
    alert("the saveVoice request failed: " + err.message);
  }
}

async function writeSoundFile (selectedTextSlected) {
  playListArry = [];
   playerStarted = false;

  selectedTextArray = selectedTextSlected.trim().split('\n');
  recordKeysText.innerText = " loading to your media folder ";

  await selectedTextArray.forEach(selectedText => {
    writeEachSoundFile(selectedText);
    console.log('selectedTextArray.length = ' + selectedTextArray.length);
  });
}
function startVoicePlayer(next) {
  if (playListArry[next]){
    console.log( '>>>>>>>>>>next playing = ' + next +  ' url ' + playListArry[next]);
    voicePlayer.src = playListArry[next];
    voicePlayer.play(next);
      next++;
    voicePlayer.onended = () => {
      startVoicePlayer(next);
    }
  }
}
async function writeEachSoundFile(selectedText) {
  recordKey = "voice";
  recordKeyCtr++;
  let text = selectedText.trim();;

  let inx = selectedText.trim().indexOf(':');
      //console.log('text = ' + text + ' inx = ' + inx);
  if ((inx > -1) && inx < 10 ) {
      recordKey = selectedText.substring(0, inx);
      text = selectedText.substring(inx +1);
  } else {
    recordKey = "voice" + recordKeyCtr;
  }
  const regex = /,([^,]*)$/;
  const replacement = " or $1";
  const str = text;
  if (recordKey.substring(0, 2) == 'CM') {
    text = str.replace(regex, replacement);
    console.log('text = ' + text + ' str = ' + str);
  }
const result = str.replace(regex, replacement)
  recordKeysText.innerHTML += recordKey + "&nbsp";
  const start = textarea.selectionStart;
  const folder = currentFolder;
  //console.log('recordKey = ' + recordKey + ' folder = ' + folder);
  if (!selectedText) return;

  try {
    const resp = await fetch('tts.php', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text, folder, recordKey, defaultPresenter }),
      //ßbody: JSON.stringify({ text, folder }),
    });
    console.log(resp);
    if (!resp.ok) {
      alert('TTS request failed' + resp);
      return;
    }

    const data = await resp.json();
    const audioBase64 = data.audioContent;

    // Convert base64 to a Blob URL usable by <audio>
    const byteChars = atob(audioBase64);
    const byteNumbers = new Array(byteChars.length);
    for (let i = 0; i < byteChars.length; i++) {
      byteNumbers[i] = byteChars.charCodeAt(i);
    }
    const byteArray = new Uint8Array(byteNumbers);
    const blob = new Blob([byteArray], { type: 'audio/mpeg' });
    const url = URL.createObjectURL(blob);
    console.log(' url = ' + url);
    //voicePlayer.src = url;
    playListArry.push(`${url}`);
    if (!playerStarted) {
      playerStarted = true;
      console.log(' playerStarted = ' + playerStarted);
      startVoicePlayer(0);
    }

    //console.log(' recordKeyCtr = ' + recordKeyCtr  + ' selectedTextArray.length = ' + selectedTextArray.length);
  } catch (e) {
    console.error(e);
    alert('Error calling TTS API ' + e);
  }
}
