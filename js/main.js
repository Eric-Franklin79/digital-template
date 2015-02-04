window.onload = function() {
    // You might want to start with a template that uses GameStates:
    //     https://github.com/photonstorm/phaser/tree/master/resources/Project%20Templates/Basic
    
    // You can copy-and-paste the code from any of the examples at http://examples.phaser.io here.
    // You will need to change the fourth parameter to "new Phaser.Game()" from
    // 'phaser-example' to 'game', which is the id of the HTML element where we
    // want the game to go.
    // The assets (and code) can be found at: https://github.com/photonstorm/phaser/tree/master/examples/assets
    // You will need to change the paths you pass to "game.load.image()" or any other
    // loading functions to reflect where you are putting the assets.
    // All loading functions will typically all be found inside "preload()".
    
    "use strict";
    
    Dog = function(index, game){
    	
        this.x = game.world.randomX;
        this.y = game.world.randomY;
        this.game = game;
        
        
        
        this.dog = game.add.sprite(this.x,this.y,"spike");
        game.physics.enable( this.dog, Phaser.Physics.ARCADE );
        this.dog.anchor.setTo(0.5, 0.5);
        this.dog.body.collideWorldBounds = true;
        
        
        this.dog.body.immovable = false;
    }
    Dog.prototype.walk = function() {
    	this.minSpeed = 75;
        this.maxSpeed = 75;
        this.dir = Math.random()*(4-0);
        this.vx = Math.random()*(this.maxSpeed - this.minSpeed+1)-this.minSpeed;
        this.vy = Math.random()*(this.maxSpeed - this.minSpeed+1)-this.minSpeed;
        if(this.dir < 1){
        	this.dog.body.velocity.x = this.vx;
        	this.dog.body.velocity.y = this.vy;	
        }
        else if(this.dir < 2){
        	this.dog.body.velocity.x = this.vx;
        	this.dog.body.velocity.y = this.vy * -1;
        }
        else if(this.dir < 3){
        	this.dog.body.velocity.x = this.vx * -1;
        	this.dog.body.velocity.y = this.vy;
        }
        else{
        	this.dog.body.velocity.x = this.vx * -1;
        	this.dog.body.velocity.y = this.vy *-1;
        }
        if(swing.isDown)
	{
		if(Math.abs(catcher.x - this.dog.x)<50){
		this.dog.kill();
		}
	}
    }
    
    var game = new Phaser.Game( 800, 600, Phaser.CANVAS, 'game', { preload: preload, create: create, update: update } );
    
    function preload() {
        // Load an image and call it 'logo'.
        game.load.image( 'park', 'assets/park.png' );
        game.load.image( 'bob', 'assets/DogCatcher.png' );
        game.load.image( 'catcherswing', 'assets/DogCatcherSwing.png' );
        game.load.image( 'catchermove', 'assets/DogCatcherMove.png' );
        game.load.image( 'spike', 'assets/dog.png' );
        
    }
    var dog;
    var catcher;
    var cursors;
    var swing;
    var background;
    var dogs;
    var numOfDogs = 2;
    var Dog;
    var startTime = new Date().getTime() * .001;
    var gameTime;
    
    function create() {
        // Create a sprite at the center of the screen using the 'logo' image.
        background = game.add.tileSprite(0,0, 800, 600, 'park'); 
        
        catcher = this.game.add.sprite( game.world.centerX, game.world.centerY, 'bob' );
        catcher.anchor.setTo( 0.5, 0.5 );
        game.physics.enable( catcher, Phaser.Physics.ARCADE );
        catcher.body.collideWorldBounds = true;
        
        
        // Turn on the arcade physics engine for this sprite.
        cursors = game.input.keyboard.createCursorKeys();
        game.input.keyboard.addKeyCapture([Phaser.Keyboard.SPACEBAR]);
        swing = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
        // Make it bounce off of the world bounds.
        
        dogs = [];
        for (var i=0; i<numOfDogs; i++)
        {
        	dogs.push(new Dog(i, game));
        }
        
        // Add some text using a CSS style.
        // Center it in X, and position its top 15 pixels from the top of the world.
       // var style = { font: "25px Verdana", fill: "#9999ff", align: "center" };
       // var text = game.add.text( game.world.centerX, 15, "Build something awesome.", style );
      //  text.anchor.setTo( 0.5, 0.0 );
        
        cursors = game.input.keyboard.createCursorKeys();
        game.input.keyboard.addKeyCapture([Phaser.Keyboard.SPACEBAR]);
        swing = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
    }
    
    function update() {
    	 gameTime = new Date().getTime() * .001;
        //Moves the dog catcher right,left,up, or down 150pixels/second by using the arrow keys.
        if(Math.floor(gameTime - startTime)%2 === 0){
		for (var i=0; i<dogs.length; i++){
			game.physics.arcade.collide(catcher, dogs[i]);
			dogs[i].walk();
		}
        }
        if(cursors.left.isDown)
	{
		
		catcher.body.velocity.x = -150;
		
	}
	else if(cursors.right.isDown)
	{
		catcher.body.velocity.x = 150;
		
	}
	else if(cursors.left.isUp || coursers.right.isUp)      
	{
		catcher.body.velocity.x = 0;
		catcher.loadTexture('bob', 0);	
	}
	if(cursors.down.isDown)
	{
		catcher.body.velocity.y = 150;
	}
	else if(cursors.up.isDown)
	{
		catcher.body.velocity.y = -150;
	}
	else if(cursors.down.isUp || coursers.up.isUp)
	{
		catcher.body.velocity.y = 0;
	}
	//The catcher 'swings' the net, the sprite frame changes when pressing Spacebar.
	if(swing.isDown)
	{
		catcher.loadTexture('catcherswing', 0);
		/*for (var i=0; i<dogs.length; i++){
			if(Math.abs(catcher.x - dogs[i].x)<50){
				dogs[i].kill();	
			}
		}*/
	}
	else if(swing.isUp)
	{
		catcher.loadTexture('bob', 0);	
	}
    }
};
