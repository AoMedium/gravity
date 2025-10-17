
var typeOfEntity = ["roid", "dwarf_planet", "terrestrial", "gas_giant", "brown_dwarf", "star", "negative_matter"]; //for roidDisguise
var typeMassThreshold = [0, 40, 100, 300, 800, 2000, 5000];

var sol_alpha = new EntitySystem("sol_alpha", 
	[ //name, x, y, mass, dx, dy, fixed, type
	["Sol Alpha", 0, 0, 1000, 0, 0, , "star"],
	["Kas", 0, 40, 20, 158, 0, , "roid"],
	["Ayca", 0, 120, 50, 91, 0, , "terrestrial"],
	["Terra", 0, -270, 70, -62, 0, , "terrestrial"],
	["Muna", 0, -290, 11, 0, 0, , "roid"],
	["Jaen", 30, 500, 20, 45, 0, , "roid"],
	["Muerin", -700, 0, 200, 0, 38, , "gas_giant"],
	["Hera", -730, -40, 12, 45, 0, , "terrestrial"],
	["Iomus", 900, 0, 400, 0, -33, ,"gas_giant"],
	["Zana", 990, 0, 23, 0, 20, , "terrestrial"],
	["Mei", 860, 0, 12, 0, -130, , "roid"]
	],
	0.4);

var sol_beta = [
	[],

];

var sol_duo = [
	["Sol A", -50, 0, 580, 0, 54, , "star"],
	["Sol B", 50, 0, 500, 0, -54, , "star"],
	["Sol C", -800, 0, 200, 0, -50, , "star"],
	["Duo 1", 200, 0, 20, 0, 70, , "terrestrial"],
	["Duo 2a", 0, 450, 45, -57, 0, , "terrestrial"],
	["Duo 2b", 0, 470, 11, 0, 0, , "roid"],
	["Duo 3", 0, -600, 30, 40, 0, , "gas_giant"],
	["Duo 4", -830, 0, 18, 0, 30, , "terrestrial"],
	["Duo 5", -890, 30, 25, 20, 10, , "terrestrial"]
];

var cannon_system = [
	["cannon1", 0, -100, 10000, 0, 0, true,],
	["cannon2", 0, 100, 10000, 0, 0, true,],
	["cannon3", 0, -25, 1000, 0, 0, true,],
	["cannon4", 0, 25, 1000, 0, 0, true,],
	["ball", -500, 0, 12, 0, 0, ,]
];

var test_system = [
	["Test Planet", 0, 0, 100, 0, 0, , "terrestrial"]
];

var isolated_system = [];

function EntitySystem(systemName, entityData, typeScale) {
	this.systemName = systemName;
	this.entityData = entityData;
	this.typeScale = typeScale;
}