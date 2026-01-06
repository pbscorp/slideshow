const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);
var state = urlParams.get('state');
var auth = urlParams.get('auth');
const AUTH0_DOMAIN = "edscode-admin.us.auth0.com";
const AUTH0_CLIENT_ID = "xzvZXRBJMBwi8xULruLZAd7eUs9BxaBE";
const REDIRECT_URI = "https://www.edscode.com/slideshow.html";
const targetPage = "editSlideshow.html?state=test";
let isAuth = true;
let isTest = true;

if (auth == "false") {
	isAuth = false;
}
let auth0Client = null;
let currentUser = null;
 //alert("hey  ");


async function initAuth0() {
	//alert("hey  initAuth0 isTest = " + isTest);
	await updateAuthState();
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
//alert("hey  1.0");


async function updateAuthState() {
	if (isTest) {
		// isAuth = true;
		currentUser = new Object();
		currentUser.email = "under10mph@gmail.com";
		currentUser.directory = "";
		currentUser.title = "";
		
	} else {
	   currentUser = await auth0Client.getUser();
		isAuth = await auth0Client.isAuthenticated();
	};
  const menu = document.getElementById("authMenu");
  const loginOpt = document.getElementById("loginOption");
  const logoutOpt = document.getElementById("logoutOption");
		
	if (isAuth) {
    //alert("Welcome " + currentUser.email);
    loginOpt.style.display = "none";
    logoutOpt.style.display = "block";
    showUserDashboard(currentUser);
  } else {
    currentUser = null;
    loginOpt.style.display = "block";
    logoutOpt.style.display = "none";
    showPublicSlideshows();
  }

  // Toggle dropdown
  	document.getElementById("authButton").onclick = () => {
    menu.style.display = menu.style.display === "none" ? "block" : "none";
  };

  loginOpt.onclick = login;
  logoutOpt.onclick = logout;
} 
//alert("hey  1.2");

//alert("hey  1.0.3");
//alert("hey  1.0");


	async function login() {
			window.open(targetPage, "_self");
	}
	async function logout() {
			window.open(targetPage + '&auth=false', "_self");
	}

//alert("hey  2 ");
	window.onload = initAuth0;


//alert("hey  1.1.1");
//alert("hey  1.0");
 