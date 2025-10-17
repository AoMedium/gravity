//smaller = greater stability, slower velocity; larger = lower stability, great velocity

var colors = ["#ffffff", "#ff7f75", "#ff4400", "#ff691f", "#ff9500", "#ffe100", "#93ff61", 
"#00ffa6", "#00aeff", "#5100ff", "#d900ff", "#ff0099"];

var planetColors = ["rgba(156, 99, 64", "rgba(145, 224, 255"];


var neutralTrailColor = "#fff";

{ //EntityType Data
	var dust = new EntityType("dust", 0, 5, 1);
		dust.draw = function(sX, sY, r) {
			dust.drawInnerGradient(sX, sY, r, [0, 1.5], [[0.1, "rgba(255,255,255,1)"], [0.3, "rgba(255,255,255,0.4)"], [1, "rgba(255,255,255,0)"]])
		}
		// dust.traceDetail = function(sX, sY, r) {
		// 	c.arc(sX , sY, (0.9 * r) * viewScale, 0, 2 * Math.PI);
		// }
		// dust.traceAura = function(sX, sY, r) {
		// 	dust.drawAura(sX, sY, r, [r * 1.5]);
		// 	//c.arc(sX , sY, (1.5 * r) * viewScale, 0, 2 * Math.PI);
		// }
	// var meteor = new EntityType("meteor", 20, 1);
	var roid = new EntityType("roid", 10, 2, 1);
		roid.draw = function(sX, sY, r, angleInfo) {
			roid.drawBody(sX, sY, r);
			roid.drawShading(sX, sY, r, angleInfo);
		}

	var dwarf_planet = new EntityType("dwarf planet", 50, 4, 10);
		dwarf_planet.draw = function(sX, sY, r, angleInfo, color) {
			dwarf_planet.drawAtmosphere(sX, sY, r, 1, color);
			dwarf_planet.drawBody(sX, sY, r, color);
			dwarf_planet.drawShading(sX, sY, r, angleInfo, 1, true);

			
		}
		// dwarf_planet.traceAura = function(sX, sY, r) {
		// 	dwarf_planet.drawAura(sX, sY, r, [r + 0.2, r + 0.4, r + 0.5]);
		// }

	var terrestrial = new EntityType("terrestrial", 500, 5, 6);
		terrestrial.draw = function(sX, sY, r, angleInfo, color) {
			terrestrial.drawAtmosphere(sX, sY, r, 2, color);
			terrestrial.drawBody(sX, sY, r, color);
			//terrestrial.drawInnerGradient(sX, sY, r, [0.5, 1], [[0.9, "rgba(255,255,255,0.2"],[1, "rgba(255,255,255,1)"]]);
			terrestrial.drawShading(sX, sY, r, angleInfo, 2, true)
			
		}
		// terrestrial.traceAura = function(sX, sY, r) {
		// 	terrestrial.drawAura(sX, sY, r, [r + 0.4, r + 0.8, r + 1]);
		// }


	var gas_giant = new EntityType("gas giant", 10000, 1, 1);
		gas_giant.draw = function(sX, sY, r, angleInfo, color) {
			gas_giant.drawBody(sX, sY, r, color);
			gas_giant.drawShading(sX, sY, r, angleInfo);
		}
		// gas_giant.traceDetail = function(sX, sY, r) {
		// 	gas_giant.drawDetail(sX, sY, r, [0.875 * r, 0.7 * r, 0.3 * r]);
		// }

	var brown_dwarf = new EntityType("brown dwarf", 500000, 1.4, 4);
		brown_dwarf.draw = function(sX, sY, r) {
			brown_dwarf.drawBody(sX, sY, r);
		}
		// brown_dwarf.traceDetail = function(sX, sY, r) {
		// 	brown_dwarf.drawDetail(sX, sY, r, [r - r/2.5]);
		// 	c.beginPath();
		// 	c.arc(sX, sY, (r - r / 2.5) * viewScale, 0, 2 * Math.PI);
		// 	c.stroke();
		// }
		// brown_dwarf.traceAura = function(sX, sY, r) {
		// 	brown_dwarf.drawAura(sX, sY, r, [r + r / 4]);
		// }

	var star = new EntityType("star", 1000000, 1.4, 6);
		star.draw = function(sX, sY, r, angleInfo, color) {
			star.drawOuterGradient(sX, sY, r, color);
			star.drawInnerGradient(sX, sY, r, [0.4, 0.8], [[0, "rgba(255,255,255, 1)"],[1, color + ", 1)"]]);
		}
		


	var negative_matter = new EntityType("negative matter", 900000000, 100, 8.5);
		negative_matter.draw = function(sX, sY, r) {
			negative_matter.drawBody(sX, sY, r);
		}
		// negative_matter.traceAura = function(sX, sY, r) {
		// 	negative_matter.drawAura(sX, sY, r, negative_matter.scattering, [r + r/2, r + r * 2.5]);
		// }
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

function EntityType(typeName, massThreshold, density, scattering = 1) {
	this.typeName = typeName;
	this.massThreshold = massThreshold;
	this.density = density;
	this.scattering = scattering;

	this.draw = function() {}


	this.drawBody = function(sX, sY, r, color = "rgba(255,255,255") {

		c.beginPath();

		c.strokeStyle = outlineColor;
		c.fillStyle = color + ",1)";

		c.arc(sX, sY, r * viewScale, 0, 2 * Math.PI);

		if (nightMode) {
			c.fill();
		} else {
			c.fill();
			c.stroke();
		}
		c.closePath();
	}


	

	this.drawDetail = function(sX, sY, r, rDrawArray) {
		c.strokeStyle = outlineColor2;
		c.fillStyle = outlineColor2;
		for (var i = 0; i < rDrawArray.length; i++) {
			c.beginPath();
			c.arc(sX, sY, rDrawArray[i] * viewScale, 0, 2 * Math.PI);
			c.stroke();
		}
		c.closePath();
	}

	this.drawAura = function(sX, sY, r, rDrawArray, color = "rgba(255,255,255") {
		c.strokeStyle = color + ",1)";


		for (var i = 0; i < rDrawArray.length; i++) {
			var opacity = round(r / (rDrawArray[i] * this.scattering), 2);
			c.fillStyle = color + "," + opacity + ")";

			c.beginPath();
			c.arc(sX, sY, rDrawArray[i] * viewScale, 0, 2 * Math.PI);

			c.fill();
		}
		c.closePath();
	}

	this.drawOuterGradient = function(sX, sY, r, color) {
		var grd = c.createRadialGradient(sX, sY, 0, sX, sY, r * viewScale * 20);
		grd.addColorStop(0, color + ",0.9)");
		//grd.addColorStop(0.05, color + ",0.2)");
		grd.addColorStop(0.1, color + ",0.2)");
		grd.addColorStop(1, color + ",0)");


		c.fillStyle = grd;
		c.beginPath();
		c.arc(sX, sY, r * 20 * viewScale, 0, 2 * Math.PI);
		c.fill();
		c.closePath();
	}
	this.drawInnerGradient = function(sX, sY, r, rArray, grdArray) {
		var grd = c.createRadialGradient(sX, sY, r * viewScale * rArray[0], sX, sY, r * viewScale * rArray[1]);

		for (var i = 0; i < grdArray.length; i++) {
			grd.addColorStop(grdArray[i][0], grdArray[i][1]);
		}
		
		c.beginPath();
		c.arc(sX, sY, r * viewScale * rArray[1], 0, 2 * Math.PI);
		c.fillStyle = grd;
		c.fill();
		c.closePath();
	}

	this.drawAtmosphere = function(sX, sY, r, thickness, color = "rgba(145, 224, 255") {
		var grd = c.createRadialGradient(sX, sY, r * viewScale, sX, sY, (r + thickness) * viewScale);
		grd.addColorStop(0, color + ", 1)");
		grd.addColorStop(0.15, color + ", 0.25)");
		grd.addColorStop(1, color + ", 0)");

		c.fillStyle = grd;
		c.beginPath();
		c.arc(sX, sY, (r + thickness) * viewScale, 0, Math.PI * 2);
		c.fill();
		c.closePath();
	}

	this.drawShading = function(sX, sY, r, angleInfo, thickness = 1, hasAtmosphere = false) {
		if (angleInfo == "none") {
			return;
		} else if (angleInfo == undefined) {
			var grd = c.createRadialGradient(sX, sY, 0, sX, sY, r * viewScale);
			grd.addColorStop(0.3, "rgba(0,0,0,0)");
			grd.addColorStop(1, "rgba(0,0,0,0.4)");
		} else {
			var grd = c.createLinearGradient(sX + r * angleInfo[0] * viewScale, sY + r * angleInfo[1] * viewScale, sX - r * angleInfo[0] * viewScale, sY - r * angleInfo[1] * viewScale); //first try???
			grd.addColorStop(0, "rgba(0,0,0," + angleInfo[2] / 200000 + ")"); //(angleInfo[2] / 20000)
			grd.addColorStop(0.55, "rgba(0,0,0,0.95)");
		}
		

		c.beginPath();

		if (fadeAtmosphere) {
			c.arc(sX, sY, (r + thickness) * viewScale, 0, Math.PI * 2); // + 0.5 to remove white spots in shade area due to drawBody
		} else {
			if (hasAtmosphere) {
				c.arc(sX, sY, r * viewScale, 0, Math.PI * 2);
			} else {
				c.arc(sX, sY, r * viewScale + 0.5, 0, Math.PI * 2); // + 0.5 to remove white spots in shade area due to drawBody
			}
			
		}
		
		c.fillStyle = grd;
		c.fill();
		c.closePath();
	}
}






var sol_alpha = new EntitySystem("sol_alpha")

	var AU = 5000;


	sol_alpha.gVal = 0.0001;
	sol_alpha.viewScale = 16; //0.05
	sol_alpha.center = "Sol Alpha"

	//sol_alpha.alignType = "align:equidistant";
	//sol_alpha.alignAngle = -1/4;

	sol_alpha.entityCap = 10;

	//sol_alpha.spawnRoids = true;
	sol_alpha.spawnRadius = AU * 2.8;
	sol_alpha.spawnRange = AU * 1.2;
	sol_alpha.cullRange = AU * 50;

	sol_alpha.coloringMode = "colormode:assigned"
	sol_alpha.targetPrefType = "target:specific";
	sol_alpha.target = "Terra"


	sol_alpha.initSystemObjects = function() {
		var Sol_Alpha = new PrimaryObject("f", "Sol Alpha", 59600000, [0,0], [0,0]); //decrease G and increase Sol m
			Sol_Alpha.primaryColor = "#fff";
			Sol_Alpha.temperature = 5700;

		var Kas = new PrimaryObject("o", "Kas", 55, AU * 0.387); //using var kas is the same as using this.kas in the function as private var
			Kas.primaryColor = "#aaa";
			Kas.planetColor = "rgba(151, 151, 159"

		var Ayca = new PrimaryObject("o", "Ayca", 815, AU * 0.723);
			Ayca.primaryColor = "#ff9d00";
			Ayca.planetColor = "rgba(230, 219, 174"

		var Terra = new PrimaryObject("o", "Terra", 1000, AU);
			Terra.primaryColor = "#00aeff";
			Terra.planetColor = "rgba(0, 129, 189"

			var Muna = new PrimaryObject("o", "Muna", 12, AU / 152);
				Muna.center = "Terra";

		var Jaen = new PrimaryObject("o", "Jaen", 110, AU * 1.524);
			Jaen.primaryColor = "#ff4400";
			Jaen.planetColor = "rgba(226, 123, 88"

			var Ryin = new PrimaryObject("o", "Ryin", 3, 10);
				Ryin.center = "Jaen";

			var Wira = new PrimaryObject("o", "Wira", 6, 25);
				Wira.center = "Jaen";


		var Veida = new PrimaryObject("o", "Veida", 40, AU * 2.8);
			Veida.primaryColor = "#aaa";


		var Muerin = new PrimaryObject("o", "Muerin", 317800, AU * 5.203);
			Muerin.primaryColor = "#ffcb00";
			Muerin.planetColor = "rgba(200, 139, 58"

			var Leio = new PrimaryObject("o", "Leio", 10, 300);
				Leio.center = "Muerin";

			var Rea = new PrimaryObject("o", "Rea", 17, 550);
				Rea.center = "Muerin";

			var Mi = new PrimaryObject("o", "Mi", 12, 1000);
				Mi.center = "Muerin";


		var Iomus = new PrimaryObject("o", "Iomus", 95200, AU * 9.529);
			Iomus.primaryColor = "#fffbad";
			Iomus.planetColor = "rgba(195, 161, 113"

			var Tyir = new PrimaryObject("o", "Tyir", 130, 500);
				Tyir.center = "Iomus";
				Tyir.isClockwise = true;

				var Keun = new PrimaryObject("o", "Keun", 8, 30);
					Keun.center = "Tyir";

			var Geuri = new PrimaryObject("o", "Geuri", 30, 1200);
				Geuri.center = "Iomus";

		var Hera = new PrimaryObject("o", "Hera", 14600, AU * 19.19);
			Hera.primaryColor = "#00ffd9";
			Hera.planetColor = "rgba(187, 225, 228"

			var Sena = new PrimaryObject("o", "Sena", 19, 800);
				Sena.center = "Hera";

			var Daes = new PrimaryObject("o", "Daes", 19, 800);
				Daes.center = "Hera";

		var Mei = new PrimaryObject("o", "Mei", 17200, AU * 30.06);
			Mei.primaryColor = "#0400ff";
			Mei.planetColor = "rgba(62, 84, 232"

		var Sera = new PrimaryObject("f", "Sera", 20, [30000, 0], [0, -0.1]);



		sol_alpha.entities = [
			Sol_Alpha, 
			Kas, 
			Ayca, 
			Terra, Muna,
			Jaen, Ryin, Wira,

			Veida, 

			Muerin, Leio, Mi, Rea,

			Iomus, Tyir, Keun, Geuri,
			Hera, Sena,
			Mei, 

			Sera,
		];
	}

	//sol_alpha.initSystemObjects(); //is this needed?


var sol_beta = new EntitySystem("sol_beta");

	sol_beta.gVal = 0.01;
	sol_beta.viewScale = 0.05; //0.05
	sol_beta.center = "Sol Beta A"

	sol_beta.cullRange = AU * 40

	sol_beta.coloringMode = "colormode:sequential";
	sol_beta.targetPrefType = "target:specific";
	sol_beta.target = "Verza";

	//sol_beta.alignType = "align:oneside";


	sol_beta.initSystemObjects = function() {

		var Sol_Beta_A = new PrimaryObject("f", "Sol Beta A", 8240000, [-AU * 0, AU * 0], [0,0]); //35, 25
		var Sol_Beta_B = new PrimaryObject("o", "Sol Beta B", 115000, AU * 0.5);
			Sol_Beta_B.type = star;
			Sol_Beta_B.typeFixed = true;

		var SB_a = new PrimaryObject("o", "SB-a", 124, AU * 1.1);
		var SB_b = new PrimaryObject("o", "SB-b", 600, AU * 1.8);
		var SB_c = new PrimaryObject("o", "SB-c", 3400, AU * 3);
		var SB_d = new PrimaryObject("o", "SB-d", 230, AU * 5);
		var SB_e = new PrimaryObject("o", "SB-e", 23, AU * 7);

		var Miena = new PrimaryObject("f", "Miena", 7519000, [-AU * 40, -AU * 45], [0,0]);

		var Verza = new PrimaryObject("f", "Verza", 14134000, [AU * 30, -AU * 20], [0,0]);
			//Verza.center = "Sol Beta Major"
			var VZ_a = new PrimaryObject("o", "VZ-a", 230, AU * 0.5);
					VZ_a.center = "Verza";
					VZ_a.isPrimary = true;

			var VZ_b = new PrimaryObject("o", "VZ-b", 400, AU * 0.95);
				VZ_b.center = "Verza";
				VZ_b.isPrimary = true;

			var VZ_c = new PrimaryObject("o", "VZ-c", 9300, AU * 2.3);
				VZ_c.center = "Verza";
				VZ_c.isPrimary = true;


			var VZ_d = new PrimaryObject("o", "VZ-d", 23700, AU * 5.6);
				VZ_d.center = "Verza";
				VZ_d.isPrimary = true;

		sol_beta.entities = [
			Sol_Beta_A, Sol_Beta_B,

			SB_a, SB_b, SB_c, SB_d, SB_e,

			Miena,

			Verza, VZ_a, VZ_b, VZ_c, VZ_d //SB5
		];
	}

var sol_duo = new EntitySystem("sol_duo");

	sol_duo.gVal = 0.05;
	sol_duo.typeScale = 0.001;
	sol_duo.checkTypeDensity = false;

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

			Duo_2b, //Duo_4, Duo_5,


		];

		console.log(sol_duo.entities)
	}


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
	orbit_sim.checkTypeDensity = false;

	orbit_sim.targetPrefType = "sol";


var proto_sol = new EntitySystem("proto_sol");

	proto_sol.center = "Proto Sol";
	proto_sol.spawnRoids = true;
	proto_sol.spawnRadius = 400;
	proto_sol.spawnRange = 1000;
	proto_sol.cullRange = 15000;
	proto_sol.entityCap = 200;
	
	proto_sol.typeScale = 0.1;

	proto_sol.initSystemObjects = function() {
		proto_sol.entities = [new PrimaryObject("f", "Proto Sol", 100000, [0,0], [0,0])];
	}


var owo_system = new EntitySystem("owo_system");

	owo_system.center = "OwO";
	owo_system.typeScale = 0.001;
	owo_system.checkTypeDensity = false;

	owo_system.initSystemObjects = function() {
		var OwO = new PrimaryObject("f", "OwO", 2000, [0,0], [0,0]);
		var UwU = new PrimaryObject("o", "UwU", 80, 300, 0);
		var OvO = new PrimaryObject("o", "OvO", 80, 300, -Math.PI);
		var UmU = new PrimaryObject("o", "UmU", 80, 300, Math.PI / 2);
		var OmO = new PrimaryObject("o", "OmO", 80, 300, -Math.PI / 2);

		owo_system.entities = [OwO, UwU, OvO, UmU, OmO];
	}



var cannon_system = new EntitySystem("cannon_system");

	cannon_system.checkTypeDensity = false;

	cannon_system.initSystemObjects = function() {
		cannon_system.entities = [
			new PrimaryObject("f", "cannon1", 100000, [0,-70], [0,0], true),
			new PrimaryObject("f", "cannon2", 100000, [0,70], [0,0], true),
			new PrimaryObject("f", "cannon3", 10000, [0,-20], [0,0], true),
			new PrimaryObject("f", "cannon4", 10000, [0,20], [0,0], true),
			new PrimaryObject("f", "ball", 12, [-500,0], [0,0])
		];
	}

var test_system = new EntitySystem("test_system");

	test_system.gVal = 0.01;
	test_system.viewScale = 1.95;
	test_system.targetPrefType = "target:specific";
	test_system.target = "Test Planet"

	test_system.initSystemObjects = function() {

		var Test_Core = new PrimaryObject("f", "Test Core", 5000, [10,5], [0,0]);
		//Test_Core.fixed = true;
		var Test_Planet = new PrimaryObject("o", "Test Planet", 100, 100);
		Test_Planet.center = "Test Core";
		Test_Planet.isPrimary = true;
		Test_Planet.isClockwise = true;

		test_system.entities = [
			Test_Core, Test_Planet
			];
	}

var isolated_system = new EntitySystem("isolated_system");
	isolated_system.spawnRoids = true;
	isolated_system.entityCap = 200;
	isolated_system.spawnRange = 500;
	isolated_system.gVal = 0.005;

	isolated_system.targetPrefType = "target:searchFor";






var systems = [sol_alpha, sol_beta, sol_duo, orbit_sim, owo_system, cannon_system, test_system, proto_sol, isolated_system];


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
	this.typeFixed;
	this.isPrimary; //autoassigned
	this.primaryColor;

	this.temperature;

	this.planetColor;
}


function EntitySystem(systemName = "untitled_system") {
	this.systemName = systemName;
	this.center = undefined;

	this.gVal = 0.005;
	this.viewScale = 0.5;

	this.entities = []; //replacing freeEntities and orbitalEntities

	this.primaryID = []; //for target selection
	this.coloringMode; //coloring mode

	this.alignType;
	this.alignAngle = 0;

	this.spawnRoids = false;
	this.spawnRadius = 0;
	this.spawnRange = 1000; //must go before below else not init
	this.cullRange = this.spawnRange * 2;
	this.entityCap = 10;


	this.testForScale = true;
	this.typeScale = 1;
	this.checkTypeDensity = true;

	this.targetPrefType = "target:free";

	this.initSystemObjects = function() {};	

	this.generateSystem = function() {
		var colorCount = 0;
		var equidistantSep = 500;


		if (this.entities != undefined) {
			for (var i = 0; i < this.entities.length; i++) {


				if (this.center == this.entities[i].id) {
					//console.log("center " + this.center);
					this.centerMass = this.entities[i].mass;
					this.centerX = this.entities[i].pos[0];
					this.centerY = this.entities[i].pos[1];
					this.centerDX = this.entities[i].v[0];
					this.centerDY = this.entities[i].v[1];
				}

				
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

							if (colorCount < colors.length - 1) {
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

						if (this.entities[i].isPrimary == undefined) {
							this.entities[i].isPrimary = true;
						}

						createNew(
							this.entities[i].id,
							this.entities[i].mass,
							this.entities[i].pos[0],
							this.entities[i].pos[1],
							this.entities[i].v[0],
							this.entities[i].v[1],
							this.entities[i].fixed,
							this.entities[i].type,
							this.entities[i].typeFixed,
							this.entities[i].isPrimary,
							this.entities[i].primaryColor,
							this.entities[i].planetColor,
							this.entities[i].temperature,
							
						);
					break;

					case "o":

						//console.log(this.entities[i].id + " " + this.entities[i].isPrimary);
						//console.log(this.entities[i].id + " " + this.entities[i].center + " " + this.center);
						if (this.entities[i].center != undefined && this.entities[i].isPrimary == undefined) { //is a moon
							this.entities[i].isPrimary = false;
						} else {
							this.entities[i].isPrimary = true;
						}

						if (this.entities[i].angle == undefined) { //angle
							switch (this.alignType) {
								case "align:oneside":
									this.entities[i].angle = this.alignAngle * Math.PI;
								break;
								case "align:twoside":
									this.entities[i].angle = (this.alignAngle + angleCount) * Math.PI;
									angleCount++;
								break;
								case "align:equidistant":
									this.entities[i].angle = this.alignAngle * Math.PI;
									if (this.center != undefined) {
										this.entities[i].radius = i * equidistantSep;
										this.entities[i].center = this.center;
										//console.log(this.entities[i].id + " " + i + " " + this.entities[i].radius);
										//console.log(this.entities[i].isPrimary);
									}
								break; //undefined is defined in actual create function
							}
						}

						//console.log(this.entities[i].id + " " + this.entities[i].isPrimary);

						createNewOrbit(
							this.entities[i].id,
							this.entities[i].mass,
							this.entities[i].radius,
							this.entities[i].angle,
							this.entities[i].center,
							this.entities[i].isClockwise,
							this.entities[i].type,
							this.entities[i].typeFixed,
							this.entities[i].isPrimary,
							this.entities[i].primaryColor,
							this.entities[i].planetColor,
							this.entities[i].temperature,
						);
						//console.log(this.entities[i].id + " " + this.entities[i].center)
					break;
				}

				this.primaryID.push(this.entities[i].id);
				
			}
		}
	}

	this.applyTargetPref = function() {
		switch (this.targetPrefType) {
			case "target:sol":
				target.id = this.center;
				isTargetting = true;
				targettingLargest = false;
			break;
			case "target:free":
				target.id = "no target";
				isTargetting = false;
				targettingLargest = false;
			break;
			case "target:specific":
				target.id = this.target;
				isTargetting = true;
				targettingLargest = false;
			break;
			case "target:searchFor":
				target.id = largest;
				isTargetting = true;
				targettingLargest = true;
			break;
		}
	}
}