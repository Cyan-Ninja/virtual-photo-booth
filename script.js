var step = 0, video = document.querySelector("video"), canvas = document.querySelector("canvas");
function stepper() {
	step++;
	switch (step) {
		case 1:
			stepOne();
			break;
		case 2:
			stepTwo();
			break;
		default:
		console.error("Incorrect Step: " + step);
		stepTwo(); // TEMP: Just For Development
	}
}
async function stepOne() { // Get The Camera & Display In Video
	if ('mediaDevices' in navigator && 'getUserMedia' in navigator.mediaDevices) { // Check For Media Devices
		const videoStream = await navigator.mediaDevices.getUserMedia({video: true});
		console.log(videoStream);
		video.srcObject = videoStream;
	} else {
		console.error("No Media Devices!");
	}
}
function stepTwo() { // Snap Photo
	if (video.videoWidth > video.videoHeight) {
		canvas.getContext("2d").drawImage(video, 0, 0, video.videoHeight + video.videoHeight / 2, video.videoHeight, 0, 0, canvas.width, canvas.height);
	} else {
		canvas.getContext("2d").drawImage(video, 0, 0, video.videoWidth, video.videoWidth + video.videoWidth / 2, 0, 0, canvas.width, canvas.height);
	}
}
