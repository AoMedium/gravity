
var typeOfEntity = ["dust", "roid", "dwarf_planet", "terrestrial", "gas_giant", "brown_dwarf", "star", "negative_matter"]; //for roidDisguise
var typeMassThreshold = [0, 15, 130, 200, 1000, 4500, 5000, 20000];
//var typeDensity = [1, 1, 1, 2]

var sol_aljpha = new EntitySystem("sol_alpha", 
	[ //name, x, y, mass, dx, dy, fixed, type
	["Sol Alpha", 0, 0, 1000, 0, 0],
	["Kas", 0, 40, 20, 158, 0],
	["Ayca", 0, 120, 50, 91, 0],
	["Terra", 0, -270, 70, -62, 0],
	["Muna", 0, -290, 11, 0, 0],
	["Jaen", 30, 500, 20, 45, 0],
	["Muerin", -700, 0, 200, 0, 38],
	["Hera", -730, -40, 12, 45, 0],
	["Iomus", 900, 0, 400, 0, -33],
	["Zana", 990, 0, 23, 0, 20],
	["Mei", 860, 0, 12, 0, -130]
]);
// sol_alpha.spawnRoids = true;
// sol_alpha.roidCap = 50;
// sol_alpha.testForScale = true;
// sol_alpha.typeScale = 0.2;

var sol_alpha = new EntitySystem("sol_alpha", 
	[ //name, x, y, mass, dx, dy, fixed, type
	["Sol Alpha", 0, 0, 5500, 0, 0],
	["Kas", 0, 130, 150, 225, 0],
	["Ayca", 0, 450, 300, 150, 0],
	["Terra", 0, 750, 500, -120, 0],
	["Muna", 0, 680, 90, 0, 0],
	["Jaen", 0, 1100, 150, 45, 0],
	["Muerin", 0, 1900, 2300, 0, 38],
	["Hera", -1900, -40, 25, 45, 0],
	["Iomus", 0, 3300, 1600, 0, -33],
	["Zana", 2400, 2400, 23, 0, -250],
	["Mei", 2360, 0, 17, 0, -150]
]);
sol_alpha.spawnRoids = false;
sol_alpha.roidCap = 50;
sol_alpha.testForScale = true;


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

var test_system = new EntitySystem("test_system", [
	["Test Planet", 0, 0, 300, 0, 0, , "terrestrial"]
	]);

var isolated_system = new EntitySystem();
isolated_system.spawnRoids = true;

function EntitySystem(systemName = "untitled_system", entityData, spawnRoids = false, roidCap = 500, testForScale = true, typeScale = 1) {
	this.systemName = systemName;
	this.entityData = entityData;
	this.spawnRoids = spawnRoids;
	this.testForScale = testForScale;
	this.typeScale = typeScale;
	this.roidCap = 500;

	this.generateSystem = function() {
		if (this.entityData != undefined) {
			for (i = 0; i < this.entityData.length; i++) {
				createNew(this.entityData[i][0], this.entityData[i][1], this.entityData[i][2], this.entityData[i][3], this.entityData[i][4], this.entityData[i][5], this.entityData[i][6], this.entityData[i][7], true);
				//entities[entities.length - 1].isPrimary = true;
				//console.log(entities[entities.length - 1].isPrimary);
			}
		}
		if (this.spawnRoids) {
			var spawnTime = setInterval(spawnRoid, 50);
		}
	}
}