var step = 0, video = document.getElementById("video"), pCanvas = document.getElementById("pictureCanvas"), fCanvas = document.getElementById("frameCanvas"), frameNum = 0, sCanvas = document.getElementById("stickerCanvas"), stickers = [], sticker = {x: 90, y: 90, i: 1}, eCanvas = document.getElementById("endCanvas");
function stepper() {
	step++;
	switch (step) {
		case 1:
			stepOne();
			break;
		// Case 2 Is The Retake & Reset Feature
		case 3:
			stepThree();
			break;
		case 4:
			stepFour();
			break;
		case 5:
			stepFive();
			break;
		case 6:
			stepSix();
			break;
		case 7:
			stepSeven();
			break;
		default:
		console.error("Incorrect Step: " + step);
	}
}
async function stepOne() { // Get The Camera & Display In Video
	if ('mediaDevices' in navigator && 'getUserMedia' in navigator.mediaDevices) { // Check For Media Devices
		/*var videoStream = await navigator.mediaDevices.getUserMedia({video: true});
		console.log(videoStream);
		video.srcObject = videoStream;*/
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
function setFrame(newFrameNum) { // Choose & Draw Frame/Canvas
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
function stepFour() { // Set Frame
	setFrame(1);
	document.getElementById("pictureSection").style.display = "none";
	document.getElementById("frameSection").style.display = "block";
}
function chooseSticker(newNum) { // Set Sticker Image
	sCanvas.getContext("2d").drawImage(fCanvas, 0, 0);
	sticker.i = newNum;
	console.log(sticker);
	drawSticker(true);
}
function drawSticker(drawArc) {
	sCanvas.getContext("2d").drawImage(fCanvas, 0, 0);
	var sImg = new Image();
	sImg.src = "stickers/" + sticker.i + ".png";
	for (var num = 0; num < stickers.length; num++) {
		console.log(sticker[num]);
		let sImgNew = new Image();
		sImgNew.src = "stickers/" + stickers[num].i + ".png";
		sCanvas.getContext("2d").drawImage(sImgNew, stickers[num].x, stickers[num].y);
	}
	if (sticker.i > 0) {
		sCanvas.getContext("2d").drawImage(sImg, sticker.x, sticker.y);
		if (drawArc) {
			sCanvas.getContext("2d").beginPath();
			sCanvas.getContext("2d").arc(sticker.x, sticker.y, 22.5, 0, 2 * Math.PI);
			sCanvas.getContext("2d").stroke();
			sCanvas.getContext("2d").closePath();
		}
	}
}
function removeSticker() {
	stickers.pop();
	drawSticker(true);
}
function setSticker() {
	stickers.push({x: sticker.x, y: sticker.y, i: sticker.i});
	sticker = {x: 90, y: 90, i: 1};
	drawSticker(true);
}
function touchableStickers() {
	var touchObj, touchStartX, touchStartY, xDist, yDist, xDistLast, yDistLast;
	sCanvas.addEventListener('touchstart', function(e){
		touchObj = e.changedTouches[0]; // Get First Finger Touchpoint
		touchStartX = parseInt(touchObj.clientX); // The Starting X Coordinate
		touchStartY = parseInt(touchObj.clientY); // The Starting Y Coordinate
		xDist = touchStartX; // Reset
		yDist = touchStartY; // Reset
		xDistLast = touchStartX; // Reset
		yDistLast = touchStartY; // Reset
		e.preventDefault(); // Stop Gestured Scrolling
		console.log("TouchStart  X: " + touchStartX + "  Y: " + touchStartY);
	}, false)
	sCanvas.addEventListener('touchmove', function(e){
		touchobj = e.changedTouches[0] // Get First Finger Touchpoint
		xDist = parseInt(touchobj.clientX) - touchStartX; // Calculate Current X Distance From Start X
		yDist = parseInt(touchobj.clientY) - touchStartY; // Calculate Current Y Distance From Start Y
		console.log("TouchMove  Xdist: " + xDist + "  Ydist: " + yDist);
		// Change Current Sticker Coordinates Based On Relative Coordinate Distance
		sticker.x += xDist - xDistLast;
		sticker.y += yDist - yDistLast;
		if (sticker.x < 0) { // Can't Go Left Off Canvas
			sticker.x = 0;
		} else if (sticker.x > sCanvas.width) { // Can't Go Right Off Canvas
			sticker.x = sCanvas.width;
		}
		if (sticker.y < 0) { // Can't Go Up Off Canvas
			sticker.y = 0;
		} else if (sticker.y > sCanvas.height) { // Can't Go Down Off Canvas
			sticker.y = sCanvas.height;
		}
		drawSticker(true);
		xDistLast = xDist;
		yDistLast = yDist;
	}, false)
}
function stepFive() { // Set Stickers
	sCanvas.getContext("2d").lineWidth = 22.5;
	chooseSticker(1);
	drawSticker(false);
	touchableStickers();
	document.getElementById("frameSection").style.display = "none";
	document.getElementById("stickerSection").style.display = "block";
}
function drawEnd() { // Draw The End Canvas
	eCanvas.getContext("2d").drawImage(fCanvas, 0, 0);
	var eImg = new Image();
	eImg.src = "stickers/" + sticker.i + ".png";
	for (var eNum = 0; eNum < stickers.length; eNum++) {
		console.log(sticker[eNum]);
		let eImgNew = new Image();
		eImgNew.src = "stickers/" + stickers[eNum].i + ".png";
		eCanvas.getContext("2d").drawImage(eImgNew, stickers[eNum].x, stickers[eNum].y);
	}
}
function stepSix() { // Ending Page
	drawEnd();
	var photoDownload = eCanvas.toDataURL('image/png');
	document.getElementById("photoDownload").href = photoDownload.replace(/^data:image\/[^;]/, 'data:application/octet-stream'); // Set The Download
	document.getElementById("photoDownload").href = photoDownload; // Set The Google Drive Save Source
	document.getElementById("stickerSection").style.display = "none";
	document.getElementById("endSection").style.display = "block";
}
function stepSeven() { // Reset To The Start To Take Another Picture
	document.getElementById("endSection").style.display = "none";
	frameNum = 0; // Reset Frame To None
	stickers = []; // Reset To No Set Stickers
	sticker = {x: 90, y: 90, i: 1}; // Reset Current Sticker
	// Go Back To Step 2
	step = 2;
	stepTwo();
}
var step = 0, video = document.getElementById("video"), pCanvas = document.getElementById("pictureCanvas"), fCanvas = document.getElementById("frameCanvas"), frameNum = 0, sCanvas = document.getElementById("stickerCanvas"), stickers = [], sticker = {x: 90, y: 90, i: 1}, eCanvas = document.getElementById("endCanvas");
