boot = {
  preload: function() {
    // progress bar
    game.load.image('preloadBar', 'assets/sprites/bar.png');

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
  loadingText: function(x, y) {
    // text message
    var loadText = game.add.text(x, y, "Carregando...", { font: "Bold 30px Courier New", fill: '#d1ad87' });
    loadText.anchor.setTo(0.5);
    loadText.setShadow(5, 5, 'rgba(0,0,0,0.5)', 5);
    loadText.alpha = 0.1;
    game.add.tween(loadText).to( { alpha: 1 }, 1500, "Quad.easeInOut", true, 0, -1, true);
  }
}
