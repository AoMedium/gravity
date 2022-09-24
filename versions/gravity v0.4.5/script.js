var canvas = document.querySelector("canvas");
var c = canvas.getContext('2d');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

//document.addEventListener('contextmenu', event => event.preventDefault());

const nonZeroFactor = 0.0000001; //to prevent divide by 0

var guiTextFont = "12px Courier New";
var textFont = "11px Helvetica";
var textFont2 = "8px Verdana";
var textFont3 = "6px Verdana";


var nightMode = true;

var ptrColor, textColor, textColor2, outlineColor, outlineColor2, auraColor;

var originX = innerWidth / 2;
var originY = innerHeight / 2;
var ptrX = innerWidth / 2;
var ptrY = innerHeight / 2;

var ptrRadius = 8;
var indent = 0.2;


var collisionMode = 1; //0: none, 1: absorb, 2: distributive
var useOrbitOffset = true;

var viewScale = new StepVariable("viewScale", 0.5, 0.0005, 0.0005);
var offsetStep = new StepVariable("offsetStep", 5, 2, 0.2);
var stepModeArray = [viewScale, offsetStep];
var stepMode = 0;

var timeStep = 1; //1 = 7.1, 5 = 9.1, 10 = 10.7 , 15 = 12.3

var maxTimeStep = 100;
var isPaused = false;

var spawnTime = setInterval(spawnRoid, 1000);
var globalUpdateTime = setInterval(globalPeriodicUpdate, 5000);

var trailMode = 0;
var maxTrail = 200;
var showTrails = true;
var trailWidth = 0.5;
var radiusCull = true;

var forceFrames = true; //force framing actually more intensive
var fps = 15;



var roidMass = 10;
var spawnAtClick = false;
var orbitTarget = false;
var testForType = true;
var userTypeOverride = false;
var hideUI = false;
var stopClear = false;



var entities = [];
var idCount = 0;


// var roidDX = 0;
// var roidDY = 0;
var roidDisguise = 0;





var infoMode = 3;

var showTrivial = false;
var trivialThreshold = 0;
var upper = 0;
var largest;


var guiHeight = 15;
var guiOffset = 10;

// ===================== Main =====================

var target = new Target;

function Target() {
	this.id = "no target";
	this.x = ptrX;
	this.y = ptrY;
}

var selTargetIndex = 0;
var isTargetting = false;
var targettingLargest = false;

//var center = "Sol Alpha"; //for centripetal
var centerX, centerY, centerMass, centerDX, centerDY;


var enableTime = false;
if (enableTime) {
	var time = new Time();
}

updateNightMode();


var simSystem;
loadSystem("sol_beta");


//viewScale.val = 1 / (simSystem.typeScale * 50);

if (forceFrames == true) {
	var fF = setInterval(forceAnimate, 1000/fps);
} else {
	animate();
}

// ===================== Main End =====================


function animate() {
	requestAnimationFrame(animate);
	forceAnimate();
}
function forceAnimate() {
	if (!stopClear) {
		c.clearRect(0, 0, innerWidth, innerHeight);
	}
	drawGUI();
	updateObjects();

	//console.log(mx);
}


function loadSystem(systemVar) {
	entities = [];
	timeStep = 1;

	if (systemVar == undefined) {
		simSystem = systems[0];
	} else {
		var foundSystem = false;
		for (var i = 0; i < systems.length; i++) {
			if (systems[i].systemName == systemVar) {
				simSystem = systems[i];
				foundSystem = true;
				console.log("found");
				break;
			}
		}
		if (foundSystem == false) {
			simSystem = systems[0];
			console.log("not found");
		}
	}
	
	simSystem.initSystemObjects(); //reset to default variables
	simSystem.generateSystem();
	simSystem.applyTargetPref();
	viewScale.val = simSystem.viewScale;
	maxTimeStep = Math.round(99 * Math.pow(4, 1 - simSystem.entityCap / 35)) + 2;

	trivialThreshold = 0;

	for (var i = 0; i < entities.length; i++) {
		entities[i].updateType();
		entities[i].updateRadiusMass();

		//console.log(entities[i].id);
		//console.log(entities[i].center);
	}

	globalPeriodicUpdate();
}




function updateObjects() { //probably simplify
	//console.log(entities[2].x);
	if (isPaused) {
		for (var i = 0; i < entities.length; i++) {
			entities[i].testAsTarget();
			entities[i].draw();
		}
	} else {
		for (var t = 0; t < timeStep; t++) {
			for (var i = 0; i < entities.length; i++) {
				entities[i].update();
				//console.log(entities[i].id + " " + entities[i].fixed);
				if (t == timeStep - 1) {
					entities[i].draw();
				}
			}
		}
	}
	
}

// function trackPos() {
// 	if (showTrails) {
// 		for (var i = 0; i < entities.length; i++) {
// 			entities[i].pushNewPos();
// 		}	
// 	}
	
// }

function drawGUI() {
	if (!hideUI) {
		c.strokeStyle = ptrColor;

		//pointer marker
		c.beginPath();
		// c.moveTo(ptrX + length, ptrY);
		// c.lineTo(ptrX - length, ptrY);
		// c.stroke();

		// c.moveTo(ptrX, ptrY + length);
		// c.lineTo(ptrX, ptrY - length);
		// c.stroke();

		c.arc(ptrX, ptrY, ptrRadius, -Math.PI * 0.5, 0);
		c.stroke();
		c.beginPath();
		c.arc(ptrX, ptrY, ptrRadius, Math.PI * 0.5, Math.PI);
		c.stroke();

		c.closePath();


		//text
		c.beginPath();
		c.font = guiTextFont;
		c.fillStyle = textColor;

		c.fillText("forced fps: " + fps, innerWidth - 120, guiHeight + guiOffset);

		c.fillText("system: " + simSystem.systemName, 20, guiHeight + guiOffset);
		c.fillText("system G const: " + simSystem.gVal, 20, 2 * guiHeight + guiOffset);
		c.fillText("collision mode: " + collisionMode, 20, 3 * guiHeight + guiOffset);

		c.fillText("[{][}] step mode: " + stepModeArray[stepMode].name, 20, 5 * guiHeight + guiOffset);
		c.fillText("       val: " + stepModeArray[stepMode].val, 20, 6 * guiHeight + guiOffset);
		c.fillText("[+][-] step: " + stepModeArray[stepMode].step, 20, 7 * guiHeight + guiOffset);
		

		c.fillText("zoom view scale: " + viewScale.val + "x", 20, 9 * guiHeight + guiOffset);
		c.fillText("offset step: " + offsetStep.val, 20, 10 * guiHeight + guiOffset);


		c.fillText("entities: " + entities.length, 20,  guiHeight + guiOffset + 200);
		c.fillText("spawn range: " + simSystem.spawnRange, 20, 2 * guiHeight + guiOffset + 200);
		c.fillText("cull range: " + simSystem.cullRange, 20, 3 * guiHeight + guiOffset + 200);

		c.fillText("[s]    spawn at click: " + spawnAtClick, 20, 5 * guiHeight + guiOffset + 200);
		c.fillText("       roid mass: " + roidMass, 20, 6 * guiHeight + guiOffset + 200);
		c.fillText("[a][d] roid disguise: " + typeOfEntity[roidDisguise].typeName, 20, 7 * guiHeight + guiOffset + 200);
		c.fillText("[f]    user type override: " + userTypeOverride, 20, 8 * guiHeight + guiOffset + 200);
		c.fillText("[g]    orbit target: " + orbitTarget, 20, 9 * guiHeight + guiOffset + 200);

		c.fillText("[r][y] target: " + target.id, 20, 15 * guiHeight + guiOffset + 200);
		c.fillText("[t]    isTargetting: " + isTargetting, 20, 16 * guiHeight + guiOffset + 200);
		c.fillText("[u]    targettingLargest: " + targettingLargest, 20, 17 * guiHeight + guiOffset + 200);


		c.fillText("[<][>] time step: " + timeStep + "x", 20, 25 * guiHeight + guiOffset + 200);
		c.fillText("       maxTimeStep: " + maxTimeStep + "x", 20, 26 * guiHeight + guiOffset + 200);
		c.fillText("[m]    reset time", 20, 27 * guiHeight + guiOffset + 200);
		c.fillText("[/]    isPaused: " + isPaused, 20, 28 * guiHeight + guiOffset + 200);
		c.closePath();

	}

}
function updateNightMode() {
	if (nightMode) {
		document.body.style.backgroundColor = "#000";
		ptrColor = "#ddd";
		textColor = "#fff"; //#000
		textColor2 = "#bbb"; //#555
		outlineColor = "#fff"; //#000
		outlineColor2 = "#ccc"; //rgba(0,0,0,0.5)
		auraColor = "rgba(255,255,255"; //rgba(0,0,0,0.3)

	} else {
		document.body.style.backgroundColor = "#fff";
		ptrColor = "#333";
		textColor = "#000"; //#000
		textColor2 = "#555"; //#555
		outlineColor = "#000"; //#000
		outlineColor2 = "#aaa";
		auraColor = "rgba(150,150,150";
	}
}
function resetStyle() {
	c.strokeStyle = outlineColor;
	c.lineWidth = 1;
}


function createNew(id, mass, x, y, dx, dy, fixed, type, typeFixed, isPrimary, primaryColor) {
	entities.push(new Entity(id, mass, ptrX + x, ptrY + y, dx, dy, fixed, type, typeFixed, isPrimary, primaryColor));
}
function createNewOrbit(id, mass, radius, angle, center, isClockwise, type, typeFixed, isPrimary, primaryColor) { //WIP
	var x, y, dx, dy, v, vx, vy;

	this.angle = angle;

	//console.log("=====" + id + " target with " + center);

	if (this.angle == undefined) {
		this.angle = Math.random() * Math.PI * 2;
	}

	if (center == undefined) {
		//console.log("undefined for " + id + ", using x" + simSystem.centerX + " y" + simSystem.centerY + " from " + simSystem.center)
		this.centerX = simSystem.centerX;
		this.centerY = simSystem.centerY;
		this.centerMass = simSystem.centerMass;
		this.centerDX = simSystem.centerDX// / vScale;
		this.centerDY = simSystem.centerDY// / vScale;
	} else { 
		for (var i = 0; i < entities.length; i++) {

			if (entities[i].id == center) {
				//console.log(entities[i].id + " x" + entities[i].x + " y" + entities[i].y);
				this.centerX = entities[i].x - ptrX; //somehow needs to include ptrX here.....
				this.centerY = entities[i].y - ptrY;
				this.centerMass = entities[i].mass;
				this.centerDX = entities[i].dx;
				this.centerDY = entities[i].dy;
				//console.log("break in 2 for " + id + center);
				break;
			}
		}
		//console.log("next 2x" + this.centerDX + " y" + this.centerDY);
	}

	//console.log(radius + " " + this.angle);
	//console.log("thisCenter " + this.centerX);

	x = Math.round(radius * Math.cos(this.angle) + this.centerX);
	y = Math.round(radius * Math.sin(this.angle) + this.centerY);

	//console.log(x + " " + y);
	

	var sepVal = calcSep(x, y, this.centerX, this.centerY);

	v = Math.sqrt(simSystem.gVal * this.centerMass / sepVal[2]);

	if (isClockwise) {
		dx = v * -Math.sin(this.angle); //using 0 - - - 0 + + + graphing method which works
		dy = v * Math.cos(this.angle);
	} else {
		dx = v * Math.sin(this.angle);
		dy = v * -Math.cos(this.angle);
	}

	// if (useOrbitOffset) {
	// 	var offsetCoeff = 1000000/radius;
	// 	console.log(offsetCoeff)
	// 	var orbitOffset = [Math.random() - 0.5, Math.random() - 0.5];

	// 	x += offsetCoeff * orbitOffset[0];
	// 	y += offsetCoeff * orbitOffset[1];
	// }
	

	//why does it spawn relative to the target rather than center of roids? not sure why originX and Y are required

	//console.log("spawned at " + x + ", " + (y - originY))
	// console.log("ptr " + ptrX + ", " + ptrY)
	// console.log("origin " + originX + ", " + originY)
	createNew(id, mass, x, y, dx + this.centerDX, dy + this.centerDY, false, type, typeFixed, isPrimary, primaryColor);
	//console.log("dx" + (dx + this.centerDX) + " dy" + (dy + this.centerDY));
	//createNew(id, x, y, mass, dx, dy, false, type, isPrimary);

}

function searchFor(id) {
	for (i = 0; i < entities.length; i++) {
		if (entities[i].id == id) {
			return i;
		}
	}
}
function setTarget(iTarget) {
	target.id = iTarget;
}

function spawnRoid(isUser, x, y) {
	if (isUser) {
		//var vVal = calcCentripetal(x, y);
		if (orbitTarget) { //&& target != undefined
			var sepVal = calcSep(target.x, target.y, x, y);
			var angle = Math.atan(sepVal[1] / sepVal[0]);
			//console.log(sepVal[2]);
			//console.log(sepVal[0]);
			if (sepVal[0] < 0) {
				angle += Math.PI;
			}
			createNewOrbit("ID" + idCount, roidMass, sepVal[2], angle, target.id, true, typeOfEntity[roidDisguise]);
		} else {
			entities.push(new Entity("ID" + idCount, roidMass, x, y, 0, 0, false, typeOfEntity[roidDisguise]));
		}
		if (userTypeOverride) {
			entities[entities.length - 1].typeFixed = true;
		}
		idCount++;



	} else if (entities.length < simSystem.entityCap && isPaused == false && simSystem.spawnRoids) {
		if (simSystem.center == undefined) {
			entities.push(new Entity("ID" + idCount, round((0.1 + Math.random()) * 20, 2), (Math.random() - 0.5) * simSystem.spawnRange * 2 + originX, (Math.random() - 0.5) * simSystem.spawnRange * 2 + originY, (Math.random() - 0.5) * 0.2, (Math.random() - 0.5) * 0.2)); //times 2 as - 0.5 is only half the range
		} else {
		//console.log(idCount);
			createNewOrbit(
				"ID" + idCount, 
				round((0.1 + Math.random()) * 20, 2), 
				simSystem.spawnRadius + (0.5 - Math.random()) * simSystem.spawnRange, 
				Math.random() * Math.PI * 2, simSystem.center, true);//<<<<<<<<<<<<<<<<<<<<
		}
		idCount++;
	}
}


function globalPeriodicUpdate() {
	var upper = trivialThreshold;

	for (var i = 0; i < entities.length; i++) {
		if (entities[i].mass > upper && entities[i].id != simSystem.center) { // != simSystem.center
			upper = entities[i].mass;
			largest = entities[i].id;
		}

		if (entities[i].isPrimary == false && (entities[i].x < originX - simSystem.cullRange || entities[i].x > originX + simSystem.cullRange || entities[i].y < originY - simSystem.cullRange || entities[i].y > originY + simSystem.cullRange)) {
			//console.log(entities[i].id + " culling " + entities[i].x + " " + entities[i].y);
			entities.splice(i, 1);
		}
		entities[i].periodicUpdate();
	}
	updateThreshold(upper);
	if (targettingLargest) {
		setTarget(largest);
	}
	//console.log(entities.length);
}
function updateThreshold(upper) {
	trivialThreshold = Math.round(upper * 0.5);
	// console.log("Threshold: " + trivialThreshold);
	// console.log("upper: " + upper)
}




function calcAccel(sepX, sepY, sep, thatMass) {
	if (sep == 0) {
		sep += nonZeroFactor;
	}
	
	var a = simSystem.gVal * thatMass / Math.pow(sep, 2);
	var vector = calcVector(sepX, sepY);

	return [a * vector[0], a * vector[1]];
}


function calcSep(x1, y1, x2, y2) {
	var sepVal = []; //sepX, sepY, sep

	sepVal[0] = x2 - x1;
	sepVal[1] = y2 - y1;
	sepVal[2] = Math.sqrt(Math.pow(sepVal[0], 2) + Math.pow(sepVal[1], 2))

	return sepVal;
}
function calcVector(x, y) {
	var theta, vecx, vecy;
	if (x == 0) {
		x += nonZeroFactor; //since y/x for x = 0 is still compiled, add 0.0001 to ensure not 1/0
		theta = Math.PI / 2;
	} else {
		theta = Math.abs(Math.atan(y / x)); //using unit circle
	}

	if (y == 0) {
		y += nonZeroFactor;
	}

	//console.log(theta);
	vecx = Math.cos(theta) * x / Math.abs(x);
	vecy = Math.sin(theta) * y / Math.abs(y);
	return [vecx, vecy];
}




function resetAllTrails() {
	for (var i = 0; i < entities.length; i++) {
		entities[i].resetPos();
	}
}



function StepVariable(name, defaultVal = 1, defaultStep = 1, stepInc) {
	this.name = name;
	this.val = defaultVal;
	this.step = defaultStep;
	this.stepInc = stepInc;

	this.incVal = function(sign) {
		switch (sign) {
			case "+":
				this.val = round(this.val + this.step, 5);
			break;
			case "-":
				if (this.val - this.step > 0) {
					this.val = round(this.val - this.step, 5);
				}
			break;
		}
	}

	this.incStep = function(sign) {
		switch (sign) {
			case "+":
				this.step = round(this.step + this.stepInc, 5);
			break;
			case "-":
				if (this.step - this.stepInc > 0) {
					this.step = round(this.step - this.stepInc, 5);
				}
			break;
		}
	}
}



function Entity(id, mass, x, y, dx = 0, dy = 0, fixed = false, type = roid, typeFixed = false, isPrimary = false, primaryColor) {

	this.id = id;
	this.mass = mass;
	this.x = x;
	this.y = y;
	
	this.dx = dx;
	this.dy = dy;
	this.fixed = fixed;
	this.type = type;
	this.typeFixed = typeFixed;
	this.isPrimary = isPrimary;

	if (isPrimary) { //possibly redundant in system declaration?
		if (primaryColor != undefined) {
			this.trailColor = primaryColor
		} else {
			this.trailColor = colors[Math.round(Math.random() * (colors.length - 1))];
		}
	} else {
		this.trailColor = neutralTrailColor;
	}
	

	// if (simSystem.typeDensity) {
	// 	this.radius = Math.sqrt(this.mass / (Math.PI * this.type.density) + 1);
	// } else {
	// 	this.radius = Math.sqrt(this.mass / Math.PI);
	// }

	

	this.lastPos = [[this.x - originX, this.y - originY]];
	this.newPosRenderThreshold = 10;
	this.newPosDistThreshold = 400;

	this.update = function() {

		this.updateRadiusMass();

		if (isPaused == false) {
			this.updateType();
			this.compare();

			if (this.fixed == false) {
				this.x += this.dx;
				this.y += this.dy;
			}
		}

		this.testAsTarget();

		if (showTrails) { //currently based on distance, implement based on screen length
			switch (trailMode) {
				case 0:
					var absDX = Math.abs(this.x - this.lastPos[this.lastPos.length - 1][0]);
					var absDY = Math.abs(this.y - this.lastPos[this.lastPos.length - 1][1]);
				break;
				case 1:
					var absDX = Math.abs(this.x - originX - this.lastPos[this.lastPos.length - 1][0]);
					var absDY = Math.abs(this.y - originY - this.lastPos[this.lastPos.length - 1][1]);
				break;
			}
			
			if (
				(absDX * viewScale.val > this.newPosRenderThreshold || 
				absDY * viewScale.val > this.newPosRenderThreshold) ||

				(absDX > this.newPosDistThreshold ||
				absDY > this.newPosDistThreshold)
				) 
			{
				this.pushNewPos();
			}
		}
	}

	this.testAsTarget = function() {
		if (target.id == this.id) {
			target.x = this.x;
			target.y = this.y;
			if (isTargetting) {
				originX = target.x;
				originY = target.y;
			}
		}
	}

	this.periodicUpdate = function() {
		if (simSystem.center == this.id) {
			simSystem.centerX = this.x - originX;
			simSystem.centerY = this.y - originY;
			simSystem.centerMass = this.mass;
			simSystem.centerDX = this.dx;
			simSystem.centerDY = this.dy;
		}

		// if (this.id == "Terra") { //for debugging
		// 	console.log("Terra: " + this.renderX + "," + this.renderY);
		// 	//console.log("targetdiff: " + (this.x - target.x) + "," + (this.y - target.y));
		// 	//console.log(this.lastPos)
		// 	console.log("array first: " + (viewScale.val * (this.lastPos[0][0] - originX) + ptrX))
		// 	if (this.lastPos.length > 1) {
		// 		console.log("array second: " + (viewScale.val * (this.lastPos[1][0] - originX) + ptrX))
		// 	}
		// }
	}
	
	this.draw = function() {
		this.renderX = (viewScale.val * (this.x - originX)) + ptrX; //find distance from origin, viewScale.val, then render from pointer
		this.renderY = (viewScale.val * (this.y - originY)) + ptrY;


		
		if (
			(this.renderX - this.radius * viewScale.val > innerWidth || 
			this.renderY - this.radius * viewScale.val > innerHeight || 
			this.renderX + this.radius * viewScale.val < 0 || 
			this.renderY + this.radius * viewScale.val < 0) &&

			(viewScale.val * (this.lastPos[0][0] - originX) + ptrX > innerWidth ||
			viewScale.val * (this.lastPos[0][1] - originY) + ptrX > innerHeight ||
			viewScale.val * (this.lastPos[0][0] - originX) + ptrX < 0 ||
			viewScale.val * (this.lastPos[0][1] - originY) + ptrY < 0)

			) 
		{

		} else {
			//=============styling
			
			if (!stopClear) {

				if (target.id == this.id) {

					c.strokeStyle = this.trailColor;

					c.beginPath();
					c.arc(this.renderX, this.renderY, ptrRadius * 1, 0 + indent, Math.PI * 0.5 - indent);
					c.stroke();

					c.beginPath();
					c.arc(this.renderX, this.renderY, ptrRadius * 1, Math.PI + indent, -Math.PI * 0.5 - indent);
					c.stroke();
					c.closePath();
				}

				if (showTrails && (this.mass >= trivialThreshold || showTrivial || this.id == target.id || this.isPrimary)) { //not combined below due to layering
					
					c.strokeStyle = this.trailColor;
					c.lineWidth = trailWidth;

					c.beginPath();

					switch (trailMode) {
						case 0:
							for (var i = 1; i < this.lastPos.length; i++) {
								c.lineTo(viewScale.val * (this.lastPos[i][0] - originX) + ptrX, viewScale.val * (this.lastPos[i][1] - originY) + ptrY)
							}
						break;
						case 1:
							for (var i = 1; i < this.lastPos.length; i++) {
								c.lineTo(viewScale.val * (this.lastPos[i][0]) + ptrX, viewScale.val * (this.lastPos[i][1]) + ptrY)
							}
						break

					}
					c.lineTo(this.renderX, this.renderY)
					

					c.stroke();
					c.closePath();

					c.lineWidth = 1;
				}

				//========type style

				if (this.radius * viewScale.val < 0.5 && (this.isPrimary || target.id == this.id) && radiusCull) {
					c.beginPath();

					c.fillStyle = this.trailColor;
					c.arc(this.renderX, this.renderY, 1, 0, 2 * Math.PI);
					c.fill();
					c.closePath();

				} else {
					this.type.traceAura(this.renderX, this.renderY, this.radius);

					c.beginPath();

					c.strokeStyle = outlineColor;
					c.fillStyle = "#fff";
					c.arc(this.renderX , this.renderY, this.radius * viewScale.val, 0, 2 * Math.PI);

					if (nightMode) {
						c.fill();
						
					} else {
						c.fill();
						c.stroke();
					}

					c.strokeStyle = outlineColor2;
					c.fillStyle = outlineColor2;
					this.type.traceDetail(this.renderX, this.renderY, this.radius);

					c.closePath();
				}


				
				//========entity text

				//console.log(this.id + " " + (this.mass >= trivialThreshold) + " " + (this.isPrimary));
				
				if (this.mass >= trivialThreshold || showTrivial || this.id == target.id || this.isPrimary) {

					var tagX = this.renderX + this.radius * viewScale.val + 4; //4
					var tagY = this.renderY + this.radius * viewScale.val + 4; //2

					var tagXOffset = 0;

					c.beginPath();

					
					// c.moveTo(tagX + tagXOffset / 2, tagY + 15);
					// c.lineTo(tagX + tagXOffset / 2, tagY + 35);
					// c.stroke();

					//========= info


					if (infoMode > 0) { //name
						c.font = textFont;

						if (nightMode) {
							c.strokeStyle = "rgba(0,0,0,0.5)";
							c.lineWidth = 3;
							c.strokeText(this.id, tagX, tagY + 10);
							c.lineWidth = 1;

							c.fillStyle = this.trailColor; //textColor
						} else {
							c.fillStyle = textColor;
						}

						
						
						c.fillText(this.id, tagX, tagY + 10);

					}

					c.font = textFont2;
					c.fillStyle = textColor2;

					if (infoMode > 1) { //name and type
						c.fillText(this.type.typeName, tagX + tagXOffset, tagY + 20);

					}

					if (infoMode > 2) { //name, type and mass
						c.fillText(this.type.typeName + " / " + Math.round(this.mass), tagX + tagXOffset, tagY + 20); //ptrX is effectively the origin, rather than the screen center
					}

					if (infoMode > 3) { //name, type, mass and vals  || target.id == this.id
						c.font = textFont3;
						c.fillText("(" + Math.round(this.x - ptrX) + ", " + Math.round(this.y - ptrY) + ")", tagX + tagXOffset, tagY + 32);
						c.fillText("[" + round(this.dx, 2) + ", " + round(this.dy, 2) + "]", tagX + tagXOffset, tagY + 42);
					}

					c.closePath(); //is this needed?
				}
			} else {
				c.beginPath();

				c.strokeStyle = this.trailColor;
				c.fillStyle = this.trailColor;
				c.arc(this.renderX , this.renderY, 0.5, 0, 2 * Math.PI);
				c.fill();
			}
			
			
			c.closePath();
		}
		
	}

	this.updateType = function() {
		if (testForType && this.typeFixed == false) {
			if (this.mass >= typeOfEntity[typeOfEntity.length - 1].massThreshold * simSystem.typeScale && this.type != typeOfEntity[typeOfEntity.length - 1]) {
				this.type = typeOfEntity[typeOfEntity.length - 1];
				this.typeFixed = true; //negative_matter
				return;
			}

			// if (this.mass < typeOfEntity[0].massThreshold * simSystem.typeScale && this.type != typeOfEntity[0]) {
			// 	this.type = typeOfEntity[0];
			// 	return;
			// }

			for (i = 0; i < typeOfEntity.length - 1; i++) {
				if (this.mass >= typeOfEntity[i].massThreshold * simSystem.typeScale && this.mass < typeOfEntity[i + 1].massThreshold * simSystem.typeScale && this.type != typeOfEntity[i]) {
					this.type = typeOfEntity[i];
					return;
				}
			}
		}
	}

	this.compare = function() {
		for (i = 0; i < entities.length; i++) {
			if (entities[i].id != this.id) {
				var sepVal = calcSep(this.x, this.y, entities[i].x, entities[i].y); //is this more intensive?

				this.sepX = sepVal[0];
				this.sepY = sepVal[1];

				this.sep = sepVal[2];

				this.thatMass = entities[i].mass;
				this.thatRad = entities[i].radius;

				this.collisionDetect(i);

				
			}		
		}
	}

	this.collisionDetect = function(i) {
		if (this.sep <= (this.thatRad + this.radius) && this.mass >= this.thatMass) {
			switch (collisionMode) {
				case 1:
					if (this.fixed == false && this.type != negative_matter) {
						this.dx = (this.dx * this.mass + entities[i].dx * this.thatMass) / (this.mass + this.thatMass); //almost p = mv?
						this.dy = (this.dy * this.mass + entities[i].dy * this.thatMass) / (this.mass + this.thatMass);
					}

					if (this.type == negative_matter || entities[i].type == negative_matter) {
						this.mass -= this.thatMass;
					} else {
						this.mass += this.thatMass;
					}


					if (this.type == star && entities[i].type == star) {
						this.type = negative_matter;
						this.typeFixed = true;	
						this.id += " + " + entities[i].id;
					}

					//console.log("collide: " + this.id + " absorbs " + entities[i].id);
					entities.splice(i, 1);
				break;

				case 2:

				break;
			}
		} else if (this.fixed == false && this.sep > (this.thatRad + this.radius)) {
			var a = calcAccel(this.sepX, this.sepY, this.sep, this.thatMass);
			this.dx += a[0];
			this.dy += a[1];
		}
	}

	this.updateRadiusMass = function() {
		if (this.mass < 1) {
			entities.splice(searchFor(this.id), 1); //perhaps implement queue to lessen calls
		} else {
			if (simSystem.typeDensity) {
				this.radius = Math.pow(3 * this.mass / (Math.PI * 4 * this.type.density), 1/3);
			} else {
				this.radius = Math.pow(3 * this.mass / (Math.PI * 4), 1/3);
			}
		}
	}

	this.resetPos = function() {
		this.lastPos = [[this.x - originX, this.y - originY]];
	}

	this.pushNewPos = function() {
		switch (trailMode) {
			case 0:
				this.lastPos.push([this.x, this.y]);
			break;
			case 1:
				this.lastPos.push([this.x - originX, this.y - originY]);
			break;
		}
		

		if (this.lastPos.length > maxTrail) {
			this.lastPos.splice(0, 1);
		}
	}
}

function round(value, decimals) {
	return Number(Math.round(value+'e'+decimals)+'e-'+decimals);
}