window.addEventListener("keydown",
	function(e) {
		var key = event.keyCode;
		if (isTargetting == false) {
			switch (key) {
				case 38:
					originY -= offsetStep; //using as in v0.0.2
				break;
				case 40:
					originY += offsetStep;
				break;
				case 37:
					originX -= offsetStep;
				break;
				case 39:
					originX += offsetStep;
				break;
			}
		}

		switch (key) {

			case 187:
				viewScale = round(viewScale + scaleStep, 3);
			break;
			case 189:
				if (viewScale - scaleStep > 0) {
					viewScale = round(viewScale - scaleStep, 3);
				} else {
					viewScale = 0.001;
				}
			break;
			case 220:
				isTargetting = false;
				targettingLargest = false;
				viewScale = simSystem.viewScale; //\
				originX = innerWidth / 2;
				originY = innerHeight / 2;
			break;
			case 221:
				scaleStep = round(scaleStep + 0.001, 3);
			break;
			case 219:
				if (scaleStep > 0) {
					scaleStep = round(scaleStep - 0.001, 3);
				}
			break;








			case 190: //>
				offsetStep = round(offsetStep + 0.2, 1);
				//console.log("increased step to " + offsetStep);
			break;
			case 188: //<
				if (offsetStep > 0) {
					offsetStep = round(offsetStep - 0.2, 1);
					//console.log("decreased step to " + offsetStep);
				}
			break;


			case 65: //a
				userTypeOverride = !userTypeOverride;
			break;

			case 83: //s
				spawnAtClick = !spawnAtClick;
			break;
			case 84: //t
				isTargetting = !isTargetting;
			break;


			case 70: //f
				if (selTargetIndex > 0) {
					selTargetIndex--;
				} else {
					selTargetIndex = simSystem.primaryID.length - 1;
				}
				target = simSystem.primaryID[selTargetIndex];
			break;
			case 71: //g
				if (selTargetIndex < simSystem.primaryID.length - 1) {
					selTargetIndex++;
				} else {
					selTargetIndex = 0;
				}
				target = simSystem.primaryID[selTargetIndex];
			break;

			case 82: //r
				if (targettingLargest) {
					isTargetting = false;
					targettingLargest = false;
				} else {
					setTarget(largest);
					isTargetting = true;
					targettingLargest = true;
				}
			break;



			case 77: //m
				if (timeStep < maxTimeStep) {
					timeStep++;
				} else {
					//G += 0.01
				}
			break;
			case 78: //n
				if (timeStep > 1) {
					timeStep--;
				} //else {
				// 	isPaused = true;
				// }
			break;
			case 80: //p
				isPaused = !isPaused;
				//console.log("isPaused = " + isPaused);
			break;








			case 88: //x
				if (roidDisguise < typeOfEntity.length - 1) {
					roidDisguise++;
				} else {
					roidDisguise = 0;
				}
			break;
			case 90: //z
				if (roidDisguise > 0) {
					roidDisguise--;
				} else {
					roidDisguise = typeOfEntity.length - 1;
				}
			break;
			


			case 13:
				setRoidProperty("all");
			break;
		}
	});

window.addEventListener('mousedown',
	function (e) {
		if (e.button === 2 || spawnAtClick) {
			spawnRoid(true, originX + ((e.clientX - ptrX) / viewScale), originY + ((e.clientY - ptrY) / viewScale)); //using algebra
		}
		//console.log(originX + ", " + originY)
		//console.log("to: " + (originX + ((e.clientX - originX) / viewScale)) + ", " + (originY + ((e.clientY - originY) / viewScale)))

		//originX += e.clientX - ptrX;
		//originY += e.clientY - ptrY; //didn't even need scaling....
		
	});

function toggleOption(option) {
	//console.log("toggle");
	switch (option) {
		case "showNames":
			showNames = !showNames;
		break;
		case "infoMode":
			if (infoMode == 2) {
				infoMode = -1;
			} else {
				infoMode++;
			}
		break;
		case "showTrivial":
			showTrivial = !showTrivial;
		break;
	}
}

function setRoidProperty(property) { //from button
	switch (property) {
		case "mass":
			roidMass = parseFloat(0 + document.getElementById("setRoidMass").value);
		break;
		case "dx":
			roidDX = parseFloat(0 + document.getElementById("setRoidDX").value);
		break;
		case "dy":
			roidDY = parseFloat(0 + document.getElementById("setRoidDY").value);
		break;
		case "all":
			setRoidProperty("mass");
			setRoidProperty("dx");
			setRoidProperty("dy");
		break;
	}
}