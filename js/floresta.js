var gameWidth, gameHeight;
var nTiles, firstTile, lastTile, tiles, tile, walkAwayTile;
var cursors;
var text;
var corridorEntrance;
var passageway = new Phaser.Rectangle(264, 134, 354, 216);

//  The Google WebFont Loader will look for this object, so create it before loading the script.
WebFontConfig = {

  //  'active' means all requested fonts have finished loading
  //  We set a 1 second delay before calling 'createText'.
  //  For some reason if we don't the browser cannot render the text the first time it's created.
  active: function() {
		game.time.events.add(Phaser.Timer.SECOND, function() {
			text = game.add.text(gameWidth / 2, gameHeight / 2,
				"Arraste ou use as setas do teclado para se mover... <- ou ->\n" +
				"Mas espere só até eu... desaparecer.\n" +
				"Boa sorte! ;)"
			);
			text.anchor.setTo(0.5, 0.5);
			text.setShadow(5, 5, 'rgba(0,0,0,0.5)', 5);
			text.alpha = 0.1;
			text.font = 'Titillium Web';
  		text.fontSize = 25;
			text.fill = "#ffffff";
			text.align = "center";

			game.add.tween(text).to( { alpha: 1 }, 2000, Phaser.Easing.Linear.None, true);
			game.time.events.add(6000, function() {
				game.add.tween(text).to({y: 0}, 1500, Phaser.Easing.Linear.None, true);
				game.add.tween(text).to({alpha: 0}, 1500, Phaser.Easing.Linear.None, true);
				//text.destroy();
			}, this);
		}, this);
	},
  //  The Google Fonts we want to load (specify as many as you like in the array)
  google: {
    families: ['Titillium Web']
  }
};

floresta = {
	init: function() {
		gameWidth = window.innerWidth;
    gameHeight = window.innerHeight;
    nTiles = Math.ceil(gameWidth / ((gameHeight * 400) / 1080));

    //game.width = nTiles * 400;
    game.width = gameWidth;
    game.height = gameHeight;

    //game.stage.bounds.height = gameHeight;
    if (game.renderType === 1) {
        game.renderer.resize(gameWidth, gameHeight);
        Phaser.Canvas.setSmoothingEnabled(game.context, false);
    }

		// Initializes StateTransition Plugin
		game.stateTransition = game.plugins.add(Phaser.Plugin.StateTransition);
		game.stateTransition.configure({
		  duration: Phaser.Timer.SECOND * 0.8,
		  ease: Phaser.Easing.Exponential.InOut,
		  properties: {
		    alpha: 0,
		    scale: {
		      x: 1.4,
		      y: 1.4
		    }
		  }
		});
	},
	preload: function() {
		//  Load the Google WebFont Loader script
		game.load.script('webfont', '//ajax.googleapis.com/ajax/libs/webfont/1.4.7/webfont.js');

		// preloading various assets
    //load forest image strips as separated sprites
    for (i = 1; i < 25; i++) {
        game.load.image('f'+i, 'assets/sprites/f'+i+'.jpg');
    }

    // load soundtrack
    game.load.audio('wind', 'assets/audio/112296__nageor__desertwind1final.ogg');
	},
	create: function() {
    this.swipe = new Swipe(this.game);
    tiles = game.add.group();

    // play audio as background sound
    music = game.add.audio('wind');
    music.loopFull(); //to play just once -> music.play();

		// tiles for background image
    for (i = 1; i <= nTiles; i++) {
        tiles.create(0 + (i-1)*400, 0, 'f'+i);
    }
    firstTile = 1;
    lastTile = nTiles;
    cursors = game.input.keyboard.createCursorKeys();
	},
	update: function() {
		// checking swipe direction (if touch-and-drag )
		var direction = this.swipe.check();
		if (direction!==null) {
				switch(direction.direction) {
						case this.swipe.DIRECTION_LEFT:
								this.moveTiles(true, 200);
								break;
						case this.swipe.DIRECTION_RIGHT:
								this.moveTiles(false, 200);
				}
		}

		// if either left or right arrow key is down
		if (cursors.right.isDown) {
				this.moveTiles(true, 5);
		} else if (cursors.left.isDown) {
				this.moveTiles(false, 5);
		}
	},
	moveTiles: function(goRight, step) {
		var tilePositionX = 0;

		if (goRight) {
				tilePositionX = tiles.getChildAt(tiles.length-1).x

				if (tilePositionX < (nTiles-1)*400 + step) {
						if (lastTile == 24)
								return;
						lastTile++;

						tile = tiles.create(tilePositionX + 400, 0, 'f'+lastTile);

						if (lastTile == 17) {
								this.enableWalkAway();
						}
				}

				if (tiles.getChildAt(0).x < -400) {
						tiles.removeChildAt(0);
						firstTile++;
				}

				tiles.setAll('x', step, false, false, 2, false);
		}
		else {
				tilePositionX = tiles.getChildAt(0).x

				if (tilePositionX > -step) {
						if (firstTile == 1)
								return;
						firstTile--;

						tile = game.add.sprite(tilePositionX - 400, 0, 'f'+firstTile);
						tiles.addAt(tile, 0);

						if (firstTile == 17) {
								this.enableWalkAway();
						}
				}

				if (tiles.getChildAt(tiles.length-1).x > (nTiles)*400) {
						lastTile--;
						tiles.removeChildAt(tiles.length-1);
				}

				tiles.setAll('x', step, false, false, 1, false);
		}
	},
	enableWalkAway: function() {
    if (tile.children.length == 0) {
      if (corridorEntrance == null) {
        corridorEntrance = game.add.button(80, 0, '', function() {
          game.camera.fade('#000000');
          game.camera.onFadeComplete.add(function() {
            game.state.start("Entrada");
          }, this);
        }, this);
        //corridorEntrance.anchor.setTo(0.5, 0);
        corridorEntrance.height = 200;
        corridorEntrance.width = 200;
      }

      tile.addChild(corridorEntrance);
    }
	}
}
