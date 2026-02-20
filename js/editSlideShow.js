
  
  function openPopup(folder) {
    //alert ('textFromPopup ' + textFromPopup); 
    const popupWindow = window.open(`recordAudio.html?folder=${folder}`, 'Recorder', 'width=700, height=400');
    console.log('open popup folder ' + folder);
   // popupWindow.project = folder;
}
async function responseFromPopup(result) {
     console.log('result from Recorder: ' + result);
     const response = result.split(':');
     if (response[0].trim() != "Success") {
        alert('response from Recorder: ' + result);
     } else {
      await loadMediaList(response[2].split('/')[0].trim());
      await hilightUnused();
     }   
}
async function hilightNewEntries() {
    document.getElementById('mediaListTable').classList.remove('is-visible');
    //document.getElementById('mediaListTable').classList.add('fade-target');
    newFileNodeList = document.querySelectorAll(".newname");
    // Loop through each row of the table
    console.log(' newFileNodeList.length ' + newFileNodeList.length);
    for (let i = 0; i < newFileNodeList.length; i++) {
      console.log(newFileNodeList[i].value.split('.')[0]);
      console.log(selectedFilesArray);
      let index = selectedFilesArray.indexOf(newFileNodeList[i].value.split('.')[0]);
      if (index > -1) {
        console.log('found index = ' + index);
        newFileNodeList[i].classList.add("newEntry");
      }
    }
    document.getElementById('mediaListTable').classList.add('is-visible');

  }
  var slideNamesArray = [];
  async function hilightUnused() {
    try {
        // alert(" hilightUnused begin ");
      document.getElementById('mediaListTable').classList.remove('is-visible');
      //document.getElementById('mediaListTable').classList.add('fade-target');
      newFileNodeList = document.querySelectorAll(".newname");
      var slide = "";
      const text = document.getElementById("textEditor").value.trim().split('\n');
      slideNamesArray = [];
      for (let i = 0; i < text.length; i++) {
        slide = text[i].split(':')[0];
        slideNamesArray.push(slide);
      };
      console.log('  slideNamesArray.length ' + slideNamesArray.length);
      console.log('  slideNamesArray ' + slideNamesArray);
      console.log(' hilightUnused newFileNodeList.length ' + newFileNodeList.length);
      for (let i = 0; i < newFileNodeList.length; i++) {
        console.log(" newFileNodeList[i].value.split('.')[0] " + newFileNodeList[i].value.split('.')[0]);
        console.log('  slideNamesArray ' + slideNamesArray);
        let baseName = newFileNodeList[i].value.split('.')[0];
        let index = slideNamesArray.indexOf(baseName);
        if (index == -1 && !baseName.includes("default", "voice"))  {
          console.log('found not used index = ' + index);
          newFileNodeList[i].classList.add("unused");
        } else {
          newFileNodeList[i].classList.remove("unused");
        }
      }
    } catch (err) {
      console.log("the hilightUnused request failed: " + err.message);
    }
// 2. Wait for the browser to register the display change, then add the transition class
  // setTimeout with 0ms works well for this
  setTimeout(() => {
    document.getElementById('mediaListTable').classList.add('is-visible');
  }, 300)
      //alert(" hilightUnused end ");
  }
  var selectedFilesArray = [];

       // <h3>Slide name: text <button class="helpButton" onclick="getHelp('text')">?💡?</button></h3>
       //<h3><span>text </span><span> <a class="helpButton" href="SlideQuestionSpecs.txt" target="_blank">🤔</a></span></h3>
       //<a href="#" onclick="window.open('https://www.example.com','name','width=600,height=400'); return false;">

        //<span class="modal" id="myPopup" onclick="getHelp()"></span>
currentFolder = "";
async function refreshMedia(folder) {
    await loadMediaList(folder);
    await hilightUnused();
    refreshMediaBtn.style.display = "none";
    saveTextBtn.style.display = "block";

  }
async function editSlideshow(folder) {
  currentFolder = folder;
    const content = document.getElementById("contentArea");

  content.innerHTML = `<h2>Editing folder ${folder}</h2>
        <button onclick="showUserDashboard(currentUser)">← Done</button>
        <h3><span>text </span><span> <a href="#" onclick="window.open('help/SlideQuestionSpecs.html','help','width=800,height=800'); return false;">🤔</a></span></h3>
        <textarea id="textEditor" rows="15" cols="120"></textarea>
        <br/><button class="saveBtn" id="saveTextBtn">Save Text</button>
            <button class="saveBtn" id="refreshMediaBtn" onclick="refreshMedia('${folder}')"  style="display: none;">Refresh-media</button>
       <div id="voiceControls" style = "display: none;">
        <br /><br /><audio id="player" controls></audio>
        <br /><p id="recordKeysText" style = "display: inline;">  loading to your media folder&nbsp;</p>
        <p id="voiceSelectionPara"> Your Presentor : <span id="voiceSelectionDropdown"></span></p>
        </div>
        <div id="contextMenu">
          <div onclick="handleAction('copy')">📋 Copy</div>
          <div onclick="handleAction('paste')">Paste 📋</div>
          <div onclick="handleAction('uppercase')">🔠 Uppercase</div>
          <div onclick="handleAction('search')">🔍 Search Google images</div>
          <div onclick="handleAction('writeSoundFile')">📢 Make Sound File</div>
          <div onclick="handleAction('recordVoice')">&#x1f399; Record Voice</div>
        </div>
        <div class="flex-container">
            <div class="flex-item1" id = "editMediaDiv">
                <h3>Media Files<span> <a href="#" onclick="window.open('help/fileUpload.html','help','width=800,height=800'); return false;">🤔</a></span></h3>
                <label for="recordAudioButton">Record Audio: </label>
                <button id="recordAudioButton" onclick="openPopup('${folder}')" >🎙️</button>
                <label for="mediaUpload">Select file: 📁</label>
                <input type="file" id="mediaUpload" multiple><br>
                <label for="uploadMediaBtn" id="uploadMediaLbl" style="display:none">Upload Selected</label>
                <button id="uploadMediaBtn" style="display:none">⬆️</button>
                <div id="mediaList">
                </div>
            </div>
        <div class="flex-item2" id = "editConfigDiv">
            <h3>Slideshow Configuration</h3>
            <form id="configForm">
                <table>
                <tr>
                    <td><label for="configTitle">title:</label></td>
                    <td><input type="text" id="configTitle"></input></td>
                </tr>
                <tr>
                    <td><label for="configDescription">Description:</label></td>
                    <td><textarea id="configDescription"></textarea></td>
                </tr>
                <tr>
                    <td><label for="configTheme">Theme:</label></td>
                    <td><input type="text" id="configTheme" value="default"></td>
                </tr>
                <tr>
                    <td><label for="configDate">Date Active:&nbsp;&nbsp;&nbsp;</label></td>
                    <td><input type="date" readonly id="configDate" style="display:none" value=""></input></td>
                </tr>
                <tr>
                    <td><label for="configWebsite">related Website:</label></td>
                    <td><input type="text" id="configWebsite" value=""></input></td>
                </tr>
                <tr>
                    <td><label for="configAbout">about:</label></td>
                    <td><textarea id="configAbout"></textarea></td>
                </tr>
                <tr>
                    <td><label for="configPublic">make Public:&nbsp;&nbsp;&nbsp;&nbsp;</label>
                    <input type="checkbox" id="configPublic"></td>
                    <td>
                    <button type="submit">Update Slideshow</button>
                    <button type="button" onclick="showUserDashboard(currentUser)">Cancel</button> 
                    </td>
                </tr>
                </table>
            </form>
        </div>
    </div>
</div>
          `;

  // load text.txt

  // Desktop right-click
  textarea = document.getElementById('textEditor');
  voicePlayer = document.getElementById('player');
  voiceControls = document.getElementById('voiceControls');
  saveVoiceBtn = document.getElementById('saveVoiceBtn');
  voiceMenu = document.getElementById('contextMenu');
  textarea = document.getElementById('textEditor');
  voicePlayer = document.getElementById('player');
  refreshMediaBtn = document.getElementById(`refreshMediaBtn`);
  recordKeysText = document.getElementById('recordKeysText');
  saveTextBtn = document.getElementById('saveTextBtn');
  createVoiceDropdown();

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
document.getElementById("configForm").onsubmit = async function (e) {
    e.preventDefault();
    await updateProject(folder)
}

async function updateProject(folder) {
  const slideshow = folder;
  const title = document.getElementById("configTitle").value.trim();
  const description = document.getElementById("configDescription").value.trim();
  const theme = document.getElementById("configTheme").value.trim();
  const dateActive = document.getElementById("configDate").value.trim();
  const website = document.getElementById("configWebsite").value.trim();
  const about = document.getElementById("configAbout").value.trim();
  const public = document.getElementById("configPublic").checked;

  if (!slideshow || !title) {
    alert("Please enter both folder name and title.");
    return;
  }
    try {
      const response = await fetch("upload.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: currentUser,
          action: "update",
          slideshow,
          title,
          description,
          theme,
          dateActive,
          website,
          about,
          public
        })
      });
      const result = await response.json();
      console.log(JSON.stringify(result));
      if (result.error) {
        alert("Error: " + result.error);
      } else {
        console.log('result ' + result.success);
        if (result.userIndex) {
          alert("index: " + result.userIndex);
          if (newUser) {
            myUserIndex = result.userIndex;
            newUser = false;
          }
        }
        console.log("Slideshow created successfully: in " + myUserIndex);


        console.log(' newUser = ' + newUser);

        await editSlideshow(slideshow);
        //showUserDashboard(user);

      }
    } catch (err) {
      alert("the create request failed: " + err.message);
    }

}

  const textResp = await fetch(`filemanager.php?action=gettext&proj=${folder}`);
  const text = await textResp.text();
  document.getElementById("textEditor").value = text;

  // load media list
  await loadMediaList(folder);  // save text
  await hilightUnused();
  var form_configTitle = document.getElementById("configTitle");
  var form_configDescription = document.getElementById("configDescription");
  var form_configTheme = document.getElementById("configTheme");
  var form_configDate = document.getElementById("configDate");
  var form_configWebsite = document.getElementById("configWebsite");
  var form_configAbout = document.getElementById("configAbout");
  var form_configPublic = document.getElementById("configPublic");

  async function populateForm(folder) {
        const response = await fetch(folder.trim() + "/config.json?_=" + Date.now());

      if (!response.ok) {
            console.log("Cannot load " + folder + " config file");
      }
      try {
        const config = await response.json();
        //alert(1.1);	
        if (!config || config.length === 0) {
          alert("No config found");
        }
        console.log(' config file folder ' + folder + ' dateActive = ' + config.dateActive);
        form_configTitle.value = config.title;
        form_configDescription.value = config.description;
        form_configTheme.value = config.theme;
        form_configDate.value = config.dateActive;
        form_configWebsite.value = config.website;
        form_configAbout.value = config.about;
        if (config.dateActive.trim()) {
          form_configPublic.checked = true;
          form_configDate.style.display = 'inline';
        } else {
          form_configDate.style.display = 'none';
        }
      } catch (error) {
        alert(' error fetching directory ' + folder + ' config file ' + error);
        return;
      }
      console.log('added ' + folder);
      // console.log('AllUsersArry now ' + JSON.stringify(AllUsersArry));
    }

  document.getElementById("saveTextBtn").onclick = async () => {
    const body = new URLSearchParams();
    body.append("action", "savetext");
    body.append("proj", folder);
    body.append("text", document.getElementById("textEditor").value);
    const resp = await fetch("filemanager.php", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body
    });
    try {
      const result = await resp.text();
      alert(result === "saved" ? "Text saved!" : "Error saving text.");
    } catch (err) {
      alert("error updating text " + err);

    }
    await loadMediaList(folder);
    await hilightUnused();
  };

  const fileInput = document.getElementById("mediaUpload");

  fileInput.addEventListener('change', handleFileSelection);
  var newFileNodeList;

  function handleFileSelection(event) {
    const selectedFiles = fileInput.files;
    document.getElementById("uploadMediaLbl").innerText = `Upload ${selectedFiles.length} files: `;
    document.getElementById("uploadMediaLbl").style.display = 'inline';
    document.getElementById("uploadMediaBtn").innerText = `⬆️`;
    document.getElementById("uploadMediaBtn").style.display = 'inline';

    // Now you can iterate through the selectedFiles and process them
    for (let i = 0; i < selectedFiles.length; i++) {
      const file = selectedFiles[i];
      console.log(`File Name: ${file.name}, Size: ${file.size} bytes, Type: ${file.type}`);
      selectedFilesArray.push(`${file.name.split('.')[0]}`);
      console.log(selectedFilesArray);
    }
  }
  // upload media
  document.getElementById("uploadMediaBtn").onclick = async () => {
    const btn = document.getElementById("uploadMediaBtn");
    btn.disabled = true;
    const files = document.getElementById("mediaUpload").files;
    if (!files.length) {
      alert("No files selected");
      btn.disabled = false;
      return;
    }

    const form = new FormData();
    
    for (let f of files) form.append("files[]", f);

    const res = await fetch(`filemanager.php?action=upload&proj=${folder}`, {
      method: "POST",
      body: form,
    });

    const txt = await res.text();
    document.getElementById("uploadMediaLbl").style.display = 'none';
    document.getElementById("uploadMediaBtn").style.display = 'none';


    //alert(txt);
    btn.disabled = false;
    document.getElementById("mediaUpload").value = ""; // clear selection
    await loadMediaList(folder);
    await hilightNewEntries();
    await hilightUnused();
    
  };

  await populateForm(folder);
  console.log('populateForm ' + folder);

  //alert();

}



//alert("hey  5");
var listMediaArray = [];

async function loadMediaList(folder) {
  const res = await fetch(`filemanager.php?action=list&proj=${folder}`);
  const files = await res.json();
  const mediaDiv = document.getElementById("mediaList");
  if (files.length === 0) {
    mediaDiv.innerHTML = "<p>No media uploaded.</p>";
  } else {
    mediaDiv.innerHTML = "<table  class= 'fade-target' id = 'mediaListTable'><tr><th>file</th><th>re-name</th><th>remove</th></tr>" + files.map((f, index) =>
      `<tr class = "newrow">
                 <td> <input class='filename' size = "10" type = "text" readonly value = "${f}"></input></td>
                 <td> <input class = "newname" id = "newname${index}" size = "6" value = '${f.split('.')[0]}'</input>&nbsp;&nbsp;&nbsp;<button onclick="renameMedia('${folder}','${f}','${index}')">rename</button></td>
                <td><button onclick="deleteMedia('${folder}','${f}')">delete</button></td>
                 </tr>`
    ).join("") + "</table>";

    //mediaDiv.innerHTML = "<ul id = 'mediaListItem'>" + files.map(f =>
    // `<li>${f} <button onclick="deleteMedia('${folder}','${f}')">Delete</button></li>`
    //).join("") + "</ul>";
  }
  listMediaNodes = document.querySelectorAll('.filename');

  // 3. Create an empty array to store the text contents

  listMediaArray = [];
  // 4. Iterate through the LI elements and extract their text content
  for (let i = 0; i < listMediaNodes.length; i++) {
    listMediaArray.push(listMediaNodes[i].value);
  }

  // Now, listItemsArray will contain: ["Item 1", "Item 2", "Another Item"]
  console.log(listMediaArray);
  const JsonMediaArray = JSON.stringify(listMediaArray);
  console.log(JsonMediaArray);
  saveMediaList(folder);
}

async function saveMediaList(folder) {
  const project = folder;  // or dynamic;  // or dynamic
  const response = await fetch("saveMediaList.php", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ project, list: listMediaArray })
  });
  //alert(await response.text());
}

async function getList() {
  const response = await fetch(`get_list.php?project=${encodeURIComponent(project)}`);
  const list = await response.json();
  console.log("Loaded list:", list);
  return list;
}

async function deleteMedia(folder, file) {
  if (!confirm("Delete " + file + "?")) return;
  const res = await fetch(`filemanager.php?action=delete&proj=${folder}&file=${file}`);
  const txt = await res.text();
  //alert(txt);
  await loadMediaList(folder);
  await hilightUnused();

}

async function renameMedia(folder, oldFile, index) {
  newBase = document.getElementById(`newname${index}`).value;
  newFile = newBase + '.' + oldFile.split('.')[1];
  //if (!confirm("renameMedia " + newFile + "?")) return;
  const res = await fetch(`filemanager.php?action=rename&proj=${folder}&oldFile=${oldFile}&newFile=${newFile}`);
  const txt = await res.text();
  console.log(txt);
  await loadMediaList(folder);
  //
  try {
    hilightUnused();
  } catch (err) {
    alert("the renameMedia request failed: " + err.message);
  }
  //
}

//alert("hey  7.1");
async function showProjectForm(user) {
  
  const content = document.getElementById("contentArea");
  content.innerHTML = `
      <h2>Create New Slideshow</h2>
      <form id="projectForm">
        <label>Folder name:<br><input type="text" id="slideshowName" required></label><br><br>
        <label>Slideshow title:<br><input type="text" id="slideshowTitle" required></label><br><br>
        <label>Description:<br><textarea id="slideshowDescription"></textarea></label><br><br>
        <label>Theme:<br><input type="text" id="slideshowTheme" value="default"></label><br><br>
        <input type="hidden" id="noOfShows" value=noOfShows>
        <button type="submit">Create Slideshow</button>
        <button type="button" onclick="showUserDashboard(currentUser)">Cancel</button> 
`;


  document.getElementById("projectForm").onsubmit = async function (e) {
    e.preventDefault();
    createNewProject(user);
  };
}

//alert("hey  8.1");
async function createNewProject(user) {
  const slideshow = document.getElementById("slideshowName").value.replace(/\W/g, "");
  const title = document.getElementById("slideshowTitle").value.trim();
  const description = document.getElementById("slideshowDescription").value.trim();
  const theme = document.getElementById("slideshowTheme").value.trim();
  if (!slideshow || !title) {
    alert("Please enter both folder name and title.");
    return;
  }
  //if (confirm("i will createNewProject " + slideshow + " in " + myUserIndex)) {
    try {
      const response = await fetch("upload.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: user,
          slideshow,
          title,
          description,
          newUser,
          myUserIndex,
          theme
        })
      });
      const result = await response.json();
      console.log(JSON.stringify(result));
      if (result.error) {
        alert("Error: " + result.error);
      } else {
        console.log('result ' + result.success);
        if (result.userIndex) {
          alert("index: " + result.userIndex);
          if (newUser) {
            myUserIndex = result.userIndex;
            newUser = false;
          }
        }
        console.log("Slideshow created successfully: in " + myUserIndex);


        console.log(' newUser = ' + newUser);

        await editSlideshow(slideshow);
        //showUserDashboard(user);

      }
    } catch (err) {
      alert("the create request failed: " + err.message);
    }
//  }

}

async function deleteFolder(path) {
  if (confirm('Confirm: This will delete the folder ' + path + ' and all data within it')) {
    const formData = new FormData();
    formData.append('folderPath', path);

    await fetch('deleteFolder.php', { method: 'POST', body: formData })

      //.then(res => res.text()).then(txt => alert('text = ' + txt))
      .then(res => res.text()).then(txt => removeFromSlideshowList(txt, path))
      .catch(err => alert('err = ' + err));
  }
}

function removeFromSlideshowList(msg, path) {
  //alert(msg);
  if (msg.split(':')[0] != "success") {
    alert("folder" + path + ' not removed, will not remove from Array ');
    console.log('delete folder fetch msg = ' + msg);
  } else {
    console.log('folder ' + path + ' removed, will now remove fromArray ' + myUserIndex);
    deleteSlideshowFolder(path);// index of users array in config file
    console.log('folder  removed');
    showUserDashboard(currentUser);
  };

};


async function deleteSlideshowFolder(folder) {
  console.log(' deleteSlideshowFolder ' + folder);
  console.log(JSON.stringify({
    email: currentUser,
    folder,
    myUserIndex
  }));
  try {
    const response = await fetch("updatePublicConfig.php", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: currentUser,
        folder,
        myUserIndex
      })
    });
    const result = await response.text();
    if (result.error) {
      alert("Error: " + result.error);
    } else {
      console.log(result);
      console.log("Slideshow config entry removed successfully: from" + myUserIndex);
    }
  } catch (err) {
    alert("the request failed: " + err.message);
  }


}

