corredor01 = {
  init: function() {
    // going fullscreen
    game.scale.pageAlignHorizontally = true;
    game.scale.pageAlignVertically = true;
    game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
    game.scale.parentIsWindow = true;
  },
  preload: function() {
    //loading background image
    game.load.image('corredor01', 'assets/sprites/corredor01.jpg');
  },
  create: function() {
    var entrance = game.add.sprite(0, 0, 'corredor01');
    entrance.inputEnabled = true;

    var corridorEntrance = game.add.button(game.world.centerX + 100, 700, '', function() {
          //game.state.start("Corredor02");
          game.stateTransition.to("Corredor02");
        }, this);
    corridorEntrance.height = 600;
    corridorEntrance.width = 500;
    corridorEntrance.anchor.setTo(0.5, 0.5);
  }
}
