
    async function editSlideshow(folder) {
      const content = document.getElementById("contentArea");
      content.innerHTML = `<h2>Editing ${folder}</h2>
          <button onclick="showUserDashboard(currentUser)">← Done</button>
          <h3>Slide name: text</h3>
          <textarea id="textEditor" rows="8" style="width:100%"></textarea><br>
          <button id="saveTextBtn">Save Text</button>
          <div class="flex-container">
              <div class="flex-item1" id = "editMediaDiv">
                <h3>Media Files</h3>
                <label for="recordAudioButton">Record Audio: </label>
                <button id="recordAudioButton" onclick="openPopup('${folder}')" >🎙️</button>
                <label for="mediaUpload">Select file: 📁</label>
                <input type="file" id="mediaUpload" multiple><br>
                <label for'"uploadMediaBtn" id="uploadMediaLbl" style='display:none' > Upload Selected>:</label>
                <button id="uploadMediaBtn" style='display:none'>⬆️</button>

                <div id="mediaList">
                </div>
              </div>
              <div class="flex-item2" id = "editConfigDiv">
                <h3>Config File</h3>
                <form id="projectForm">
                <label>Folder name:<br><input type="text" id="slideshowName" required></label><br><br>
                <label>Slideshow title:<br><input type="text" id="slideshowTitle" required></label><br><br>
                <label>Description:<br><textarea id="slideshowDescription"></textarea></label><br><br>
                <label>Theme:<br><input type="text" id="slideshowTheme" value="default"></label><br><br>
                <input type="hidden" id="noOfShows" value=noOfShows>
                <button type="submit">Create Slideshow</button>
                <button type="button" onclick="showUserDashboard(currentUser)">Cancel</button> 
            </div>
          </div>
          `;
   
  // load text.txt
  
  const textResp = await fetch(`filemanager.php?action=gettext&proj=${folder}`);
      const text = await textResp.text();
      document.getElementById("textEditor").value = text;

      // load media list
      await loadMediaList(folder);  // save text
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
        } catch  (err) {
           alert("error updating text " + err);

        }
        await hilightUnused();
      };
const fileInput = document.getElementById("mediaUpload");

fileInput.addEventListener('change', handleFileSelection);
const selectedFilesArray = [];
var newFileNodeList; 

async function hilightNewEntries() {
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
}
var slideNamesArray = [];

 function hilightUnused() {
  try {
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
    let index = slideNamesArray.indexOf(newFileNodeList[i].value.split('.')[0]);
    if (index == -1) {
      console.log('found not used index = ' + index);
      newFileNodeList[i].classList.add("unused");
    }
  }
 } catch (err) {
        alert("the hilightUnused request failed: " + err.message);
      }
}
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
         mediaDiv.innerHTML = "<table id = 'mediaListTable'><tr><th>file</th><th>re-name</th><th>remove</th></tr>" + files.map((f, index) =>
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
     listMediaNodes= document.querySelectorAll('.filename');

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
    }

    async function renameMedia(folder, oldFile, index) {
      newBase = document.getElementById(`newname${index}`).value;
      newFile = newBase +  '.' + oldFile.split('.')[1];
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
      if (confirm("i will createNewProject " + slideshow + " in " + myUserIndex)) {
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
    
         editSlideshow(slideshow);
          //showUserDashboard(user);

        }
      } catch (err) {
        alert("the create request failed: " + err.message);
      }
    }

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
        alert("the create request failed: " + err.message);
      }


    }
  
