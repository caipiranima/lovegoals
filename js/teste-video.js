var game = new Phaser.Game(1920, 1080, Phaser.AUTO, 'phaser-example',
                          { preload: preload,
                            create: create,
                            render: render,
                            update: update });

var audioFile, imageFile, glitch;
var randomEffect = 0, interval = 0, timer = 0; w = 0;
var colors = Phaser.Color.HSVColorWheel();
var p = null;
var rect = null;
var lines = [];
var availableFile = [];
var filter;

function preload() {
    var file = '';

    // load some useful scripts
    game.load.script('filter', 'js/filters/pixelate.js');

    //loading audio and image files
    for (i = 0; i < 12; i++) {
      try {
        file = 'audio' + i.toString();
        game.load.audio(file, 'audio/' + file + '.ogg');

        file = 'image' + i.toString();
        game.load.image(file, 'assets/faces/' + file + '.png');

        availableFile.push(i);
      }
      catch (err) {
        console.log("File " + file + " does not exist.")
      }

      //GIF overlay
      game.load.image('glitch', 'assets/gif/glitch.gif');
    }
}

function create() {
    //setting up the game world
    game.stage.backgroundColor = '#00000';
    game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
    game.scale.parentIsWindow = true;
    game.input.touch.preventDefault = false;
    game.stage.smoothed = false;

    // setting up camera fade
    game.camera.onFadeComplete.add(function() {
      game.camera.resetFX();
    }, this);

    //bitmap data for static images
    imageFile = game.make.bitmapData();
    p = new Phaser.Point();
    for (var c = 0; c < 50; c++)
    {
        lines.push(new Phaser.Line(game.world.randomX, game.world.randomY,
          game.world.randomX, game.world.randomY));
    }

    //starting audio file shift
    changeAudioSource();
}

function update() {
  if (imageFile != null) {
    // what will be the effect applied over the currently loaded image
    try {
      switch (randomEffect) {
        case 0: //'replace colors',
          recolor();
          break;
        case 1: //'distort',
          distort();
          break;
        case 2: //'pointilize',
          pointilize();
          break;
        case 3: //'pixelate',
          pixelateOverlay();
          break;
        case 4: //'glitch overlay',
          glitchOverlay();
          break;
        default:
          throw 'No effect selected';
      }
    }
    catch(err) {
      console.log(err.toString());
    }
  }
}

function render() {
    //game.debug.soundInfo(audioFile, 20, 32);
}

function randomize(from, to) {
  return Math.floor((Math.random() * to) + from);
}

function changeAudioSource() {
    var randomFile = randomize(0, availableFile.length - 1);

    // change audio file
    audioFile = game.add.audio('audio' + availableFile[randomFile].toString());
    audioFile.onStop.addOnce(function() {
      game.camera.fade(0x000000, 2000); //fade to black
      changeAudioSource();
    }, this);
    audioFile.play();

    // change image file
    imageFile.load('image' + availableFile[randomFile].toString());
    imageFile.addToWorld(game.world.centerX, game.world.centerY, 0.5, 0.5, 1.5, 1.5);


    //GIF overlay
    glitch = game.add.sprite(0, 0, 'glitch');
    glitch.alpha = 0;
    glitch.width = game.width;
    glitch.height = game.height;
    filter = game.add.filter('Pixelate', game.width, game.height);
    glitch.filters = [filter];

    //rectangle for effects
    rect = new Phaser.Rectangle(0, 0, imageFile.width, imageFile.height);
    //randomEffect = randomize(0, 4);
    randomEffect = 3;
    // if (videoFile != null)
    //   videoFile.destroy();
    //
    // videoFile = game.add.video('video' + availableFile[randomFile].toString());
    // videoFile.play(true);
    // //  x, y, anchor x, anchor y, scale x, scale y
    // videoFile.addToWorld();
}

function recolor() {
  // replaceRGB: function (sourceR, sourceG, sourceB, sourceA, destR, destG, destB, destA, region) {
  //game.add.tween(text).to( { alpha: 1 }, 2000, Phaser.Easing.Linear.None, true);
	imageFile.replaceRGB(255, 255, 255, 255,
    randomize(0, 255),
    randomize(0, 255),
    randomize(0, 255),
    255);
}

function distort() {

}

function pointilize() {
  if (p != null) {
    for (var c = 0; c < lines.length; c++) {
      rect.random(p);
      //  We'll floor it as setPixel needs integer values and random returns floats
      p.floor();
      imageFile.setPixel(p.x, p.y, colors[w].r, colors[w].g, colors[w].b);

      lines[c].random(p);
      p.floor();
      imageFile.setPixel(p.x, p.y, colors[w].r, colors[w].g, colors[w].b);
    }

    w = game.math.wrapValue(w, 1, 359);
  }
}

function pixelateOverlay() {
  if (interval <= 0) {
    game.add.tween(glitch).to({alpha: 1}, 1000, Phaser.Easing.Linear.None, true);
    timer = game.time.now;
  }

  if (game.time.now == timer)
  {
    interval = randomize(0, 10000);
    timer = game.time.now + interval;
    game.add.tween(filter).to( { sizeX: 100, sizeY: 100 }, interval, "Quad.easeInOut", true, 0, -1, true);
  }
}

function glitchOverlay() {
  if (interval <= 0) {
    interval = randomize(0, 10000);

    game.time.events.add(interval, function() {
      game.add.tween(glitch).to({alpha: 1}, interval, Phaser.Easing.Linear.None, true);
      interval = 0;
    }, this);
  }
}
