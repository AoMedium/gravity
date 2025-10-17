var G = 0.005; //smaller = greater stability, slower velocity; larger = lower stability, great velocity

var colors = ["#fff", "#ff4400", "#ff9500", //"#ffe100", "#6fff00", 
"#00ffa6", "#00aeff", "#5100ff", "#d900ff", "#ff0099"];


var neutralTrailColor = "#555";

{ //EntityType Data
	var dust = new EntityType("dust", 0, 5);
		dust.traceDetail = function(sX, sY, r) {
			c.arc(sX , sY, (0.9 * r) * viewScale.val, 0, 2 * Math.PI);
		}
		dust.traceAura = function(sX, sY, r) {
			c.arc(sX , sY, (1.5 * r) * viewScale.val, 0, 2 * Math.PI);
		}
	// var meteor = new EntityType("meteor", 20, 1);
	var roid = new EntityType("roid", 10, 2);
		roid.traceDetail = function() {
			//console.log("roid");
		}

	var dwarf_planet = new EntityType("dwarf_planet", 50, 4);
		dwarf_planet.traceAura = function(sX, sY, r) {
			c.arc(sX , sY, (r + 0.5) * viewScale.val, 0, 2 * Math.PI);
		}

	var terrestrial = new EntityType("terrestrial", 500, 5);
		dwarf_planet.traceAura = function(sX, sY, r) {
			c.arc(sX , sY, (r + 1.5) * viewScale.val, 0, 2 * Math.PI);
		}


	var gas_giant = new EntityType("gas_giant", 10000, 1);
		gas_giant.traceDetail = function(sX, sY, r) {
			c.arc(sX , sY, (0.875 * r) * viewScale.val, 0, 2 * Math.PI);
			c.stroke();
			c.beginPath();
			c.arc(sX , sY, (0.7 * r) * viewScale.val, 0, 2 * Math.PI);
			c.stroke();
			c.beginPath();
			c.arc(sX , sY, (0.3 * r) * viewScale.val, 0, 2 * Math.PI);
		}

	var brown_dwarf = new EntityType("brown_dwarf", 500000, 1.4);
		brown_dwarf.traceDetail = function(sX, sY, r) {
			c.arc(sX, sY, (r - r / 2.5) * viewScale.val, 0, 2 * Math.PI);
		}
		brown_dwarf.traceAura = function(sX, sY, r) {
			c.arc(sX, sY, (r + r / 4) * viewScale.val, 0, 2 * Math.PI);
		}

	var star = new EntityType("star", 1000000, 1.4);
		star.traceAura = function(sX, sY, r) {
			c.arc(sX , sY, (1.15 * r) * viewScale.val, 0, 2 * Math.PI);
			c.stroke();
			c.beginPath();
			c.arc(sX , sY, (1.6 * r) * viewScale.val, 0, 2 * Math.PI);
		}


	var negative_matter = new EntityType("negative_matter", 900000000, 100);
		negative_matter.traceAura = function(sX, sY, r) {
			c.arc(sX , sY, (r + r / 2) * viewScale.val, 0, 2 * Math.PI);
			c.stroke();
			c.beginPath();
			c.arc(sX , sY, (r + r * 2.5) * viewScale.val, 0, 2 * Math.PI);
		}
}

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

	this.traceDetail = function() {}; //assigned individually; still needs stroke or fill
	this.traceAura = function() {};

	// this.draw = function() {
	// 	switch (this.typeName) {

	// 	}
	// }
}






var sol_alpha = new EntitySystem("sol_alpha")

	var AU = 5000;


	sol_alpha.gVal = 0.005;
	sol_alpha.viewScale = 0.02; //0.05
	sol_alpha.center = "Sol"

	//sol_alpha.alignType = 1;
	//sol_alpha.alignAngle = -1/4;

	sol_alpha.entityCap = 10;

	//sol_alpha.spawnRoids = true;
	sol_alpha.spawnRadius = AU * 2.8;
	sol_alpha.spawnRange = AU * 1.2;
	sol_alpha.cullRange = AU * 50;

	sol_alpha.targetPrefType = "target:specific";
	sol_alpha.target = "Sol";

	sol_alpha.coloringMode = "colormode:assigned"


	sol_alpha.initSystemObjects = function() {
		var Sol_Alpha = new PrimaryObject("f", "Sol", 59600000, [0,0], [0,0]); //decrease G and increase Sol m
			Sol_Alpha.primaryColor = "#fff";

		var Kas = new PrimaryObject("o", "Kas", 55, AU * 0.387); //using var kas is the same as using this.kas in the function as private var
			Kas.primaryColor = "#aaa";

		var Ayca = new PrimaryObject("o", "Ayca", 815, AU * 0.723);
			Ayca.primaryColor = "#ff9d00";

		var Terra = new PrimaryObject("o", "Terra", 1000, AU);
			Terra.primaryColor = "#00aeff";

			var Muna = new PrimaryObject("o", "Muna", 12, AU / 82);
				Muna.center = "Terra";

		var Jaen = new PrimaryObject("o", "Jaen", 110, AU * 1.524);
			Jaen.primaryColor = "#ff4400";

			var Ryin = new PrimaryObject("o", "Ryin", 3, 20);
				Ryin.center = "Jaen";

			var Wira = new PrimaryObject("o", "Wira", 6, 50);
				Wira.center = "Jaen";


		var Veida = new PrimaryObject("o", "Veida", 40, AU * 2.8);
			Veida.primaryColor = "#aaa";


		var Muerin = new PrimaryObject("o", "Muerin", 317800, AU * 5.203);
			Muerin.primaryColor = "#ffcb00";

			var Leio = new PrimaryObject("o", "Leio", 10, 300);
				Leio.center = "Muerin";

			var Rea = new PrimaryObject("o", "Rea", 17, 550);
				Rea.center = "Muerin";

			var Mi = new PrimaryObject("o", "Mi", 12, 1000);
				Mi.center = "Muerin";


		var Iomus = new PrimaryObject("o", "Iomus", 95200, AU * 9.529);
			Iomus.primaryColor = "#fffbad";

			var Tyir = new PrimaryObject("o", "Tyir", 130, 500);
				Tyir.center = "Iomus";

			var Geurin = new PrimaryObject("o", "Geurin", 30, 1200);
				Geurin.center = "Iomus";

		var Hera = new PrimaryObject("o", "Hera", 14600, AU * 19.19);
			Hera.primaryColor = "#00ffd9";

			var Sena = new PrimaryObject("o", "Sena", 19, 800);
				Sena.center = "Hera";

		var Mei = new PrimaryObject("o", "Mei", 17200, AU * 30.06);
			Mei.primaryColor = "#0400ff";

		var Sera = new PrimaryObject("f", "Sera", 20, [30000, 0], [-1, -1.5]);



		sol_alpha.entities = [
			Sol_Alpha, 
			Kas, 
			Ayca, 
			Terra, Muna, 
			Jaen, Ryin, Wira,

			Veida, 

			Muerin, Leio, Mi, Rea,

			Iomus, Tyir, Geurin,
			Hera, Sena,
			Mei, 

			Sera,
		];
	}

	sol_alpha.initSystemObjects();


var sol_beta = new EntitySystem("sol_beta");
	sol_beta.freeEntities = [];

var sol_duo = new EntitySystem("sol_duo");

	sol_duo.gVal = 0.05;
	sol_duo.typeScale = 0.005;
	sol_duo.typeDensity = false;

	sol_duo.coloringMode = "colormode:proportional"


	sol_duo.initSystemObjects = function() {

		var Duo_2b = new PrimaryObject("o", "Duo 2b", 11, 40);
			Duo_2b.center = "Duo 2a";

		var Duo_4 = new PrimaryObject("o", "Duo 4", 18, 30);
			Duo_4.center = "Sol C";

		var Duo_5 = new PrimaryObject("o", "Duo 5", 25, 90);
			Duo_5.center = "Sol C";

		sol_duo.entities = [
			new PrimaryObject("f", "Sol A", 1000, [-50,0], [0, 0.54]),
			new PrimaryObject("f", "Sol B", 1000, [50,0], [0, -0.54]),
			new PrimaryObject("f", "Sol C", 500, [-800,0], [0, -0.5]),
			new PrimaryObject("f", "Duo 1", 20, [200,0], [0, 0.7]),
			new PrimaryObject("f", "Duo 2a", 45, [0,450], [-0.57, 0]),
			new PrimaryObject("f", "Duo 3", 30, [0,-600], [0.4, 0]),

			Duo_2b, Duo_4, Duo_5,


		];
	}

	sol_duo.initSystemObjects();


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


//var kas = new PrimaryObject("kasLeak"); //testing, does not influence others


function PrimaryObject(motionType = "f", id, mass, p1, p2, p3, p4) {
	this.motionType = motionType; //f = free, o = orbit
	this.id = id;
	this.mass = mass;
	

	if (this.motionType == "o") {
		this.radius = p1;
		this.angle = p2;
		this.center = p3;
		this.isClockwise = p4;
	} else {
		this.pos = p1; //[]
		this.v = p2; //[]
		this.fixed = p3;
	}	

	this.type;
	this.isPrimary = true; //autoassigned
	this.primaryColor;
}


function EntitySystem(systemName = "untitled_system") {
	this.systemName = systemName;
	this.center = undefined;

	this.gVal = G;
	this.viewScale = 0.5;

	this.entities = []; //replacing freeEntities and orbitalEntities

	this.primaryID = []; //for target selection
	this.coloringMode; //coloring mode

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

	this.targetPrefType = "target:free";

	this.initSystemObjects = function() {};	

	this.generateSystem = function() {
		var colorCount = 0;

		G = this.gVal;

		if (this.entities != undefined) {
			for (var i = 0; i < this.entities.length; i++) {

				
				// if (this.entities[i].primaryColor == undefined) {

					switch (this.coloringMode) {
						case "colormode:assigned":
							if (this.entities[i].primaryColor == undefined) {
								this.entities[i].primaryColor = neutralTrailColor;
							}
							//per usual
						break;
						case "colormode:neutral":
							this.entities[i].primaryColor = neutralTrailColor;
						break;
						case "colormode:sequential":
							this.entities[i].primaryColor = colors[colorCount];

							if (colorCount < this.primaryColors.length - 1) {
								colorCount++;
							} else {
								colorCount = 0;
							}
						break;

						case "colormode:proportional":
							this.entities[i].primaryColor = colors[Math.round((colors.length - 1) * i / (this.entities.length - 1))];
						break;
					}
				//}				





				switch (this.entities[i].motionType) {
					case "f":
						createNew(
							this.entities[i].id,
							this.entities[i].mass,
							this.entities[i].pos[0],
							this.entities[i].pos[1],
							this.entities[i].v[0],
							this.entities[i].v[1],
							this.entities[i].fixed,
							this.entities[i].type,
							this.entities[i].isPrimary,
							this.entities[i].primaryColor
						);
					break;

					case "o":
						if (this.entities[i].angle == undefined) { //angle
							switch (this.alignType) {
								case 1:
									this.entities[i].angle = this.alignAngle * Math.PI;
								break;
								case 2:
									this.entities[i].angle = (this.alignAngle + angleCount) * Math.PI;
									angleCount++;
								break;
								default:
									this.entities[i].angle = Math.random() * Math.PI * 2;
								break;
							}
						}
						createNewOrbit(
							this.entities[i].id,
							this.entities[i].mass,
							this.entities[i].radius,
							this.entities[i].angle,
							this.entities[i].center,
							this.entities[i].isClockwise,
							this.entities[i].type,
							this.entities[i].isPrimary,
							this.entities[i].primaryColor
						);
					break;
				}

				this.primaryID.push(this.entities[i].id);
				

				if (this.center == this.entities[i].id) {
					//console.log("center " + this.center);
					this.centerMass = this.entities[i].mass;
					this.centerX = this.entities[i].pos[0];
					this.centerY = this.entities[i].pos[1];
					this.centerDX = this.entities[i].v[0];
					this.centerDY = this.entities[i].v[1];
				}
			}
		}
	}

	this.applyTargetPref = function() {
		switch (this.targetPrefType) {
			case "target:sol":
				target = this.center;
				isTargetting = true;
				targettingLargest = false;
			break;
			case "target:free":
				target = "no target";
				isTargetting = false;
				targettingLargest = false;
			break;
			case "target:specific":
				target = this.target;
				isTargetting = true;
				targettingLargest = false;
			break;
			case "target:searchFor":
				target = largest;
				isTargetting = true;
				targettingLargest = true;
			break;
		}
	}
}