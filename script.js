var step = 0, video = document.getElementById("video"), pCanvas = document.getElementById("pictureCanvas"), fCanvas = document.getElementById("frameCanvas"), frameNum = 0, sCanvas = document.getElementById("stickerCanvas"), stickers = [], sticker = {x: 90, y: 90, i: 1, s: 1, d: 0}, touchableStickersRunOnce = false, eCanvas = document.getElementById("endCanvas"), stickerSelectionOpen = false;
function stepper() {
	step++;
	console.log("Running Step: " + step);
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
function hideAllSections() {
	for (var i = 0; i < document.getElementsByClassName("section").length; i++) {
		document.getElementsByClassName("section")[i].style.display = "none";
	}
	document.getElementsByTagName("body")[0].style.backgroundColor = "#890456";
	document.getElementsByTagName("body")[0].style.backgroundImage = 'url("background.png")';
}
async function stepOne() { // Get The Camera & Display In Video
	if ('mediaDevices' in navigator && 'getUserMedia' in navigator.mediaDevices) { // Check For Media Devices
		var videoStream = await navigator.mediaDevices.getUserMedia({video: true});
		console.log(videoStream);
		video.srcObject = videoStream;
	} else {
		console.error("No Media Device Navigator!");
	}
	stepTwo();
	step++;
}
function stepTwo() {
	hideAllSections();
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
	hideAllSections();
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
		fCanvas.getContext("2d").drawImage(fImg, 0, 0, fCanvas.width, fCanvas.height);
	}
}
function stepFour() { // Set Frame
	setFrame();
	hideAllSections();
	document.getElementById("frameSection").style.display = "block";
}
function rechooseFrame() {
	step = 4;
	stepFour();
}
function chooseSticker(newNum) { // Set Sticker Image
	sCanvas.getContext("2d").drawImage(fCanvas, 0, 0);
	sticker.i = newNum;
	console.log(sticker);
	drawSticker(true);
	stickerSelectionToggle();
}
function drawSticker(drawArc) {
	sCanvas.getContext("2d").drawImage(fCanvas, 0, 0);
	var sImg = new Image();
	sImg.src = "stickers/" + sticker.i + ".png";
	for (var num = 0; num < stickers.length; num++) {
		console.log(stickers[num]);
		let imgNew = new Image();
		imgNew.src = "stickers/" + stickers[num].i + ".png";
		sCanvas.getContext("2d").save(); // Save Canvas To Restore
		sCanvas.getContext("2d").translate(stickers[num].x + imgNew.width / 2, stickers[num].y + imgNew.height / 2); // Set Origin To Image Centre
		sCanvas.getContext("2d").rotate(stickers[num].d * Math.PI / 360); // Rotate Canvas Around Origin (Degrees To Radians)
		sCanvas.getContext("2d").drawImage(imgNew, imgNew.width / 2 * (-1), imgNew.height / 2 * (-1), imgNew.width * stickers[num].s, imgNew.height * stickers[num].s); // Draw Image
		sCanvas.getContext("2d").restore(); // Restore Canvas To Normal
	}
	if (sticker.i > 0) {
		sCanvas.getContext("2d").save(); // Save Canvas To Restore
		sCanvas.getContext("2d").translate(sticker.x + sImg.width / 2, sticker.y + sImg.height / 2); // Set Origin To Image Centre
		sCanvas.getContext("2d").rotate(sticker.d * Math.PI / 360); // Rotate Canvas Around Origin (Degrees To Radians)
		sCanvas.getContext("2d").drawImage(sImg, sImg.width / 2 * (-1), sImg.height / 2 * (-1), sImg.width * sticker.s, sImg.height * sticker.s); // Draw Image
		if (drawArc) {
			sCanvas.getContext("2d").beginPath();
			sCanvas.getContext("2d").arc(0 - (sImg.width * (1 - sticker.s) / 2), 0 - (sImg.height * (1 - sticker.s) / 2), 6.9, 0, 2 * Math.PI);
			sCanvas.getContext("2d").stroke();
			sCanvas.getContext("2d").closePath();
		}
		sCanvas.getContext("2d").restore(); // Restore Canvas To Normal
	}
}
function removeSticker() {
	stickers.pop();
	drawSticker(true);
}
function setSticker() {
	stickers.push({x: sticker.x, y: sticker.y, i: sticker.i, s: sticker.s, d: sticker.d});
	sticker = {x: 90, y: 90, i: 1, s: 1, d: 0};
	drawSticker(true);
}
function touchableStickers() {
	console.warn("TOUCHABLE STICKERS FUNC RUN");
	var touchObj, touchStartX, touchStartY, xDist, yDist, xDistLast, yDistLast, touchObjTwo, hyp, lastHyp;
	sCanvas.addEventListener('touchstart', function(e){
		e.preventDefault();
		touchObj = e.changedTouches[0]; // Get First Finger Touchpoint
		touchStartX = parseInt(touchObj.clientX); // The Starting X Coordinate
		touchStartY = parseInt(touchObj.clientY); // The Starting Y Coordinate
		xDist = 0; // Reset
		yDist = 0; // Reset
		xDistLast = 0; // Reset
		yDistLast = 0; // Reset
		hyp = 0; // Reset
		lastHyp = 0; // Reset
		console.log("TouchStart  X: " + touchStartX + "  Y: " + touchStartY);
	}, false)
	sCanvas.addEventListener('touchmove', function(e){
		touchobj = e.changedTouches[0]; // Get First Finger Touchpoint
		if (e.changedTouches.length == 1) {
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
		}

		if (e.changedTouches.length > 1) {
			touchObjTwo = e.changedTouches[1]; // Get Second Finger Touchpoint
			hyp = Math.sqrt(Math.abs((touchObj.clientX-touchObjTwo.clientX)*(touchObj.clientX-touchObjTwo.clientX)) + Math.abs((touchObj.clientY-touchObjTwo.clientY)*(touchObj.clientY-touchObjTwo.clientY)));

			hyp = Math.abs(hyp);

			sticker.s += (hyp - lastHyp) / 100;
			sticker.x -= xDist - xDistLast; // Revert The Singletouch
			sticker.y -= yDist - yDistLast; // Revert The Singletouch

			if (sticker.s < 0) {
				sticker.s = 0;
			} else if (sticker.s > 1) {
				sticker.s = 1;
			}

			lastHyp = hyp;
		}

		drawSticker(true);
		xDistLast = xDist;
		yDistLast = yDist;
	}, false)
}
function stepFive() { // Set Stickers
	sCanvas.getContext("2d").lineWidth = 22.5;
	drawSticker(true);
	if (!touchableStickersRunOnce) {
		touchableStickersRunOnce = true;
		touchableStickers();
	}
	hideAllSections();
	document.getElementById("stickerSection").style.display = "block";
}
function drawEnd() { // Draw The End Canvas
	eCanvas.getContext("2d").drawImage(fCanvas, 0, 0);
	for (var num = 0; num < stickers.length; num++) {
		console.log(stickers[num]);
		let imgNew = new Image();
		imgNew.src = "stickers/" + stickers[num].i + ".png";
		eCanvas.getContext("2d").save(); // Save Canvas To Restore
		eCanvas.getContext("2d").translate(stickers[num].x + imgNew.width / 2, stickers[num].y + imgNew.height / 2); // Set Origin To Image Centre
		eCanvas.getContext("2d").rotate(stickers[num].d * Math.PI / 360); // Rotate Canvas Around Origin (Degrees To Radians)
		eCanvas.getContext("2d").drawImage(imgNew, imgNew.width / 2 * (-1), imgNew.height / 2 * (-1), imgNew.width * stickers[num].s, imgNew.height * stickers[num].s); // Draw Image
		eCanvas.getContext("2d").restore(); // Restore Canvas To Normal
	}
}
function stickerSelectionToggle() {
	stickerSelectionOpen = !stickerSelectionOpen;
	if (stickerSelectionOpen) {
		document.getElementById("stickerSelection").style.display = "flex";
	} else {
		document.getElementById("stickerSelection").style.display = "none";
	}
}
function backToStickers() {
	step = 5;
	stepFive();
}
function stepSix() { // Ending Page
	drawEnd();
	var photoDownload = eCanvas.toDataURL('image/png');
	document.getElementById("photoDownload").href = photoDownload.replace(/^data:image\/[^;]/, 'data:application/octet-stream'); // Set The Download
	document.getElementById("photoDownload").href = photoDownload; // Set The Google Drive Save Source
	hideAllSections();
	document.getElementById("endSection").style.display = "block";
	document.getElementsByTagName("body")[0].style.backgroundColor = "#bfab39";
	document.getElementsByTagName("body")[0].style.backgroundImage = 'url("background2.png")';
	/* Could Be Used If Wanted, But Not
	if (document.getElementsByTagName("body")[0].style.backgroundColor == 'url("background.png")' || document.getElementsByTagName("body")[0].style.backgroundColor == "") {
		document.getElementsByTagName("body")[0].style.backgroundColor = "#bfab39";
		document.getElementsByTagName("body")[0].style.backgroundImage = 'url("background2.png")';
	} else {
		document.getElementsByTagName("body")[0].style.backgroundColor = "#890456";
		document.getElementsByTagName("body")[0].style.backgroundImage = 'url("background.png")';
	}*/
}
function stepSeven() { // Reset To The Start To Take Another Picture
	hideAllSections();

	// Reset Variables
	frameNum = 0; // Reset Frame To None
	stickers = []; // Reset To No Set Stickers
	sticker = {x: 90, y: 90, i: 1, s: 1, d: 0}; // Reset Current Sticker

	// Go Back To Step 2
	step = 2;
	stepTwo();
}
