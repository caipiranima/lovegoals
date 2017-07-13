boot = {
  preload: function() {
    // progress bar
    game.load.image('preloadBar', 'assets/sprites/bar.png');
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
  }
}
