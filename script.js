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
var aliens;
var cursor;
var sky;
var fireButton;
var bullets;
var bulletTime = 0;

function preload(){
	game.load.image("sky", "assets/invaders/sky.png")
    game.load.image("ship", "assets/invaders/player.png")
    game.load.spritesheet("invader", "assets/invaders/invader32x32x4.png", 32, 32)
	game.load.image("bullet", "assets/invaders/bullet.png")
}

function create(){
	sky = game.add.tileSprite(0, 0, 800, 600 ,'sky')
    ship = game.add.sprite(400, 500 ,'ship')
    ship.anchor.setTo(0.5, 0.5)
    game.physics.arcade.enable(ship)
    ship.body.collideWorldBounds = true;
    cursor = game.input.keyboard.createCursorKeys()

    
    aliens = game.add.group();
    aliens.enableBody = true;
    aliens.physicsBodyType = Phaser.Physics.ARCADE;

    createAliens();
    bullets = game.add.group();
    bullets.enableBody = true;
    bullets.physicsBodyType = Phaser.Physics.ARCADE;
    bullets.createMultiple(30, 'bullet')
    bullets.setAll('anchor.x', 0.5)
    bullets.setAll('anchor.y', 1)

    bullets.setAll('checkWorldBounds', true);
    bullets.setAll('outOfBoundsKill', true);

    fireButton = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR)
}



function update(){
	sky.tilePosition.y += 2
	ship.body.velocity.x = 0;
	if(cursor.left.isDown){
		ship.body.velocity.x = -75;
	}
	else if(cursor.right.isDown){
		ship.body.velocity.x = +75;
	}
	if(fireButton.isDown){
		shipFire();
	}
}0

 function shipFire(){
 	if(game.time.now > bulletTime ){
 		bullet = bullets.getFirstExists(false)
 		if(bullet){
 			bullet.reset(ship.x, ship.y + 8);
 			bullet.body.velocity.y = -400;
 			bulletTime = game.time.now + 200;
 		}
 	}
 }

 function createAliens(){
    for(var y=0;y<4;y++){
        for(var x=0;x<10;x++){
            var alien=aliens.create(x*48,y*50,'invader');
            alien.anchor.setTo(0.5,0.5);
            alien.animations.add('fly',[0,1,2,3],20,true);
            alien.play('fly');
            alien.body.moves=false;
        }
    }
    aliens.x=100;
    aliens.y=50;
    var tween =game.add.tween(aliens).to({x:200},2000,Phaser.Easing.Linear.None,true,0,1000,true);
   /* tween.onLoop.add(descend,this);*/
}