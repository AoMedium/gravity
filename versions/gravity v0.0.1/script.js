var canvas = document.querySelector("canvas");
var c = canvas.getContext('2d');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const G = 20;

var originX = innerWidth / 2;
var originY = innerHeight / 2;

var entities = [];
var scale = 1;
var contact = 1;

var spawnTime = setInterval(spawnRoid, 50);
var cullTime = setInterval(cullOutside, 10000);
var forceFrames = true;

window.addEventListener("keydown",
	function(e) {
		var key = event.keyCode;
		switch (key) {
			case 38:
			break;
		}
	});

// Main

createNew("a", 0, 0, 20, 0, 0, true);
createNew("b", -200, 1, 5, 0, -1.1, false);
//createNew("c", 1, 250, 1, -1, 0, false);
//createNew("d", -30, 4, 2, 1, 1, false);

if (forceFrames == true) {
	var fF = setInterval(forceAnimate, 50);
} else {
	animate();
}

// Main End

function animate() {
	requestAnimationFrame(animate);
	forceAnimate();
}
function forceAnimate() {
	c.clearRect(0, 0, innerWidth, innerHeight);
	updateObjects();
}

function createNew(id, x, y, mass, dx, dy, fixed) {
	console.log(fixed);
	entities.push(new Entity(id, originX + x, originY + y, mass, dx, dy, fixed));
}

function spawnRoid() {
	if (entities.length < 30) {
		entities.push(new Entity(Math.random(), Math.random() * innerWidth, Math.random() * innerHeight, 0.5 + Math.random() * 3, (Math.random() - 0.5) * 2, (Math.random() - 0.5) * 2, false));
	}
}

function cullOutside(){
	for (var i = 0; i < entities.length; i++) {
		if (entities[i].y < 0 || entities[i].y > innerHeight) {
			entities.splice(i, 1);
		}
	}
	//console.log(entities.length);
}

function updateObjects() {
	//console.log(entities[2].x);
	for (var i = 0; i < entities.length; i++) {
		entities[i].update();
		//console.log(entities[i].id + " " + entities[i].fixed);
	}
}



function Entity(id, x, y, mass, dx, dy, fixed) {

	this.id = id;
	this.x = x;
	this.y = y;
	this.mass = mass;

	this.radius = this.mass / scale;

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
	

	this.a = 0;
	
	this.draw = function() {
		c.beginPath();
		//c.strokeStyle = "rgb(255, 255, 255)";		
		c.strokeStyle = "rgb(0, 0, 0)";
		//c.fillStyle = "rgb(255,255,255)";
		c.arc(this.x, this.y, this.radius, 0, 2 * Math.PI);
		//c.fill();
		c.stroke();
	}

	this.calculate = function() {
		for (i = 0; i < entities.length; i++) {
			if (entities[i].id != this.id) {
				//console.log(this.id + " test: " + entities[i].id)

				this.sepX = entities[i].x - this.x;
				this.sepY = entities[i].y - this.y;
				this.sep = Math.sqrt(this.sepX * this.sepX + this.sepY * this.sepY)

				this.thatMass = entities[i].mass;
				this.thatRad = entities[i].radius;

				this.a = G * this.thatMass / Math.pow(this.sep, 2);
				
				if (this.sep <= contact * (this.thatRad + this.radius)) {

					if (this.mass >= this.thatMass) {
						this.dx += (entities[i].dx * this.thatMass) / this.mass; //almost p = mv?
						this.dy += (entities[i].dy * this.thatMass) / this.mass; 

						entities.splice(i, 1);
						this.mass += this.thatMass;
						this.updateMass();


					}
					
				} else {
					this.dx += this.a * Math.cos(Math.atan(this.sepY/this.sepX)) * this.sepX / Math.abs(this.sepX);
					this.dy += this.a * Math.abs(Math.sin(Math.atan(this.sepY/this.sepX))) * this.sepY / Math.abs(this.sepY); //why did this take so long?
				}

				//console.log(id + " " + this.sepX / Math.abs(this.sepX))
				//console.log(id + " " + this.ddx + " " + this.ddy + " " + this.a)

				// this.dx += 0;
				// this.dy += this.a * this.sepY / Math.abs(this.sepY)
			}		
		}
	}

	this.update = function() {
		if (this.fixed == false) {
			this.calculate();
			this.x += this.dx;
			this.y += this.dy;
		}
		
		this.draw();
		
	}
	this.updateMass = function() {
		this.radius = this.mass / scale;
	}
}