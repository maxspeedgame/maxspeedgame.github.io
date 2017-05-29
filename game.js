var FPS = 60;
var startSpeed = 1;
var maxSpeed = 6;
var blockSpeedMult = 2;
var blockStartPos = -5;
var blockEndPos = 88;
var blockCheckPos = 69;
var startKMH = 100;
var maxKMH = 1079000000;
var startHP = 3;
var speedIncrPerSecond = 0.032;
var ECarPosition = {
	MID: 46,
	LEFT: 42,
	RIGHT: 50
}
var EBlockPosition = {
	LEFT: 44,
	RIGHT: 50
}

var kmh = 0;
var distance = 0;
var timePerFrame = 0;
var carPos;
var blockHPos;
var blockVPos;
var showBlock = false;
var collisionCheckFlag = false;
var increments = 0;
var speed = 0;
var hp = 3;
var mainInterval;
var achievements = new Array();
var playing = false;
var roadFrames = new Array();

function start() {
	preloadImages();
	document.getElementById("instrDiv").style.display = "none";
	playing = true;
	carPos = ECarPosition.MID;
	timePerFrame = 1 / FPS * 1000;
	speed = startSpeed;
	kmh = startKMH;
	resetBlock();
	mainInterval = setInterval(function () {
			mainLoop();
		}, timePerFrame);
}

function mainLoop() {
	distance += speed;
	setRoadFrame(Math.round(distance));
	document.getElementById("car").style.left = carPos + "%";
	document.getElementById("speedometer").innerHTML = speedDisplay();
	document.getElementById("hp").innerHTML = hpDisplay();
	if (showBlock) {
		document.getElementById("block").style.display = "block";
		blockVPos += speed * blockSpeedMult;
		document.getElementById("block").style.top = blockVPos + "%";
		if (blockVPos >= blockCheckPos && !collisionCheckFlag) {
			collisionCheckFlag = true;
			passBlock();
		}
		if (showBlock && blockVPos >= blockEndPos) {
			resetBlock();
		}
	} else {
		document.getElementById("block").style.display = "none";
	}
	increaseKMH();
	increaseSpeed();
	checkAchievements();
}

function preloadImages(){
					for (i = 0; i < 13; i++) {
					roadFrames[i] = new Image()
					roadFrames[i].src = "assets/roadFrames/"+i+".png";
				}
}

function increaseSpeed() {
	if (speed < maxSpeed) {
		speed += speedIncrPerSecond / FPS;
	}
}
function increaseKMH() {
	if (kmh < maxKMH) {
		kmh += 1;
	}
}

function setRoadFrame(pos) {
	document.getElementById("road").src = "assets/roadFrames/"+pos%13+".png";
}

function setBlockPos() {
	var randomPos = Math.random();
	if (randomPos >= 0.5) {
		blockHPos = EBlockPosition.LEFT
	} else {
		blockHPos = EBlockPosition.RIGHT;
	}
	document.getElementById("block").style.left = blockHPos + "%";
	blockVPos = blockStartPos;
	showBlock = true;
	collisionCheckFlag = false;
}

function speedDisplay() {
	if (kmh < 1233) {
		return Math.round(kmh) + " KM/H";
	} else if (kmh < 30825) {
		return "Mach " + (kmh / 1233).toFixed(1);
	} else if (kmh < 10790000) {
		return Math.round(kmh / 3600) + " KM/S";
	}
	return (kmh / 1079000000).toFixed(2) + "c";
}

function hpDisplay() {
	return Math.round((hp / startHP) * 100) + "%";
}

function passBlock() {
	if ((blockHPos == EBlockPosition.LEFT && carPos == ECarPosition.LEFT) || (blockHPos == EBlockPosition.RIGHT && carPos == ECarPosition.RIGHT) || carPos == ECarPosition.MID) {
		damage();
	}
}

function resetBlock() {
	showBlock = false;
	document.getElementById("block").style.display = "none";
	window.setTimeout("setBlockPos()", 1500);
}

function damage() {
	hp--;
	document.getElementById("hp").innerHTML = hpDisplay();
	if (hp <= 0) {
		document.getElementById("crash").play();
		die();
	} else {
		document.getElementById("crack").play();
	}
}

function die() {
	clearInterval(mainInterval);
	document.getElementById("goDiv").style.display = "block";
	document.getElementById("finalText").innerHTML = "Final speed: " + speedDisplay() + "<br>Press Space to try again";
	for (var i = 0; i < 6; i++) {
		if (achievements[i] == true) {
			document.getElementById("medal" + i).src = "assets/medal" + i + ".png";
		}
	}
	playing = false;
}

function resetGame() {
	document.getElementById("block").style.display = "none";
	document.getElementById("goDiv").style.display = "none";
	for (var i = 0; i < 6; i++) {
		achievements[i] = false;
		document.getElementById("medal" + i).src = "assets/medal_base_locked.png";
	}
	hp = startHP;
	kmh = startKMH;
	speed = startSpeed;
	start();
}

function checkAchievements() {
	if (kmh >= 1233) {
		achievements[0] = true;
	}
	if (kmh >= 4069) {
		achievements[1] = true;
	}
	if (kmh >= 6165) {
		achievements[2] = true;
	}
	if (kmh >= 40300) {
		achievements[3] = true;
	}
	if (kmh >= 10790000) {
		achievements[4] = true;
	}
	if (kmh >= 1079000000) {
		achievements[5] = true;
	}
}
document.onkeydown = onKey;
function onKey(e) {
	switch (e.which || e.charCode || e.keyCode) {
	case 37: //left
		carPos = ECarPosition.LEFT;
		break;
	case 39: //right
		carPos = ECarPosition.RIGHT;
		break;
	case 32:
		if (!playing) {
			resetGame();
		}
		break;
	}

}
function share(){
	FB.ui({
    method: 'share',
    display: 'popup',
    href: 'https://maxspeedgame.github.io/', 
	quote: "I went " + kmh + " Km/h, how fast are you?",
  }, function(response){});
}