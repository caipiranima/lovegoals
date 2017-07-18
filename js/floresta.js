var nTiles, firstTile, lastTile, tiles, tile;
var gameWidth, gameHeight, tileWidth, preloadX, preloadY;
var cursors, corridorEntrance, imageView;
var randomTiles = [];
var lightConfig = { position: new illuminated.Vec2(300, 50),
                    color: '#fff699',
                    distance: 50 };
var passageway = new Phaser.Rectangle(264, 134, 354, 216);

floresta = {
	preload: function() {
    // loading this game state...
    // adapting forest tile size accordingly to screen resolution
    this.resizeGame();

    // preload sprite -> progress bar
    interval = 0;
    preloadX = game.width / 2;
    preloadY = game.height / 2;
    boot.loadingText(preloadX, preloadY - 30, "Carregando...", "#d1ad87", 0.1);

    var preloadBar = game.add.sprite(preloadX, preloadY, 'preloadBar');
    preloadBar.anchor.setTo(0.5);
    game.load.setPreloadSprite(preloadBar);

		// preloading several assets...
    // load forest image strips as separated tiles
    for (var i = 1; i < 25; i++) {
      game.load.image('f' + i, 'assets/sprites/f' + i +'.jpg');
    }

    // load camera spritesheet animation
    game.load.spritesheet('camera', 'assets/sprites/c-camera-forest.png', 100, 100, 12);

    // let's say we want at least 6 cameras in this background
    for (var i = 1; i < 7; i++) {
      // let's use modulus to sort cameras amongs trees that come before and after bunker entrance
      if (i % 2 == 0) {
        randomTiles.push(game.rnd.integerInRange(4, 15));
      }
      else {
        randomTiles.push(game.rnd.integerInRange(19, 23));
      }
    }
    // load soundtrack
    game.load.audio('wind', 'assets/audio/112296__nageor__desertwind1final.ogg');

    //if game loses focus, it pauses by itself and it may lose its scale configurations while resuming
    game.onResume.add(function() {
      if (game.scale.scaleMode !== Phaser.ScaleManager.SHOW_ALL) {
        game.renderer.resize(gameWidth, gameHeight);
      }
    }, this);
	},
	create: function() {
    this.swipe = new Swipe(this.game);
    tiles = game.add.group();

    // play audio as background sound
    music = game.add.audio('wind');
    music.loopFull(); //to play just once -> music.play();

		// tiles for background image
    for (i = 1; i <= nTiles; i++) {
        tile = tiles.create(0 + (i - 1) * tileWidth, 0, 'f' + i);
        tile.width = tileWidth;
        tile.height = gameHeight;
    }
    firstTile = 1;
    lastTile = nTiles;

    // mapping input from keyboard
    cursors = game.input.keyboard.createCursorKeys();

    // glitch overlay
    imageView = game.add.bitmapData(game.width, game.height)
    imageView.addToWorld(0, 0);

    // show welcome text message
    this.showStartMessage();
	},
	update: function() {
		// checking swipe direction (if touch-and-drag )
		var direction = this.swipe.check();
		if (direction !== null) {
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

    // glitch overlay
    boot.showGlitchOverlay();
	},
  resizeGame: function() {
    // general dimensions
    gameWidth = window.innerWidth;
    gameHeight = window.innerHeight;
    tileWidth = (gameHeight * 400) / 1080;
    nTiles = Math.ceil(gameWidth / tileWidth);
    //nTiles = Math.ceil((1080 * gameWidth) / (400 * gameHeight));

    game.width = gameWidth;
    game.height = gameHeight;

    // if (game.renderType === 1) {
    //     game.renderer.resize(gameWidth, gameHeight);
    //     Phaser.Canvas.setSmoothingEnabled(game.context, false);
    // }
  },
  showStartMessage: function() {
    var text;

    game.time.events.add(1000, function() {
			text = game.add.text(preloadX, preloadY,
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
			game.time.events.add(5000, function() {
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
				tilePositionX = tiles.getChildAt(tiles.length - 1).x

				if (tilePositionX < (nTiles-1) * tileWidth + step) {
						if (lastTile == 24)
								return;
						lastTile++;

						tile = tiles.create(tilePositionX + tileWidth, 0, 'f' + lastTile);
            tile.width = tileWidth;
            tile.height = gameHeight;

            // either we test tile index to verify camera insert or we insert invisible button
            if (randomTiles.indexOf(lastTile) >= 0) {
              this.enableCameraSprite(lastTile);
            }
						else if (lastTile == 17) {
						  this.enableWalkAway();
            }
				}

				if (tiles.getChildAt(0).x < -tileWidth) {
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

						tile = game.add.sprite(tilePositionX - tileWidth, 0, 'f' + firstTile);
            tile.width = tileWidth;
            tile.height = gameHeight;
						tiles.addAt(tile, 0);

            // either we test tile index to verify camera insert or we insert invisible button
            if (randomTiles.indexOf(firstTile) >= 0) {
              this.enableCameraSprite(firstTile);
            }
            else if (firstTile == 17) {
              this.enableWalkAway();
            }
				}

				if (tiles.getChildAt(tiles.length - 1).x > (nTiles) * tileWidth) {
						lastTile--;
						tiles.removeChildAt(tiles.length - 1);
				}

				tiles.setAll('x', step, false, false, 1, false);
		}
	},
  // enabling clickable area through which we'll get to the next game state
	enableWalkAway: function() {
    if (tile.children.length == 0) {
      if (corridorEntrance == null) {
        //adding an invisbile button as a child to current tile
        corridorEntrance = game.add.button(tileWidth * 0.9, 150, "", function() {
          // text message
          boot.loadingText(preloadX, preloadY, "Você precisa continuar...", "#ffffff", 0.1);

          game.time.events.add(4000, function() {
            game.camera.fade('#000000');
            game.camera.onFadeComplete.add(function() { game.state.start("Entrada"); }, this);
          });
        }, this);

        corridorEntrance.anchor.setTo(0.5);
        corridorEntrance.height = 200;
        corridorEntrance.width = 200;
      }

      // light that will get one's attention
      var tunnelLight = game.add.illuminated.lamp(tileWidth * 0.9, 170, lightConfig);
      tunnelLight.anchor.setTo(0.5);
      tunnelLight.alpha = 0.2;
      game.add.tween(tunnelLight).to( { alpha: 1 }, 2000, "Quad.easeInOut", true, 0, 1, true);

      // adding button and light as children to current tile
      tile.addChild(corridorEntrance);
      tile.addChild(tunnelLight);
    }
	},
  enableCameraSprite: function(tileIndex) {
    if (tile.children.length == 0) {
      var cameraSprite = game.add.sprite(50, 75 + game.rnd.integerInRange(0, 50), 'camera');

      // the closer the current tile is in relation to bunker entrance, the smaller the camera size will be
      var diff = (-10 * Math.abs(17 - tileIndex));
      cameraSprite.width -= diff;
      cameraSprite.height -= diff;

      if (tileIndex % 2 == 0)
        cameraSprite.scale.x *= -1;

      cameraSprite.anchor.setTo(0.5);
      cameraSprite.animations.add('turn');
      cameraSprite.animations.play('turn', 5, true);
      tile.addChild(cameraSprite);
    }
  },
  // lighting effect
  addLightingFX: function() {
    // light at right image corner
    var cornerLight = game.add.illuminated.lamp(preloadX, preloadY, lightConfig);
    cornerLight.anchor.setTo(0.5);
    cornerLight.alpha = 0.2;

    var tween = game.add.tween(cornerLight).to( { alpha: 1 }, 1500, "Quad.easeInOut", true, 0, -1, true);
    tween.onLoop.addOnce(function() {
      game.add.tween(cornerLight).to( { x: game.width + 100}, 6000, Phaser.Easing.Linear.None, true);
    }, this);
  }
}
