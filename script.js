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
var enemyBullets;
var firingTimer = 0;
var enemyBullet;
var explosions;
var livingEnemies = [];
var lives;

function preload(){
	game.load.image("sky", "assets/invaders/sky.png")
    game.load.image("ship", "assets/invaders/player.png")
    game.load.spritesheet("invader", "assets/invaders/invader32x32x4.png", 32, 32)
	game.load.image("bullet", "assets/invaders/bullet.png")
	game.load.image("enemyBullet", "assets/invaders/enemy-bullet.png")
	game.load.spritesheet("kaboom", "assets/invaders/explode.png", 128, 128)
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

    enemyBullets = game.add.group();
    enemyBullets.enableBody = true;
    enemyBullets.physicsBodyType = Phaser.Physics.ARCADE;
    enemyBullets.createMultiple(30, 'enemyBullet');
    enemyBullets.setAll('anchor.x', 0.5);
    enemyBullets.setAll('anchor.y', 1);
    enemyBullets.setAll('outOfBoundsKill', true);
    enemyBullets.setAll('checkWorldBounds', true);

    explosions = game.add.group();
    explosions.createMultiple(30, 'kaboom');
    explosions.forEach(setupInvader, this);

    fireButton = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR)

     lives = game.add.group();
    game.add.text(game.world.width - 100, 10, 'Lives : ', { font: '34px Arial', fill: '#fff' });
    stateText = game.add.text(game.world.centerX,game.world.centerY,' ', { font: '84px Arial', fill: '#fff' });
    stateText.anchor.setTo(0.5, 0.5);
    stateText.visible = false;

    for (var i = 0; i < 3; i++) 
    {
        var shipLife = lives.create(game.world.width - 100 + (30 * i), 60, 'ship');
        shipLife.anchor.setTo(0.5, 0.5);
        shipLife.angle = 90;
        shipLife.alpha = 0.4;
    }
}



function update(){
	sky.tilePosition.y += 2

	if(ship.alive){
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
		if(game.time.now > firingTimer){
			enemyFires();
		}
		game.physics.arcade.overlap(bullets, aliens, collisionHandler, null, this);
    	game.physics.arcade.overlap(enemyBullets, ship, enemyHitsPlayer, null, this);
    }
}

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
   	tween.onLoop.add(descend,this);
}

function enemyFires() {
	enemyBullet = enemyBullets.getFirstExists(false);
	livingEnemies.length = 0;
	aliens.forEachAlive(function(alien){
		livingEnemies.push(alien);
	});
	if (enemyBullet && livingEnemies.length > 0)
    {     
        var random=game.rnd.integerInRange(0,livingEnemies.length-1);
        var shooter=livingEnemies[random];
        enemyBullet.reset(shooter.body.x, shooter.body.y);
        game.physics.arcade.moveToObject(enemyBullet,ship,120);
        firingTimer = game.time.now + 2000;
    }
}

function setupInvader (invader) {

    invader.anchor.x = 0.5;
    invader.anchor.y = 0.5;
    invader.animations.add('kaboom');

}

function collisionHandler (bullet, alien) {
    bullet.kill();
    alien.kill();
    var explosion = explosions.getFirstExists(false);
    explosion.reset(alien.body.x, alien.body.y);
    explosion.play('kaboom', 30, false, true);
    if (aliens.countLiving() == 0)
    {
        enemyBullets.callAll('kill',this);
        stateText.text = " You Won, \n Click to restart";
        stateText.visible = true;
        game.input.onTap.addOnce(restart,this);
    }
}

function enemyHitsPlayer (player,bullet) { 
    bullet.kill();
    live = lives.getFirstAlive();
    if (live)
    {
        live.kill();
    }
    var explosion = explosions.getFirstExists(false);
    explosion.reset(player.body.x, player.body.y);
    explosion.play('kaboom', 30, false, true);
    if (lives.countLiving() < 1)
    {
        player.kill();
        enemyBullets.callAll('kill');
        stateText.text=" GAME OVER \n Click to restart";
        stateText.visible = true;
        game.input.onTap.addOnce(restart,this);
    }
}

function descend() {
	aliens.y += 10;
}