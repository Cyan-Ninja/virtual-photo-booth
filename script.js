var step = 0;
function stepper() {
	step++;
	switch (step) {
		case 1:
			stepOne();
			break;
		default:
		console.error("Incorrect Step: " + step);
	}
}
async function stepOne() { // Get The Camera & Display In Video
	if ('mediaDevices' in navigator && 'getUserMedia' in navigator.mediaDevices) { // Check For Media Devices
		const videoStream = await navigator.mediaDevices.getUserMedia({video: true});
		console.log(videoStream);
		const video = document.querySelector("#video");
		video.srcObject = videoStream;
	} else {
		console.error("No Media Devices!");
	}
}
