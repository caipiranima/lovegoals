//http://www.emanueleferonato.com/2014/12/05/html5-phaser-tutorial-how-to-create-a-level-selection-screen-with-locked-levels-and-stars-finished-prototype/
// default Phaser.Game instance
var game = new Phaser.Game(1920, 1080, Phaser.AUTO, "");
// variables for general glitch overlay
var imageView = null;
var interval = 0;

// variable for general sound ambience
var music;

// global game variables
game.global = {
	levelFlow : ["Boot", "Floresta", "Entrada", "Corredor01", "Corredor02", "Bunker"],
	// level currently playing
	startBunker : false
};

// game states
// BOOT
game.state.add("Boot", boot);
// LEVEL 0
game.state.add("Floresta", floresta);
// LEVEL 1
game.state.add("Entrada", entrada);
// LEVEL 2
game.state.add("Corredor01", corredor01);
// LEVEL 3
game.state.add("Corredor02", corredor02);
// LEVEL 4
game.state.add("Bunker", bunker);

// start me up!
game.state.start("Boot");
