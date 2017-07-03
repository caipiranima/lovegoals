//http://www.emanueleferonato.com/2014/12/05/html5-phaser-tutorial-how-to-create-a-level-selection-screen-with-locked-levels-and-stars-finished-prototype/
// default Phaser.Game instance
var game = new Phaser.Game(1920, 1080, Phaser.AUTO, "");
// variable for general sound ambience
var music;

// global game variables
game.global = {
	levelFlow : ["Floresta", "Entrada", "Corredor01", "Corredor02", "Bunker"],
	// level currently playing
	level : 0
}

// game states
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

// if there isn't previous references to the video screen in the bunker...
if (localStorage.getItem('screens') == null || game.global.level == 0)
{
	// ...that means that the user didn't get to interact with the bunker yet
	game.state.start("Floresta");
}
else {
	// redirect user to bunker without passing through the previous levels all over again
	game.state.start("Bunker");
}
