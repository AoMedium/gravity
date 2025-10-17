var canvas = document.querySelector("canvas");
var c = canvas.getContext('2d');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const G = 0.1;

const contact = 1;
const vScale = 0.01;

var originX = innerWidth / 2;
var originY = innerHeight / 2;

var offsetStep = 1;
var scale = 0.5;

var entities = [];
var idCount = 0;

var debris = [];
var debrisSize = 0.1;



//var spawnTime = setInterval(spawnRoid, 50);
var cullTime = setInterval(cullOutside, 2000);
var forceFrames = true;
var fps = 10;

var showNames = true;
var showInfo = true;
var hideTrivial = true;

window.addEventListener("keydown",
	function(e) {
		var key = event.keyCode;
		switch (key) {

			case 187:
				scale = round(scale + offsetStep / 10, 1);
			break;
			case 189:
				if (scale > 0) {
					scale = round(scale - offsetStep / 10, 1);
				}
			break;
			case 48:
				scale = 1;
				originX = innerWidth / 2;
				originY = innerHeight / 2;
			break;

			case 190:
				offsetStep += 1;
				console.log("increased step to " + offsetStep);
			break;
			case 188:
				if (offsetStep > 0) {
					offsetStep -= 1;
					console.log("decreased step to " + offsetStep);
				}
			break;



			case 88:
				console.log(innerWidth + " " + innerHeight);
			break;
		}
	});

window.addEventListener('mousedown',
	function (e) {
		spawnRoid(true, originX + ((e.clientX - originX) / scale), originY + ((e.clientY - originY) / scale)); //using algebra
		//console.log(e.clientX + " " + e.clientY);
	});

// ===================== Main =====================

var system = "sol_alpha";
var centre = "Sol"; //for centripetal

simulateSystem(system);


if (forceFrames == true) {
	var fF = setInterval(forceAnimate, 1000/fps);
} else {
	animate();
}

// ===================== Main End =====================


function simulateSystem(id) {
	switch (id) {
		case "sol_alpha":
			createNew("Sol Alpha", 0, 0, 1000, 0, 0, true);
			createNew("Kas", 0, 40, 20, 158, 0, false);
			createNew("Ayca", 0, 120, 50, 91, 0, false);
			createNew("Terra", 0, -320, 70, -56, 0, false);
			createNew("Muerin", -700, 0, 200, 0, 38, false);
			createNew("Iomus", 900, 0, 400, 0, -33, false);
		break;
		case "sol_beta":
		break;
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
	c.strokeStyle = "#000";

	//origin marker
	c.beginPath();
	c.moveTo(originX + length, originY);
	c.lineTo(originX - length, originY);
	c.stroke();

	c.moveTo(originX, originY + length);
	c.lineTo(originX, originY - length);
	c.stroke();

	c.closePath();

	//text
	c.beginPath();
	c.font = "12px Arial";
	c.fillText("system: " + system, 20, 35);
	c.fillText("scale: " + scale, 20, 50);
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
	if (isUser) {
		//var vVal = calcCentripetal(x, y);
		entities.push(new Entity(idCount, x, y, 1, 0, 0, false));
	} else if (entities.length < 30) {
		entities.push(new Entity(idCount, Math.random() * innerWidth, Math.random() * innerHeight, 0.1 + Math.random(), (Math.random() - 0.5) * vScale, (Math.random() - 0.5) * vScale, false));
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
			//console.log(entities[i].id + " culling " + entities[i].x + " " + entities[i].y);
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
		x += 0.0001; //since y/x for x = 0 is still compiled, add 0.0001 to ensure not 1/0
		theta = Math.PI / 2;
	} else {
		theta = Math.abs(Math.atan(y / x)); //using unit circle
	}

	if (y == 0) {
		y += 0.0001;
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
		if (this.fixed == false) {
			this.x += this.dx;
			this.y += this.dy;
		}

		this.compare();
		this.draw();
		this.updateRadiusMass();
		
	}
	
	this.draw = function() {
		var scaleX = (scale * (this.x - originX)) + originX;
		var scaleY = (scale * (this.y - originY)) + originY;

		c.beginPath();
		//c.strokeStyle = "rgb(255, 255, 255)";		
		c.strokeStyle = "rgb(0, 0, 0)";
		//c.fillStyle = "rgb(255,255,255)";
		c.arc(scaleX, scaleY, this.radius * scale, 0, 2 * Math.PI);
		//c.fill();
		c.stroke();
		c.closePath();

		if (this.mass > 10) {
			c.beginPath();
			if (showNames) {
				c.font = "10px Arial";
				c.fillText(this.id, scaleX + 10, scaleY + 10);
			}
			if (showInfo) {
				c.font = "8px Arial";
				c.fillText(Math.round(this.mass) + " / (" + Math.round(this.x - originX) + ", " + Math.round(this.y - originY) + ")", scaleX + 10, scaleY + 20)
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