var canvas = document.querySelector("canvas");
var c = canvas.getContext('2d');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

//document.addEventListener('contextmenu', event => event.preventDefault());

const G = 0.1;

const contact = 1;
const vScale = 0.01;
const nonZeroFactor = 0.0000001; //to prevent divide by 0

var textColor = "#000"; //#000
var textColor2 = "#555"; //#555
var outlineColor = "#000"; //#000
var outlineColor2 = "rgba(0,0,0,0.5)"; //rgba(0,0,0,0.5)
var auraColor = "rgba(0,0,0,0.3)"; //rgba(0,0,0,0.3)

var originX = innerWidth / 2;
var originY = innerHeight / 2;
var ptrX = innerWidth / 2;
var ptrY = innerHeight / 2;

var offsetStep = 2;
var scale = 0.7;
var scaleStep = 0.05;
var isPaused = false;
var timeStep = 1; //1 = 7.1, 5 = 9.1, 10 = 10.7 , 15 = 12.3
var spawnAtClick = false;
var testForType = true;

var entities = [];
var idCount = 0;

var roidMass = 10;
var roidDX = 0;
var roidDY = 0;
var roidDisguise = 0;

var debris = [];
var debrisMass = 0.1;

var cullTime = setInterval(cullOutside, 10000);
var forceFrames = true;
var fps = 5;

var spawnRange = 2000;
var cullRange = 2 * spawnRange;

var showNames = true;
var infoMode = 1;

var showTrivial = false;
var trivialThreshold = 10;
var lower = 1;
var upper = 10;
var largest;


var guiHeight = 15;
var guiOffset = 10;

// var guiValues = [
// 	["system", simSystem, 0],
// 	["zoom scale", scale, 1],
// 	["scale step", scaleStep, 1],
// 	["offset step", offsetStep, 1],
// 	["entities", entities.length, 2],
// 	["spawn range", spawnRange, 2],
// 	["cull range", cullRange, 2],
// 	["isPaused", isPaused, 3]
// ];

// ===================== Main =====================


var target = "Terra";
var isTargetting = false;

var centre = "Sol"; //for centripetal
var centreX, centreY;

var simSystem = sol_alpha;
simSystem.generateSystem();


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
	c.clearRect(0, 0, innerWidth, innerHeight);
	drawGUI();
	updateObjects();
}




function updateObjects() {
	//console.log(entities[2].x);
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

function drawGUI() {
	var length = 5
	c.strokeStyle = textColor2;

	//pointer marker
	c.beginPath();
	c.moveTo(ptrX + length, ptrY);
	c.lineTo(ptrX - length, ptrY);
	c.stroke();

	c.moveTo(ptrX, ptrY + length);
	c.lineTo(ptrX, ptrY - length);
	c.stroke();

	c.closePath();

	// c.strokeStyle = "#f00";
	// c.beginPath();
	// c.moveTo(originX + length, originY);
	// c.lineTo(originX - length, originY);
	// c.stroke();

	// c.moveTo(originX, originY + length);
	// c.lineTo(originX, originY - length);
	// c.stroke();

	// c.closePath();

	//text
	c.beginPath();
	c.font = "12px Arial";
	c.fillStyle = textColor;

	// for (i = 0; i < guiValues.length; i++) {
	// 	switch (guiValues[i][2]) {
	// 		case 0:
	// 			guiOffset = 10;
	// 		break;
	// 		case 1:
	// 			guiOffset = 40;
	// 		break;
	// 		case 2:
	// 			guiOffset = 100;
	// 		break;
	// 		case 3:
	// 			guiOffset = 200;
	// 		break;
	// 	}
	// 	//console.log("render " + guiValues[i][0]);
	// 	c.fillText(guiValues[i][0] + ": " + guiValues[i][1], 20, (i + 1) * guiHeight + guiOffset);
	// }
	c.fillText("system: " + simSystem.systemName, 20, guiHeight + guiOffset);
	c.fillText("zoom scale: " + scale, 20, 3 * guiHeight + guiOffset);
	c.fillText("scale step: " + scaleStep, 20, 4 * guiHeight + guiOffset);
	c.fillText("offset step: " + offsetStep, 20, 5 * guiHeight + guiOffset);


	c.fillText("entities: " + entities.length, 20,  guiHeight + guiOffset + 100);
	c.fillText("spawn range: " + spawnRange, 20, 2 * guiHeight + guiOffset + 100);
	c.fillText("cull range: " + cullRange, 20, 3 * guiHeight + guiOffset + 100);

	c.fillText("spawn at click: " + spawnAtClick, 20, 5 * guiHeight + guiOffset + 100);
	c.fillText("roid disguise: " + typeOfEntity[roidDisguise], 20, 6 * guiHeight + guiOffset + 100);

	c.fillText("target: " + target, 20, 8 * guiHeight + guiOffset + 100);
	c.fillText("time step: " + timeStep + "x", 20, 9 * guiHeight + guiOffset + 100);
	c.fillText("isPaused: " + isPaused, 20, 10 * guiHeight + guiOffset + 100);
	c.closePath();


	// c.moveTo(originX, 0);
	// c.lineTo(originX, innerHeight);
	// c.stroke();

	// c.moveTo(0, originY);
	// c.lineTo(innerWidth, originY);
	// c.stroke();

}





function createNew(id, x, y, mass, dx, dy, fixed, type, isPrimary) {
	entities.push(new Entity(id, originX + x, originY + y, mass, dx * vScale, dy * vScale, fixed, type, isPrimary));
}
function createNewOrbit(id, mass, radius, arc, type, isPrimary) { //WIP

	var x, y, dx, dy;
	calcSep(x, y, centreX, centreY);

	calcAccel();

	v = Math.sqrt(G * thatMass / sep);

	var vector = calcVector(sepX, sepY);
	vx = vector[1] * v + thatdx;
	vy = vector[0] * v + thatdy;

	createNew(id, x, y, dx, dy, false, type, isPrimary);
}

function removeSelf(id) {
	for (i = 0; i < entities.length; i++) {
		if (entities[i].id == id) {
			entities.splice(i, 1);
			return;
		}
	}
}
function setTarget(iTarget) {
	target = iTarget;
}

function spawnRoid(isUser, x, y) {
	if (isUser) {
		//var vVal = calcCentripetal(x, y);
		entities.push(new Entity("ID" + idCount, x, y, roidMass, roidDX, roidDY, false, typeOfEntity[roidDisguise]));
		entities[entities.length - 1].typeFixed = true;
		idCount++;
	} else if (entities.length < simSystem.roidCap) {
		entities.push(new Entity("ID" + idCount, (Math.random() - 0.5) * spawnRange * 2 + originX, (Math.random() - 0.5) * spawnRange * 2 + originY, round((0.1 + Math.random()) * 20, 2), (Math.random() - 0.5) * vScale, (Math.random() - 0.5) * vScale)); //times 2 as - 0.5 is only half the range
		idCount++;
	}
}


// function spawnDebris(x, y, massDif) {
// 	var debrisCount = Math.round(massDif / debrisMass);

// 	if (debrisCount > 10) {
// 		debrisCount = 10;
// 	}

// 	for (i = 0; i < debrisCount + 1; i++) {
// 		entities.push(new Entity("ID" + idCount, x, y, debrisMass, (Math.random() - 0.5) * vScale, Math.random() - 0.5) * vScale, false, );
// 		idCount++;
// 	}
// }


function cullOutside() {
	var upper = trivialThreshold;

	for (var i = 0; i < entities.length; i++) {
		if (entities[i].mass > upper) {
			upper = entities[i].mass;
			largest = entities[i].id;
		}

		if (entities[i].x < originX - cullRange || entities[i].x > originX + cullRange || entities[i].y < originY - cullRange || entities[i].y > originY + cullRange) {
			console.log(entities[i].id + " culling " + entities[i].x + " " + entities[i].y);
			entities.splice(i, 1);
		}
	}
	updateThreshold(upper);
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
	
	var a = G * thatMass / Math.pow(sep, 2);
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


function Entity(id, x, y, mass, dx = 0, dy = 0, fixed = false, type = "roid", isPrimary = false) {

	this.id = id;
	this.x = x;
	this.y = y;
	this.mass = mass;
	this.dx = dx;
	this.dy = dy;
	this.fixed = fixed;
	this.type = type;
	this.isPrimary = isPrimary;

	this.radius = Math.sqrt(this.mass / Math.PI);

	this.typeFixed = false;
	

	this.update = function() {

		this.updateType();

		if (isPaused == false) {
			this.compare();
			this.updateRadiusMass();

			if (this.fixed == false) {
				this.x += this.dx;
				this.y += this.dy;
			}
		}

		if (target == this.id && isTargetting) {
			originX = this.x;
			originY = this.y;
		}

		if (centre == this.id) {
			centreX = this.x;
			centreY = this.y;
		}
	}
	
	this.draw = function() {
		var scaleX = (scale * (this.x - originX)) + ptrX; //find distance from origin, scale, then render from pointer
		var scaleY = (scale * (this.y - originY)) + ptrY;

		c.beginPath();	
		
		// if (this.type == "roid") {

		// } else {
		// 	c.arc(scaleX , scaleY, this.radius * scale, 0, 2 * Math.PI);
		// }
		if (this.type == "dust") {
			c.strokeStyle = outlineColor2;
		} else {
			c.strokeStyle = outlineColor;
		}
		c.arc(scaleX , scaleY, this.radius * scale, 0, 0.5*  Math.PI);
		c.stroke();
		c.closePath();

		
		
		
		c.beginPath();
		c.strokeStyle = auraColor;
		switch (this.type) {
			case "negative_matter":
				c.arc(scaleX , scaleY, (this.radius + this.radius / 2) * scale, 0, 2 * Math.PI);
				c.stroke();
				c.beginPath();
				c.arc(scaleX , scaleY, (this.radius + this.radius * 2.5) * scale, 0, 2 * Math.PI);
			break;
			case "star":
				c.arc(scaleX , scaleY, (this.radius + this.radius / 2.5) * scale, 0, 2 * Math.PI);
			break;
			case "brown_dwarf":
				c.arc(scaleX , scaleY, (this.radius - this.radius / 2.5) * scale, 0, 2 * Math.PI);
				c.stroke();
				c.beginPath();
				c.arc(scaleX , scaleY, (this.radius + this.radius / 4) * scale, 0, 2 * Math.PI);
			break;
			case "gas_giant":
				c.arc(scaleX , scaleY, (this.radius - this.radius / 2.5) * scale, 0, 2 * Math.PI);
			break;
			case "terrestrial":
				c.arc(scaleX , scaleY, (this.radius + 1.5) * scale, 0, 2 * Math.PI);
			break;
			case "dwarf_planet":
				c.arc(scaleX , scaleY, (this.radius + 0.5) * scale, 0, 2 * Math.PI);
			break;
			case "dust":
				c.arc(scaleX , scaleY, (this.radius + this.radius / 2) * scale, 0, 2 * Math.PI);
			break;
		}
		c.stroke();
		c.closePath(); //is this needed?

		

		if (this.mass >= trivialThreshold || showTrivial || this.id == target || this.isPrimary) {
			c.beginPath();
			if (showNames) {
				c.font = "10px Arial";
				c.fillStyle = textColor;
				c.fillText(this.id, scaleX + 10, scaleY + 10);
			}

			c.font = "8px Arial";
			c.fillStyle = textColor2;

			if (infoMode == 0) {
				c.fillText(this.type, scaleX + 10, scaleY + 20);
			} else if (infoMode > 0) {
				c.fillText(this.type + " / " + Math.round(this.mass), scaleX + 10, scaleY + 20); //ptrX is effectively the origin, rather than the screen centre
			}

			if (infoMode == 2) {
				c.fillText("(" + Math.round(this.x - ptrX) + ", " + Math.round(this.y - ptrY) + ") / [" + round(this.dx, 2) + ", " + round(this.dy, 2) + "]", scaleX + 10, scaleY + 30);
			}

			c.closePath(); //is this needed?
		}
	}

	this.updateType = function() {
		if (testForType && this.typeFixed == false) {
			if (this.mass > typeMassThreshold[typeMassThreshold.length - 1] * simSystem.typeScale && this.type != typeOfEntity[typeMassThreshold.length - 1]) {
				this.type = typeOfEntity[typeOfEntity.length - 1]
				this.typeFixed = true; //negative_matter
				return;
			}

			for (i = 0; i < typeMassThreshold.length; i++) {
				if (this.mass >= typeMassThreshold[i] * simSystem.typeScale && this.mass < typeMassThreshold[i + 1] * simSystem.typeScale && this.type != typeOfEntity[i]) {
					this.type = typeOfEntity[i]
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

				if (this.fixed == false) {
					var a = calcAccel(this.sepX, this.sepY, this.sep, this.thatMass);
					this.dx += a[0];
					this.dy += a[1];
				}
			}		
		}
	}

	this.collisionDetect = function(i) {
		if (this.sep <= contact * (this.thatRad + this.radius)) {

			if (this.mass >= this.thatMass) {
				//spawnDebris(entities[i].x, entities[i].y, this.mass - this.thatMass);

				if (entities[i].type == "negative_matter" || this.type == "negative_matter") {
					this.mass -= this.thatMass;
				} else {
					this.mass += this.thatMass;
				}
				// var collideMass = this.thatMass;
				// var thatX = entities[i].x;
				// var thatY = entities[i].y;

				this.updateRadiusMass();

				if (this.fixed == false && this.type != "negative_matter") {
					this.dx += (entities[i].dx * this.thatMass) / this.mass; //almost p = mv?
					this.dy += (entities[i].dy * this.thatMass) / this.mass;
				}

				//console.log("collide: " + this.id + " absorbs " + entities[i].id);
				entities.splice(i, 1);

				//if 1:1, then debris is 1:1

				// if (this.type == "terrestrial" || this.type == "roid") {
				// 	spawnDebris(thatX, thatY, collideMass);
				// }
			}
		}
	}

	this.updateRadiusMass = function() {
		if (this.mass < 1) {
			removeSelf(this.id); //perhaps implement queue to lessen calls
		} else {
			this.radius = Math.sqrt(this.mass / Math.PI);
		}
	}
}

function round(value, decimals) {
	return Number(Math.round(value+'e'+decimals)+'e-'+decimals);
}