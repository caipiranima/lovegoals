boot = {
  preload: function() {
    // align game in relation to window
    //game.scale.pageAlignHorizontally = true;
    //game.scale.pageAlignVertically = true;

    // progress bar
    game.load.image('preloadBar', 'assets/sprites/bar.png');

    //GIF overlay
    game.load.image('glitch', 'assets/gif/glitch.gif');

    // initializes StateTransition Plugin
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

    // initializes Illuminated.js plugin library
    game.plugins.add(Phaser.Plugin.PhaserIlluminated);
  },
  create: function() {
    // if there isn't previous references to the video screen in the bunker...
    if (!game.global.startBunker || localStorage.getItem('screens') == null)
    {
    	// ...that means that the user didn't get to interact with the bunker yet
    	game.state.start("Floresta");
    }
    else {
    	// redirect user to bunker without passing through the previous levels all over again
    	game.state.start("Bunker");
    }
  },
  loadingText: function(x, y, textLine, fillColor, alpha) {
    // text message
    var loadText = game.add.text(x, y, textLine);
    loadText.anchor.setTo(0.5);
    loadText.setShadow(5, 5, 'rgba(0,0,0,0.5)', 5);
    loadText.alpha = alpha;
    loadText.font = "Lucida Sans Unicode";
    loadText.fontSize = 15;
    loadText.fill = fillColor;
    loadText.align = "center";
    loadText.z = 0;

    if (alpha < 1) {
      game.add.tween(loadText).to( { alpha: 1 }, 1500, "Quad.easeInOut", true, 0, -1, true);
    }
  },
  updateGameScale: function() {
    if (game.scale.scaleMode !== Phaser.ScaleManager.SHOW_ALL) {
      game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
      game.scale.pageAlignHorizontally = true;
      game.scale.pageAlignVertically = true;
      game.scale.parentIsWindow = true;
    }
  },
  showGlitchOverlay: function() {
    if (imageView != null) {
      if (interval <= 0) {
        interval = game.rnd.integerInRange(3000, 8000);

        game.time.events.add(interval, function() {
          imageView.draw('glitch', 0, 0, imageView.width, imageView.height, 'color');
          interval = 0;
        });
      }
      else {
        imageView.clear();
      }
    }
  }
}
