
const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);
var state = urlParams.get('state');
var auth = urlParams.get('auth');
const AUTH0_DOMAIN = "edscode-admin.us.auth0.com";
const AUTH0_CLIENT_ID = "xzvZXRBJMBwi8xULruLZAd7eUs9BxaBE";
const REDIRECT_URI = "https://www.edscode.com/slideshow.html";
const targetPage = "slideshow.html?state=test";
let isAuth = false;
let isGuest = false;
let isTest= false;
if (state == "test") {
	isTest = true;
	isAuth = true;
}
if (auth == "false") {
	isAuth = false;
}
if (auth == "guest") {
	isGuest = true;
}
let auth0Client = null;
let currentUserArray = null;
// alert("hey  ");

async function initAuth0() {
	//alert("hey  initAuth0 isTest = " + isTest);
try {
  if (isTest) {
    await updateAuthState();
  } else {
    auth0Client = await auth0.createAuth0Client({
      domain: AUTH0_DOMAIN,
      clientId: AUTH0_CLIENT_ID,
      authorizationParams: { redirect_uri: REDIRECT_URI, scope: "openid profile email" }
    });
    await handleRedirect();
    await updateAuthState();
    }
  } catch (err) {
    alert(' catch err ' + err);
  }
}

//alert("hey  1.0");

async function handleRedirect() {
  const query = window.location.search;
  if (query.includes("code=") && query.includes("state=")) {
    await auth0Client.handleRedirectCallback();
    window.history.replaceState({}, document.title, REDIRECT_URI);
  }
}
//alert("hey  1.1");

async function updateAuthState() {
	if (isTest) {
		// isAuth = true;
		currentUserArray = new Object();
		currentUserArray.email = "under10mph@gmail.com";
		currentUserArray.directory = "";
		currentUserArray.title = "";
		
	} else {
	   currentUserArray = await auth0Client.getUser();
		isAuth = await auth0Client.isAuthenticated();
	};
  const menu = document.getElementById("authMenu");
  const loginOpt = document.getElementById("loginOption");
  const logoutOpt = document.getElementById("logoutOption");
  const guestOption = document.getElementById("guestOption");
		
	if (isAuth) {
    //alert("Welcome " + currentUserArray.email);
    loginOpt.style.display = "none";
    guestOption.style.display = "none";
    logoutOpt.style.display = "block";
    await showUserDashboard(currentUserArray.email);
  } else if (isGuest) {
    currentUserArray = null;
    guestOption.style.display = "block";
    logoutOpt.style.display = "block";
    loginOpt.style.display = "none";
    await showPublicSlideshows();
  } else {
    currentUserArray = null;
    loginOpt.style.display = "block";
    guestOption.style.display = "block";
    logoutOpt.style.display = "none";
    await showPublicSlideshows();
  }

  // Toggle dropdown
  document.getElementById("authButton").onclick = () => {
    menu.style.display = menu.style.display === "none" ? "block" : "none";
  };

  loginOpt.onclick = login;
  logoutOpt.onclick = logout;
  guestOption.onclick = guest;
 };
//alert("hey  1.2");

	async function login() {
			window.open(targetPage, "_self");
	}
	async function logout() {
			window.open(targetPage + '&auth=false', "_self");
	
}
	async function guest() {
			window.open(targetPage + '&auth=guest', "_self");
	
}
//alert("hey  2 ");
	window.onload = initAuth0;
