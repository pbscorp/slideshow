// voice.js
const textarea = document.getElementById('textEditor');
const voicePlayer = document.getElementById('player');
const voiceControls = document.getElementById('voiceControls');
const saveVoiceBtn = document.getElementById('saveVoiceBtn');
const audioName = document.getElementById('voiceName');

const menu = document.getElementById('contextMenu');
let selectedText = '';
let longPressTimer;

// Get selected text
function getSelectionText() {
  return textarea.value.substring(
    textarea.selectionStart,
    textarea.selectionEnd
  );
}

// Show menu
function showMenu(x, y) {
  selectedText = getSelectionText();
  if (!selectedText) return;
  menu.style.left = x + 'px';
  menu.style.top = y + 'px';
  menu.style.display = 'block';
  voiceControls.style.display = "none";
}

// Hide menu
function hideMenu() {
  menu.style.display = 'none';
}

// Desktop right-click
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
      voiceControls.style.display = "block";
      saveVoiceBtn.style.display = "none";
      writeSoundFile(selectedText);
      saveVoiceBtn.style.display = "block";

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

async function saveVoice(folder, voiceFile) {
  newBase = document.getElementById(`voiceName`).value;
  newFile = newBase + '.' + voiceFile.split('.')[1];
  //if (!confirm("renameMedia " + newFile + "?")) return;
  const res = await fetch(`filemanager.php?action=rename&proj=${folder}&oldFile=${voiceFile}&newFile=${newFile}`);
  const txt = await res.text();
  console.log('text from rename request = ' + txt);
  await loadMediaList(folder);
  //
  try {
    hilightUnused();
  } catch (err) {
    alert("the saveVoice request failed: " + err.message);
  }
  //
}

async function writeSoundFile (selectedText) {
  let recordKey = "";
  let text = selectedText.trim();
  let inx = selectedText.trim().indexOf(':');
      console.log('text = ' + text + ' inx = ' + inx);
  if ((inx > -1) && inx < 10 ) {
      recordKey = selectedText.substring(0, inx);
      text = selectedText.substring(inx +1, selectedText.length - inx +2);
  }
  const start = textarea.selectionStart;
  const folder = "Jokes";
  console.log('recordKey = ' + recordKey + ' selectedText = ' + text);
  if (!selectedText) return;

  try {
      const resp = await fetch('/tts.php', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text }),
    });
    console.log(resp);
    if (!resp.ok) {
      alert('TTS request failed' + JSON.stringify(resp));
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
    voicePlayer.src = url;
    voicePlayer.play();
  } catch (e) {
    console.error(e);
    alert('Error calling TTS API' + e);
  }
};
