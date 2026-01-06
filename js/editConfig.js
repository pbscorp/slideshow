var form_configTitle = document.getElementById("configTitle");
var form_configDescription = document.getElementById("configDescription");
var form_configTheme = document.getElementById("configTheme");
var form_configDate = document.getElementById("configDate");
var form_configWebsite = document.getElementById("configWebsite");
var form_configAbout = document.getElementById("configAbout");
var form_configPublic = document.getElementById("configPublic");

async function updateProject(folder) {
  const slideshow = folder;
  const title = document.getElementById("configTitle").value.trim();
  const description = document.getElementById("configDescription").value.trim();
  const theme = document.getElementById("configTheme").value.trim();
  const website = document.getElementById("configWebsite");
  const about = document.getElementById("configAbout");
  const public = document.getElementById("configPublic");

  if (!slideshow || !title) {
    alert("Please enter both folder name and title.");
    return;
  }
  if (confirm("i will update " + slideshow + " in " + myUserIndex)) {
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

        editSlideshow(slideshow);
        //showUserDashboard(user);

      }
    } catch (err) {
      alert("the create request failed: " + err.message);
    }
 }

}

