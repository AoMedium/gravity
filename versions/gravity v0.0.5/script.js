var canvas = document.querySelector("canvas");
var c = canvas.getContext('2d');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const G = 0.1;

const contact = 1;
const vScale = 0.01;
const nonZeroFactor = 0.0000001; //to prevent divide by 0


var originX = innerWidth / 2;
var originY = innerHeight / 2;
var ptrX = innerWidth / 2;
var ptrY = innerHeight / 2;

var offsetStep = 1;
var scale = 0.5;
var scaleStep = 0.05;
var isPaused = false;

var entities = [];
var idCount = 0;

var debris = [];
var debrisSize = 0.1;



//var spawnTime = setInterval(spawnRoid, 50);
var cullTime = setInterval(cullOutside, 2000);
var forceFrames = true;
var fps = 30;

var showNames = true;
var infoMode = 1;
var showTrivial = false;

window.addEventListener("keydown",
	function(e) {
		var key = event.keyCode;
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






			case 187:
				scale = round(scale + scaleStep, 2);
			break;
			case 189:
				if (scale - scaleStep > 0) {
					scale = round(scale - scaleStep, 2);
				} else {
					scale = 0.01;
				}
			break;
			case 48:
				scale = 1;
				originX = innerWidth / 2;
				originY = innerHeight / 2;
			break;
			case 221:
				scaleStep = round(scaleStep + 0.01, 2);
			break;
			case 219:
				if (scaleStep > 0) {
					scaleStep = round(scaleStep - 0.01, 2);
				}
			break;








			case 190:
				offsetStep = round(offsetStep + 0.2, 1);
				//console.log("increased step to " + offsetStep);
			break;
			case 188:
				if (offsetStep > 0) {
					offsetStep = round(offsetStep - 0.2, 1);
					//console.log("decreased step to " + offsetStep);
				}
			break;



			case 88:
				isPaused = !isPaused;
				//console.log("isPaused = " + isPaused);
			break;
		}
	});

window.addEventListener('mousedown',
	function (e) {
		spawnRoid(true, originX + ((e.clientX - ptrX) / scale), originY + ((e.clientY - ptrY) / scale)); //using algebra
		
		//console.log(originX + ", " + originY)
		//console.log("to: " + (originX + ((e.clientX - originX) / scale)) + ", " + (originY + ((e.clientY - originY) / scale)))

		//originX += e.clientX - ptrX;
		//originY += e.clientY - ptrY; //didn't even need scaling....
		
	});

function toggleOption(option) {
	console.log("toggle");
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

// ===================== Main =====================

var simulatedSystem = "sol_duo";
var centre = "Sol"; //for centripetal


var sol_alpha = [ //name, x, y, mass, dx, dy, fixed
	["Sol Alpha", 0, 0, 1000, 0, 0, false],
	["Kas", 0, 40, 20, 158, 0, false],
	["Ayca", 0, 120, 50, 91, 0, false],
	["Terra", 0, -270, 70, -62, 0, false],
	["Muna", 0, -290, 11, 0, 0, false],
	["Jaen", 30, 500, 20, 45, 0, false],
	["Muerin", -700, 0, 200, 0, 38, false],
	["Hera", -730, -40, 12, 45, 0, false],
	["Iomus", 900, 0, 400, 0, -33, false],
	["Zana", 990, 0, 23, 0, 20, false],
	["Mei", 860, 0, 12, 0, -130, false]
];

var sol_beta = [
	[],

];

var sol_duo = [
	["Sol A", -50, 0, 580, 0, 54, false],
	["Sol B", 50, 0, 500, 0, -54, false],
	["Sol C", -800, 0, 200, 0, -50, false],
	["Duo 1", 200, 0, 20, 0, 70, false],
	["Duo 2a", 0, 450, 45, -57, 0, false],
	["Duo 2b", 0, 470, 11, 0, 0, false],
	["Duo 3", 0, -600, 30, 40, 0, false],
	["Duo 4", -830, 0, 18, 0, 30, false],
	["Duo 5", -890, 30, 25, 20, 10, false]
];

var cannon_system = [
	["cannon1", 0, -100, 10000, 0, 0, true],
	["cannon2", 0, 100, 10000, 0, 0, true],
	["cannon3", 0, -25, 1000, 0, 0, true],
	["cannon4", 0, 25, 1000, 0, 0, true],
	["ball", -500, 0, 12, 0, 0, false]
];

simulateSystem(simulatedSystem);


if (forceFrames == true) {
	var fF = setInterval(forceAnimate, 1000/fps);
} else {
	animate();
}

// ===================== Main End =====================


function simulateSystem(id) {
	var system;
	if (id != "isolated_system") {
		switch (id) {
			case "sol_alpha":
				system = sol_alpha;
			break;
			case "sol_beta":
				system = sol_beta;
			break;
			case "sol_duo":
				system = sol_duo;
			break;
			case "cannon_system":
				system = cannon_system;
			break;
		}

		for (i = 0; i < system.length; i++) {
			createNew(system[i][0], system[i][1], system[i][2], system[i][3], system[i][4], system[i][5], system[i][6]);
		}
	}
}




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
	for (var i = 0; i < entities.length; i++) {
		entities[i].update();
		//console.log(entities[i].id + " " + entities[i].fixed);
	}
}

function drawGUI() {
	var length = 5
	c.strokeStyle = "#999";

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
	c.fillText("system: " + simulatedSystem, 20, 30);
	c.fillText("zoom scale: " + scale, 20, 45);
	c.fillText("scale step: " + scaleStep, 20, 60);
	c.fillText("offset step: " + offsetStep, 20, 75);
	c.fillText("entities: " + entities.length, 20, 90);
	c.fillText("isPaused: " + isPaused, 20, innerHeight - 30);
	c.closePath();


	// c.moveTo(originX, 0);
	// c.lineTo(originX, innerHeight);
	// c.stroke();

	// c.moveTo(0, originY);
	// c.lineTo(innerWidth, originY);
	// c.stroke();

}





function createNew(id, x, y, mass, dx, dy, fixed) {
	entities.push(new Entity(id, originX + x, originY + y, mass, dx * vScale, dy * vScale, fixed));
}
function spawnRoid(isUser, x, y) {
	var roidSize = 10;
	var spawnRange = 1000;

	if (isUser) {
		//var vVal = calcCentripetal(x, y);
		entities.push(new Entity("ID" + idCount, x, y, 1, 0, 0, false));
	} else if (entities.length < 30) {
		entities.push(new Entity("ID" + idCount, (Math.random() - 0.5) * spawnRange + originX, (Math.random() - 0.5) * spawnRange + originY, (0.1 + Math.random()) * roidSize, (Math.random() - 0.5) * vScale, (Math.random() - 0.5) * vScale, false));
	}
	idCount++;
}
// function spawnDebris(x, y, massDif) {
// 	var debrisCount = Math.round(massDif / debrisSize);

// 	if (debrisCount > 10) {
// 		debrisCount = 10;
// 	}

// 	for (i = 0; i < debrisCount + 1; i++) {

// 		idCount++;
// 	}
// }


function cullOutside(){
	var cullRange = 1000;
	for (var i = 0; i < entities.length; i++) {
		if (entities[i].x < -cullRange || entities[i].x > innerWidth + cullRange || entities[i].y < -cullRange || entities[i].y > innerHeight + cullRange) {
			console.log(entities[i].id + " culling " + entities[i].x + " " + entities[i].y);
			entities.splice(i, 1);
		}
	}
	//console.log(entities.length);
}








function calcCentripetal(x, y) { //WIP
	var thatX, thatY, thatMass, thatdx, thatdy, sepX, sepY, sep, v, vx, vy;
	for (i = 0; i < entities.length; i++) {
		if (entities[i].id == centre) {
			thatX = entities[i].x;
			thatY = entities[i].y;
			thatdx = entities[i].dx;
			thatdy = entities[i].dy;
			thatMass = entities[i].mass;
			break;
		}
	}

	var sepVal = calcSep(x, y, thatX, thatY);
	sepX = sepVal[0];
	sepY = sepVal[1];
	sep = sepVal[2];

	v = Math.sqrt(G * thatMass / sep);

	var vector = calcVector(sepX, sepY);
	vx = vector[1] * v + thatdx;
	vy = vector[0] * v + thatdy;

	return [vx, vy];
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


function Entity(id, x, y, mass, dx, dy, fixed) {

	this.id = id;
	this.x = x;
	this.y = y;
	this.mass = mass;

	this.radius = Math.sqrt(this.mass / Math.PI);

	if (dx == undefined && dy == undefined) {
		this.dx = 0;
		this.dy = 0;
	} else {
		this.dx = dx;
		this.dy = dy;
	}

	if (fixed == undefined) {
		this.fixed = false;
	} else {
		this.fixed = fixed;
	}

	this.update = function() {
		this.draw();

		if (isPaused == false) {
			this.compare();
			this.updateRadiusMass();

			if (this.fixed == false) {
				this.x += this.dx;
				this.y += this.dy;
			}
		}
	}
	
	this.draw = function() {
		var scaleX = (scale * (this.x - originX)) + ptrX; //find distance from origin, scale, then render from pointer
		var scaleY = (scale * (this.y - originY)) + ptrY;

		c.beginPath();
		//c.strokeStyle = "rgb(255, 255, 255)";		
		c.strokeStyle = "rgb(0, 0, 0)";
		//c.fillStyle = "rgb(255,255,255)";
		c.arc(scaleX , scaleY, this.radius * scale, 0, 2 * Math.PI);
		//c.fill();
		c.stroke();
		c.closePath();

		if (this.mass >= 10 || showTrivial) {
			c.beginPath();
			if (showNames) {
				c.font = "10px Arial";
				c.fillText(this.id, scaleX + 10, scaleY + 10);
			}

			c.font = "8px Arial";

			if (infoMode == 0) {
				c.fillText(Math.round(this.mass), scaleX + 10, scaleY + 20);
			} else if (infoMode > 0) {
				c.fillText(Math.round(this.mass) + " / (" + 
					Math.round(this.x - ptrX) + ", " + 
					Math.round(this.y - ptrY) + ")", scaleX + 10, scaleY + 20); //ptrX is effectively the origin, rather than the screen centre
			}

			if (infoMode == 2) {
				c.fillText("[" + round(this.dx, 2) + ", " + round(this.dy, 2) + "]", scaleX + 10, scaleY + 30);
			}


			c.closePath();
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
					this.calculateA();
					
				}


			}		
		}
	}

	this.collisionDetect = function(i) {
		if (this.sep <= contact * (this.thatRad + this.radius)) {

			if (this.mass >= this.thatMass) {
				//spawnDebris(entities[i].x, entities[i].y, this.mass - this.thatMass);

				this.mass += this.thatMass;
				this.updateRadiusMass();

				if (this.fixed == false) {
					this.dx += (entities[i].dx * this.thatMass) / this.mass; //almost p = mv?
					this.dy += (entities[i].dy * this.thatMass) / this.mass;
				}

				//console.log("collide: " + this.id + " absorbs " + entities[i].id);
				entities.splice(i, 1);
			}
		}
	}

	this.calculateA = function() {
		if (this.sep == 0) {
			//this.sep += nonZeroFactor;
			this.sep = this.radius;
		}
		this.a = G * this.thatMass / Math.pow(this.sep, 2);

		var vector = calcVector(this.sepX, this.sepY);

		this.dx += this.a * vector[0];
		this.dy += this.a * vector[1];
	}

	this.updateRadiusMass = function() {
		this.radius = Math.sqrt(this.mass / Math.PI);
	}
}

function round(value, decimals) {
	return Number(Math.round(value+'e'+decimals)+'e-'+decimals);
}