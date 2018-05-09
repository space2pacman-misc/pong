var resolution = {x: true, y: true};
var gameTimer;

var field = new createObject(".field");
var ball = new createObject(".ball");
var player = new createObject(".player");
var bot = new createObject(".bot");

var game = {
	object: function() {
		var shadow = document.querySelector(".shadow");
		return shadow;
	},
	start: function() {
		gameTimer = setInterval(startGame, this.speed);

	},
	stop: function() {
		clearInterval(gameTimer);
		this.object().style.display = "block";
	},
	clearObject: function() {
		this.object().style.display = "none";
	},
	speed: 10,
	status: true
}

// PLAYER

player.pos = {
	y: 0
}

player.step = 1;

player.height = function() {
	return this.el.offsetHeight;
}

player.width = function() {
	return this.el.offsetWidth;
}

player.move = function(value) {
	switch(value) {
		case "up":
			if(this.pos.y == 0) return
			this.pos.y -= this.step;
			break;
		case "down":
			var difference = (this.height() * 100 / field.height()).toFixed();

			if(this.pos.y == 100 - difference) return
			this.pos.y += this.step;
			break;
	}
	this.el.style.top = this.pos.y + "%";
}

// BOT

bot.pos = {
	y: 0
}

bot.step = 1;

bot.speed = 10;

bot.height = function() {
	return this.el.offsetHeight;
}

bot.width = function() {
	return this.el.offsetWidth;
}

bot.setPos = function() {
	this.el.style.top = this.pos.y + "%";
}

bot.move = function() {
		if (ball.pos.y - ball.height() > 75) {
			bot.pos.y = 75;
			bot.setPos();
		} else if (ball.pos.y - ball.height() <= 0) {
			bot.pos.y = 0;
			bot.setPos();
		} else {
			bot.pos.y = ball.pos.y - ball.height();
			bot.setPos();	
		}
}

bot.start = function() {
	setInterval(this.move, this.speed);
}


// BALL

ball.pos = {
	x: 0,
	y: 0
}

ball.angel = 0.5;

ball.setStartPosition = function() {
	this.pos.x = field.width() / 2;
	this.pos.y = 50;
	this.move();
}

ball.move = function() {
	this.el.style.left = this.pos.x + "px";
	this.el.style.top = this.pos.y + "%";
}

ball.width = function() {
	return this.el.offsetWidth;
}

ball.height = function() {
	return this.el.offsetHeight;
}

ball.checkPos = function(coordinate, side) {
	// Высота field минус высота ball конвертируем в проценты
	var heightInPercent = +((field[side]() - ball.height()) / field[side]() * 100).toFixed();
	var value = (coordinate == "y") ? heightInPercent : field[side]();
	var step = (coordinate == "y") ? 1 * ball.angel : 1;

	if (ball.pos[coordinate] < value && resolution[coordinate]) {
		ball.pos[coordinate] += step;
		//
		if (ball.pos[coordinate].toFixed() == value) {
			resolution[coordinate] = false;
		}
	}
	if (!resolution[coordinate]) {
		ball.pos[coordinate] -= step;
		//
		if(ball.pos[coordinate].toFixed() <= 0 ) {
			resolution[coordinate] = true;
		}
	}
}

ball.checkZone = function() {
	var fieldWidth = field.width() - ball.width() - bot.width() - 2; // 2px из-за рамки
	var playerHeight = player.height() * 100 / field.height();
	var botHeight = bot.height() * 100 / field.height();

	// Проверка столкновения с платформой player
	if(ball.pos.y > player.pos.y && ball.pos.y < player.pos.y + playerHeight && ball.pos.x == player.width()) {
		ball.pos.x = player.width();
		resolution.x = true;
		
		//ball.angel = +((ball.pos.y - player.pos.y) / 10).toFixed();
	}
	// Проверка столкновения с платформой bot
	if(ball.pos.y > bot.pos.y && ball.pos.y < bot.pos.y + botHeight && ball.pos.x == fieldWidth) {
		ball.pos.x = fieldWidth;
		resolution.x = false;
	}
	// Проверка столкновения с краями поля field
	if (ball.pos.x == 0 || ball.pos.x == field.width()) {
		//game.stop();
		game.status = true;
	}
}

// FIELD

field.width = function() {
	return this.el.offsetWidth;
}

field.height = function() {
	return this.el.offsetHeight;
}

// CONSTRUCTION

function createObject(el) {
	this.el = document.querySelector(el);
}

function startGame() {
	ball.checkPos("x","width");
	ball.checkPos("y","height");
	ball.checkZone();
	ball.move();
}

document.addEventListener("keydown", function(e) {
	switch(e.keyCode) {
		case 38:
			player.move("up");
			break;
		case 40:
			player.move("down");
			break;
		case 32:
			if(game.status) {
				game.clearObject();
				game.start();
				bot.start();
				game.status = false;
			}
			break;
	}
})

ball.setStartPosition();