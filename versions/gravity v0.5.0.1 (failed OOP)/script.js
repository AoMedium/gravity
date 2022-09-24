var canvas = document.querySelector("canvas");
var c = canvas.getContext('2d');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

//document.addEventListener('contextmenu', event => event.preventDefault());

const nonZeroFactor = 0.0000001; //to prevent divide by 0

var guiTextFont = "9px Courier New";
var textFont = "11px Helvetica";
var textFont2 = "8px Verdana";
var textFont3 = "6px Verdana";

var guiHeight = 12;
var guiOffset = 10;


var nightMode = true;

var ptrColor, textColor, textColor2, outlineColor, outlineColor2, auraColor;

var ptrX = innerWidth / 2;
var ptrY = innerHeight / 2;
var midX = innerWidth / 2;
var midY = innerHeight / 2;

var ptrRadius = 8;
var indent = 0;

var showTargetCursor = true;
var radiusColoring = true;


var renderCulling = true; //1.5 cpu load


var collisionMode = 1; //0: none, 1: absorb, 2: distributive
var useOrbitOffset = true;

var viewScale = 1;
var viewScaleStep = 0.0005;
var viewScaleStepStep = 0.0005;
var offsetStep = 5;
var offsetStepStep = 0.5;



var timeStep = 1; //1 = 7.1, 5 = 9.1, 10 = 10.7 , 15 = 12.3

var maxTimeStep = 100;
var isPaused = false;




var spawnTime = setInterval(spawnRoid, 1000);
var globalUpdateTime = setInterval(globalPeriodicUpdate, 5000);




var trailMode = 0;
var trailCalcMode = 2//2;

var trailSamples = 300;

var showTrails = true;
var trailWidth = 0.5;
var showTrailNodes = false;
var trailNodeRadius = 1;

var maxAngleDiffer = 2;

var isPredictPath = false;
var predictUsingOtherBodies = true;




var forceFrames = true; //force framing actually more intensive
var fps = 5;



var roidMass = 10;
var spawnAtClick = false;
var orbitTarget = false;
var testForType = true;
var userTypeOverride = false;
var hideUI = false;
var stopClear = false;



var entityArray = [];
var idCount = 0;


// var roidDX = 0;
// var roidDY = 0;
var roidDisguise = 0;





var infoMode = 4;

var showTrivial = false;
var trivialThreshold = 0;
var upper = 0;
var largest;


// ===================== Main =====================

var target = new Target;
var relTarget = new Target;

function Target() {
	this.id = "no target";
	this.x = midX;
	this.y = midY;

	this.dx;
	this.dy;
}

var selTargetIndex = [0, 0];
var selTargetMode = 0; //absolute, relative
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
loadSystem("test_system");


//viewScale = 1 / (simSystem.typeScale * 50);

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
	entityArray = [];
	timeStep = 1;

	if (systemVar == undefined) {
		simSystem = systems[0];
	} else {
		var foundSystem = false;
		for (var i = 0; i < systems.length; i++) {
			if (systems[i].systemName == systemVar) {
				simSystem = systems[i];
				foundSystem = true;
				//console.log("found");
				break;
			}
		}
		if (foundSystem == false) {
			simSystem = systems[0];
			//console.log("not found");
		}
	}
	
	simSystem.initSystemObjects(); //reset to default variables
	simSystem.generateSystem();
	simSystem.applyTargetPref();

	relTarget.id = simSystem.center;


	viewScale = simSystem.viewScale;
	maxTimeStep = Math.round(99 * Math.pow(4, 1 - simSystem.entityCap / 35)) + 2;

	trivialThreshold = 0;

	for (var i = 0; i < entityArray.length; i++) {
		//entityArray[i].updateType();
		entityArray[i].updateRadiusMass();

		//console.log(entityArray[i].id);
		//console.log(entityArray[i].center);
	}

	globalPeriodicUpdate();
}




function updateObjects() { //probably simplify
	//console.log(entityArray[2].x);
	if (isPaused) {
		for (var i = 0; i < entityArray.length; i++) {
			entityArray[i].testAsTarget();
			entityArray[i].draw();
		}
	} else {
		for (var t = 0; t < timeStep; t++) {
			for (var i = 0; i < entityArray.length; i++) {
				entityArray[i].update();
				//console.log(entityArray[i].id + " " + entityArray[i].fixed);
				if (t == timeStep - 1) {
					entityArray[i].draw();
				}
			}
		}
	}
	
}

// function trackPos() {
// 	if (showTrails) {
// 		for (var i = 0; i < entityArray.length; i++) {
// 			entityArray[i].pushNewPos();
// 		}	
// 	}
	
// }

function drawGUI() {
	if (!hideUI) {
		c.strokeStyle = ptrColor;

		//pointer marker
		c.beginPath();
		// c.moveTo(midX + length, midY);
		// c.lineTo(midX - length, midY);
		// c.stroke();

		// c.moveTo(midX, midY + length);
		// c.lineTo(midX, midY - length);
		// c.stroke();

		c.arc(midX, midY, ptrRadius, -Math.PI * 0.5, 0);
		c.stroke();
		c.beginPath();
		c.arc(midX, midY, ptrRadius, Math.PI * 0.5, Math.PI);
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

		c.fillText("zoom view scale: " + viewScale + "x", 20, 9 * guiHeight + guiOffset);
		c.fillText("zoom view scale step: " + viewScaleStep, 20, 10 * guiHeight + guiOffset);
		c.fillText("offset step: " + offsetStep, 20, 11 * guiHeight + guiOffset);


		c.fillText("entityArray: " + entityArray.length, 20,  guiHeight + guiOffset + 200);
		c.fillText("spawn range: " + simSystem.spawnRange, 20, 2 * guiHeight + guiOffset + 200);
		c.fillText("cull range: " + simSystem.cullRange, 20, 3 * guiHeight + guiOffset + 200);

		c.fillText("[s]    spawn at click: " + spawnAtClick, 20, 5 * guiHeight + guiOffset + 200);
		c.fillText("       roid mass: " + roidMass, 20, 6 * guiHeight + guiOffset + 200);
		c.fillText("[a][d] roid disguise: " + typeOfEntity[roidDisguise].typeName, 20, 7 * guiHeight + guiOffset + 200);
		c.fillText("[f]    user type override: " + userTypeOverride, 20, 8 * guiHeight + guiOffset + 200);
		c.fillText("[g]    orbit target: " + orbitTarget, 20, 9 * guiHeight + guiOffset + 200);

		c.fillText("[r][y] target: " + target.id, 20, 14 * guiHeight + guiOffset + 200);
		c.fillText("[r][y] relative target: " + relTarget.id, 20, 15 * guiHeight + guiOffset + 200);
		c.fillText("[e]    target mode: " + selTargetMode, 20, 16 * guiHeight + guiOffset + 200);
		c.fillText("[w]    predict influence: " + predictUsingOtherBodies, 20, 17 * guiHeight + guiOffset + 200);
		
		c.fillText("[t]    isTargetting: " + isTargetting, 20, 18 * guiHeight + guiOffset + 200);
		c.fillText("[u]    targettingLargest: " + targettingLargest, 20, 19 * guiHeight + guiOffset + 200);


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
	entityArray.push(new SystemObject(id, mass, x, y, dx, dy, fixed, type, typeFixed, isPrimary, primaryColor));
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
		for (var i = 0; i < entityArray.length; i++) {

			if (entityArray[i].id == center) {
				//console.log(entityArray[i].id + " x" + entityArray[i].x + " y" + entityArray[i].y);
				this.centerX = entityArray[i].x;
				this.centerY = entityArray[i].y;
				this.centerMass = entityArray[i].mass;
				this.centerDX = entityArray[i].dx;
				this.centerDY = entityArray[i].dy;
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
	

	//why does it spawn relative to the target rather than center of roids? not sure why ptrX and Y are required

	//console.log("spawned at " + x + ", " + (y - ptrY))
	// console.log("ptr " + midX + ", " + midY)
	// console.log("origin " + ptrX + ", " + ptrY)
	createNew(id, mass, x, y, dx + this.centerDX, dy + this.centerDY, false, type, typeFixed, isPrimary, primaryColor);
	//console.log("dx" + (dx + this.centerDX) + " dy" + (dy + this.centerDY));
	//createNew(id, x, y, mass, dx, dy, false, type, isPrimary);

}

function searchFor(id) {
	for (i = 0; i < entityArray.length; i++) {
		if (entityArray[i].id == id) {
			return i;
		}
	}
	return undefined;
}
function setTarget(iTarget) {
	target.id = iTarget;
}

function updateTargetSelection() {
	switch (selTargetMode) {
		case 0:
			target.id = simSystem.primaryID[selTargetIndex[selTargetMode]];
		break;
		case 1:
			relTarget.id = simSystem.primaryID[selTargetIndex[selTargetMode]];
		break;
	}
	

	if (trailMode == 1) {
		resetAllTrails();
	}
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
			entityArray.push(new Entity("ID" + idCount, roidMass, x, y, 0, 0, false, typeOfEntity[roidDisguise]));
		}
		if (userTypeOverride) {
			entityArray[entityArray.length - 1].typeFixed = true;
		}
		idCount++;



	} else if (entityArray.length < simSystem.entityCap && isPaused == false && simSystem.spawnRoids) {
		if (simSystem.center == undefined) {
			entityArray.push(new Entity("ID" + idCount, round((0.1 + Math.random()) * 20, 2), (Math.random() - 0.5) * simSystem.spawnRange * 2 + ptrX, (Math.random() - 0.5) * simSystem.spawnRange * 2 + ptrY, (Math.random() - 0.5) * 0.2, (Math.random() - 0.5) * 0.2)); //times 2 as - 0.5 is only half the range
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

	for (var i = 0; i < entityArray.length; i++) {
		if (entityArray[i].mass > upper && entityArray[i].id != simSystem.center) { // != simSystem.center
			upper = entityArray[i].mass;
			largest = entityArray[i].id;
		}

		if (entityArray[i].isPrimary == false && (entityArray[i].x < ptrX - simSystem.cullRange || entityArray[i].x > ptrX + simSystem.cullRange || entityArray[i].y < ptrY - simSystem.cullRange || entityArray[i].y > ptrY + simSystem.cullRange)) {
			//console.log(entityArray[i].id + " culling " + entityArray[i].x + " " + entityArray[i].y);
			entityArray.splice(i, 1);
		}
		//entityArray[i].periodicUpdate();
	}
	updateThreshold(upper);
	if (targettingLargest) {
		setTarget(largest);
	}
	//console.log(entityArray.length);
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
	
	var a = simSystem.gVal * thatMass / (sep * sep);
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
	for (var i = 0; i < entityArray.length; i++) {
		entityArray[i].resetPos();
	}
}










function GravityEntity(id, mass, x, y, dx = 0, dy = 0) {
	this.id = id;
	this.mass = mass;
	this.x = x;
	this.y = y;
	
	this.dx = dx;
	this.dy = dy;

	this.radius = 1; //to prevent undefined;

	this.trailColor = colors[Math.round(Math.random() * (colors.length - 1))];

	this.drawTag = function() {

		var tagX = this.renderX + this.radius * viewScale + 4; //4
		var tagY = this.renderY + this.radius * viewScale + 4; //2

		var tagXOffset = 6;

		c.beginPath();
		c.font = textFont;
		c.strokeStyle = "rgba(0,0,0,0.5)";
		c.lineWidth = 3;

		c.strokeText(this.id, tagX, tagY + 10);
		c.lineWidth = 1;

		c.fillStyle = this.trailColor;
		c.fillText(this.id, tagX, tagY + 10);
	}

	this.interact = function() {
		for (i = 0; i < entityArray.length; i++) {
			if (entityArray[i].id != this.id) {
				var sepVal = calcSep(this.x, this.y, entityArray[i].x, entityArray[i].y); //is this more intensive?

				this.sepX = sepVal[0];
				this.sepY = sepVal[1];

				this.sep = sepVal[2];

				this.thatMass = entityArray[i].mass;
				this.thatRad = entityArray[i].radius;

				if (this.sep <= (this.thatRad + this.radius) && this.mass >= this.thatMass) {
					this.dx = (this.dx * this.mass + entityArray[i].dx * this.thatMass) / (this.mass + this.thatMass); //almost p = mv?
					this.dy = (this.dy * this.mass + entityArray[i].dy * this.thatMass) / (this.mass + this.thatMass);

					entityArray.splice(i, 1);
				}
			}		
		}

		if (this.sep > this.thatRad + this.radius) {
			var a = calcAccel(this.sepX, this.sepY, this.sep, this.thatMass);
			this.dx += a[0];
			this.dy += a[1];
		}
	}

	
}

GravityEntity.prototype.update = function() {
	this.x += this.dx;
	this.y += this.dy;

	this.renderX = viewScale * this.x + midX; //find distance from origin, viewScale, then render from pointer
	this.renderY = viewScale * this.y + midY;

	this.interact();
	this.drawTag(); //cant be named as draw() as well
}








function SystemObject(id, mass, x, y, dx = 0, dy = 0, fixed = false, type = roid, typeFixed = false, isPrimary = false, primaryColor) {

	GravityEntity.call(this, id, mass, x, y, dx, dy);

	this.fixed = fixed;
	this.type = type;
	this.typeFixed = typeFixed;
	this.isPrimary = isPrimary;

	// if (isPrimary) { //possibly redundant in system declaration?
	// 	if (primaryColor != undefined) {
	// 		this.trailColor = primaryColor
	// 	} else {
	// 		this.trailColor = colors[Math.round(Math.random() * (colors.length - 1))];
	// 	}
	// } else {
	// 	this.trailColor = neutralTrailColor;
	// }
	





	this.update = function() {
		this.updateRadiusMass();
		this.updateType();

		GravityEntity.prototype.update.call(this);
	}

	this.draw = function() {
		//console.log(this.x);

		if (this.radius * viewScale < 0.5 && (this.isPrimary || target.id == this.id) && radiusColoring) {
			c.beginPath();

			c.fillStyle = this.trailColor;
			c.arc(this.renderX, this.renderY, 1, 0, 2 * Math.PI);
			c.fill();
			c.closePath();

		} else {
			this.type.traceAura(this.renderX, this.renderY, this.radius);

			this.type.drawBody(this.renderX, this.renderY, this.radius);

			this.type.traceDetail(this.renderX, this.renderY, this.radius);

			c.closePath();
		}

		//console.log(this.renderX + " " + this.radius);
	}

	this.updateRadiusMass = function() {
		if (this.mass < 1) {
			entityArray.splice(searchFor(this.id), 1); //perhaps implement queue to lessen calls
		} else {
			if (simSystem.checkTypeDensity) {
				this.radius = Math.pow(3 * this.mass / (Math.PI * 4 * this.type.density), 1/3);
			} else {
				this.radius = Math.pow(3 * this.mass / (Math.PI * 4), 1/3);
			}
		}
	}

	this.updateType = function() {
		if (testForType && this.typeFixed == false) {
			if (this.mass >= typeOfEntity[typeOfEntity.length - 1].massThreshold * simSystem.typeScale && this.type != typeOfEntity[typeOfEntity.length - 1]) {
				this.type = typeOfEntity[typeOfEntity.length - 1];
				this.typeFixed = true; //negative_matter
				return;
			}

			for (i = 0; i < typeOfEntity.length - 1; i++) {
				if (this.mass >= typeOfEntity[i].massThreshold * simSystem.typeScale && this.mass < typeOfEntity[i + 1].massThreshold * simSystem.typeScale && this.type != typeOfEntity[i]) {
					this.type = typeOfEntity[i];
					return;
				}
			}
		}
	}
}





















function Entity(id, mass, x, y, dx = 0, dy = 0) {

	this.id = id;
	this.mass = mass;
	this.x = x;
	this.y = y;
	
	this.dx = dx;
	this.dy = dy;
	


	switch (trailMode) {
		case 0:
			this.lastPos = [[this.x, this.y]];
		break;
		case 1:
			this.lastPos = [[this.x - ptrX, this.y - ptrY]];
		break;
	}

	this.newPosRenderThreshold = 10;
	this.newPosDistThreshold = 400;

	this.predictPos = [[]];



	this.update = function() {
		this.compare();

		if (this.fixed == false) {
			this.x += this.dx;
			this.y += this.dy;
		}

		this.testAsTarget();

		if (isPredictPath && target.id == this.id && timeStep == 1) {
			this.predictPos = [];
			this.predictPath(0, this.x, this.y, this.dx, this.dy);
	
		}

		if (showTrails) { //currently based on distance, implement based on screen length
			switch (trailMode) {
				case 0:
					var absDX = Math.abs(this.x - this.lastPos[this.lastPos.length - 1][0]);
					var absDY = Math.abs(this.y - this.lastPos[this.lastPos.length - 1][1]);
				break;
				case 1:
					var absDX = Math.abs(this.x - ptrX - this.lastPos[this.lastPos.length - 1][0]);
					var absDY = Math.abs(this.y - ptrY - this.lastPos[this.lastPos.length - 1][1]);
				break;
			}

			switch (trailCalcMode) {
				case 0: //based on distance and minimum distance
					if ( //less intensive
						(absDX * viewScale > this.newPosRenderThreshold || 
						absDY * viewScale > this.newPosRenderThreshold) ||

						(absDX > this.newPosDistThreshold ||
						absDY > this.newPosDistThreshold)
						) 
					{
						//console.log(this.posAngleDiffers())
						this.pushNewPos();
					}
				break;
				case 1: //based on angle difference
					if (this.posAngleDiffers()) { //more intensive by about 2 energy usage
						this.pushNewPos();
					}
				break;
				case 2: //based on angle difference with minimum distance
					if ( //more intensive by about 2 energy usage
						this.posAngleDiffers() ||
						
						(
							(absDX * viewScale > this.newPosRenderThreshold || 
							absDY * viewScale > this.newPosRenderThreshold) &&

							this.isInRender()
						)
							
						)
					{
						this.pushNewPos();
					}
				break;
			}
			
			
			
		}
	}

	this.testAsTarget = function() {
		if (target.id == this.id) {
			target.x = this.x;
			target.y = this.y;
			if (isTargetting) {
				ptrX = target.x;
				ptrY = target.y;
			}
		}

		if (relTarget.id == this.id) {
			relTarget.dx = this.dx;
			relTarget.dy = this.dy;
		}
	}

	this.isInRender = function() {
		if (this.renderX - this.radius * viewScale > innerWidth || 
			this.renderY - this.radius * viewScale > innerHeight || 
			this.renderX + this.radius * viewScale < 0 || 
			this.renderY + this.radius * viewScale < 0) 
		{
			return false;
		} else {
			return true;
		}
	}

	this.periodicUpdate = function() {
		// if (simSystem.center == this.id) {
		// 	simSystem.centerX = this.x;
		// 	simSystem.centerY = this.y - ptrY;
		// 	simSystem.centerMass = this.mass;
		// 	simSystem.centerDX = this.dx;
		// 	simSystem.centerDY = this.dy;
		// }

		
	}
	
	this.draw = function() {
		//console.log(this.id + " drawing at " + this.x);
		this.renderX = (viewScale * (this.x - ptrX)) + midX; //find distance from origin, viewScale, then render from pointer
		this.renderY = (viewScale * (this.y - ptrY)) + midY;


		
		if (
			!this.isInRender() &&

			(viewScale * (this.lastPos[0][0] - ptrX) + midX > innerWidth ||
			viewScale * (this.lastPos[0][1] - ptrY) + midY > innerHeight ||
			viewScale * (this.lastPos[0][0] - ptrX) + midX < 0 ||
			viewScale * (this.lastPos[0][1] - ptrY) + midY < 0) &&

			target.id != this.id &&
			renderCulling

			) 
		{

		} else {
			//=============styling
			
			if (!stopClear) {

				if (showTargetCursor && target.id == this.id) {

					c.strokeStyle = this.trailColor;

					c.beginPath();
					c.arc(this.renderX, this.renderY, ptrRadius * 0.7, Math.PI * 0.5 + indent, Math.PI - indent);
					c.stroke();

					c.beginPath();
					c.arc(this.renderX, this.renderY, ptrRadius * 0.7, -Math.PI * 0.5 + indent, 0 - indent);
					c.stroke();
					c.closePath();
				}

				if (showTrails && (this.mass >= trivialThreshold || showTrivial || this.id == target.id || this.isPrimary)) { //not combined below due to layering
					
					c.strokeStyle = this.trailColor;
					c.lineWidth = trailWidth;

					c.beginPath();

					switch (trailMode) {
						case 0:
							c.fillStyle = this.trailColor;
							var bold = true;

							for (var i = 0; i < this.lastPos.length; i++) {
								c.lineTo(viewScale * (this.lastPos[i][0] - ptrX) + midX, viewScale * (this.lastPos[i][1] - ptrY) + midY);

								if (showTrailNodes) { //not sure if having condition induces additional load
									//arcs are 3 more intensive than rects

									if (bold) {
										trailNodeRadius = 3;
									} else {
										trailNodeRadius = 1;
									}
									c.fillRect(viewScale * (this.lastPos[i][0] - ptrX) + midX - trailNodeRadius / 2, viewScale * (this.lastPos[i][1] - ptrY) + midY - trailNodeRadius / 2, trailNodeRadius, trailNodeRadius);
									bold = !bold
								}
							}
						break;
						case 1:
							for (var i = 1; i < this.lastPos.length; i++) {
								c.lineTo(viewScale * (this.lastPos[i][0]) + midX, viewScale * (this.lastPos[i][1]) + midY)
							}
						break

					}
					c.lineTo(this.renderX, this.renderY)
					

					c.stroke();
					c.closePath();

					
				}

				if (isPredictPath && target.id == this.id && timeStep == 1) {
					//c.fillStyle = "#aaa";
					c.beginPath();
					c.lineTo(this.renderX, this.renderY);
					for (var i = 0; i < this.predictPos.length; i++) {
						c.lineTo(viewScale * (this.predictPos[i][0] - ptrX) + midX, viewScale * (this.predictPos[i][1] - ptrY) + midY)
						
						//c.fillRect(viewScale * (this.predictPos[i][0] - ptrX) + midX - trailNodeRadius / 2, viewScale * (this.predictPos[i][1] - ptrY) + midY - trailNodeRadius / 2, trailNodeRadius, trailNodeRadius)
					}

					c.lineWidth = trailWidth * 0.3;

					c.stroke();
					c.closePath();
				}

				c.lineWidth = 1;

				//========type style

				if (this.radius * viewScale < 0.5 && (this.isPrimary || target.id == this.id) && radiusColoring) {
					c.beginPath();

					c.fillStyle = this.trailColor;
					c.arc(this.renderX, this.renderY, 1, 0, 2 * Math.PI);
					c.fill();
					c.closePath();

				} else {
					this.type.traceAura(this.renderX, this.renderY, this.radius);

					this.type.drawBody(this.renderX, this.renderY, this.radius);

					this.type.traceDetail(this.renderX, this.renderY, this.radius);

					c.closePath();
				}


				
				//========entity text

				//console.log(this.id + " " + (this.mass >= trivialThreshold) + " " + (this.isPrimary));
				
				if (this.mass >= trivialThreshold || showTrivial || this.id == target.id || this.isPrimary) {

					var tagX = this.renderX + this.radius * viewScale + 4; //4
					var tagY = this.renderY + this.radius * viewScale + 4; //2

					var tagXOffset = 6;

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
						c.fillText(this.type.typeName, tagX + tagXOffset, tagY + 22);

					}

					if (infoMode > 2) { //name, type and mass
						c.fillText(this.type.typeName + " / " + Math.round(this.mass), tagX + tagXOffset, tagY + 22); //midX is effectively the origin, rather than the screen center
					}

					if (infoMode > 3) { //name, type, mass and vals  || target.id == this.id
						c.font = textFont3;
						c.fillText("(" + Math.round(this.x) + ", " + Math.round(this.y) + ")", tagX + tagXOffset, tagY + 32);
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
			
			//c.fillText(theta, this.renderX, this.renderY);
			
			c.closePath();
		}
		
	}


	this.compare = function() {
		for (i = 0; i < entityArray.length; i++) {
			if (entityArray[i].id != this.id) {
				var sepVal = calcSep(this.x, this.y, entityArray[i].x, entityArray[i].y); //is this more intensive?

				this.sepX = sepVal[0];
				this.sepY = sepVal[1];

				this.sep = sepVal[2];

				this.thatMass = entityArray[i].mass;
				this.thatRad = entityArray[i].radius;

				this.collisionDetect(i);

				
			}		
		}
	}

	this.posAngleDiffers = function() {
		if (this.lastPos.length > 2) {
			if (this.lastPos[this.lastPos.length - 1][0] != this.x) {

				var theta = round(180 * (
					Math.atan((this.y - this.lastPos[this.lastPos.length - 1][1]) / (this.x - this.lastPos[this.lastPos.length - 1][0]))
					- Math.atan((this.lastPos[this.lastPos.length - 1][1] - this.lastPos[this.lastPos.length - 2][1]) / (this.lastPos[this.lastPos.length - 1][0] - this.lastPos[this.lastPos.length - 2][0]))

					) / Math.PI,1);

				// if (target.id == this.id) {
				// 	console.log("-----------");
				// 	console.log(round(this.x - this.lastPos[this.lastPos.length - 1][0],2) + ", " + round(this.y - this.lastPos[this.lastPos.length - 1][1],2))
				// 	console.log(round(this.lastPos[this.lastPos.length - 1][0] - this.lastPos[this.lastPos.length - 2][0],2) + ", " + round(this.lastPos[this.lastPos.length - 1][1] - this.lastPos[this.lastPos.length - 2][1],2))
				// 	//console.log(Math.atan((this.y - this.lastPos[this.lastPos.length - 1][1]) / (this.x - this.lastPos[this.lastPos.length - 1][0])));
				// 	console.log("before: " + theta)
				// }

				if (theta < -90) {
					theta *= -1;
				} else if (theta <= 0) { //probably a better method involving trigonometry
					//console.log(">> theta += 180");
					theta += 180;
				} else {
					theta = 180 - theta;
					//console.log(">> theta = 180 - theta");
				}

				// if (target.id == this.id) {
				// 	console.log("after: " + theta)

				// }


				

				if (theta >= 180 - maxAngleDiffer) {
					//console.log(theta + " is within")
					return false;
				} else {
					// if (target.id == this.id) {
					// 	console.log(theta + " is overshot")
					// }
					
					return true;
				}
			}
		} else {
			return true;
		}
		
	}

	this.predictPath = function(no, x, y, dx, dy) {
		if (no < 500) {
			if (selTargetMode == 0 || predictUsingOtherBodies) {
				for (i = 0; i < entityArray.length; i++) {
					if (entityArray[i].id != this.id) {
						var sepVal = calcSep(x, y, entityArray[i].x, entityArray[i].y); //is this more intensive?

						if (sepVal[2] < this.radius + entityArray[i].radius) {
							return;
						}

						var thatMass = entityArray[i].mass;
						
						var a = calcAccel(sepVal[0], sepVal[1], sepVal[2], thatMass);
						dx += a[0];
						dy += a[1];
						
					}		
				}
			} else {
				var i = searchFor(relTarget.id);
				var sepVal = calcSep(x, y, entityArray[i].x, entityArray[i].y); //is this more intensive?

				if (sepVal[2] < this.radius + entityArray[i].radius) {
					return;
				}

				var thatMass = entityArray[i].mass;
				
				var a = calcAccel(sepVal[0], sepVal[1], sepVal[2], thatMass);
				dx += a[0];
				dy += a[1];
			}
			
			x += dx - relTarget.dx;
			y += dy - relTarget.dy;

			if (no % 2 == 0) {
				this.predictPos.push([x, y]);
			}
			no++;

			this.predictPath(no, x, y, dx, dy);

		} else {
			return;
		}
	}

	this.collisionDetect = function(i) {
		if (this.sep <= (this.thatRad + this.radius) && this.mass >= this.thatMass) {
			switch (collisionMode) {
				case 1:
					if (this.fixed == false && this.type != negative_matter) {
						this.dx = (this.dx * this.mass + entityArray[i].dx * this.thatMass) / (this.mass + this.thatMass); //almost p = mv?
						this.dy = (this.dy * this.mass + entityArray[i].dy * this.thatMass) / (this.mass + this.thatMass);
					}

					if (this.type == negative_matter || entityArray[i].type == negative_matter) {
						this.mass -= this.thatMass;
					} else {
						this.mass += this.thatMass;
					}


					if (this.type == star && entityArray[i].type == star) {
						this.type = negative_matter;
						this.typeFixed = true;	
						this.id += " + " + entityArray[i].id;
					}

					//console.log("collide: " + this.id + " absorbs " + entityArray[i].id);
					entityArray.splice(i, 1);
				break;

				case 2:
					this.thatdx = entityArray[i].dx;
					this.thatdy = entityArray[i].dy;

					if (this.fixed == false && this.type != negative_matter) {
						entityArray[i].dx = this.dx * 2 * this.mass / (this.mass + this.thatMass) - this.thatdx * (this.mass - this.thatMass) / (this.mass + this.thatMass);
						entityArray[i].dy = this.dy * 2 * this.mass / (this.mass + this.thatMass) - this.thatdy * (this.mass - this.thatMass) / (this.mass + this.thatMass);

						this.dx = this.dx * (this.mass - this.thatMass) / (this.mass + this.thatMass) + this.thatdx * 2 * this.thatMass / (this.mass * this.thatMass);
						this.dy = this.dy * (this.mass - this.thatMass) / (this.mass + this.thatMass) + this.thatdy * 2 * this.thatMass / (this.mass * this.thatMass);
						console.log("contact by " + this.id);
					}

				break;
			}
		} else if (this.fixed == false && this.sep > (this.thatRad + this.radius)) {
			var a = calcAccel(this.sepX, this.sepY, this.sep, this.thatMass);
			this.dx += a[0];
			this.dy += a[1];
		}
	}

	

	this.resetPos = function() {
		switch (trailMode) {
			case 0:
				this.lastPos = [[this.x, this.y]];
			break;
			case 1:
				this.lastPos = [[this.x - target.x, this.y - target.y]];
			break;
		}
	}

	this.pushNewPos = function() {
		switch (trailMode) {
			case 0:
				this.lastPos.push([this.x, this.y]);
			break;
			case 1:
				this.lastPos.push([this.x - target.x, this.y - target.y]);
			break;
		}
		
		if (this.lastPos.length > trailSamples) {
			this.lastPos.splice(0, 1);
		}
	}
}




function round(value, decimals) {
	return Number(Math.round(value+'e'+decimals)+'e-'+decimals);
}