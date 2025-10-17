var disableKeyInput = false;
var cmdHistory = [];
var iCmd = 0;
var maxCmdHistory = 10;


var controlStep = 0.01;
var controlMult = 0.01;


window.addEventListener("keydown",
	function(e) {
		var key = event.keyCode;

		if (disableKeyInput) {
			switch (key) {
				case 13: //enter
					cmdEnter();
				break;
				case 38: //up
					if (cmdBox.value == "") {// probably better if not previous cmds
						cmd = cmdHistory.length - 1; //latest cmd
					} else {

						if (iCmd > 0) {
							iCmd--;
						}
					}
					cmdBox.value = cmdHistory[iCmd];
				break;
				case 40: //down
					if (iCmd < cmdHistory.length - 1) {
						iCmd++;
					}
					cmdBox.value = cmdHistory[iCmd];
				break;
			}
		} else {

			if (isTargetting) {
				var i = searchForEntity(target.id);
				if (i == undefined) {
					i = searchForCraft(target.id);
				}

				if (i != undefined) {
					
					var ds = Math.sqrt(Math.pow(entities[i].dx,2) + Math.pow(entities[i].dy,2))
					switch (key) {
						case 38: //up
							entities[i].dy -= controlStep;
							updateTargetPrediction(i);
						break;
						case 40: //down
							entities[i].dy += controlStep;
							updateTargetPrediction(i);
						break;
						case 37: //left
							entities[i].dx -= controlStep;
							updateTargetPrediction(i);
						break;
						case 39: //right
							entities[i].dx += controlStep;
							updateTargetPrediction(i);
						break;

						case 186: //;
							entities[i].dx -= entities[i].dx * controlMult;
							entities[i].dy -= entities[i].dy * controlMult;
							updateTargetPrediction(i);
						break;
						case 222: //'
							entities[i].dx += entities[i].dx * controlMult;
							entities[i].dy += entities[i].dy * controlMult;
							updateTargetPrediction(i);
						break;



						case 87: //w
							craftArray[i].dy -= 2 * controlStep;
							updateTargetPrediction(i, "craft");
						break;
						case 83: //s
							craftArray[i].dy += 2 * controlStep;
							updateTargetPrediction(i, "craft");
						break;
						case 65: //a
							craftArray[i].dx -= 2 * controlStep;
							updateTargetPrediction(i, "craft");
						break;
						case 68: //d
							craftArray[i].dx += 2 * controlStep;
							updateTargetPrediction(i, "craft");
						break;
					}
				}
			
			} else {
				switch (key) {
					case 38:
						ptrY -= offsetStep / viewScale; //using as in v0.0.2
					break;
					case 40:
						ptrY += offsetStep / viewScale;
					break;
					case 37:
						ptrX -= offsetStep / viewScale;
					break;
					case 39:
						ptrX += offsetStep / viewScale;
					break;
				}
			}

			switch (key) {

				case 27: //esc
					if (markerFixed) {
						marker.reset();
					}
				break;


				case 90: //z
					spawnCraftAtClick = !spawnCraftAtClick;
					
				break;


				case 67: //c
					target.id = craftArray[selCraftTarget].id;
				break;

				case 88: //x
					if (selCraftTarget > 0) {
						selCraftTarget--;
					} else {
						selCraftTarget = craftArray.length - 1;
					}
				break;
				
				case 86: //v
					if (selCraftTarget < craftArray.length - 1) {
						selCraftTarget++;
					} else {
						selCraftTarget = 0;
					}
				break;







				case 219: //[
					
				break;
				case 221: //]
					
				break;

				case 187: //+
					viewScale = round(viewScaleMult * viewScale, 4);
				break;
				case 189: //-
					if (viewScale / viewScaleMult > 0.001) {
						viewScale = round(viewScale / viewScaleMult, 4);
					}
				break;
				

				case 48: //0
					viewScaleMult = round(viewScaleMult + viewScaleMultStep, 4);
				break;
				case 57: //9
					if (viewScaleMult - viewScaleMultStep > 1) {
						viewScaleMult = round(viewScaleMult - viewScaleMultStep, 4);
					}
				break;


				case 76: //l
					isTargetting = false;
					targettingLargest = false;
					viewScale = simSystem.viewScale;
					ptrX = innerWidth / 2;
					ptrY = innerHeight / 2;
				break;
				case 186: //;
				break;
				case 222: //'
				break;
				








				case 85: //u
					userTypeOverride = !userTypeOverride;
				break;
				
				case 73: //i
					spawnRoidAtClick = !spawnRoidAtClick;
				break;
				case 79: //o
					orbitTarget = !orbitTarget;
					
				break;
				
				

				









				case 53: //5
					predictUsingOtherBodies = !predictUsingOtherBodies;
					var i = searchForEntity(target.id);
					if (i != undefined) {
						updateTargetPrediction(i);
					}
				break;


				case 69: //e
					if (selTargetMode > 0) {
						selTargetMode--;
					} else {
						selTargetMode = 1;
					}
				break;
				case 84: //t
					isTargetting = !isTargetting;
					if (trailMode == 1) {
						resetAllTrails();
					}
				break;

				case 82: //r
					if (selTargetIndex[selTargetMode] > 0) {
						selTargetIndex[selTargetMode]--;
					} else {
						selTargetIndex[selTargetMode] = simSystem.primaryID.length - 1;
					}

					updateTargetSelection();
					
				break;
				
				case 89: //y
					if (selTargetIndex[selTargetMode] < simSystem.primaryID.length - 1) {
						selTargetIndex[selTargetMode]++;
					} else {
						selTargetIndex[selTargetMode] = 0;
					}

					updateTargetSelection();
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
		if (!disableKeyInput) {
			if (spawnRoidAtClick) {
				switch (spawnMode) {
					case 0:
						spawnRoid(true, ptrX + ((e.clientX - midX) / viewScale), ptrY + ((e.clientY - midY) / viewScale)); //using algebra
					break;
					case 1:
						if (markerFixed) {
							var ds = marker.getVelVector();
							spawnRoid(true, marker.x, marker.y, ds[0] * launchConst, ds[1] * launchConst);
							marker.reset();
						} else {
							marker.setMarker(ptrX + ((e.clientX - midX) / viewScale), ptrY + ((e.clientY - midY) / viewScale));
							markerFixed = true;
						}
					break;
				}
				
			} else if (spawnCraftAtClick) {
				spawnCraft(ptrX + ((e.clientX - midX) / viewScale), ptrY + ((e.clientY - midY) / viewScale));
			}
		}
		
		
	});


window.addEventListener('mousemove', 
	function mouseState(e) {
		if (markerFixed) {
			marker.x2 = ptrX + ((e.clientX - midX) / viewScale);
			marker.y2 = ptrY + ((e.clientY - midY) / viewScale);
		}
	});


function updateTargetPrediction(i, type = "entity") {
	if (isPredictPath && isPaused) {
		switch (type) {
			case "entity":
				entities[i].predictPos = [];
				entities[i].predictPath(0, entities[i].x, entities[i].y, entities[i].dx, entities[i].dy);
			break;
			case "craft":
				craftArray[i].predictPos = [];
				craftArray[i].predictPath(0, craftArray[i].x, craftArray[i].y, craftArray[i].dx, craftArray[i].dy);
			break;
		}
	}
}

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

				case "compile":
					var data = cmd.split("system compile ");
					compileSystem(data[1]);
				break;

				case "entity":
					switch (cmdSplit[2]) {
						case "set":
							var i = searchForEntity(target.id);

							switch (cmdSplit[3]) {
								case "mass":
									if (cmdSplit[4] != undefined) {
										entities[i].mass = parseInt(cmdSplit[4]);
										updateCmdResult("set entity " + target.id + " mass to " + parseInt(cmdSplit[4]));
									}
								break;
								case "dx":
									if (cmdSplit[4] != undefined) {
										entities[i].dx = parseFloat(cmdSplit[4]);
										updateCmdResult("set entity " + target.id + " dx to " + parseFloat(cmdSplit[4]));
									}
								break;
								case "dy":
									if (cmdSplit[4] != undefined) {
										entities[i].dy = parseFloat(cmdSplit[4]);
										updateCmdResult("set entity " + target.id + " dy to " + parseFloat(cmdSplit[4]));
									}
								break;

								default:
									updateCmdResult("ERROR: could not parse token 3: " + cmdSplit[3]);
									error = true;
							}

							updateTargetPrediction(i);
							
						break;
						case "delete":
							updateCmdResult("attempted to delete " + target.id);
							var i = searchForEntity(target.id);
							if (i != undefined) {
								entities.splice(i, 1);
							}
						break;

						default:
							updateCmdResult("ERROR: could not parse token 2: " + cmdSplit[2]);
							error = true;
					}
				break;

				case "set":
					//
					switch (cmdSplit[2]) {
						case "g":
							var val = parseFloat(cmdSplit[3]);
							simSystem.gVal = val;
							updateCmdResult("set system g value to " + val);
						break;

						case "entitycap":
							var val = parseInt(cmdSplit[3]);
							simSystem.entityCap = val;
							updateCmdResult("set system entity cap to " + val);
						break;
						case "spawnrange":
							var val = parseFloat(cmdSplit[3]);
							simSystem.spawnRange = val;
							updateCmdResult("set system spawn range to " + val);
						break;
						case "cullrange":
							var val = parseFloat(cmdSplit[3]);
							simSystem.cullRange = val;
							updateCmdResult("set system cull range to " + val);
						break;
						case "typescale":
							var val = parseFloat(cmdSplit[3]);
							simSystem.typeScale = val;
							updateCmdResult("set system type scale to " + val);
						break;
						case "collisionmode":
							var val = parseInt(cmdSplit[3]);
							collisionMode = val;
							updateCmdResult("set system collision mode to " + val);
						break;

						default:
							updateCmdResult("ERROR: could not parse token 2: " + cmdSplit[2]);
							error = true;
					}
				break;

				default:
					updateCmdResult("ERROR: could not parse token 1: " + cmdSplit[1]);
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
						case "type":
						case "disguise":
							roidDisguise = val;
							updateCmdResult("attempted to set roid type to " + val);
						break;

						default:
							updateCmdResult("ERROR: could not parse token 2: " + cmdSplit[2]);
							error = true;
					}
				break;
				case "toggle":
					var val = parseFloat(cmdSplit[3]);
					switch (cmdSplit[2]) {
						case "override":
							userTypeOverride = !userTypeOverride;
							updateCmdResult("toggled userTypeOverride to " + userTypeOverride);
						break;

						default:
							updateCmdResult("ERROR: could not parse token 2: " + cmdSplit[2]);
							error = true;
					}
				break;
				default:
					updateCmdResult("ERROR: could not parse token 1: " + cmdSplit[1]);
					error = true;
			}
		break;

		case "set":
			var val = parseFloat(cmdSplit[2]);
			switch (cmdSplit[1]) {
				case "viewscale":
					viewScale = val;
					updateCmdResult("set view scale to " + val);
				break;
				case "viewscale.step":
					viewScaleStep = val;
					updateCmdResult("set view scale step to " + val);
				break;
				case "offsetstep":
					offsetStep = val;
					updateCmdResult("set offset step to " + val);
				break;
				case "offsetstep.step":
					offsetStepStep = val;
					updateCmdResult("set offset step step to " + val);
				break;

				case "trailwidth":
					trailWidth = val;
					updateCmdResult("set trail width to " + val);
				break;

				case "trailmode":
					resetAllTrails();
					trailMode = parseInt(val);
					updateCmdResult("set trail mode to " + val);
				break;
				case "trailcalcmode":
					resetAllTrails();
					trailCalcMode = parseInt(val);
					updateCmdResult("set trail calculation mode to " + val);
				break;

				case "spawnmode":
					spawnMode = parseInt(val);
					updateCmdResult("set spawnMode mode to " + val);
				break;


				default:
					updateCmdResult("ERROR: could not parse token 1: " + cmdSplit[1]);
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
					updateCmdResult("ERROR: could not parse token 1: " + cmdSplit[1]);
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
		// 					updateCmdResult("ERROR: could not parse token 2: " + cmdSplit[2]);
		// 					error = true;
		// 			}
		// 		break;

		// 		default:
		// 			updateCmdResult("ERROR: could not parse token 1: " + cmdSplit[1]);
		// 			error = true;
		// 	}
		// break;


		case "toggle":
			switch (cmdSplit[1]) {
				case "ui":
					hideUI = !hideUI;
					updateCmdResult("toggled hideUI to " + hideUI);
				break;
				case "targetcursor":
					showTargetCursor = !showTargetCursor;
					updateCmdResult("toggled showTargetCursor to " + showTargetCursor);
				break;
				case "radiuscoloring":
					radiusColoring = !radiusColoring;
					updateCmdResult("toggled radiusColoring to " + radiusColoring);
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
				case "trailnodes":
					showTrailNodes = !showTrailNodes;
					updateCmdResult("toggled showTrailNodes to " + showTrailNodes);
				break;

				case "predictpath":
					isPredictPath = !isPredictPath;
					updateCmdResult("toggled isPredictPath to " + isPredictPath);
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

				case "renderculling":
					renderCulling = !renderCulling;
					updateCmdResult("toggled renderCulling to " + renderCulling);
				break;

				case "pause":
					isPaused = !isPaused;
					updateCmdResult("toggled isPaused to " + isPaused);
				break;

				case "shading":
					isUsingShading = !isUsingShading;
					updateCmdResult("toggled isUsingShading to " + isUsingShading);
				break;

				case "fadeatmosphere":
					fadeAtmosphere = !fadeAtmosphere;
					updateCmdResult("toggled fadeAtmosphere to " + fadeAtmosphere);
				break;

				default:
					updateCmdResult("ERROR: could not parse token 1: " + cmdSplit[1]);
					error = true;
			}
			
		break;



		case "info":
			switch (cmdSplit[1]) {
				case "mode":
					infoMode = parseInt(cmdSplit[2]);
					updateCmdResult("set entity info mode to " + infoMode);
				break;
				case "hide":
					infoMode = 0;
					updateCmdResult("hid entity info");
				break;
				
				default:
					updateCmdResult("ERROR: could not parse token 1: " + cmdSplit[1]);
					error = true;
			}
		break;


		case "display":
			switch (cmdSplit[1]) {
				case "mode":
					switch (cmdSplit[2]) {
						// case "default":
						// 	nightMode = true;

						// 	showTrivial = false;

						// 	showTrails = true;
						// 	trailMode = 0;
						// 	trailCalcMode = 2;
						// 	showTrailNodes = false;
						// 	isPredictPath = false;

						// 	radiusColoring = true;

						// 	showTargetCursor = true;
						// 	infoMode = 3;
						// break;
						case "natural":
							hideUI = true;
							nightMode = true;

							showTrails = false;
							showTrailNodes = false;
							isPredictPath = false;
							
							radiusColoring = false;

							showTargetCursor = false;
							infoMode = 0;
						break;

						case "minimal":
							hideUI = true;
							nightMode = true;

							showTrails = true;
							showTrailNodes = false;
							isPredictPath = false;
							
							radiusColoring = true;

							showTargetCursor = false;
							infoMode = 1;
						break;

						default:
							updateCmdResult("ERROR: could not parse token 2: " + cmdSplit[2]);
							error = true;
					}
				break;

				default:
					updateCmdResult("ERROR: could not parse token 1: " + cmdSplit[1]);
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
					updateCmdResult("ERROR: could not parse token 1: " + cmdSplit[1]);
					error = true;
			}
		break;

		default:
			updateCmdResult("ERROR: could not parse token 0: " + cmdSplit[0]);
			error = true;
	}

	if (error == false) {
		if (cmd != cmdHistory[cmdHistory.length - 1]) {
			cmdHistory.push(cmd);
			iCmd = cmdHistory.length - 1;
		}

		if (cmdHistory.length > maxCmdHistory) {
			cmdHistory.splice(0, 1);
		}

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




function compileSystem(data) {
	data = data.replace(/	/g, "");
	data = data.replace(/ /g, "");

	var tagData = data.split("{");

	for (var i = 0; i < tagData.length; i++) {
		tagData[i] = tagData[i].split(";");
		for (var line = 0; line < tagData[i].length; line++) {
			var tokenStart = undefined;
			var tokens = [];
			console.log(tagData[i][line]);

			for (var char = 0; char < tagData[i][line].length; char++) {
				switch (tagData[i][line][char]) {
					case ":":
						tokens.push(tagData[i][line].slice(tokenStart, char));
						//console.log(tokenStart + ": " + char);
						tokenStart = undefined;
					break;

					default:
						if (tokenStart == undefined) {
							tokenStart = char;
							//console.log("tokenst is now " + tokenStart);
						}
					break;
				}
			}
			tokens.push(tagData[i][line].slice(tokenStart, char + 1));
			tagData[i][line] = tokens;
		}
	}





	//testLines(tagData);

	console.log(tagData);

	var centerID = undefined;
	var systemObjects = [];

	systemObjects = compileObjects(tagData, centerID);

	console.log(systemObjects)
}

function compileObjects(tagData, centerID) {

	var objects = [];

	for (var i = 0; i < tagData.length; i++) {
		var newObject = new PrimaryObject();

		for (var line = 0; line < tagData[i].length; line++) {
			//console.log(tagData[i][line]);
			switch (tagData[i][line][0]) {
				case "id":
					newObject.id = tagData[i][line][1];
				break;
				case "mass":
					newObject.mass = tagData[i][line][1];
				break;





				case "":
					objects.push(compileObjects(tagData.slice(i + 1, tagData.length), newObject.id));
				break;
				case "}":
					newObject.motionType = "o";
					newObject.center = centerID;
				break;
				case "}}":
					newObject.motionType = "o";
					newObject.center = centerID;
				break;
			}
		}
		objects.push(newObject);
	}

	return objects;
}


// function testLines(tagData) {
// 	var tokenArray = [];

// 	for (var i = 0; i < tagData.length; i++) {
// 		console.log(tagData[i]);

// 		var tokens = [];
// 		var tokenStart = undefined;

// 		for (var char = 0; char < tagData[i].length; char++) {
// 			//console.log(tagData[i][char] + " "+ tokenStart);
// 			if (tagData[i][char] != " " && tagData[i][char] != "	") {
// 				switch (tagData[i][char]) {
// 					case ":":
// 						tokens.push(tagData[i].slice(tokenStart, char));
// 						//console.log(tokenStart + ": " + char);
// 						tokenStart = undefined;
// 					break;


// 					case "{":
// 						for (search = char; search < tagData.length)
// 						tokens.push(testLines(tagData[i].slice(1, tagData[i].length)));
// 					break;




// 					default:
// 						if (tokenStart == undefined) {
// 							tokenStart = char;
// 							//console.log("tokenst is now " + tokenStart);
// 						}
// 					break;
// 				}
// 			}
// 			if (char == tagData[i].length - 1) {
// 				tokens.push(tagData[i].slice(tokenStart, char + 1)); //at end of line
// 			}
// 		}

// 		tokenArray.push(testLines(tagData[i]));
// 	}
	
// 	return tokenArray;
// }





