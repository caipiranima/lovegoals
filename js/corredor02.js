corredor02 = {
  init: function() {
    game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
    game.scale.parentIsWindow = true;
    game.scale.refresh();
  },
  preload: function() {
    //loading background image
    game.load.image('corredor02', 'img/corredor02.jpg');
  },
  create: function() {
    var entrance = game.add.sprite(0, 0, 'corredor02');
    entrance.inputEnabled = true;

    var corridorEntrance = game.add.button(game.world.centerX, 350, '', function() {
          //game.state.start("Bunker");
          game.stateTransition.to("Bunker");
        }, this);
    corridorEntrance.height = 500;
    corridorEntrance.width = 400;
    corridorEntrance.anchor.setTo(0.5, 0.5);
  }
}
