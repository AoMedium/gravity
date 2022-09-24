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
					target.id = simSystem.primaryID[selTargetIndex];
					if (trailMode == 1) {
						resetAllTrails();
					}
					
				break;
				case 84: //t
					isTargetting = !isTargetting;
					resetAllTrails();
				break;
				case 89: //y
					if (selTargetIndex < simSystem.primaryID.length - 1) {
						selTargetIndex++;
					} else {
						selTargetIndex = 0;
					}
					target.id = simSystem.primaryID[selTargetIndex];
					if (trailMode == 1) {
						resetAllTrails();
					}
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

	switch (cmdSplit[0]) {
		case "system":
			switch (cmdSplit[1]) {
				case "load":
					loadSystem(cmdSplit[2]);
					updateCmdResult("attempted to load system: " + cmdSplit[2]);
				break;

				case "set":
					var val = parseFloat(cmdSplit[3]);
					switch (cmdSplit[2]) {
						case "g":
							simSystem.gVal = val;
							updateCmdResult("set system g value to " + val);
						break;

						case "entitycap":
							simSystem.entityCap = val;
							updateCmdResult("set system entity cap to " + val);
						break;
						case "spawnrange":
							simSystem.spawnRange = val;
							updateCmdResult("set system spawn range to " + val);
						break;
						case "cullrange":
							simSystem.cullRange = val;
							updateCmdResult("set system cull range to " + val);
						break;
						case "typescale":
							simSystem.typeScale = val;
							updateCmdResult("set system type scale to " + val);
						break;
						case "collisionmode":
							collisionMode = val;
							updateCmdResult("set system collision mode to " + val);
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

		case "roid":
			switch (cmdSplit[1]) {
				case "set":
					var val = parseFloat(cmdSplit[3]);
					switch (cmdSplit[2]) {
						case "mass":
							roidMass = val;
							updateCmdResult("set roid mass to " + val);
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

		case "set":
			var val = parseFloat(cmdSplit[2]);
			switch (cmdSplit[1]) {
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

				case "trailmode":
					resetAllTrails();
					trailMode = parseInt(val);
					updateCmdResult("set trail mode to " + val);
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
					target.id = cmdSplit[2];
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


		case "toggle":
			switch (cmdSplit[1]) {
				case "ui":
					hideUI = !hideUI;
					updateCmdResult("toggled hideUI to " + hideUI);
				break;
				case "clear":
					hideUI = !hideUI;
					stopClear = !stopClear;
					updateCmdResult("toggled stopClear to " + stopClear);
				break;

				case "trails":
					showTrails = !showTrails;
					updateCmdResult("toggled showTrails to " + showTrails);
					if (showTrails) {
						resetAllTrails();
					}
				break;

				case "nightmode":
					nightMode = !nightMode;
					updateNightMode();
					updateCmdResult("toggled nightMode to " + nightMode);
				break;

				case "trivial":
					showTrivial = !showTrivial;
					updateCmdResult("toggled showTrivial to " + showTrivial);
				break;

				case "pause":
					isPaused = !isPaused;
					updateCmdResult("toggled isPaused to " + isPaused);
				break;

				default:
					updateCmdResult("ERROR: could not parse token 1");
					error = true;
			}
			
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

				default:
					updateCmdResult("ERROR: could not parse token 1");
					error = true;
			}
		break;

		default:
			updateCmdResult("ERROR: could not parse token 0");
			error = true;
	}

	if (error == false) {
		prevCmd = cmd;
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