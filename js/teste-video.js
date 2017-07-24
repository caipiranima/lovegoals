  //game global settings
var game = new Phaser.Game(1024, 768, Phaser.AUTO, "",
                          { preload: preload,
                            create: create,
                            render: render });

// variables of general use
var interval = 0;
var alpha = { alpha: 0.2 };
var imageView, videoStream, videoBase;

function preload() {
    var file = '';
    
    //setting up the game world
    game.stage.backgroundColor = '#000000';
    game.scale.pageAlignHorizontally = true;
    game.scale.pageAlignVertically = true;
    game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
    game.scale.parentIsWindow = true;
    game.input.touch.preventDefault = false;
    game.stage.smoothed = false;

    // loading...
    game.add.text(game.world.centerX, game.world.centerY, "Carregando...",
                { font: "50px Calibri", fill: "#ffffff" });

      //GIF overlay
      game.load.image('glitch', 'assets/gif/glitch.gif');
      //video test
      game.load.video('recorte', 'assets/video/recorte0.mp4');
}

function create() {
    // setting up camera fade
    game.camera.onFadeComplete.add(fadeIntoNext, this);

    //video reference we'll use to blend with snapshots taken from webcam
    videoBase = game.add.video('recorte');
    videoBase.onComplete.add(changeVideoBaseSource, this);
    videoBase.play();

    //  No properties at all means we'll create a video stream from a webcam
    videoStream = game.add.video();
    videoStream.onAccess.add(camAllowed, this); //  If access to the camera is allowed
    videoStream.onError.add(camBlocked, this); //  If access to the camera is denied
    videoStream.startMediaStream(); //starting video stream from webcam
}

function render() {
    // Input debug info
    game.debug.inputInfo(32, 32);
    //game.debug.spriteInputInfo(sprite, 32, 130);
    game.debug.pointer(game.input.activePointer);
}

function camAllowed() {
    //imageView = game.add.bitmapData(videoStream.width, videoStream.height);
    imageView = game.add.bitmapData(game.width, game.height)
    imageView.addToWorld(game.world.centerX, game.world.centerY, 0.5, 0.5);

    //  Grab a new frame every 50ms
    game.time.events.loop(100, takeSnapshot, this);
    game.add.tween(alpha).to( { alpha: 0.5 }, 1000, "Cubic.easeInOut", true, 0, -1, true);
}

function camBlocked(videoStatus, error) {
    console.log('Camera was blocked', videoStatus, error);
}

function takeSnapshot() {
    videoStream.grab(true, alpha.alpha);
    imageView.draw(videoStream.snapshot, 0, 0, game.width, game.height);
    //imageView.draw(imageFile, 0, 0, game.width, game.height, 'multiply');
    videoBase.grab(true, alpha.alpha);
    imageView.draw(videoBase.snapshot, 0, 0, game.width, game.height, 'multiply');

    if (interval <= 0) {
      //interval = randomize(0, 7000);
      interval = game.rnd.integerInRange(0, 7000);

      game.time.events.add(interval, function() {
        imageView.draw('glitch', 0, 0, game.width, game.height, 'color');
        interval = 0;
      });
    }
}

function fadeIntoNext() {
  game.camera.resetFX();
  videoBase.changeSource('assets/video/recorte' + randomFile);
}

function changeVideoBaseSource() {
  var randomFile = 0; //game.rnd.integerInRange(0, 12);
  game.camera.fade(0x000000, 2000); //fade to black
}

// function randomize(plus, to) {
//   return Math.round((Math.random() * to) + plus);
// }
