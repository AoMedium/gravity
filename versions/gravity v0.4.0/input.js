var disableKeyInput = false;
var prevCmd = "";

window.addEventListener("keydown",
	function(e) {
		var key = event.keyCode;

		if (disableKeyInput) {
			switch (key) {
				case 13: //enter
					cmdEnter();
				break;
				case 38: //up
					cmdBox.value = prevCmd;
				break;
			}
		} else if (disableKeyInput == false) {
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
					orbitTarget = !orbitTarget;
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

			}
		}
	});

window.addEventListener('mousedown',
	function (e) {
		if (spawnAtClick && disableKeyInput == false) {
			spawnRoid(true, originX + ((e.clientX - ptrX) / viewScale.val), originY + ((e.clientY - ptrY) / viewScale.val)); //using algebra
		}
		
	});



function cmdEnter() {
	var error = false;
	var cmd = cmdBox.value;
	var cmdSplit = cmd.split(" ");

	console.log(cmd);
	//console.log(cmdSplit);

	prevCmd = cmd;

	switch (cmdSplit[0]) {
		case "load":
			loadSystem(cmdSplit[1]);
			updateCmdResult("attempted to load system: " + cmdSplit[1]);
		break;


		case "setval":
			var val = parseFloat(cmdSplit[2]);
			switch (cmdSplit[1]) {
				case "g":
					simSystem.gVal = val;
					updateCmdResult("set system g value to " + val);
				break;



				case "viewscale":
					viewScale.val = val;
					updateCmdResult("set view scale to " + val);
				break;
				case "viewscale.step":
					viewScale.step = val;
					updateCmdResult("set view scale step to " + val);
				break;
				case "offsetstep":
					offsetStep.val = val;
					updateCmdResult("set offset step to " + val);
				break;
				case "offsetstep.step":
					offsetStep.step = val;
					updateCmdResult("set offset step step to " + val);
				break;


				case "roidmass":
					roidMass.val = val;
					updateCmdResult("set roid mass to " + val);
				break;
				case "roidmass.step":
					roidMass.step = val;
					updateCmdResult("set roid mass step to " + val);
				break;

				default:
					updateCmdResult("ERROR: could not parse token 1");
					error = true;
			}
		break;


		case "goto":
			switch (cmdSplit[1]) {
				case "entity":
					isTargetting = true;
					target = cmdSplit[2];
					updateCmdResult("attempted to set target to " + cmdSplit[2]);
				break;
				case "position":
					isTargetting = false;
				break;

				default:
					updateCmdResult("ERROR: could not parse token 1");
					error = true;
			}
			
		break;

		// case "target":
		// 	switch (cmdSplit[1]) {
		// 		case "edit":
		// 			switch (cmdSplit[2]) {
		// 				case "mass":

		// 				break;

		// 				default:
		// 					updateCmdResult("ERROR: could not parse token 2");
		// 					error = true;
		// 			}
		// 		break;

		// 		default:
		// 			updateCmdResult("ERROR: could not parse token 1");
		// 			error = true;
		// 	}
		// break;


		case "toggleui":
			hideUI = !hideUI;
			updateCmdResult("hideUI is now " + hideUI);
		break;



		case "info":
			switch (cmdSplit[1]) {
				case "entity":
					switch (cmdSplit[2]) {
						case "mode":
							infoMode = parseInt(cmdSplit[3]);
							updateCmdResult("set entity info mode to " + infoMode);
						break;
						case "hide":
							infoMode = 0;
							updateCmdResult("hid entity info");
						break;
						case "toggletrivial":
							showTrivial = !showtrivial;
							updateCmdResult("show trivial entity info is now " + showTrivial);
						break;

						default:
							updateCmdResult("ERROR: could not parse token 2");
							error = true;
					}
				break;
				

				default:
					updateCmdResult("ERROR: could not parse token 1");
					error = true;
			}
		break;


		case "togglecastorbits":
			hideUI = !hideUI;
			stopClear = !stopClear;
			updateCmdResult("stopClear is now " + stopClear);
		break;



		case "timestep":
			var val = parseInt(cmdSplit[2]);

			switch (cmdSplit[1]) {
				case "set":
					timeStep = val;
					updateCmdResult("set time step to " + val);
				break;
				case "overridemax":
					maxTimeStep = val;
					updateCmdResult("overridden max time step to " + val);
				break;
				case "togglepause":
					isPaused = !isPaused;
					updateCmdResult("isPaused is now " + isPaused);
				break;

				default:
					updateCmdResult("ERROR: could not parse token 1");
					error = true;
			}
		break;

		case "togglenightmode":
			nightMode = !nightMode;
			updateNightMode();
			updateCmdResult("toggled night mode to " + nightMode);
		break;

		default:
			updateCmdResult("ERROR: could not parse token 0");
			error = true;
	}

	if (error == false) {
		cmdBox.value = "";
	}
}

function updateCmdResult(result) {
	cmdResult.innerHTML = cmdBox.value + " > " + result;
}

function toggleKeyInput(bool) {
	//console.log(bool);
	disableKeyInput = bool;
}