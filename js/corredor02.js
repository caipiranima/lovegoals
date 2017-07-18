corredor02 = {
  preload: function() {
    // // loading this game state...
    interval = 0;
    // var preloadBar = game.add.sprite(game.world.centerX, game.world.centerY, 'preloadBar');
    // preloadBar.anchor.setTo(0.5);
    // game.load.setPreloadSprite(preloadBar);
    // test current scale configurations to check if game needs to go fullscreen
    boot.updateGameScale();

    //loading background image
    game.load.image('corredor02', 'assets/sprites/corredor02.jpg');
  },
  create: function() {
    var entrance = game.add.sprite(0, 0, 'corredor02');
    entrance.inputEnabled = true;

    var corridorEntrance = game.add.button(game.world.centerX, 350, "", function() {
      // text message
      boot.loadingText(game.world.centerX, game.world.centerY - 150,
        "Tem a determinação \npara prosseguir?", "#ffffff", 1);

      // load state
      //game.state.start("Bunker");
      game.stateTransition.to("Bunker");
    }, this);
    corridorEntrance.height = 500;
    corridorEntrance.width = 400;
    corridorEntrance.anchor.setTo(0.5, 0.5);

    // glitch overlay
    imageView = game.add.bitmapData(game.width, game.height)
    imageView.addToWorld(0, 0);
  },
  update: function() {
    // glitch overlay
    boot.showGlitchOverlay();
  }
}
