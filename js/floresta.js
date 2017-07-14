var gameWidth, gameHeight;
var nTiles, firstTile, lastTile, tiles, tile, walkAwayTile;
var cursors, text;
var corridorEntrance;
var lightConfig = { position: new illuminated.Vec2(300, 50),
                    color: '#fff699',
                    distance: 50 };
var passageway = new Phaser.Rectangle(264, 134, 354, 216);

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
	},
	preload: function() {
    // loading this game state...
    var preloadX = gameWidth / 2;
    var preloadY = gameHeight / 2;
    boot.loadingText(preloadX, preloadY - 30, 0.1);

    var preloadBar = game.add.sprite(preloadX, preloadY, 'preloadBar');
    preloadBar.anchor.setTo(0.5);
    game.load.setPreloadSprite(preloadBar);

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

    // show welcome text message
    this.showStartMessage();
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
  showStartMessage: function() {
    game.time.events.add(1000, function() {
			text = game.add.text(gameWidth / 2, gameHeight / 2,
				"Arraste ou use as setas do teclado para se mover... <- ou ->\n" +
				"Mas espere só até eu... desaparecer.\n" +
				"Boa sorte! ;)"
			);
			text.anchor.setTo(0.5);
			text.setShadow(5, 5, 'rgba(0,0,0,0.5)', 5);
			text.alpha = 0.1;
			text.font = "Lucida Sans Unicode";
  		text.fontSize = 25;
			text.fill = "#ffffff";
			text.align = "center";

			game.add.tween(text).to( { alpha: 1 }, 2000, Phaser.Easing.Linear.None, true);
			game.time.events.add(6000, function() {
				game.add.tween(text).to({y: 0}, 1500, Phaser.Easing.Linear.None, true);
				game.add.tween(text).to({alpha: 0}, 1500, Phaser.Easing.Linear.None, true);

        //starting lighting effects
        floresta.addLightingFX();
			}, this);
		}, this);
  },
  // moving forest tiles accordingly to horizontal swipe
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
  // enabling clickable area through which we'll get to the next game state
	enableWalkAway: function() {
    if (tile.children.length == 0) {
      if (corridorEntrance == null) {
        //adding an invisbile button as a child to current tile
        corridorEntrance = game.add.button(tile.width - 100, 150, '', function() {
          game.camera.fade('#000000');
          game.camera.onFadeComplete.add(function() { game.state.start("Entrada"); }, this);
        }, this);

        corridorEntrance.anchor.setTo(0.5);
        corridorEntrance.height = 200;
        corridorEntrance.width = 200;

        // light that will get one's attention
        var tunnelLight = game.add.illuminated.lamp(corridorEntrance.x + 15, corridorEntrance.y + 50, lightConfig);
        tunnelLight.anchor.setTo(0.5);
        tunnelLight.alpha = 0.2;
        game.add.tween(tunnelLight).to( { alpha: 1 }, 2000, "Quad.easeInOut", true, 0, 1, true);
      }

      tile.addChild(corridorEntrance);
      tile.addChild(tunnelLight);
    }
	},
  // lighting effect
  addLightingFX: function() {
    // light at right image corner
    var cornerLight = game.add.illuminated.lamp(gameWidth / 2, gameHeight / 2, lightConfig);
    cornerLight.anchor.setTo(0.5);
    cornerLight.alpha = 0.2;

    var tween = game.add.tween(cornerLight).to( { alpha: 1 }, 1500, "Quad.easeInOut", true, 0, -1, true);
    tween.onLoop.addOnce(function() {
      game.add.tween(cornerLight).to( { x: gameWidth + 100}, 6000, Phaser.Easing.Linear.None, true);
    }, this);
  }
}
