<!DOCTYPE html>
<html>
<head>
 <!-- <meta http-equiv="refresh" content="0; url=/slideshow.html"> -->
  <title>Redirecting...</title>
</head>
<body>
  <p>Redirecting to slideshow.html........</p>
  <SCRIPT>
const queryString = window.location.search;
   		// Define the base URL and parameters
			const urlParams = new URLSearchParams(queryString);
			var projName = urlParams.get('projName');
			
			//alert("projName  " + projName);
			
			const targetPage = "slideshow.html";
			
			if (projName) {
		
 			   targetPage = "'startSlideshow.html/' + projName";
       
      };

    window.open(targetPage, "_self");
  </script>
</body>
</html> 