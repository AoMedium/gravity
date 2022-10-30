var canvas = document.querySelector("canvas");
var c = canvas.getContext('2d');

// fix blurry canvas rendering
// https://www.kirupa.com/canvas/canvas_high_dpi_retina.htm
var canvasScale = window.devicePixelRatio;
canvas.width = window.innerWidth * canvasScale;
canvas.height = window.innerHeight * canvasScale;

// ensure all drawing operations are scaled
c.scale(devicePixelRatio, devicePixelRatio);

// scale back down to window dimensions
canvas.style.width = window.innerWidth + 'px';
canvas.style.height = window.innerHeight + 'px';

//document.addEventListener('contextmenu', event => event.preventDefault());

const nonZeroFactor = 0.0000001; //to prevent divide by 0

var guiTextFont = "9px Courier New";
var textFont = "px Verdana";
var textFont2 = "px Verdana";
var textFont3 = "px Verdana";

var fontSizes = [11, 8, 6];

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
var viewScaleMult = 1.05;
var viewScaleMultStep = 0.01;
var offsetStep = 5;
var offsetStepStep = 0.5;



var timeStep = 1; //1 = 7.1, 5 = 9.1, 10 = 10.7 , 15 = 12.3

var maxTimeStep = 100;
var isPaused = false;




var spawnTime = setInterval(spawnRoid, 1000);
var globalUpdateTime = setInterval(globalPeriodicUpdate, 5000);


var radiusConst = 0.1;



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




var forceFrames = false; //force framing actually more intensive
var fps = 15;



var roidMass = 10;
var spawnRoidAtClick = false;
var orbitTarget = false;
var testForType = true;
var userTypeOverride = false;

var spawnMode = 1;
var markerFixed = false;
var launchConst = 0.05



var entities = [];
var idCount = 0;


var roidDisguise = 1;





var infoMode = 3;
var hideUI = false;
var stopClear = false;

var showTrivial = true;
var trivialThreshold = 0;
var upper = 0;
var largest;




var craftArray = [];
var craftIDCount = 0;
var selCraftTarget = 0;
var spawnCraftAtClick = false;
var craftRadius = 1;



var isUsingShading = true;
var fadeAtmosphere = false;


// ===================== Main =====================

updateNightMode();

var selTargetIndex = [0, 0];
var selTargetMode = 0; //absolute, relative
var isTargetting = false;
var targettingLargest = false;

//var center = "Sol Alpha"; //for centripetal
var centerX, centerY, centerMass, centerDX, centerDY;


var marker = new SpawnMarker();

var target = new Target;
var relTarget = new Target;






var simSystem;
loadSystem("sol_beta");
//generateSystem(1000000, 20, 0);


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









function Target() {
	this.id = "no target";
	this.x = midX;
	this.y = midY;

	this.dx;
	this.dy;
}




function SpawnMarker() {
	this.x = 0;
	this.y = 0;
	this.x2 = undefined;
	this.y2 = 0;

	this.predictPos = [];

	this.update = function() {
		if (markerFixed) {
			this.draw();

			if (isPredictPath) {
				this.predictPos = [];
				var ds = calcSep(this.x, this.y, this.x2, this.y2);
				this.predictPath(0, this.x, this.y, ds[0] * launchConst, ds[1] * launchConst);
			}
		}
	}

	this.draw = function() {
		this.renderX = (viewScale * (this.x - ptrX)) + midX; //find distance from origin, viewScale, then render from pointer
		this.renderY = (viewScale * (this.y - ptrY)) + midY;

		c.strokeStyle = "#f00";
		c.lineWidth = 1;
		c.beginPath();
		c.arc(this.renderX, this.renderY, 4, 0, Math.PI * 2);
		c.stroke();

		if (this.x2 != undefined) {
			c.strokeStyle = "#f00";
			c.beginPath();
			c.moveTo(this.renderX, this.renderY);
			c.lineTo((viewScale * (this.x2 - ptrX)) + midX, (viewScale * (this.y2 - ptrY)) + midY);
			c.stroke();
			c.closePath();
		}

		if (isPredictPath) {
			c.strokeStyle = "#aaa";
			c.beginPath();
			c.lineTo(this.renderX, this.renderY);
			for (var i = 0; i < this.predictPos.length; i++) {
				c.lineTo(viewScale * (this.predictPos[i][0] - ptrX) + midX, viewScale * (this.predictPos[i][1] - ptrY) + midY)
			}
			c.lineWidth = trailWidth * 0.3;
			c.stroke();
			c.closePath();
		}




		var tagX = this.renderX + 6; //4
		var tagY = this.renderY + 4; //2

		var ds = calcSep(this.x, this.y, this.x2, this.y2)

		c.beginPath();
		c.font = fontSizes[1] + textFont2;
		c.fillStyle = textColor2;
		c.fillText("type: " + typeOfEntity[roidDisguise].typeName, tagX, tagY + 10);
		c.fillText("mass: " + roidMass, tagX, tagY + 20);
		c.fillText("velocity: " + Math.round(ds[2]), tagX, tagY + 30);
		c.fillText("(" + Math.round(this.x) + ", " + Math.round(this.y) + ")", tagX, tagY + 40);
		// c.font = textFont2;
		// c.fillStyle = textColor2;


		// c.font = textFont3;
		// 
		// c.fillText("[" + round(this.dx, 2) + ", " + round(this.dy, 2) + "]", tagX + tagXOffset, tagY + 32);

		c.closePath();


	}

	this.setMarker = function(x, y) {
		this.x = x;
		this.y = y;
	}

	this.getVelVector = function(x, y) {
		if (this.x2 == undefined) {
			return [0,0];
		}

		var sepVal = calcSep(this.x, this.y, this.x2, this.y2);
		return sepVal;
	}

	this.reset = function() {
		markerFixed = false;
		this.x2 = undefined;
		this.predictPos = [];
	}


	this.predictPath = function(no, x, y, dx, dy) {
		if (no < 500) {
			if (selTargetMode == 0 || predictUsingOtherBodies) {
				for (i = 0; i < entities.length; i++) {
					var sepVal = calcSep(x, y, entities[i].x, entities[i].y); //is this more intensive?

					if (sepVal[2] <= entities[i].radius) {
						return;
					}

					var thatMass = entities[i].mass;
					
					var a = calcAccel(sepVal[0], sepVal[1], sepVal[2], thatMass);
					dx += a[0];
					dy += a[1];
				}

				x += dx;
				y += dy;

			} else {
				var i = searchForEntity(relTarget.id);
				var sepVal = calcSep(x, y, entities[i].x, entities[i].y); //is this more intensive?

				if (sepVal[2] <= entities[i].radius) {
					return;
				}

				var thatMass = entities[i].mass;
				
				var a = calcAccel(sepVal[0], sepVal[1], sepVal[2], thatMass);
				dx += a[0];
				dy += a[1];

				x += dx - relTarget.dx;
				y += dy - relTarget.dy;
			}
			
			

			if (no % 2 == 0) {
				this.predictPos.push([x, y]);
			}
			no++;

			this.predictPath(no, x, y, dx, dy);

		} else {
			return;
		}
	}

}







function generateSystem(
	radius = 100000, 
	entityCount = 5,
	gVal = 0.01,
	threshold = [1, 8, 8],

	) {

	entities = [];
	craftArray = [];
	timeStep = 1;

	// var pi = "3141592653589793238462643383279502884197169399375105820974944592307816406286208998628034825342117067982148086513282306647093844609550582231725359408128481117450284102701938521105559644622948954930381964428810975665933446128475648233786783165271201909145648566923460348610454326648213393607260249141273724587006606315588174881520920962829254091715364367892590360011330530548820466521384146951941511609433057270365759591953092186117381932611793105118548074462379962749567351885752724891227938183011949"
	
	// var seedGen = pi.slice(seed, seed + entityCount);

	// if (seed + entityCount > pi.length) {
	// 	seedGen += pi.slice(0, (seed + entityCount) - pi.length);
	// }

	// console.log(seedGen)

	// seedGen = (1103515245 * parseInt(seedGen) + 123456) % Math.pow(2, 31);

	

	var genEntities = []

	var systemID = 1;
	var planetID = 1;
	var moonID = 0;
	
	var newStructure = "system";

	var systemIsClockwise;


	//for moon
	var planetMass;

	var totalWeight = threshold[0] + threshold[1] + threshold[2];
	

	for (var iEntity = 0; iEntity < entityCount; iEntity++) {

		switch (newStructure) {
			case "system":
				var newEntity = new PrimaryObject("f", "SY" + systemID, 
					Math.round(899000000 * Math.random()) + 1000000, 
					[radius * (Math.random() - 0.5) * 2, radius * (Math.random() - 0.5) * 2],
					[0,0]
				);

				if (Math.random() > 0.5) {
					systemIsClockwise = true;
				} else {
					systemIsClockwise = false;
				}


			break;
			case "planet":

				planetMass = Math.round(25000 * Math.random())

				var newEntity = new PrimaryObject("o", "SY" + systemID + "-" + planetID, 
					planetMass,
					Math.abs(radius * 0.01 * planetID + (Math.random() - 0.5) * 5000 * planetID * gVal));

				newEntity.center = "SY" + systemID;
				newEntity.isPrimary = true;
				newEntity.isClockwise = systemIsClockwise;
				
				
			break;
			case "moon":
				
				var newEntity = new PrimaryObject("o", "SY" + systemID + "-" + planetID + ":" + moonID, 
					1 + Math.round(0.2 * planetMass * Math.random()), 
					Math.pow(3 * planetMass / (Math.PI * 4), 1/3) * (1 + 10 * Math.random())



				);

				newEntity.center = "SY" + systemID + "-" + planetID;
				newEntity.isPrimary = true;
				newEntity.isClockwise = systemIsClockwise;

			break;
		}

		var rnd = Math.random();

		if (rnd < threshold[0] / totalWeight) {
			newStructure = "system";
			planetID = 0;
			systemID++;
		} else if (rnd < threshold[1] / totalWeight) {
			newStructure = "planet";
			moonID = 0;
			planetID++;
		} else if (newStructure == "planet") {
			newStructure = "moon";
			moonID++;
		}



		genEntities[iEntity] = newEntity;


	}

	var gen_system = new EntitySystem("gen_system")
	gen_system.entities = genEntities;
	gen_system.gVal = gVal;
	simSystem = gen_system;

	instantiateSystem();

	target.id = gen_system.entities[0].id;

	console.log(genEntities);
}


function loadSystem(systemVar) {
	entities = [];
	craftArray = [];
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
	simSystem.applyTargetPref();

	instantiateSystem();
}

function instantiateSystem() {
	simSystem.generateSystem();


	viewScale = simSystem.viewScale;
	maxTimeStep = Math.round(99 * Math.pow(4, 1 - simSystem.entityCap / 35)) + 2;

	trivialThreshold = 0;

	for (var i = 0; i < entities.length; i++) {
		entities[i].updateType();
		entities[i].updateRadiusMass();
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
		for (var i = 0; i < craftArray.length; i++) {
			craftArray[i].testAsTarget();
			craftArray[i].draw();
		}
	} else {
		for (var t = 0; t < timeStep; t++) {
			for (var i = 0; i < entities.length; i++) {
				entities[i].update();
				if (t == timeStep - 1) {
					entities[i].draw();
				}
			}
			for (var i = 0; i < craftArray.length; i++) {
				craftArray[i].update();
				if (t == timeStep - 1) {
					craftArray[i].draw();
				}
			}
		}
	}

	if (spawnMode == 1) {
		marker.update();
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

		c.fillText("system: " + simSystem.systemName, 20, guiHeight + guiOffset);
		c.fillText("system G const: " + simSystem.gVal, 20, 2 * guiHeight + guiOffset);
		c.fillText("collision mode: " + collisionMode, 20, 3 * guiHeight + guiOffset);

		c.fillText("zoom view scale: " + viewScale + "x", 20, 9 * guiHeight + guiOffset);
		c.fillText("zoom view scale mult: " + viewScaleMult, 20, 10 * guiHeight + guiOffset);
		c.fillText("offset step: " + offsetStep, 20, 11 * guiHeight + guiOffset);

		c.fillText("entities: " + entities.length, 20, 13 * guiHeight + guiOffset);
		c.fillText("spawn range: " + simSystem.spawnRange, 20, 14 * guiHeight + guiOffset);
		c.fillText("cull range: " + simSystem.cullRange, 20, 15 * guiHeight + guiOffset);

		c.fillText("spawn mode: " + spawnMode, 20, 4 * guiHeight + guiOffset + 200);
		c.fillText("roid mass: " + roidMass, 20, 5 * guiHeight + guiOffset + 200);
		c.fillText("roid disguise: " + typeOfEntity[roidDisguise].typeName, 20, 6 * guiHeight + guiOffset + 200);
		c.fillText("[u]    user type override: " + userTypeOverride, 20, 7 * guiHeight + guiOffset + 200);
		c.fillText("[i]    spawn roid at click: " + spawnRoidAtClick, 20, 8 * guiHeight + guiOffset + 200);
		c.fillText("[o]    orbit target: " + orbitTarget, 20, 9 * guiHeight + guiOffset + 200);

		if (craftArray.length == 0) {
			c.fillText("[x][v] target craft: " + "no target", 20, 11 * guiHeight + guiOffset + 200);
		} else {
			c.fillText("[x][v] target craft: " + craftArray[selCraftTarget].id, 20, 11 * guiHeight + guiOffset + 200);
		}
		
		c.fillText("[z]    spawn craft at click: " + spawnCraftAtClick, 20, 12 * guiHeight + guiOffset + 200);

		c.fillText("[r][y] target: " + target.id, 20, 14 * guiHeight + guiOffset + 200);
		c.fillText("[r][y] relative target: " + relTarget.id, 20, 15 * guiHeight + guiOffset + 200);
		c.fillText("[e]    target mode: " + selTargetMode, 20, 16 * guiHeight + guiOffset + 200);
		c.fillText("[5]    predict influence: " + predictUsingOtherBodies, 20, 17 * guiHeight + guiOffset + 200);
		
		c.fillText("[t]    isTargetting: " + isTargetting, 20, 18 * guiHeight + guiOffset + 200);
		c.fillText("[u]    targettingLargest: " + targettingLargest, 20, 19 * guiHeight + guiOffset + 200);


		c.fillText("[<][>] time step: " + timeStep + "x", 20, 25 * guiHeight + guiOffset + 200);
		c.fillText("       maxTimeStep: " + maxTimeStep + "x", 20, 26 * guiHeight + guiOffset + 200);
		c.fillText("[m]    reset time", 20, 27 * guiHeight + guiOffset + 200);
		c.fillText("[/]    isPaused: " + isPaused, 20, 28 * guiHeight + guiOffset + 200);











		c.fillText("forced fps: " + fps, innerWidth - 120, guiHeight + guiOffset);









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


function createNew(id, mass, x, y, dx, dy, fixed, type, typeFixed, isPrimary, primaryColor, planetColor, temperature) {
	entities.push(new Entity(id, mass, x, y, dx, dy, fixed, type, typeFixed, isPrimary, primaryColor, planetColor, temperature));
	//console.log(id + " " + x)
}
function createNewOrbit(id, mass, radius, angle, center, isClockwise, type, typeFixed, isPrimary, primaryColor, planetColor, temperature) { //WIP
	var x, y, dx, dy, v;

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
				this.centerX = entities[i].x;
				this.centerY = entities[i].y;
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


	if (useOrbitOffset) {
		var offsetCoeff = radius/10;
		//console.log(offsetCoeff)
		var orbitOffset = [Math.random() - 0.5, Math.random() - 0.5];

		x += offsetCoeff * orbitOffset[0];
		y += offsetCoeff * orbitOffset[1];
	}
	

	//why does it spawn relative to the target rather than center of roids? not sure why ptrX and Y are required

	//console.log("spawned at " + x + ", " + (y - ptrY))
	// console.log("ptr " + midX + ", " + midY)
	// console.log("origin " + ptrX + ", " + ptrY)
	createNew(id, mass, x, y, dx + this.centerDX, dy + this.centerDY, false, type, typeFixed, isPrimary, primaryColor, planetColor, temperature);
	//console.log("dx" + (dx + this.centerDX) + " dy" + (dy + this.centerDY));
	//createNew(id, x, y, mass, dx, dy, false, type, isPrimary);

}









function searchForEntity(id) {
	for (i = 0; i < entities.length; i++) {
		if (entities[i].id == id) {
			return i;
		}
	}
	return undefined;
}
function searchForCraft(id) {
	for (i = 0; i < craftArray.length; i++) {
		if (craftArray[i].id == id) {
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


function spawnRoid(isUser, x, y, dx = 0, dy = 0) {
	if (isUser) {
		//var vVal = calcCentripetal(x, y);
		if (orbitTarget && spawnMode != 1) { //&& target != undefined
			var orbitPara = calcSepAngle(target.x, target.y, x, y);
			createNewOrbit("ID" + idCount, roidMass, orbitPara[0], orbitPara[1], target.id, true, typeOfEntity[roidDisguise]);
		} else {
			entities.push(new Entity("ID" + idCount, roidMass, x, y, dx, dy, false, typeOfEntity[roidDisguise]));
		}
		if (userTypeOverride) {
			entities[entities.length - 1].typeFixed = true;
		}
		idCount++;
		entities[entities.length - 1].periodicUpdate();

	} else if (entities.length < simSystem.entityCap && isPaused == false && simSystem.spawnRoids) {
		if (simSystem.center == undefined) {
			entities.push(new Entity("ID" + idCount, round((0.1 + Math.random()) * 20, 2), (Math.random() - 0.5) * simSystem.spawnRange * 2 + ptrX, (Math.random() - 0.5) * simSystem.spawnRange * 2 + ptrY, (Math.random() - 0.5) * 0.2, (Math.random() - 0.5) * 0.2)); //times 2 as - 0.5 is only half the range
		} else {
		//console.log(idCount);
			createNewOrbit(
				"ID" + idCount, 
				round((0.1 + Math.random()) * 20, 2), 
				simSystem.spawnRadius + (0.5 - Math.random()) * simSystem.spawnRange, 
				Math.random() * Math.PI * 2, simSystem.center, true);//<<<<<<<<<<<<<<<<<<<<
		}
		idCount++;
		entities[entities.length - 1].periodicUpdate();
	}
}


function globalPeriodicUpdate() {
	var upper = trivialThreshold;

	for (var i = 0; i < entities.length; i++) {
		if (entities[i].mass > upper && entities[i].id != simSystem.center) { // != simSystem.center
			upper = entities[i].mass;
			largest = entities[i].id;
		}

		if (entities[i].isPrimary == false && (entities[i].x < ptrX - simSystem.cullRange || entities[i].x > ptrX + simSystem.cullRange || entities[i].y < ptrY - simSystem.cullRange || entities[i].y > ptrY + simSystem.cullRange)) {
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
	var vecx, vecy, k;
	if (x == 0 && y == 0) {
		vecx = 0;
		vecy = 0;
	} else {
		k = 1 / Math.sqrt(x * x + y * y);
		vecx = k * x;
		vecy = k * y;
	}
	

	return [vecx, vecy];
}

function calcSepAngle(x1, y1, x2, y2) {
	var sepVal = calcSep(x1, y1, x2, y2);
	var angle = Math.atan(sepVal[1] / sepVal[0]);
	if (sepVal[0] < 0) {
		angle += Math.PI;
	}

	return [sepVal[2], angle];
}

function calcOrbit(radius, angle, center, isClockwise) {
	var x, y, dx, dy, v;

	this.angle = angle;

	if (this.angle == undefined) {
		this.angle = Math.random() * Math.PI * 2;
	}

	if (center == undefined) {
		this.centerX = simSystem.centerX;
		this.centerY = simSystem.centerY;
		this.centerMass = simSystem.centerMass;
		this.centerDX = simSystem.centerDX// / vScale;
		this.centerDY = simSystem.centerDY// / vScale;
	} else { 
		for (var i = 0; i < entities.length; i++) {

			if (entities[i].id == center) {
				//console.log(entities[i].id + " x" + entities[i].x + " y" + entities[i].y);
				this.centerX = entities[i].x;
				this.centerY = entities[i].y;
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

	return [x, y, dx, dy];
}










function resetAllTrails() {
	for (var i = 0; i < entities.length; i++) {
		entities[i].resetPos();
	}
}


function spawnCraft(x, y) {
	var orbitPara = calcSepAngle(target.x, target.y, x, y);
	var orbitVal = calcOrbit(orbitPara[0], orbitPara[1], target.id, true);

	createNewCraft("Craft-" + craftIDCount, orbitVal[0], orbitVal[1], orbitVal[2] + target.dx, orbitVal[3] + target.dy);
	console.log(target.dx);
	craftIDCount++;
}

function createNewCraft(id, x, y, dx, dy) {
	craftArray.push(new Craft(id, x, y, dx, dy));
}






















function isInRender(rX, rY, radius) {
	if (rX - radius * viewScale > innerWidth || 
		rY - radius * viewScale > innerHeight || 
		rX + radius * viewScale < 0 || 
		rY + radius * viewScale < 0) 
	{
		return false;
	} else {
		return true;
	}
}
















function Craft(id, x, y, dx = 0, dy = 0) {
	this.id = id;
	this.x = x;
	this.y = y;
	
	this.dx = dx;
	this.dy = dy;

	this.predictPos = [];

	this.draw = function() {
		this.renderX = (viewScale * (this.x - ptrX)) + midX; //find distance from origin, viewScale, then render from pointer
		this.renderY = (viewScale * (this.y - ptrY)) + midY;


		if (isPredictPath && target.id == this.id && timeStep == 1) {
			c.strokeStyle = "#aaa";
			c.beginPath();
			c.lineTo(this.renderX, this.renderY);
			for (var i = 0; i < this.predictPos.length; i++) {
				c.lineTo(viewScale * (this.predictPos[i][0] - ptrX) + midX, viewScale * (this.predictPos[i][1] - ptrY) + midY)
			}
			c.lineWidth = trailWidth * 0.3;
			c.stroke();
			c.closePath();
		}


		c.fillStyle = "#fff"

		c.beginPath();
		//c.fillRect(this.renderX - craftRadius/2 * viewScale, this.renderY - craftRadius/2 * viewScale, craftRadius, craftRadius);
		c.lineTo(this.renderX, this.renderY + craftRadius * viewScale);
		c.lineTo(this.renderX - craftRadius * viewScale, this.renderY);
		c.lineTo(this.renderX, this.renderY - craftRadius * viewScale);
		c.lineTo(this.renderX + craftRadius * viewScale, this.renderY);
		c.fill();


		var tagX = this.renderX + 4; //4
		var tagY = this.renderY + 4; //2
		var tagXOffset = 6;

		c.beginPath();

		if (infoMode > 0) { //name
			c.font = fontSizes[0] + textFont;

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

		c.font = fontSizes[1] + textFont2;
		c.fillStyle = textColor2;

		
		if (infoMode > 3) { //name, type, mass and vals  || target.id == this.id
			c.font = fontSizes[2] + textFont3;
			c.fillText("(" + Math.round(this.x) + ", " + Math.round(this.y) + ")", tagX + tagXOffset, tagY + 22);
			c.fillText("[" + round(this.dx, 2) + ", " + round(this.dy, 2) + "]", tagX + tagXOffset, tagY + 32);
		}
		c.closePath(); //is this needed?
	}

	this.update = function() {
		this.interact();

		this.x += this.dx;
		this.y += this.dy;

		this.testAsTarget();

		if (isPredictPath && target.id == this.id && timeStep == 1) {
			this.predictPos = [];
			this.predictPath(0, this.x, this.y, this.dx, this.dy);
	
		}
	}

	this.testAsTarget = function() {
		if (target.id == this.id) {
			target.x = this.x;
			target.y = this.y;
		}

		if (isTargetting) {
			ptrX = target.x;
			ptrY = target.y;
		}
	}

	this.interact = function() {
		for (var i = 0; i < entities.length; i++) {
			var sepVal = calcSep(this.x, this.y, entities[i].x, entities[i].y); //is this more intensive?
			var thatMass = entities[i].mass;
			var thatRad = entities[i].radius;

			if (sepVal[2] <= thatRad) {
				craftArray.splice(searchForCraft(this.id), 1);
			} else {
				var a = calcAccel(sepVal[0], sepVal[1], sepVal[2], thatMass);
				this.dx += a[0];
				this.dy += a[1];
			}
		}
	}

	this.predictPath = function(no, x, y, dx, dy) {
		if (no < 500) {
			if (selTargetMode == 0 || predictUsingOtherBodies) {
				for (i = 0; i < entities.length; i++) {
					var sepVal = calcSep(x, y, entities[i].x, entities[i].y); //is this more intensive?

					if (sepVal[2] <= entities[i].radius) {
						return;
					}

					var thatMass = entities[i].mass;
					
					var a = calcAccel(sepVal[0], sepVal[1], sepVal[2], thatMass);
					dx += a[0];
					dy += a[1];
				}

				x += dx;
				y += dy;

			} else {
				var i = searchForEntity(relTarget.id);
				var sepVal = calcSep(x, y, entities[i].x, entities[i].y); //is this more intensive?

				if (sepVal[2] <= entities[i].radius) {
					return;
				}

				var thatMass = entities[i].mass;
				
				var a = calcAccel(sepVal[0], sepVal[1], sepVal[2], thatMass);
				dx += a[0];
				dy += a[1];

				x += dx - relTarget.dx;
				y += dy - relTarget.dy;
			}
			
			

			if (no % 2 == 0) {
				this.predictPos.push([x, y]);
			}
			no++;

			this.predictPath(no, x, y, dx, dy);

		} else {
			return;
		}
	}
}






function EntityProperties(id, temperature) {
	this.id = id;

	this.fixTemp = temperature;

	this.albedo = Math.random();
	this.luminosity;
	this.temperature = 0; //surface temp

	this.update = function(x, y, radius, type) {
		if (type == star) {
			if (this.temperature != this.fixTemp) {
				this.temperature = this.fixTemp;
				this.luminosity = 4 * Math.PI * radius * radius * Math.pow(this.temperature, 4) * 0.021;
			}
		} else {
			this.temperature = 0;
			for (var i = 0; i < entities.length; i++) {
				if (entities[i].id != this.id && entities[i].type == star) {
					var sepVal = calcSep(entities[i].x, entities[i].y, x, y);
					this.temperature += Math.pow(entities[i].properties.luminosity * (1 - this.albedo) / (16 * Math.PI * sepVal[2] * sepVal[2]), 1/4);
				}
			} 
		}
	}

	this.draw = function(x, y) {
		c.beginPath();
		c.font = fontSizes[1] + textFont2;
		c.fillStyle = textColor2;
		c.fillText("albedo: " + round(this.albedo, 2), x, y);
		c.fillText("temp: " + round(this.temperature, 2) + "K / " + (round(this.temperature - 273.15, 2)) + "C", x, y + 10);
		//c.fillText("lum: " + round(this.luminosity, 2), x, y - 20);
		c.closePath;
	}

	this.getColor = function(type) { //146, 181, 255
		if (type == "star") {
			if (this.temperature <= 3700) {
				return "255, 182, 108";
			} else if (this.temperature >= 3700 && this.temperature < 5200) {
				return "255, 218, 181";
			} else if (this.temperature >= 5200 && this.temperature < 6000) {
				return "255, 237, 227";
			} else if (this.temperature >= 6000 && this.temperature < 7500) {
				return "249, 245, 255";
			} else if (this.temperature >= 7500 && this.temperature < 10000) {
				return "213, 224, 255";
			} else if (this.temperature >= 10000 && this.temperature < 30000) {
				return "162, 191, 255";
			} else if (this.temperature >= 30000) {
				return "146, 181, 255";
			}
		} else {

		}
		


	}
}






function Entity(id, mass, x, y, dx = 0, dy = 0, fixed = false, type = roid, typeFixed = false, isPrimary = false, primaryColor, 
				planetColor = [surfaceColors[Math.round(Math.random() * (surfaceColors.length - 1))], atmosphereColors[Math.round(Math.random() * (atmosphereColors.length - 1))]]
				) {

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
	
	this.radius = 1; //to prevent undefined;
	this.newPosRenderThreshold = 10;
	this.newPosDistThreshold = 400;

	this.predictPos = []




	//this.properties = new EntityProperties(id, temperature);





	var foundStar = false;
	var closestSep = 200000;
	var iClosestStar;

	this.planetColor = planetColor




	switch (trailMode) {
		case 0:
			this.lastPos = [[this.x, this.y]];
		break;
		case 1:
			this.lastPos = [[this.x - ptrX, this.y - ptrY]];
		break;
	}
	if (isPrimary) { //possibly redundant in system declaration?
		if (primaryColor != undefined) {
			this.trailColor = primaryColor
		} else {
			this.trailColor = colors[Math.round(Math.random() * (colors.length - 1))];
		}
	} else {
		this.trailColor = neutralTrailColor;
	}

	

	this.update = function() {

		//this.properties.update(this.x, this.y, this.radius, this.type);

		this.updateRadiusMass();
		this.updateType();
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

							isInRender(this.renderX, this.renderY, this.radius)
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
			target.dx = this.dx;
			target.dy = this.dy;

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


	this.periodicUpdate = function() {
		foundStar = false;

		if (isUsingShading) {
			//console.log("====== periodic");
			for (var i = 0; i < entities.length; i++) {

				if (entities[i].type == star) {

					var sepVal = calcSep(this.x, this.y, entities[i].x, entities[i].y);

					//console.log("test " + entities[i].id);

					if (!foundStar) {
						closestSep = sepVal[2];
						iClosestStar = i;
						foundStar = true;
					} else if (sepVal[2] < closestSep) {
						closestSep = sepVal[2];
						iClosestStar = i;
					}
					// console.log("s " + sepVal[2]);
					// console.log("cs " + closestSep);
					// console.log("i " + i);
					// console.log("ic " + iClosestStar);

				}
			}
		}
		
	}
	
	this.draw = function() {
		//console.log(this.id + " drawing at " + this.x);
		this.renderX = (viewScale * (this.x - ptrX)) + midX; //find distance from origin, viewScale, then render from pointer
		this.renderY = (viewScale * (this.y - ptrY)) + midY;


		
		if (
			!isInRender(this.renderX, this.renderY, this.radius) &&

			(viewScale * (this.lastPos[0][0] - ptrX) + midX > innerWidth ||
			viewScale * (this.lastPos[0][1] - ptrY) + midY > innerHeight ||
			viewScale * (this.lastPos[0][0] - ptrX) + midX < 0 ||
			viewScale * (this.lastPos[0][1] - ptrY) + midY < 0) &&

			target.id != this.id &&
			renderCulling

			&& this.type != star

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

					c.strokeStyle = this.trailColor;
					c.lineWidth = trailWidth * 0.3;

					c.stroke();
					c.closePath();
				}

				c.lineWidth = 1;

				//========type style


				if (this.radius * viewScale < 0.5 && radiusColoring && this.type != star && this.type != comet) {
					if (this.isPrimary || target.id == this.id) {
						c.beginPath();

						c.fillStyle = this.trailColor;
						c.arc(this.renderX, this.renderY, 1, 0, 2 * Math.PI);
						c.fill();
						c.closePath();
					} else {
						c.beginPath();
						c.fillStyle = "#fff";
						c.arc(this.renderX, this.renderY, this.radius * viewScale, 0, 2 * Math.PI);
						c.fill();
						c.closePath();
					}

				} else {


					//================== Body


					if (this.type == star) {
						//var color = this.properties.getColor("star");
						if (this.starColor == undefined) {
							this.starColor = starColor[Math.round((starColor.length - 1) * Math.random())]
						}
						this.type.draw(this.renderX, this.renderY, this.radius, this.starColor)
					} else {
						//var color = this.properties.getColor("default");
						var color = this.planetColor;
						var angleInfo;

						if (isUsingShading) {
							if (!foundStar) {
								angleInfo = undefined;
							} else {
								if (iClosestStar > entities.length - 1 || entities[iClosestStar].type != star) { //in the event of a star being deleted
									angleInfo = undefined;
								} else {
									var sepVal = calcSep(this.x, this.y, entities[iClosestStar].x, entities[iClosestStar].y);
									var vector = calcVector(sepVal[0], sepVal[1]);
									angleInfo = [vector[0], vector[1], sepVal[2]];
								}
							}
						} else {
							angleInfo = "none";
							
						}

						if (this.type == comet) {
							var vector = calcVector(this.dx, this.dy);
							this.type.draw(this.renderX, this.renderY, this.radius, angleInfo, [vector[0], vector[1]]);
						} else {
							this.type.draw(this.renderX, this.renderY, this.radius, angleInfo, color);
						}
						c.closePath();
					}

					
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
						c.font = fontSizes[0] + textFont;

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

					c.font = fontSizes[1] + textFont2;
					c.fillStyle = textColor2;

					if (infoMode > 1) { //name and type
						c.fillText(this.type.typeName, tagX + tagXOffset, tagY + 22);

					}

					if (infoMode > 2) { //name, type and mass
						c.fillText(this.type.typeName + " / " + Math.round(this.mass), tagX + tagXOffset, tagY + 22); //midX is effectively the origin, rather than the screen center
					}

					if (infoMode > 3) { //name, type, mass and vals  || target.id == this.id
						c.font = fontSizes[2] + textFont3;
						c.fillText("(" + Math.round(this.x) + ", " + Math.round(this.y) + ")", tagX + tagXOffset, tagY + 32);
						c.fillText("[" + round(this.dx, 2) + ", " + round(this.dy, 2) + "]", tagX + tagXOffset, tagY + 42);
					}

					c.closePath(); //is this needed?


					//this.properties.draw(tagX + tagXOffset, tagY + 52);


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

	this.updateType = function() {
		if (testForType && !this.typeFixed) {
			if (this.mass >= typeOfEntityComparison[typeOfEntityComparison.length - 1].massThreshold * simSystem.typeScale && this.type != negative_matter) {
				this.type = typeOfEntityComparison[typeOfEntityComparison.length - 1];
				this.typeFixed = true; //negative_matter
				return;
			}

			for (i = 0; i < typeOfEntityComparison.length - 1; i++) {
				if (this.mass >= typeOfEntityComparison[i].massThreshold * simSystem.typeScale && this.mass < typeOfEntityComparison[i + 1].massThreshold * simSystem.typeScale && this.type != typeOfEntityComparison[i]) {
					this.type = typeOfEntityComparison[i];
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
				for (i = 0; i < entities.length; i++) {
					if (entities[i].id != this.id) {
						var sepVal = calcSep(x, y, entities[i].x, entities[i].y); //is this more intensive?

						if (sepVal[2] <= this.radius + entities[i].radius) {
							return;
						}

						var thatMass = entities[i].mass;
						
						var a = calcAccel(sepVal[0], sepVal[1], sepVal[2], thatMass);
						dx += a[0];
						dy += a[1];
						
					}	
				}

					x += dx;
					y += dy;

			} else {
				var i = searchForEntity(relTarget.id);
				var sepVal = calcSep(x, y, entities[i].x, entities[i].y); //is this more intensive?

				if (sepVal[2] <= this.radius + entities[i].radius) {
					return;
				}

				var thatMass = entities[i].mass;
				
				var a = calcAccel(sepVal[0], sepVal[1], sepVal[2], thatMass);
				dx += a[0];
				dy += a[1];

				x += dx - relTarget.dx;
				y += dy - relTarget.dy;
			}

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
					this.thatdx = entities[i].dx;
					this.thatdy = entities[i].dy;

					if (this.fixed == false && this.type != negative_matter) {
						entities[i].dx = this.dx * 2 * this.mass / (this.mass + this.thatMass) - this.thatdx * (this.mass - this.thatMass) / (this.mass + this.thatMass);
						entities[i].dy = this.dy * 2 * this.mass / (this.mass + this.thatMass) - this.thatdy * (this.mass - this.thatMass) / (this.mass + this.thatMass);

						this.dx = this.dx * (this.mass - this.thatMass) / (this.mass + this.thatMass) + this.thatdx * 2 * this.thatMass / (this.mass * this.thatMass);
						this.dy = this.dy * (this.mass - this.thatMass) / (this.mass + this.thatMass) + this.thatdy * 2 * this.thatMass / (this.mass * this.thatMass);
						//console.log("contact by " + this.id);
					}

				break;
			}
		} else if (this.fixed == false && this.sep > (this.thatRad + this.radius)) {
			// if (entities[i].type == negative_matter && this.type != negative_matter && this.sep < this.thatRad * 10000) {
			// 	this.mass -= Math.round(10000 / this.sep);
			// 	entities[i].mass += Math.round(10000 / this.sep);
			// 	//console.log("s");
			// }
			
			var a = calcAccel(this.sepX, this.sepY, this.sep, this.thatMass);
			this.dx += a[0];
			this.dy += a[1];
		}
	}

	this.updateRadiusMass = function() {
		if (this.mass < 1) {
			entities.splice(searchForEntity(this.id), 1); //perhaps implement queue to lessen calls
		} else {
			if (simSystem.checkTypeDensity) {
				this.radius = Math.pow(3 * this.mass / (Math.PI * 4 * this.type.density), 1/3) * radiusConst;
			} else {
				this.radius = Math.pow(3 * this.mass / (Math.PI * 4), 1/3) * radiusConst;
			}
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
