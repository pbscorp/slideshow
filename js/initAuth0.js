const AUTH0_DOMAIN = "edscode-admin.us.auth0.com";
const AUTH0_CLIENT_ID = "xzvZXRBJMBwi8xULruLZAd7eUs9BxaBE";
const REDIRECT_URI = window.location.href.split('?')[0];

let auth0Client = null;
let currentUserArray = null;

async function initAuth0() {
  //alert(REDIRECT_URI);
  try {
    auth0Client = await auth0.createAuth0Client({
      domain: AUTH0_DOMAIN,
      clientId: AUTH0_CLIENT_ID,
      authorizationParams: { redirect_uri: REDIRECT_URI, scope: "openid profile email" }
    });
    await handleRedirect();
    await updateAuthState();
  } catch (err) {
    alert(' catch error: ' + err);
  }
}

async function handleRedirect() {
  const query = window.location.search;
  if (query.includes("code=") && query.includes("state=")) {
    await auth0Client.handleRedirectCallback();
    window.history.replaceState({}, document.title, REDIRECT_URI);
  }
}
var userType = "empty";
var isCreator = false
var isPlayer = false
async function updateAuthState() {
  const isAuth = await auth0Client.isAuthenticated();
  userType = sessionStorage.getItem("userType");

  const menu = document.getElementById("authMenu");
  const loginOption = document.getElementById("loginOption");
  const logoutOption = document.getElementById("logoutOption");
  const playerOption = document.getElementById("playerOption");
  try {
    if (isAuth) {
      //userType = "creator";
      //sessionStorage.setItem("userType", userType);
      currentUserArray = await auth0Client.getUser();
      //alert("Welcome " + userType + ' ' + currentUserArray.email);
      if (userType == "creator") {
          showUserDashboard(currentUserArray.email);
      } else if (userType == "player") {
          showPlayerSlideshows(currentUserArray.email);
      } 
  } else {      
      currentUserArray = null;
      showPublicSlideshows();
    
  }
  } catch (err) {
    alert(' catch err ' + err);
  }
  sessionStorage.setItem("userType", userType);
}

  // Toggle dropdown
  userType = sessionStorage.getItem("userType");
  const loginOption = document.getElementById("loginOption");
  const logoutOption = document.getElementById("logoutOption");
  const playerOption = document.getElementById("playerOption");
  loginOption.onclick = login;
  logoutOption.onclick = logout;
  playerOption.onclick = player;
  const menu = document.getElementById("authMenu");
 //alert('userType starts at ' + userType);

  document.getElementById("authButton").onclick = () => {
     menu.style.display = menu.style.display === "none" ? "block" : "none";
     userType = sessionStorage.getItem("userType");

     if (userType == "creator") {
        loginOption.style.display = "none";
        playerOption.style.display = "block";

     }
     if (userType == "player") {
        playerOption.style.display = "none";
        loginOption.style.display = "block";

     }
     //alert('userType === ' + userType);
  };

async function login() {
  userType = sessionStorage.getItem("userType");
       //alert('userType now ' + userType);
      sessionStorage.setItem("userType", "creator");

  if (userType != "creator" && userType != "player") {
          //alert('getting auth0 ');

      await auth0Client.loginWithRedirect({ authorizationParams: { redirect_uri: REDIRECT_URI } });
  }
  sessionStorage.setItem("userType", "creator");
  menu.style.display = "none";
  showUserDashboard(currentUserArray.email);
}
async function logout() {
  sessionStorage.setItem("userType", "empty");
  await auth0Client.logout({ logoutParams: { returnTo: REDIRECT_URI } });
}

async function player() {
      userType = sessionStorage.getItem("userType");
       //alert('userType now ' + userType);
      sessionStorage.setItem("userType", "player");

     if (userType != "creator" && userType != "player") {
      //alert('getting auth0 ');
      await auth0Client.loginWithRedirect({ authorizationParams: { redirect_uri: REDIRECT_URI } });
    }
    sessionStorage.setItem("userType", "player");
    menu.style.display = "none";
    showPlayerSlideshows(currentUserArray.email);
}

	window.onload = initAuth0;