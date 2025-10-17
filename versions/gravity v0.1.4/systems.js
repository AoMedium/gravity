
var typeOfEntity = ["dust", "roid", "dwarf_planet", "terrestrial", "gas_giant", "brown_dwarf", "star", "negative_matter"]; //for roidDisguise
var typeMassThreshold = [0, 15, 130, 200, 1000, 4500, 5000, 100000];
//var typeDensity = [1, 1, 1, 2]

var sol_alpha = new EntitySystem("sol_alpha")
	sol_alpha.freeEntities = 
		[ //id, mass, x, y, dx, dy, fixed, type
		["Sol Alpha", 60000, 0, 0, 0, 0, true],
		["Sera", 20, 18000, 0, 0, -20]
		];

	sol_alpha.orbitalEntities = [
		//id, mass, radius, angle, isClockwise, type, isPrimary 
		["Kas", 130, 300, , false],
		["Ayca", 300, 650, , false],
		["Terra", 500, 1520, , false],
		//["Muna", 500, 950, -2, false],
		["Jaen", 220, 2900, , false],
		//["Hera", 110, 2800, 0, false],
		["Muerin", 2300, 8000, , false],
		["Iomus", 1900, 13000, , false],
		["Mei", 1300, 17200, , false],
		["Zana", 200, 19500, , false]
		];

	sol_alpha.centre = "Sol Alpha"
	sol_alpha.rndAngle = true;

	sol_alpha.spawnRoids = true;
	sol_alpha.entityCap = 10;
	sol_alpha.testForScale = true;

	sol_alpha.spawnRange = 10000;


var sol_beta = [
	[],

];

var sol_duo = new EntitySystem("sol_duo", [
	["Sol A", -50, 0, 580, 0, 54],
	["Sol B", 50, 0, 500, 0, -54],
	["Sol C", -800, 0, 200, 0, -50],
	["Duo 1", 200, 0, 20, 0, 70],
	["Duo 2a", 0, 450, 45, -57, 0],
	["Duo 2b", 0, 470, 11, 0, 0],
	["Duo 3", 0, -600, 30, 40, 0],
	["Duo 4", -830, 0, 18, 0, 30],
	["Duo 5", -890, 30, 25, 20, 10]
	]);
sol_duo.typeScale = 0.1;

var owo = new EntitySystem("owo", [
	["OwO", 0, 0, 5000, 0, 0, true],
	["UmU", 300, 0, 200, 0, 130],
	["UwU", -300, 0, 200, 0, -130],
	["OvO", 0, 300, 200, -130, 0],
	["OmO", 0, -300, 200, 130, 0],
	["* bulge *", -500, 500, 8000, 0, 0]
	]);

var cannon_system = new EntitySystem("cannon_system", [
	["cannon1", 0, -100, 10000, 0, 0, true],
	["cannon2", 0, 100, 10000, 0, 0, true],
	["cannon3", 0, -25, 1000, 0, 0, true],
	["cannon4", 0, 25, 1000, 0, 0, true],
	["ball", -500, 0, 12, 0, 0]
	],);

var test_system = new EntitySystem("test_system");
	test_system.freeEntities = [["Test Core", 5000, 0, 0, 0, 0]];

var isolated_system = new EntitySystem();
isolated_system.spawnRoids = true;
isolated_system.entityCap = 200;

function EntitySystem(systemName = "untitled_system") {
	this.systemName = systemName;
	this.centre = undefined;

	this.freeEntities = [];
	this.orbitalEntities = [];

	this.rndAngle = false;

	this.spawnRoids = false;
	this.spawnRange = 1000;
	this.entityCap = 10;


	this.testForScale = true;
	this.typeScale = 1;

	
	

	this.generateSystem = function() {
		if (this.freeEntities != undefined) {
			for (i = 0; i < this.freeEntities.length; i++) {
				createNew(this.freeEntities[i][0], this.freeEntities[i][1], this.freeEntities[i][2], this.freeEntities[i][3], this.freeEntities[i][4], this.freeEntities[i][5], this.freeEntities[i][6], this.freeEntities[i][7], true);

				if (this.centre == this.freeEntities[i][0]) {
					centreMass = this.freeEntities[i][1];
					centreX = this.freeEntities[i][2];
					centreY = this.freeEntities[i][3];
				}
			}
		}
		if (this.orbitalEntities != undefined) {
			var angleCount = 0;
			for (i = 0; i < this.orbitalEntities.length; i++) {
				if (this.orbitalEntities[i][3] == undefined) {
					if (this.rndAngle) {
						this.orbitalEntities[i][3] = Math.random() * Math.PI * 2;
					} else {
						this.orbitalEntities[i][3] = angleCount * Math.PI;
						angleCount++;
					}
				}
				createNewOrbit(this.orbitalEntities[i][0], this.orbitalEntities[i][1], this.orbitalEntities[i][2], this.orbitalEntities[i][3], this.orbitalEntities[i][4], this.orbitalEntities[i][5], true)
			}
		}
		if (this.spawnRoids) {
			var spawnTime = setInterval(spawnRoid, 50);
		}
	}
}