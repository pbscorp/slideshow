//alert(" define updateSlides--");
   function togglePlay() {
      const video = document.getElementById("myVideo");
      if (video.paused) video.play();
      else video.pause();
    }

    function restart() {
      const video = document.getElementById("myVideo");
      video.currentTime = 0;
      video.play();
    }

    function nextVideo() {
		//alert(pplaylist);
    //const playlist = ["video1.mov", "video2.mov"];
      current = (current + 1) % playlist.length;
      playVideo(playlist[current]);
    }
function setVolumnVideo(val) {
  var video = document.getElementById("myVideo");
  video.volume = val;
}

function muteVideo() {
  var video = document.getElementById("myVideo");
  video.muted = true;
	//document.querySelector('.mute-toggle').textContent = "Unmute";
	//isMuted = true;
}

function unMuteVideo() {
  var video = document.getElementById("myVideo");
  video.muted = false;
}
function toggleFullscreen() {
	const video = document.getElementById("myVideo");
	if (video.requestFullscreen) {
	video.requestFullscreen();
	} else if (video.webkitEnterFullscreen) {
	// iOS Safari
	video.webkitEnterFullscreen();
	}
}

function startControls() {
	const progress = document.getElementById("progress");
	const video = document.getElementById("myVideo");
	controls.classList.add("visible");
	video.addEventListener("timeupdate", () => {
		progress.max = video.duration;
		progress.value = video.currentTime;
	});
	progress.addEventListener("input", () => {
		video.currentTime = progress.value;
	});
};

function showControls() {
	const controls = document.getElementById("controls");
	controls.classList.add("visible");
	clearTimeout(hideTimeout);
	hideTimeout = setTimeout(() => {
	controls.classList.remove("visible");
	}, 3000);
	startControls();
}
    let current = 0;
    let hideTimeout;
    wrapper = document.getElementById("initSlide");
    wrapper.addEventListener("click", showControls);
    wrapper.addEventListener("touchstart", showControls);

    function getMimeType(filename) {
      const ext = filename.split('.').pop().toLowerCase();
      const mimeTypes = {
        mp4: "video/mp4",
        m4v: "video/x-m4v",
        mov: "video/quicktime",
        avi: "video/x-msvideo",
        wmv: "video/x-ms-wmv",
        flv: "video/x-flv",
        webm: "video/webm",
        ogv: "video/ogg",
        "3gp": "video/3gpp",
        "3g2": "video/3gpp2",
        mkv: "video/x-matroska",
        ts: "video/mp2t",
        mts: "video/MP2T",
        mpeg: "video/mpeg",
        mpg: "video/mpeg"
      };
      return mimeTypes[ext] || "video/mp4";
    }

	 function playVideo(file) {
      //setOverlayText("Now playing: " + file);
	   const video = document.getElementById("myVideo");
		video.addEventListener('ended', (event) => {
  			//alert("The video has ended");
			//const myTimeout = setTimeout(function() {
  				changeSlide(1);
			//}, 2000);
		});
      const source = document.getElementById("videoSource");
		//alert("playVideo executing");
      source.src = file;
      source.type = getMimeType(file);
      video.currentTime = 0;
      video.load()
      video.play();
    }
  //alert("playVideo functions defined");
//alert("createAndPlayVideo now defined");


	function playNewVideo(file) {
      //setOverlayText("Now playing: " + file);
	   const video = document.getElementById("myVideo");
	//	if (!isAudio || isMuted) {
			video.addEventListener('ended', (event) => {
  				changeSlide(1);
			});
	//	};
      const source = document.getElementById("videoSource");
		//alert("playVideo executing");
      source.src = file;
      source.type = getMimeType(file);
      video.currentTime = 0;
      video.load();
      video.play();
		if (isAudio) {
			setVolumnVideo(0);
			//muteVideo();
		};
		if (isMuted) {
			muteVideo();
		};
		

		
    }
function createAndPlayVideo(file) {
	let oldVideo = document.getElementById("myVideo");
	if (oldVideo) oldVideo.remove();
	const video = document.createElement("video");
	video.id = "myVideo";
	video.controls = true;
	const source = document.createElement("source");
	source.setAttribute("src", file);
	source.setAttribute("type", getMimeType(file));
	//alert('source ' + file);
	video.appendChild(source);
	//video.autoplay = true;
	const wrapper = document.getElementById("slideContainer");
	wrapper.innerHTML = `
	<div id="videoWrapper" class="video-wrapper">
	<video id="myVideo">
		<source id="videoSource" src="${file}" type="video/quicktime">
	</video>
	<!-- Custom Controls -->
	<div id="controls" class="controls" >
		<button onclick="togglePlay()">play/pause</button>
		<button onclick="restart()">restart</button>
		<button onclick="nextVideo()">next</button>
		<input type="range" id="progress" value="0" min="0" max="" step="0.1">
		<button onclick="toggleFullscreen()">full</button>
	</div>
	</div>
	`;
	//wrapper.appendChild(video);	
	//wrapper.appendChild(audio);
	//

	video.addEventListener('ended', () => {
	// Check which fullscreen exit method is available and call it
	if (document.exitFullscreen) {
		document.exitFullscreen();
	} else if (document.webkitExitFullscreen) { // Safari on iPad
		document.webkitExitFullscreen();
	}
  }, false);
	playNewVideo(file);
   	return video;
}

function updateSlides(slideNo) {

	if (slideNo == 0) {
		 if (inCorrectAnswerCtr + correctAnswerCtr > 0) {
			
            showMultichoiceResults();
			isMedia = false;
          }
	} 
	if (slideNo != currentSlide) {
		alert("slideNo " + slideNo + " not = currentSlide " + currentSlide);
	}
	const container = document.getElementById('slideContainer');
	const ovlerlay = document.getElementById('overlay');
	container.innerHTML = '';
	const slideDiv = document.createElement('div');
	container.className = `slide-container`;
	slideDiv.className = `slide ${slides[slideNo].type}-slide`;
	overlay.className = `overlay-text ${slides[slideNo].type}-slide`;
	isVideo = false;
	isAudio = false;
	if (slides[slideNo].videoSrc  && slides[slideNo].videoSrc != "false") {
		isVideo = true;
		isMedia = true
	} else {
		isVideo = false;
	}
	console.log(slides[slideNo].audioSrc);
	if (slides[slideNo].audioSrc && slides[slideNo].audioSrc != "false") {
		isAudio = true;
		isMedia = true;
	} else {
		isAudio = false;
	}
	if (isMedia) {	
		muteButton.style.display = 'block';
		setMuteButton();
	}
	if (slides[slideNo].background && slides[slideNo].background  != "false") {
			hasImage = true;
		} else {
			hasImage = false;
	}				
	const audio = document.createElement('audio');
	audioElements[slideNo] = audio;
	if (isAudio) {
		audio.src = slides[slideNo].audioSrc || ''; // Use hardcoded src or silence if not found
	}
	if (hasImage || isVideo) {
		setBackgroundImage(slideDiv, slides[slideNo].background);
		document.getElementById('initSlide').style.opacity = '1.0';
	} else {
		document.getElementById('initSlide').style.opacity = '0.7';
	}
	//console.log(' hasImage ' + hasImage + ' background ' + slides[slideNo].background);
	//console.log(' isAudio ' + isAudio + ' type ' + slides[slideNo].type + ' scr = ' + audio.src);
	g_audioFailed = false;
	if (!isMuted && isAudio){
		audio.play().catch(error => {
				g_audioFailed = true;
				alert(g_audioFailed + ' Audio play failed:' + error);
			});
	};

	console.log(' slideNo ' + slideNo + ' src and type = ' + slides[slideNo].audioSrc + ' ' + slides[slideNo].type );
	console.log(' slideNo ' + slideNo + ' src2 and type = ' + slides[slideNo].audioSrc2 + ' ' + slides[slideNo].type );

	g_audioFailed = false;
	if (!isMuted && isAudio) {
		console.log(' now playing ' + slides[slideNo].audioSrc);
		audio.onended = () => {
			if (slides[slideNo].audioSrc2.length) {
				audio.src = slides[slideNo].audioSrc2;
				audio.play();
				audio.onended = () => {
					if (slides[slideNo].type == "multi-choice") {
						inCorrectAnswer();
					}
					changeSlide(1);
					}
			} else {
				if (slides[slideNo].type == "multi-choice") {
					inCorrectAnswer();
				}
					changeSlide(1);
			}
		};
	} else if (slides[slideNo].type == "multi-choice") {
		audio.play();
			audio.onended = () => {
				inCorrectAnswer();
				changeSlide(1);
				}
		 
	}
	//const excludeAdvancingSlide = "Xquestion, Xmuli-choice, Xanswer";
	/*if (excludeAdvancingSlide.indexOf(slides[slideNo].type) == -1 ) {
		if (!isMuted && isAudio) {
		console.log('advance  slides[slideNo].type. = ' + slides[slideNo].type);
		audio.onended = () => {
		changeSlide(1);
		}
	};
	*/
	var displayText = slides[slideNo].content;
	if (slides[slideNo].type == "answer") {
		if(currentAnswerCorrect) {
			var newDisplayText = '<span class="text-red blink-hard"> Correct! </span></br>' + displayText
			displayText = newDisplayText;
		}
		currentAnswerCorrect = null;
		currentAnswerIncorrect = null; 
	}
	setOverlayText(displayText);     
	if (isVideo) {
		//overlay.classList.remove('other-slide');
		slideDiv.classList.add('active');
		overlay.classList.add('video-slide');
		const video = createAndPlayVideo(slides[slideNo].videoSrc);

	} else if (isAudio) {
		slideDiv.classList.add('active');
		slideDiv.appendChild(audio);
		container.appendChild(slideDiv);
	} else {
		slideDiv.classList.add('active');
		container.appendChild(slideDiv);
	}
	//alert("update5 slide no " + slideNo);

};
																									