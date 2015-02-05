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
        this.alive = true;
        this.dog = game.add.sprite(this.x,this.y,"spike");
        game.physics.enable( this.dog, Phaser.Physics.ARCADE );
        this.dog.anchor.setTo(0.5, .05);
        this.dog.body.collideWorldBounds = true;
       // this.dog.body.immovable = false;
    }
    Dog.prototype.det = function() {
    	this.dog.destroy();	    
    }
    Dog.prototype.walk = function() {
    	this.minSpeed = -65;
        this.maxSpeed = 65;
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
        if(swing.isDown){
		if(this.alive){
			if((Math.abs(this.dog.x - catcher.x) >0) && (Math.abs(this.dog.x
				- catcher.x) <75) && (Math.abs(this.dog.y- catcher.y) < 90) 
				&& (Math.abs(this.dog.y - catcher.y) > 0)){
				this.dog.kill();
				this.alive = false;
				score = score + 50;
				numOfDogs -= 1;
				scoreText.setText("Score: " + String(score));
				count.setText("Dogs Captured: " + String(score/50));
			}
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
        game.load.image( 'gameover', 'assets/gameOver.png' );
        
    }
    
    var dog;
    var catcher;
    var cursors;
    var swing;
    var background;
    var dogs;
    var numOfDogs = 6;
    var Dog;
    var startTime = 0;
    var gameTime;
    var score = 0;
    var timer;
    var timeText;
    var scoreText;
    var end = false;
    var maxDogs = 500
    var count;
    var start = false;
    
    function create() {
        // Create a sprite at the center of the screen using the 'logo' image.
        background = game.add.tileSprite(0,0, 800, 600, 'park'); 
        
        catcher = this.game.add.sprite( game.world.centerX, game.world.centerY, 'bob' );
        catcher.anchor.setTo( 0.5, 0.5 );
        game.physics.enable( catcher, Phaser.Physics.ARCADE );
        catcher.body.collideWorldBounds = true;
        game.input.onDown.add(startGame, this);
        
        // Turn on the arcade physics engine for this sprite.
        cursors = game.input.keyboard.createCursorKeys();
        game.input.keyboard.addKeyCapture([Phaser.Keyboard.SPACEBAR]);
        swing = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
        // Make it bounce off of the world bounds.
        
        dogs = [];
        
        for (var i=0; i<numOfDogs; i++){
        	dogs.push(new Dog(i, game));
        }
        // Add some text using a CSS style.
        // Center it in X, and position its top 15 pixels from the top of the world.
        var style = { font: "20px Verdana", fill: "#FFFFFF", align: "center" };
        scoreText = game.add.text( 55, 10, "Score: "+ String(score), style );
        count = game.add.text( 550, 10, "Dogs Captured: 0", style );
        scoreText.anchor.setTo( 0.5, 0.0 );
        var styleT = { font: "35px Verdana", fill: "#FFFFFF", align: "center" };
        timeText = game.add.text(300, 200, "Click to Start", styleT);
        
        cursors = game.input.keyboard.createCursorKeys();
        game.input.keyboard.addKeyCapture([Phaser.Keyboard.SPACEBAR]);
        swing = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
    }
    
    function update() {
    	 if(start){
    	 if(!end){
		 if(numOfDogs === 0){win();}
		 gameTime = new Date().getTime();
		 updateTimer();
		 //move the dogs
		 if(Math.floor((gameTime - startTime)*.01)%5 === 0){
			for (var i=0; i<dogs.length; i++){
				game.physics.arcade.collide(catcher, dogs[i]);
				dogs[i].walk();
			}
		}
		//The catcher 'swings' the net, the sprite frame changes when pressing Spacebar.
		//Moves the dog catcher right,left,up, or down 150pixels/second by using the arrow keys.
		if(cursors.left.isDown){
			catcher.scale.x = -1;
			catcher.body.velocity.x = -150;
			if(Math.floor((gameTime - startTime)*.01)%2 === 0){
				catcher.loadTexture('catchermove');
			}
			else{
				catcher.loadTexture('bob');
			}
			if(swing.isDown){
				catcher.loadTexture('catcherswing');
			}
		}
		else if(cursors.right.isDown){
			
			catcher.scale.x = 1;
			catcher.body.velocity.x = 150;
			if(Math.floor((gameTime - startTime)*.01)%2 === 0){
				catcher.loadTexture('catchermove');
			}
			else{
				catcher.loadTexture('bob');
			}
			if(swing.isDown){
				catcher.loadTexture('catcherswing');
			}
		}
		else{ //if(cursors.left.isUp || coursers.right.isUp)      
			catcher.body.velocity.x = 0;
			catcher.loadTexture('bob', 0);	
			if(swing.isDown){
				catcher.loadTexture('catcherswing');
			}
		}
		if(cursors.down.isDown){
			catcher.body.velocity.y = 150;
		}
		else if(cursors.up.isDown){
			catcher.body.velocity.y = -150;
		}
		else if(cursors.down.isUp || coursers.up.isUp){
			catcher.body.velocity.y = 0;
		}
		//add a dog for every two dogs every 7 seconds
		if((90 - (90-(gameTime-startTime)*.001))%5 < .025){
			var j = Math.floor(numOfDogs/2);
			if((numOfDogs + j) < maxDogs){
				for(var i=0; i<j; i++){
					dogs.push(new Dog(numOfDogs+i, game));
				}
				numOfDogs += j;
			}
		}
	 }
	 //end game update
	 else{
	 	 catcher.body.velocity.y = 0;
	 	 catcher.body.velocity.x = 0;
	 	 for (var i=0; i<dogs.length; i++){
				dogs[i].det();
		}
		
	 }
	 }
    }
    function updateTimer(){
    	 timer = 90 - Math.floor((gameTime-startTime)*.001);
    	 timeText.x = game.world.centerX;
    	 timeText.y = 10;
    	 timeText.setText(String(timer));
    	 if(timer < 0){gameover()} 
    }
    function gameover(){
    	    end = true;
    	    game.add.sprite(0, 0, 'gameover');
    	    var style = { font: "20px Verdana", fill: "#DF0101", align: "center" };
    	    var finalScore = game.add.text( 300, 400, "Final Score: "+ String(score), style );
    }
    function win(){
	end = true;    	    
    	game.world.remove(scoreText, true);
    	game.world.remove(timeText, true);
    	var style = { font: "bold 60px Verdana", fill: "#FFFFFF", align: "center" };
    	game.add.text(40, 140, "CONGRATULATIONS!", style);
    	style = { font: "bold 40px Verdana", fill: "#FFFFFF", align: "center" };
    	game.add.text(220, 250, "Final Score: " + String(score), style);
    }
    function startGame() {
    	game.input.onDown.remove(startGame, this);
    	start = true;
    	startTime = new Date().getTime();
    }
};
