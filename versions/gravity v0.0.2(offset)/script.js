var canvas = document.querySelector("canvas");
var c = canvas.getContext('2d');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const G = 0.1;

const contact = 1;
const vScale = 0.01;

var originX = innerWidth / 2;
var originY = innerHeight / 2;

var offsetX = 0;
var offsetY = 0;
var totalOffsetX = 0;
var totalOffsetY = 0;

var offsetStep = 1;
var scale = 1;

var entities = [];
var idCount = 0;

var debris = [];
var debrisSize = 0.1;



//var spawnTime = setInterval(spawnRoid, 50);
var cullTime = setInterval(cullOutside, 1000);
var forceFrames = true;

window.addEventListener("keydown",
	function(e) {
		var key = event.keyCode;
		switch (key) {
			case 38:
				offsetY -= offsetStep;
			break;
			case 40:
				offsetY += offsetStep;
			break;
			case 37:
				offsetX -= offsetStep;
			break;
			case 39:
				offsetX += offsetStep;
			break;

			case 187:
				scale += offsetStep / 10;
			break;
			case 189:
				if (scale > 0) {
					scale -= offsetStep / 10;
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
		}
	});

window.addEventListener('mousedown',
	function (e) {
		spawnRoid(true, originX + ((e.clientX - originX) / scale), originY + ((e.clientY - originY) / scale)); //using algebra
		//console.log(e.clientX + " " + e.clientY);
	});

// ===================== Main =====================

var centre = "Sol";
createNew("Sol", 0, 0, 100, 0, 0, false);
createNew("Ayca", 1, 100, 50, 50, 0, false);
createNew("b", 200, -100, 1, 0, 1.1, false);

if (forceFrames == true) {
	var fF = setInterval(forceAnimate, 50);
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
	updateObjects();
	drawGUI();
}




function updateObjects() {
	//console.log(entities[2].x);
	for (var i = 0; i < entities.length; i++) {
		entities[i].update();
		//console.log(entities[i].id + " " + entities[i].fixed);
	}
}

function drawGUI() {
	c.strokeStyle = "#ccc";

	c.moveTo(originX, 0);
	c.lineTo(originX, innerHeight);
	c.stroke();

	c.moveTo(0, originY);
	c.lineTo(innerWidth, originY);
	c.stroke();

}





function createNew(id, x, y, mass, dx, dy, fixed) {
	entities.push(new Entity(id, originX + x, originY + y, mass, dx * vScale, dy * vScale, fixed));
}
function spawnRoid(isUser, x, y) {
	if (entities.length < 30) {
		if (isUser) {
			//var vVal = calcCentripetal(x, y);
			entities.push(new Entity(idCount, x, y, 1, 0, 0, false));
		} else {
			entities.push(new Entity(idCount, Math.random() * innerWidth, Math.random() * innerHeight, 0.1 + Math.random(), (Math.random() - 0.5) * vScale, (Math.random() - 0.5) * vScale, false));
		}

		idCount++;
	}
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
	for (var i = 0; i < entities.length; i++) {
		if (entities[i].y < 0 || entities[i].y > innerHeight) {
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
		theta = Math.PI / 2;
	} else if (y == 0) {
		theta = 0;
	} else {
		theta = Math.abs(Math.atan(y / x)); //using unit circle
	}

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
		var scaleX = (scale * (this.x - originX + offsetX)) + originX;
		var scaleY = (scale * (this.y - originY + offsetY)) + originY;

		c.beginPath();
		//c.strokeStyle = "rgb(255, 255, 255)";		
		c.strokeStyle = "rgb(0, 0, 0)";
		//c.fillStyle = "rgb(255,255,255)";
		c.arc(scaleX, scaleY, this.radius * scale, 0, 2 * Math.PI);
		//c.fill();
		c.stroke();
		c.closePath();

		c.beginPath();
		c.font = "10px Arial";
		c.fillText(this.id, scaleX + 10, scaleY + 10);
		c.font = "8px Arial";
		c.fillText(this.mass + " / (" + Math.round(this.x - originX) + ", " + Math.round(this.y - originY) + ")", scaleX + 10, scaleY + 20)
		c.closePath();
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