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
function stepOne() { // Get The Camera
	if ('mediaDevices' in navigator && 'getUserMedia' in navigator.mediaDevices) { // Check For Media Devices
		console.log(navigator.mediaDevices.getUserMedia({video: true}));
	} else {
		console.error("No Media Devices!");
	}
}
