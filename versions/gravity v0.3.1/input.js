window.addEventListener("keydown",
	function(e) {
		var key = event.keyCode;
		if (isTargetting == false) {
			switch (key) {
				case 38:
					originY -= stepModeArray[1].val; //using as in v0.0.2
				break;
				case 40:
					originY += stepModeArray[1].val;
				break;
				case 37:
					originX -= stepModeArray[1].val;
				break;
				case 39:
					originX += stepModeArray[1].val;
				break;
			}
		}

		switch (key) {

			case 192: //`
				nightMode = !nightMode;
				updateNightMode();
			break;

			case 49: //1
			break;


			case 219: //[
				if (stepMode > 0) {
					stepMode--;
				} else {
					stepMode = stepModeArray.length - 1;
				}
			break;
			case 221: //]
				if (stepMode < stepModeArray.length - 1) {
					stepMode++;
				} else {
					stepMode = 0;
				}
			break;

			case 187: //+
				stepModeArray[stepMode].incVal("+");
			break;
			case 189: //-
				stepModeArray[stepMode].incVal("-");
			break;
			

			case 48: //0
				stepModeArray[stepMode].incStep("+");
			break;
			case 57: //9
				stepModeArray[stepMode].incStep("-");
			break;


			case 76: //l
				isTargetting = false;
				targettingLargest = false;
				viewScale.val = simSystem.viewScale;
				originX = innerWidth / 2;
				originY = innerHeight / 2;
			break;
			case 186: //;
				if (viewScale.val - viewScale.step > 0) {
					viewScale.val = round(viewScale.val - viewScale.step, 3);
				}// else {
				// 	viewScale.val = 0.001;
				// }
			break;
			case 222: //'
				viewScale.val = round(viewScale.val + viewScale.step, 3);
			break;








			// case 190: //>
			// 	offsetStep = round(offsetStep + 0.2, 1);
			// 	//console.log("increased step to " + offsetStep);
			// break;
			// case 188: //<
			// 	if (offsetStep > 0) {
			// 		offsetStep = round(offsetStep - 0.2, 1);
			// 		//console.log("decreased step to " + offsetStep);
			// 	}
			// break;


			case 65: //a
				if (roidDisguise > 0) {
					roidDisguise--;
				} else {
					roidDisguise = typeOfEntity.length - 1;
				}
			break;
			case 83: //s
				spawnAtClick = !spawnAtClick;
			break;
			case 68: //d
				if (roidDisguise < typeOfEntity.length - 1) {
					roidDisguise++;
				} else {
					roidDisguise = 0;
				}
			break;
			case 70: //f
				userTypeOverride = !userTypeOverride;
			break;


			// case 90: //z
			// 	if (roidMass - roidMassStep > 0) {
			// 		roidMass -= roidMassStep;
			// 	}
			// break;
			// case 88: //x
			// 	roidMass += roidMassStep;
			// break;
			











			case 82: //r
				if (selTargetIndex > 0) {
					selTargetIndex--;
				} else {
					selTargetIndex = simSystem.primaryID.length - 1;
				}
				target = simSystem.primaryID[selTargetIndex];
			break;
			case 84: //t
				isTargetting = !isTargetting;
			break;
			case 89: //y
				if (selTargetIndex < simSystem.primaryID.length - 1) {
					selTargetIndex++;
				} else {
					selTargetIndex = 0;
				}
				target = simSystem.primaryID[selTargetIndex];
			break;

			case 85:
				if (targettingLargest) {
					isTargetting = false;
					targettingLargest = false;
				} else {
					setTarget(largest);
					isTargetting = true;
					targettingLargest = true;
				}
			break;


			
			case 71: //g
				
			break;

			case 82: //r
				
			break;



			case 72: //h
				hideUI = !hideUI;
				hideHtml();
			break;
			case 67: //c
				hideUI = true;
				hideHtml();

				stopClear = !stopClear;
			break;






			case 80: //p
				
				//console.log("isPaused = " + isPaused);
			break;


			case 77: //m
				timeStep = 1;
			break;
			case 188: //<
				if (timeStep > 1) {
					timeStep--;
				}
			break;
			case 190: //>
				if (timeStep < maxTimeStep) {
					timeStep++;
				}
			break;
			case 191: ///
				isPaused = !isPaused;
			break;


			case 81: //Q
				if (selSystem > 0) {
					selSystem--;
				} else {
					selSystem = systems.length - 1;
				}
			break;
			case 87: //W
				if (selSystem < systems.length - 1) {
					selSystem++;
				} else {
					selSystem = 0;
				}
			break;
			case 13: //enter
				useNewSystem();
			break;



		}
	});

window.addEventListener('mousedown',
	function (e) {
		if (e.button === 2 || spawnAtClick) {
			spawnRoid(true, originX + ((e.clientX - ptrX) / viewScale.val), originY + ((e.clientY - ptrY) / viewScale.val)); //using algebra
		}
		
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