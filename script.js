var step = 0, video = document.getElementById("video"), pCanvas = document.getElementById("pictureCanvas"), fCanvas = document.getElementById("frameCanvas"), frameNum = 0;
function stepper() {
	step++;
	switch (step) {
		case 1:
			stepOne();
			break;
		// Case 2 Is The Retake Feature
		case 3:
			stepThree();
			break;
		case 4:
			stepFour();
			break;
		default:
		console.error("Incorrect Step: " + step);
	}
}
async function stepOne() { // Get The Camera & Display In Video
	if ('mediaDevices' in navigator && 'getUserMedia' in navigator.mediaDevices) { // Check For Media Devices
		var videoStream = await navigator.mediaDevices.getUserMedia({video: true});
		console.log(videoStream);
		video.srcObject = videoStream;
		//video.src = "https://www.w3schools.com/html/mov_bbb.mp4"; // TEMP: Just For Development (Desktop Doesn't Have Webcam)
	} else {
		console.error("No Media Device Navigator!");
	}
	stepTwo();
	step++;
}
function stepTwo() {
	document.getElementById("startStepper").style.display = "none";
	document.getElementById("pictureSection").style.display = "none";
	document.getElementById("videoSection").style.display = "block";
}
function retakePicture() { // Go Back To Step Two
	step = 2;
	stepTwo();
}
function stepThree() { // Snap Photo
	if (video.videoWidth > video.videoHeight) {
		pCanvas.getContext("2d").drawImage(video, (video.videoWidth - video.videoHeight) / 2, 0, video.videoHeight, video.videoHeight, 0, 0, pCanvas.width, pCanvas.height);
	} else {
		pCanvas.getContext("2d").drawImage(video, 0, (video.videoHeight - video.videoWidth) / 2, video.videoWidth, video.videoWidth, 0, 0, pCanvas.width, pCanvas.height);
	}
	document.getElementById("videoSection").style.display = "none";
	document.getElementById("pictureSection").style.display = "block";
}
function setFrame(newFrameNum) {
	if (newFrameNum > 0 || newFrameNum === 0) {
		frameNum = newFrameNum;
		console.log("Frame Num: " + frameNum);
	}
	fCanvas.getContext("2d").drawImage(pCanvas, 0, 0);
	if (frameNum > 0) {
		var fImg = new Image();
		fImg.src = "frames/" + frameNum + ".png";
		fCanvas.getContext("2d").drawImage(fImg, 0, 0);
	}
}
function stepFour() {
	setFrame();
	document.getElementById("pictureSection").style.display = "none";
	document.getElementById("frameSection").style.display = "block";
}
/*function changeElement() {
  var videoC = document.getElementById("videoContainer");
  videoC.style.width = video.videoHeight + "px";
  videoC.style.height = video.videoHeight + "px";
}*/
