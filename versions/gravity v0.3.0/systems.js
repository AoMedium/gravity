
var colours = ["#ff4400", "#ff9500", "#ffe100", "#6fff00", "#00ffa6", "#00aeff", "#5100ff", "#d900ff", "#ff0099"];


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
		["Sol Alpha", 22000, 0, 0, 0, 0, false],
		["Sera", 20, 30000, 0, -5, -15]
		];

	sol_alpha.orbitalEntities = [
		//id, mass, radius, angle, isClockwise, type, isPrimary 
		// ["Kas", 360, 500, , false],
		["Ayca", 480, 1250],
		["Terra", 700, 3120],
		//["Muna", 500, 950, -2, false],
		["Jaen", 500, 5000],
		//["Hera", 110, 2800, 0, false],
		// ["Muerin", 4500, 15000, , false],
		// ["Iomus", 3900, 20000, , false],
		// ["Mei", 3100, 25000, , false],
		// ["Zana", 200, 29000, , false]
		];

	sol_alpha.viewScale = 0.1
	sol_alpha.centre = "Sol Alpha"

	//sol_alpha.alignType = 2;
	//sol_alpha.alignAngle = -1/4;

	sol_alpha.entityCap = 10;

	sol_alpha.spawnRange = 8000;
	sol_alpha.cullRange = 30000;


var sol_beta = new EntitySystem("sol_beta");
	sol_beta.freeEntities = [];

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
	sol_duo.typeDensity = false;


var orbit_sim = new EntitySystem("orbit_sim");
	orbit_sim.freeEntities = [
		["Sol", 2000, 0, 0, 0, 0, true],
		//["Terra", 50, 200, 0, 0, -100]
		// ["Z", 1, 600, 0, 0, -8],
		// ["Y", 1, -600, 0, 0, 8],
		// ["W", 1, 0, 600, 8, 0],
		// ["X", 1, 0, -600, -8, 0]
	];

	orbit_sim.orbitalEntities = [
		["Terra", 50, 700],
		["Muna", 5, 30, , "Terra"],
		["Jaen", 30, 300],
		["Jaen B", 1, 10, , "Jaen"],
		
	];

	//orbit_sim.viewScale = 0.1;
	orbit_sim.centre = "Sol"
	orbit_sim.typeScale = 0.1;
	orbit_sim.typeDensity = false;


var proto_sol = new EntitySystem("proto_sol");
	proto_sol.freeEntities = [["Proto Sol", 2000, 0, 0, 0, 0]];

	proto_sol.centre = "Proto Sol";
	proto_sol.spawnRoids = true;
	proto_sol.spawnRange = 700;
	proto_sol.entityCap = 500;
	

	proto_sol.typeScale = 0.1;

var owo = new EntitySystem("owo");
	owo.freeEntities = [
		["OwO", 2000, 0, 0, 0, 0, true],
		//["* bulge *", 8000, -500, 500, 0, 0]
	];

	owo.orbitalEntities = [
		["UmU", 80, 300, 0],
		["UwU", 80, 300, -Math.PI],
		["OvO", 80, 300, Math.PI / 2],
		["OmO", 80, 300, -Math.PI / 2]
	];

	owo.centre = "OwO";
	owo.typeScale = 0.1;
	owo.typeDensity = false;

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









var systems = [sol_alpha, sol_duo, orbit_sim, owo, cannon_system, test_system, isolated_system];
var selSystem = 0;










function EntitySystem(systemName = "untitled_system") {
	this.systemName = systemName;
	this.centre = undefined;


	this.viewScale = 0.5;

	this.freeEntities = [];
	this.orbitalEntities = [];
	this.primaryID = []; //for target selection

	this.alignType = 0;
	this.alignAngle = 0;

	this.spawnRoids = false;
	this.spawnRange = 1000; //must go before below else not init
	this.cullRange = this.spawnRange * 2;
	this.entityCap = 10;


	this.testForScale = true;
	this.typeScale = 1;
	this.typeDensity = true;

	
	

	this.generateSystem = function() {
		if (this.freeEntities != undefined) {
			for (var i = 0; i < this.freeEntities.length; i++) {
				createNew(this.freeEntities[i][0], this.freeEntities[i][1], this.freeEntities[i][2], this.freeEntities[i][3], this.freeEntities[i][4], this.freeEntities[i][5], this.freeEntities[i][6], this.freeEntities[i][7], true);
				
				this.primaryID.push(this.freeEntities[i][0]);

				if (this.centre == this.freeEntities[i][0]) {
					this.centreMass = this.freeEntities[i][1];
					this.centreX = this.freeEntities[i][2];
					this.centreY = this.freeEntities[i][3];
					this.centreDX = this.freeEntities[i][4];
					this.centreDY = this.freeEntities[i][5];
				}
			}
		}
		if (this.orbitalEntities != undefined) {
			var angleCount = 0;
			for (var i = 0; i < this.orbitalEntities.length; i++) { //var i is needed for two consecutive for loops
				if (this.orbitalEntities[i][3] == undefined) { //angle
					switch (this.alignType) {
						case 1:
							this.orbitalEntities[i][3] = this.alignAngle * Math.PI;
						break;
						case 2:
							this.orbitalEntities[i][3] = (this.alignAngle + angleCount) * Math.PI;
							angleCount++;
						break;
						default:
							this.orbitalEntities[i][3] = Math.random() * Math.PI * 2;
						break;
					}
				}



				createNewOrbit(
					this.orbitalEntities[i][0], //id
					this.orbitalEntities[i][1], //mass
					this.orbitalEntities[i][2], //radius
					this.orbitalEntities[i][3], //angle
					this.orbitalEntities[i][4], //centre
					this.orbitalEntities[i][5], //isClockwise
					this.orbitalEntities[i][6], //type
					true //isPrimary
				);

				this.primaryID.push(this.orbitalEntities[i][0]);
			}
		}
	}
}