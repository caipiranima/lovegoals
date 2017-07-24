  //game global settings
var game = new Phaser.Game(1024, 1024, Phaser.AUTO, "phaser-example",
                          { preload: preload,
                            create: create,
                            update: update });
game.global = {
  	// number of file
  	fileNumber : 12,
    // number of available EFFECTS
    vfx: 8,
    // expected extension for audio files
    audioExt : ".ogg",
    // expected extension for image files
    imageExt : ".png"
};

// variables of general use
var audioFile, imageFile, imageView, startColor, background;
var randomEffect = 0, interval = 0, w = 0;
var colors = Phaser.Color.HSVColorWheel();
var p = new Phaser.Point();
var lines = [];
var availableFile = [];
var filterX, filterY;

/* STANDARD FUNCTIONS */
function preload() {
  var file = '';
  //setting up the game world
  game.stage.backgroundColor = '#ffffff';
  game.scale.pageAlignHorizontally = true;
  game.scale.pageAlignVertically = true;
  game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
  game.scale.parentIsWindow = true;
  game.input.touch.preventDefault = false;
  game.stage.smoothed = false;

  // load some useful scripts
  game.load.script('Pixelate', 'js/filters/Pixelate.js');
  game.load.script('Rotozoomer', 'js/filters/Rotozoomer.js');
  game.load.script('SinewaveFixedBase', 'js/filters/SinewaveFixedBase.js');
  game.load.script('Marble', 'js/filters/Marble.js');
  game.load.script('BlurX', 'js/filters/BlurX.js');
  game.load.script('BlurY', 'js/filters/BlurY.js');
  game.load.script('Fire', 'js/filters/Fire.js');

  // shaders
  game.load.shader('bacteria', 'assets/shaders/bacteria.frag');

  // loading audio and image files
  for (i = 0; i < game.global.fileNumber; i++) {
    try {
      file = 'audio' + i;
      game.load.audio(file, 'assets/audio/' + file + game.global.audioExt);

      file = 'image' + i;
      game.load.image(file, 'assets/faces/' + file + game.global.imageExt);

      availableFile.push(i);
    }
    catch (err) {
      console.log("File " + file + " does not exist.", err);
    }
  }
}

function create() {
  // setting up camera fade
  game.camera.onFadeComplete.add(fadeIntoNext, this);

  //starting audio file shift
  changeAudioSource();
}

function update() {
  // what will be the effect applied over the currently loaded image
  if (audioFile != null && imageFile != null) {
    try {
      switch (randomEffect) {
        case 0: //'replace colors',
          tint();
          break;
        case 1: //'distort',
          fireDistort();
          break;
        case 2: //'pointilize',
          pointilize();
          break;
        case 3: //'pixelate',
          pixelate();
          break;
        case 4: //'rotozoomer',
          rotozoomify();
          break;
        case 5: //'blur',
          blurXY();
          break;
        case 6: //'distort',
          fireDistort();
          break;
        case 7: //'bacteria overlay',
          bacteriaOverlay();
          break;
        case 8: //'marble overlay',
          marbleOverlay();
          break;
        default:
          throw 'No effect selected';
      }
    }
    catch(err) {
      console.log('No effect selected', err);
    }
  }
}

/* SHIFT SOUND AND IMAGE FILE SOURCES AS AUDIO PROGRESSES */
function changeAudioSource() {
    //var randomFile = randomize(0, availableFile.length - 1);
    var randomFile = game.rnd.integerInRange(0, availableFile.length - 1);
    var selected = availableFile[randomFile];
    interval = 0;
    imageView = null;
    startColor = 0xffffff;

    // change audio file
    audioFile = game.add.audio('audio' + selected);
    audioFile.onStop.addOnce(function() {
      game.camera.fade(0x000000, 2000); //fade to black
    }, this);
    audioFile.play();

    // change image file
    //selected = 11;
    imageFile = game.add.sprite(game.world.centerX, game.world.centerY, 'image' + selected);
    imageFile.anchor.set(0.5);

    //randomEffect = 8;
    randomEffect = game.rnd.integerInRange(0, game.global.vfx);
}

/* GENERAL-USE FUNCTIONS */
// function randomize(plus, to) {
//   return Math.round((Math.random() * to) + plus);
// }

function fullImagePosition() {
  if (imageFile != null) {
    imageFile.width = game.width;
    imageFile.height = game.height;
    imageFile.anchor.set(0);
    imageFile.x = 0;
    imageFile.y = 0;
  }
}

function fadeIntoNext() {
  game.camera.resetFX();
  changeAudioSource();
}

/* FUNCTIONS FOR APPLYING FILTER EFFECTS ON CURRENT SPRITE */
function tint() {
  if (interval <= 0) {
    //interval = randomize(0, 20000);
    interval = game.rnd.integerInRange(0, 20000);

    var endColor = Math.random() * 0xffffff;
    var colorBlend = { step: 0 };
  	// create a tween to increment that step from 0 to 100.
    var colorTween = game.add.tween(colorBlend).to({ step: 100 }, interval, Phaser.Easing.Linear.None, 0);
  	// add an anonomous function with lexical scope to change the tint, calling Phaser.Colour.interpolateColor
    colorTween.onUpdateCallback(() => {
        imageFile.tint = Phaser.Color.interpolateColor(startColor, endColor, 100, colorBlend.step);
    });
  	// set object to the starting colour
    imageFile.tint = startColor;
  	// if you passed a callback, add it to the tween on complete
    colorTween.onComplete.add(function() {
      interval = 0;
      startColor = endColor;
    }, this);

  	// finally, start the tween
    colorTween.start();
  }
}

function fireDistort() {
  if (interval <= 0) {
    // here we only need to make use of 'interval' variable as a 'flag'
    interval = 1;
    fullImagePosition();

    // distort image sprite as sine wave with fixed base
    filterX = game.add.filter('SinewaveFixedBase', game.width, game.height);
    filterX.spriteTexture = imageFile.texture;

    // fire overlay effect
    background = game.add.sprite(0, 0);
    background.width = game.width;
    background.height = game.height;
    filterY = game.add.filter('Fire', game.width, game.height);
    filterY.alpha = 0.3;

    imageFile.filters = [filterX];
    background.filters = [filterY];
  }
  else {
    if (filterX != null) { filterX.update(); }
    if (filterY != null) { filterY.update(); }
  }
}

// function underseaOverlay() {
//   if (interval <= 0) {
//     // here we only need to make use of 'interval' variable as a 'flag'
//     interval = 1; //randomize(0, 1000);
//
//     // undersea overlay effect
//     background = game.add.sprite(0, 0);
//     background.width = game.width;
//     background.height = game.height;
//     filterY = game.add.filter('Undersea', game.width, game.height);
//
//     background.filters = [filterY];
//   }
//   else {
//     // if (filterX != null) { filterX.update(); }
//     if (filterY != null) { filterY.update(); }
//   }
// }

function bacteriaOverlay() {
  if (interval <= 0) {
    // here we only need to make use of 'interval' variable as a 'flag'
    interval = 1;
    filterX = new Phaser.Filter(game, null, game.cache.getShader('bacteria'));
    filterX.addToWorld(0, 0 ,game.width, game.height);
  }
  else {
    if (filterX != null) { filterX.update(); }
  }
}

function marbleOverlay() {
  if (interval <= 0) {
    // here we only need to make use of 'interval' variable as a 'flag'
    interval = 1;

    // marble overlay effect
    background = game.add.sprite(0, 0);
    background.width = game.width;
    background.height = game.height;
    filterY = game.add.filter('Marble', game.width, game.height);
    filterY.alpha = 0.2;

    background.filters = [filterY];
  }
  else {
    //if (filterX != null) { filterX.update(); }
    if (filterY != null) { filterY.update(); }
  }
}

function pointilize() {
  //points and lines to draw over bitmapData view to be created
  if (imageView == null) {
    for (var c = 0; c < 50; c++) {
        lines.push(new Phaser.Line(game.world.randomX, game.world.randomY,
          game.world.randomX, game.world.randomY));
    }

    // 'blank' bitmap data block
    imageView = game.add.bitmapData(game.width, game.height);
    imageView.addToWorld();
  }
  else {
    var rect = new Phaser.Rectangle(0, 0, imageView.width, imageView.height);

    for (var c = 0; c < lines.length; c++) {
      rect.random(p);
      //  We'll floor it as setPixel needs integer values and random returns floats
      p.floor();
      imageView.setPixel(p.x, p.y, colors[w].r, colors[w].g, colors[w].b);

      lines[c].random(p);
      p.floor();
      imageView.setPixel(p.x, p.y, colors[w].r, colors[w].g, colors[w].b);
    }

    w = game.math.wrapValue(w, 1, 359);
  }
}

function pixelate() {
  if (interval <= 0) {
    //interval = randomize(5000, 10000);
    interval = game.rnd.integerInRange(5000, 10000);
    filterX = game.add.filter('Pixelate', game.width, game.height);
    imageFile.filters = [filterX];
    game.add.tween(filterX).to( { sizeX: 100, sizeY: 100 }, interval, "Quad.easeInOut", true, 0, -1, true);
  }
}

function rotozoomify() {
  if (interval <= 0) {
    // here we only need to make use of 'interval' variable as a 'flag'
    interval = 1;
    fullImagePosition();

    filterX = game.add.filter('Rotozoomer', game.width, game.height);
    filterX.spriteTexture = imageFile.texture;
    imageFile.filters = [filterX];
  }
  else {
    if (filterX != null) { filterX.update(); }
  }
}

function blurXY() {
  if (interval <= 0) {
    //interval = randomize(0, 100);
    interval = game.rnd.integerInRange(0, 100);
    filterX = game.add.filter('BlurX');
	  filterY = game.add.filter('BlurY');

    filterX.blur = interval;
    //filterY.blur = randomize(0, 100);
    filterY.blur = game.rnd.integerInRange(0, 100);

    imageFile.filters = [filterX, filterY];
  }
}
