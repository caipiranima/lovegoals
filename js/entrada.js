entrada = {
  init: function() {
    // going fullscreen
    game.scale.pageAlignHorizontally = true;
    game.scale.pageAlignVertically = true;
    game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
    game.scale.parentIsWindow = true;
  },
  preload: function() {
    //loading background image
    game.load.image('entrada', 'assets/sprites/entrada.jpg');
  },
  create: function() {
    var entrance = game.add.sprite(0, 0, 'entrada');
    entrance.inputEnabled = true;

    var corridorEntrance = game.add.button(game.world.centerX, 500, '', function() {
          //game.state.start("Corredor01");
          game.stateTransition.to("Corredor01");
        }, this);
    corridorEntrance.height = 500;
    corridorEntrance.width = 500;
    corridorEntrance.anchor.setTo(0.5, 0.5);

    // câmera volta do fade-out
    game.camera.flash('#000000');
  }
}
