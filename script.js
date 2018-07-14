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
var sky;
var fireButton;
function preload(){
	game.load.image("sky", "assets/invaders/sky.png")
	game.load.image("ship", "assets/invaders/player.png")
}

function create(){
	sky = game.add.tileSprite(0, 0, 800, 600 ,'sky')
    ship = game.add.sprite(400, 500 ,'ship')
    ship.anchor.setTo(0.5, 0.5)
    game.physics.arcade.enable(ship)
    ship.body.collideWorldBounds = true;
    cursor = game.input.keyboard.createCursorKeys()

    fireButton = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR)
}

function update(){
	sky.tilePosition.y += 2
	ship.body.velocity.x = 0;
	if(cursor.left.isDown){
		console.log("left pressed")
		ship.body.velocity.x = -75;
	}
	else if(cursor.right.isDown){
		console.log("right pressed")
		ship.body.velocity.x = +75;
	}
	if(fireButton.isDown){
		shipFire();
	}
}

 function shipFire(){
 	console.log("Bullet was fired")
 }