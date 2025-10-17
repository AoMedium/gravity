var G = 0.005; //smaller = greater stability, slower velocity; larger = lower stability, great velocity

var colors = ["#ff4400", "#ff9500", //"#ffe100", "#6fff00", 
"#00ffa6", "#00aeff", "#5100ff", "#d900ff", "#ff0099"];


var dust = new EntityType("dust", 0, 1);
// var meteor = new EntityType("meteor", 20, 1);
var roid = new EntityType("roid", 10, 1);
var dwarf_planet = new EntityType("dwarf_planet", 50, 1.2);
var terrestrial = new EntityType("terrestrial", 500, 1.2);
var gas_giant = new EntityType("gas_giant", 500000, 0.2);
var brown_dwarf = new EntityType("brown_dwarf", 1000000, 0.1);
var star = new EntityType("star", 2000000, 0.08);
var negative_matter = new EntityType("negative_matter", 9000000, 100);

var typeOfEntity = [
	dust,
	//meteor,
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







var AU = 5000;
var sol_alpha = new EntitySystem("sol_alpha")
	sol_alpha.freeEntities = 
		[ //id, mass, x, y, dx, dy, fixed, type
		["Sol Alpha", 5962000, 0, 0, 0, 0, false],
		["Sera", 20, 30000, 0, -1, -1.5]
		];

	sol_alpha.orbitalEntities = [
		//id, mass, radius, angle, isClockwise, type, isPrimary 
		["Kas", 55, AU * 0.387],
		["Ayca", 815, AU * 0.723],
		["Terra", 1000, AU], //["Muna", 12, 50, , "Terra"],
		["Jaen", 110, AU * 1.524], //["Ryin", 2, 30, , "Jaen"],
		["Seira", 40, AU * 2.8],

		["Muerin", 25000, AU * 5.203], //["Mi", 5, 300, , "Muerin"],
		["Iomus", 13900, AU * 9.529],
		["Hera", 12000, AU * 19.19],
		["Mei", 10000, AU * 30.06],
		//["Zana", 200, 29000]
		];

	sol_alpha.primaryColors = [
		"#fff", 
		"#ddd",

		"#aaa", 
		"#ff9d00", 
		"#00aeff", //"#555", //00ffa6
		"#ff4400", //"#555", 
		"#aaa",

		"#ffcb00", //"#555",
		"#fffbad",
		"#00ffd9",
		"#0400ff"
	];

	sol_alpha.gVal = 0.05;
	sol_alpha.viewScale = 0.04;
	sol_alpha.center = "Sol Alpha"

	//sol_alpha.alignType = 1;
	//sol_alpha.alignAngle = -1/4;

	sol_alpha.entityCap = 10;

	//sol_alpha.spawnRoids = true;
	sol_alpha.spawnRadius = AU * 2.8;
	sol_alpha.spawnRange = AU * 1.2;
	sol_alpha.cullRange = AU * 40;

	sol_alpha.targetPrefType = "specific";
	sol_alpha.target = "Sol Alpha";


var sol_beta = new EntitySystem("sol_beta");
	sol_beta.freeEntities = [];

var sol_duo = new EntitySystem("sol_duo");

	sol_duo.freeEntities = [
		["Sol A", 580, -50, 0, 0, 0.54],
		["Sol B", 500, 50, 0, 0, -0.54],
		["Sol C", 200, -800, 0, 0, -0.5],
		//["Duo 1", 20, 200, 0, 0, 0.7],
		["Duo 2a", 45, 0, 450, -0.57, 0],
		["Duo 2b", 11, 0, 470, 0, 0],
		["Duo 3", 30, 0, -600, 0.40, 0],
		["Duo 4", 18, -830, 0, 0, 0.3],
		["Duo 5", 25, -890, 30, 0.2, 0.1]
	];

	sol_duo.gVal = 0.1;
	sol_duo.typeScale = 0.02;
	sol_duo.typeDensity = false;
	sol_duo.primaryColors = colors;


var orbit_sim = new EntitySystem("orbit_sim");
	orbit_sim.freeEntities = [
		["Sol", 2000, 0, 0, 0, 0, false],
		//["Terra", 50, 200, 0, 0, -100]
		// ["Z", 1, 600, 0, 0, -8],
		// ["Y", 1, -600, 0, 0, 8],
		// ["W", 1, 0, 600, 8, 0],
		["X", 1, 0, 500, -0.2, 0]
	];

	orbit_sim.orbitalEntities = [
		["Terra", 50, 700], ["Muna", 5, 50, , "Terra"],
		//["Jaen", 30, 300], ["Jaen B", 1, 15, , "Jaen"],
		
	];

	//orbit_sim.viewScale = 0.1;
	orbit_sim.center = "Sol"
	orbit_sim.typeScale = 0.1;
	orbit_sim.typeDensity = false;

	orbit_sim.targetPrefType = "sol";


var proto_sol = new EntitySystem("proto_sol");
	proto_sol.freeEntities = [["Proto Sol", 2000, 0, 0, 0, 0]];

	proto_sol.center = "Proto Sol";
	proto_sol.spawnRoids = true;
	proto_sol.spawnRadius = 200;
	proto_sol.spawnRange = 1000;
	proto_sol.cullRange = 15000;
	proto_sol.entityCap = 200;
	
	proto_sol.typeScale = 0.1;
	proto_sol.testForScale = false;


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

	owo.center = "OwO";
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

	isolated_system.targetPrefType = "searchFor";






var systems = [sol_alpha, sol_duo, orbit_sim, owo, cannon_system, test_system, proto_sol, isolated_system];
var selSystem = 0;










function EntitySystem(systemName = "untitled_system") {
	this.systemName = systemName;
	this.center = undefined;

	this.gVal = G;
	this.viewScale = 0.5;

	this.freeEntities = [];
	this.orbitalEntities = [];
	this.primaryID = []; //for target selection
	this.primaryColors = colors;

	this.alignType = 0;
	this.alignAngle = 0;

	this.spawnRoids = false;
	this.spawnRadius = 0;
	this.spawnRange = 1000; //must go before below else not init
	this.cullRange = this.spawnRange * 2;
	this.entityCap = 10;


	this.testForScale = true;
	this.typeScale = 1;
	this.typeDensity = true;

	this.targetPrefType = "free";
	

	this.generateSystem = function() {
		var colorCount = 0;

		G = this.gVal;

		if (this.freeEntities != undefined) {
			for (var i = 0; i < this.freeEntities.length; i++) {
				createNew(
					this.freeEntities[i][0], 
					this.freeEntities[i][1], 
					this.freeEntities[i][2], 
					this.freeEntities[i][3], 
					this.freeEntities[i][4], 
					this.freeEntities[i][5], 
					this.freeEntities[i][6], 
					this.freeEntities[i][7], 
					true,
					this.primaryColors[colorCount] //primaryColor
					);

				if (colorCount < this.primaryColors.length - 1) {
					colorCount++;
				} else {
					colorCount = 0;
				}
				
				this.primaryID.push(this.freeEntities[i][0]);

				if (this.center == this.freeEntities[i][0]) {
					this.centerMass = this.freeEntities[i][1];
					this.centerX = this.freeEntities[i][2];
					this.centerY = this.freeEntities[i][3];
					this.centerDX = this.freeEntities[i][4];
					this.centerDY = this.freeEntities[i][5];
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
					this.orbitalEntities[i][4], //center
					this.orbitalEntities[i][5], //isClockwise
					this.orbitalEntities[i][6], //type
					true, //isPrimary
					this.primaryColors[colorCount] //primaryColor
				);

				if (colorCount < this.primaryColors.length - 1) {
					colorCount++;
				} else {
					colorCount = 0;
				}

				this.primaryID.push(this.orbitalEntities[i][0]);
			}
		}
	}

	this.applyTargetPref = function() {
		switch (this.targetPrefType) {
			case "sol":
				target = this.center;
				isTargetting = true;
				targettingLargest = false;
			break;
			case "free":
				target = "no target";
				isTargetting = false;
				targettingLargest = false;
			break;
			case "specific":
				target = this.target;
				isTargetting = true;
				targettingLargest = false;
			break;
			case "searchFor":
				target = largest;
				isTargetting = true;
				targettingLargest = true;
			break;
		}
	}
}