
var dust = new EntityType("dust", 15, 1);
var roid = new EntityType("roid", 130, 1);
var dwarf_planet = new EntityType("dwarf_planet", 350, 1.2);
var terrestrial = new EntityType("terrestrial", 500, 1.2);
var gas_giant = new EntityType("gas_giant", 3000, 0.2);
var brown_dwarf = new EntityType("brown_dwarf", 12500, 0.1);
var star = new EntityType("star", 20000, 0.08);
var negative_matter = new EntityType("negative_matter", 100000, 100);

var typeOfEntity = [
	dust, 
	roid, 
	dwarf_planet, 
	terrestrial, 
	gas_giant, 
	brown_dwarf, 
	star, 
	negative_matter]; //for roidDisguise

function EntityType(typeName, massThreshold, density) {
	this.typeName = typeName;
	this.massThreshold = massThreshold;
	this.density = density;
}

var sol_alpha = new EntitySystem("sol_alpha")
	sol_alpha.freeEntities = 
		[ //id, mass, x, y, dx, dy, fixed, type
		["Sol Alpha", 22000, 0, 0, 0, 0],
		["Sera", 20, 18000, 0, -5, -15]
		];

	sol_alpha.orbitalEntities = [
		//id, mass, radius, angle, isClockwise, type, isPrimary 
		["Kas", 360, 500, , false],
		["Ayca", 480, 1250, , false],
		["Terra", 800, 3120, , false],
		//["Muna", 500, 950, -2, false],
		["Jaen", 500, 5000, , false],
		//["Hera", 110, 2800, 0, false],
		["Muerin", 4500, 15000, , false],
		["Iomus", 3900, 20000, , false],
		["Mei", 3100, 25000, , false],
		["Zana", 200, 29000, , false]
		];

	sol_alpha.viewScale = 0.1
	sol_alpha.centre = "Sol Alpha"
	//sol_alpha.rndAngle = false;
	//sol_alpha.alignAll = true;

	sol_alpha.spawnRoids = false;
	sol_alpha.entityCap = 10;

	sol_alpha.spawnRange = 8000;
	sol_alpha.cullRange = 30000;


var sol_beta = [
	[],

];

var sol_duo = new EntitySystem("sol_duo");

	sol_duo.freeEntities = [
		["Sol A", 580, -50, 0, 0, 54],
		["Sol B", 500, 50, 0, 0, -54],
		["Sol C", 200, -800, 0, 0, -50],
		["Duo 1", 20, 200, 0, 0, 70],
		["Duo 2a", 45, 0, 450, -57, 0],
		["Duo 2b", 11, 0, 470, 0, 0],
		["Duo 3", 30, 0, -600, 40, 0],
		["Duo 4", 18, -830, 0, 0, 30],
		["Duo 5", 25, -890, 30, 20, 10]
		];

	sol_duo.typeScale = 0.02;

var proto_sol = new EntitySystem("proto_sol");
	proto_sol.freeEntities = [["Proto Sol", 2000, 0, 0, 0, 0]];

	proto_sol.centre = "Proto Sol";
	proto_sol.spawnRoids = true;
	proto_sol.entityCap = 500;
	proto_sol.spawnRange = 700;

	proto_sol.typeScale = 0.1;

var owo = new EntitySystem("owo", [
	["OwO", 0, 0, 5000, 0, 0, true],
	["UmU", 300, 0, 200, 0, 130],
	["UwU", -300, 0, 200, 0, -130],
	["OvO", 0, 300, 200, -130, 0],
	["OmO", 0, -300, 200, 130, 0],
	["* bulge *", -500, 500, 8000, 0, 0]
	]);

var cannon_system = new EntitySystem("cannon_system");
	cannon_system.freeEntities = [
	["cannon1", 10000, 0, -100, 0, 0, true],
	["cannon2", 10000, 0, 100, 0, 0, true],
	["cannon3", 1000, 0, -25, 0, 0, true],
	["cannon4", 1000, 0, 25, 0, 0, true],
	["ball", 12, -500, 0, 0, 0]
	];
	cannon_system.typeDensity = false;

var test_system = new EntitySystem("test_system");
	test_system.freeEntities = [["Test Core", 5000, 0, 0, 0, 0]];

var isolated_system = new EntitySystem();
	isolated_system.spawnRoids = true;
	isolated_system.entityCap = 200;
	isolated_system.spawnRange = 500;

function EntitySystem(systemName = "untitled_system") {
	this.systemName = systemName;
	this.centre = undefined;
	this.viewScale = 0.5;

	this.freeEntities = [];
	this.orbitalEntities = [];
	this.primaryID = []; //for target selection

	this.alignAll = 0;

	this.spawnRoids = false;
	this.spawnRange = 1000;
	this.cullRange = this.spawnRange * 2;
	this.entityCap = 10;


	this.testForScale = true;
	this.typeScale = 1;
	this.typeDensity = true;

	
	

	this.generateSystem = function() {
		if (this.freeEntities != undefined) {
			for (i = 0; i < this.freeEntities.length; i++) {
				createNew(this.freeEntities[i][0], this.freeEntities[i][1], this.freeEntities[i][2], this.freeEntities[i][3], this.freeEntities[i][4], this.freeEntities[i][5], this.freeEntities[i][6], this.freeEntities[i][7], true);
				this.primaryID.push(this.freeEntities[i][0]);

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
					switch (this.alignAll) {
						case 1:
							this.orbitalEntities[i][3] = 0;
						break;
						case 2:
							this.orbitalEntities[i][3] = angleCount * Math.PI;
							angleCount++;
						break;
						default:
							this.orbitalEntities[i][3] = Math.random() * Math.PI * 2;
						break;
					}
				}
				createNewOrbit(this.orbitalEntities[i][0], this.orbitalEntities[i][1], this.orbitalEntities[i][2], this.orbitalEntities[i][3], this.orbitalEntities[i][4], this.orbitalEntities[i][5], true)
				this.primaryID.push(this.orbitalEntities[i][0]);
			}
		}
		if (this.spawnRoids) {
			var spawnTime = setInterval(spawnRoid, 50);
		}
	}
}