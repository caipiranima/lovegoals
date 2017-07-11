var screens = [];
var screensSprites = [];

// array of positions
var POSITION_DEFS = [{
        x: 242,
        y: 202,
        w: 225,
        h: 107
    },{
        x: 870,
        y: 225,
        w: 225,
        h: 107
    },{
        x: 1137,
        y: 225,
        w: 225,
        h: 107
    },{
        x: 1665,
        y: 249,
        w: 225,
        h: 107,
        s: 1.2
    },{
        x: 15,
        y: 340,
        w: 150,
        h: 107
    },{
        x: 230,
        y: 356,
        w: 136,
        h: 100
    },{
        x: 434,
        y: 369,
        w: 126,
        h: 100
    },{
        x: 614,
        y: 368,
        w: 126,
        h: 100
    },{
        x: 789,
        y: 378,
        w: 126,
        h: 100
    },{
        x: 962,
        y: 372,
        w: 126,
        h: 100
    },{
        x: 1132,
        y: 374,
        w: 126,
        h: 100
    },{
        x: 1310,
        y: 368,
        w: 126,
        h: 100
    },{
        x: 1498,
        y: 354,
        w: 126,
        h: 100
    },{
        x: 12,
        y: 476,
        w: 153,
        h: 112
    },{
        x: 232,
        y: 478,
        w: 131,
        h: 102
    },{
        x: 434,
        y: 480,
        w: 126,
        h: 100
    },{
        x: 620,
        y: 480,
        w: 126,
        h: 100
    },{
        x: 792,
        y: 478,
        w: 126,
        h: 100
    },{
        x: 968,
        y: 477,
        w: 126,
        h: 100
    },{
        x: 1142,
        y: 476,
        w: 126,
        h: 100
    },{
        x: 1314,
        y: 472,
        w: 126,
        h: 100
    },{
        x: 1503,
        y: 465,
        w: 126,
        h: 100
    },{
        x: 1668,
        y: 420,
        w: 225,
        h: 107
    },{
        x: 10,
        y: 618,
        w: 168,
        h: 107,
        s: 1.2
    },{
        x: 200,
        y: 608,
        w: 185,
        h: 107,
        s: 1.1
    },{
        x: 400,
        y: 601,
        w: 164,
        h: 107
    },{
        x: 582,
        y: 596,
        w: 162,
        h: 107
    },{
        x: 766,
        y: 588,
        w: 162,
        h: 107
    },{
        x: 944,
        y: 588,
        w: 162,
        h: 107
    },{
        x: 1107,
        y: 590,
        w: 162,
        h: 107
    },{
        x: 1288,
        y: 590,
        w: 162,
        h: 107
    },{
        x: 1486,
        y: 590,
        w: 160,
        h: 107,
        s: 1.1
    },{
        x: 1692,
        y: 593,
        w: 156,
        h: 107,
        s: 1.1
    }
];

// array of video references from YouTube
// in order: ANITA (11) -> FABIANA (11) -> MIRANDA (11)
var VIDEO_DEFS = ['AxkuUCPH6D0',
                  'F4-R4GavWY8',
                  '-ES84W6Bb_s',
                  'SAjsnxPw26g',
                  '5UvBOJi2_HY',
                  'b6wcOfiecvo',
                  'GDtufnDYgVM',
                  '4DZpqUv6dmg',
                  '88W-3bBvMkE',
                  '0yaV_y7FcF4',
                  'awqcr6I9a_0',
                  '1M7AQ2JaQg8',
                  '7EcleG_MLv8',
                  'vZYh8hk9gSE',
                  'KzDHdLFtfHE',
                  'DJVCA9803iA',
                  'yQuwJca6QLQ',
                  'QlgtlhttS24',
                  '9Af83ictC_s',
                  'wpWqViIPyBw',
                  'nCkHQkblNyU',
                  'qtu0R75Cvbc',
                  'mE2jEZekGLM',
                  'dpVIVm2aj4k',
                  'NXQ7YJoXQQE',
                  'P9jgtHpu_Vw',
                  '4uyzr_FdG8A',
                  'JbyWk7KNZJo',
                  'b8RNNNZQAW0',
                  'JeBeuXrEgRI',
                  'xHb-6v4d6qw',
                  'iAX6H1UE_D4',
                  '9PJw1U0_rns']

bunker = {
  init: function() {
    game.scale.pageAlignHorizontally = true;
    game.scale.pageAlignVertically = true;
    game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
    game.scale.parentIsWindow = true;
  },
  preload: function() {
    //loading background image
    game.load.image('bunker', 'img/bunker.png');

    var nArray = [];
    for (i = 1; i < 34; i++) {
        nArray.push(i);
        game.load.image('m'+i, 'img/miniaturas-videos/'+i+'.png');
    }

    if (localStorage.getItem('screens') == null) {
        nArray = this.shuffle(nArray);

        for (i = 0; i < 33; i++) {
            screens.push({
                x: POSITION_DEFS[i].x,
                y: POSITION_DEFS[i].y,
                w: POSITION_DEFS[i].w,
                h: POSITION_DEFS[i].h,
                s: POSITION_DEFS[i].s,
                nImage: nArray[i],
                video: 'https://www.youtube.com/embed/' + VIDEO_DEFS[nArray[i]-1],
                watched: false
            });
        }

        localStorage.setItem('screens', JSON.stringify(screens));
    } else {
        screens = JSON.parse(localStorage.getItem('screens'));
    }
  },
  create: function() {
    for (i = 0; i < 33; i++) {
        var s = game.add.sprite(screens[i].x, screens[i].y, 'm'+screens[i].nImage);
        s.crop(new Phaser.Rectangle((225 - screens[i].w)/2, (107 - screens[i].h)/2, screens[i].w, screens[i].h));
        if (screens[i].s) {
            s.scale.setTo(screens[i].s, screens[i].s)
        }
        s.inputEnabled = true;
        s.events.onInputDown.add(function(sprite, pointer) {
            if (pointer.rightButton.isDown) {
                return;
            }

            screens[this.nScreen].watched = true;
            localStorage.setItem('screens', JSON.stringify(screens));
            screensSprites[this.nScreen].alpha = 0.3;

            var modal = new Custombox.modal({
              content: {
                effect: 'fadein',
                target: screens[this.nScreen].video
              }
            });
            modal.open();
          },
          { nScreen: i }
        );
        s.input.useHandCursor = true;

        if (screens[i].watched) {
            s.alpha = 0.3;
        }
        screensSprites.push(s);
    }

    var bunker = game.add.sprite(0, 0, 'bunker');
    game.sound.stopAll();
  },
  shuffle: function(array) {
      var currentIndex = array.length, temporaryValue, randomIndex;

      // While there remain elements to shuffle...
      while (0 !== currentIndex) {

          // Pick a remaining element...
          randomIndex = Math.floor(Math.random() * currentIndex);
          currentIndex -= 1;

          // And swap it with the current element.
          temporaryValue = array[currentIndex];
          array[currentIndex] = array[randomIndex];
          array[randomIndex] = temporaryValue;
      }

      return array;
  }
}
