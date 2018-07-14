var game = new Phaser.Game(
		800,
		600,
		Phaser.AUTO,
		'',
		{
			preload: preload,
			create: create,
			update: update
		}
	)
var ship;
var cursor;
function preload(){
	game.load.image("sky", "assets/invaders/sky.png")
	game.load.image("ship", "assets/invaders/player.png")
}

function create(){
	game.add.tileSprite(0, 0, 800, 600 ,'sky')
    ship = game.add.sprite(375, 300 ,'ship')
    game.physics.arcade.enable(ship)
    ship.body.collideWorldBounds = true;
    cursor = game.input.keyboard.createCursorKeys()
}

function update(){
	ship.body.velocity.x = 0;
	if(cursor.left.isDown){
		console.log("left pressed")
		ship.body.velocity.x = -25;
	}
	else if(cursor.right.isDown){
		console.log("right pressed")
		ship.body.velocity.x = +25;
	}
}
