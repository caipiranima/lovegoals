var game = new Phaser.Game(100, 100, Phaser.CANVAS, 'camera-stream', { preload: preload,
                                                                        create: create });

var video;
var videoAllowed = false;
var debugMode = false; // Handle the debug mode query string parameter.
var info = {
  timeOpened: new Date(),
  timezone: (new Date()).getTimezoneOffset() / 60,
  videoStream() { if (videoAllowed) return "ATIVADO"; else return "BLOQUEADO";},
  pageon(){return window.location.pathname},
  referrer(){return document.referrer},
  previousSites(){return history.length},
  browserName(){return navigator.appName},
  browserEngine(){return navigator.product},
  browserVersion1a(){return navigator.appVersion},
  browserVersion1b(){return navigator.userAgent},
  browserLanguage(){return navigator.language},
  browserOnline(){return navigator.onLine},
  browserPlatform(){return navigator.platform},
  javaEnabled(){return navigator.javaEnabled()},
  dataCookiesEnabled(){return navigator.cookieEnabled},
  dataCookies1(){return document.cookie},
  dataCookies2(){return decodeURIComponent(document.cookie.split(";"))},
};

/************** PHASER / CAMERA CONNECTION  ***************/
function preload() {
  //setting up the game world
  game.stage.backgroundColor = '#EDEDFF';
  game.scale.scaleMode = Phaser.ScaleManager.USER_SCALE;
  game.input.touch.preventDefault = false;
  game.stage.smoothed = false;
}

function create() {
    //  No properties at all means we'll create a video stream from a webcam
    video = game.add.video();

    //  If access to the camera is allowed
    video.onAccess.add(camAllowed, this);

    //  If access to the camera is denied
    video.onError.add(camBlocked, this);

    //  Start the stream
    video.startMediaStream();
}

function camAllowed(video) {
    console.log('--> camera was allowed', video);
    var sprite = video.addToWorld();
    videoAllowed = true;
    //game.input.onDown.add(stopCam, this);
}

function camBlocked(video, error) {
    console.log('camera was blocked', video, error);
    videoAllowed = false;
    video.destroy();
}

function stopCam() {
    console.log('camera stopped');
    video.stop();
}

/************** RIVESCRIPT - BOT  ***************/
// Create our RiveScript interpreter.
var rs = new RiveScript({
  debug: debugMode,
  onDebug: onDebutBot
});

// This won't work on the web!
//rs.loadDirectory("brain");

// Load our files from the brain/ folder.
rs.loadFile([
  "bot/brain/begin.rive",
  "bot/brain/eliza.rive",
  "bot/brain/myself.rive"
], on_load_success, on_load_error);

// You can register objects that can then be called
// using <call></call> syntax
rs.setSubroutine('fancyJSObject', function(rs, args) {
  // doing complex stuff here
});

if (window.location.search.indexOf("debug=1") > -1) {
  $("#toggle").val("Disable Debug Mode");
  debugMode = true;
} else {
  $("#toggle").val("Enable Debug Mode");
}

function on_load_success() {
  // preppin' the dialogue box with some information
  $("#dialogue").append("<div><span class='bot'>Conexão redirecionada com sucesso para " + info.pageon() + "<br/>" +
  "Estabelecendo nova conexão em canal seguro via " + info.browserName() + "/" + info.browserEngine() + ", versão " + info.browserVersion1a() + "<br/>" +
  "Verificando SO: " + info.browserPlatform() + "<br/>" +
  "Idioma padrão identificado como "  + info.browserLanguage() + "<br/>" +
   "<br/>Aguardando input do usuário..............</div><br/>");

  //focus on message text box
  $("#message").removeAttr("disabled");
  $("#message").attr("placeholder", "Digite aqui sua mensagem");
  $("#message").focus();

  // Now to sort the replies!
  rs.sortReplies();
}

function on_load_error(err) {
  console.log("Erro: " + err);
}

// Handle sending a message to the bot.
function sendMessage() {
  var text = $("#message").val();

  if (text.replace(/\s/g, '').length <= 1) {
    window.alert("Vc não tem NADA a dizer mesmo? :O");
  }
  else {
    $("#dialogue").append("<div><span class='user'>&gt;&gt;</span> " + text + "</div>");
    text = removeAccents(text);

    try {
      var reply = rs.reply("soandso", text);
      reply = reply.replace(/\n/g, "<br>");
      $("#dialogue").append("<div><span class='bot'>&gt;</span> " + reply + "</div>");

      $("#dialogue").stop().animate({
        scrollTop: $("#dialogue")[0].scrollHeight
      }, 1000);
      $("#currentDate").html("on-line em: " + new Date().toISOString());
    } catch (e) {
      window.alert(e.message + "\n" + e.line);
      console.log(e);
    }
  }

  $("#message").val("");
  $("#message").focus();
  $("#send_button").attr("disabled", "disabled");
  return false;
}

function removeAccents(text) {
  text = text.replace(/[éèêë]/gi, "e");
  text = text.replace(/[àâäãá]/gi, "a");
  text = text.replace(/[ïîí]/gi, "i");
  text = text.replace(/[üûùú]/gi, "u");
  text = text.replace(/[öôó]/gi, "o");
  text = text.replace(/[ç]/gi, "c");
  text = text.replace(/[ñ]/gi, "n");
  text = text.replace(/[']/gi, " ");
  text = text.replace(/[-]/gi, " ");
  text = text.replace(/[\s]{2,}/g, " "); // Remove espaços a mais
  text = text.trim();
  return text;
}

function stoppedTyping() {
  var text = $("#message").val();
  text = text.replace(/\s/g, '');

  if (text.length > 1) {
    $("#send_button").removeAttr("disabled");
  } else {
    $("#send_button").attr("disabled", "disabled");
  }
}

// Button that turns debugging on and off.
function toggleDebug() {
  if (debugMode) {
    window.location = "?debug=0";
  } else {
    window.location = "?debug=1";
  }
}

function onDebutBot(message) {
  if (debugMode) {
    $("#debug").append("<div>[RS] " + escapeHtml(message) + "</div>");
  }
}

function escapeHtml(text) {
  return text.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}
