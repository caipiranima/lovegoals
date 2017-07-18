corredor01 = {
  preload: function() {
    // // loading this game state...
    interval = 0;
    // var preloadBar = game.add.sprite(game.world.centerX, game.world.centerY, 'preloadBar');
    // preloadBar.anchor.setTo(0.5);
    // game.load.setPreloadSprite(preloadBar);

    // test current scale configurations to check if game needs to go fullscreen
    boot.updateGameScale();

    //loading background image
    game.load.image('corredor01', 'assets/sprites/corredor01.jpg');
  },
  create: function() {
    var entrance = game.add.sprite(0, 0, 'corredor01');
    entrance.inputEnabled = true;

    var corridorEntrance = game.add.button(game.world.centerX + 100, 700, "", function() {
      // text message
      boot.loadingText(game.world.centerX + 20, game.world.centerY,
        "Mas você quer MESMO continuar?", "#ffffff", 1);

      // load state
      //game.state.start("Corredor02");
      game.stateTransition.to("Corredor02");
    }, this);
    corridorEntrance.height = 600;
    corridorEntrance.width = 500;
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
