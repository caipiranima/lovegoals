entrada = {
  preload: function() {
    // // loading this game state...
    interval = 0;
    // var preloadBar = game.add.sprite(game.world.centerX, game.world.centerY, 'preloadBar');
    // preloadBar.anchor.setTo(0.5);
    // game.load.setPreloadSprite(preloadBar);

    // test current scale configurations to check if game needs to go fullscreen
    boot.updateGameScale();

    //loading background image
    game.load.image('entrada', 'assets/sprites/entrada.jpg');
  },
  create: function() {
    var entrance = game.add.sprite(0, 0, 'entrada');
    entrance.inputEnabled = true;

    var corridorEntrance = game.add.button(game.world.centerX, 500, '', function() {
      // text message
      boot.loadingText(game.world.centerX - 50, game.world.centerY - 100,
        "O que te espera aqui?", "#ffffff", 1);

      //load state
      //game.state.start("Corredor01");
      game.stateTransition.to("Corredor01");
    }, this);

    corridorEntrance.height = 500;
    corridorEntrance.width = 500;
    corridorEntrance.anchor.setTo(0.5, 0.5);

    // camera returns from fade-out
    game.camera.flash('#000000');

    // glitch overlay
    imageView = game.add.bitmapData(game.width, game.height)
    imageView.addToWorld(0, 0);
  },
  update: function() {
    // glitch overlay
    boot.showGlitchOverlay();
  }
}
