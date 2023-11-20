
var song;
var button;

function setup() {
  createCanvas(200, 200);
  song = loadSound('song1.wav', loaded);
  background(51);
  song.addCue(3, changecolor, color(0, 0, 255));
  song.addCue(4, changecolor, color(255, 0, 255));
  amp = new p5.Amplitude();
  song.setVolume(0.3);
}

function togglePlaying() {
  if (!song.isPlaying()) {
    song.play();
    song.setVolume(0.3);
    button.html('pause');
  } else {
    song.pause();
    button.html('play');
  }
}
function changecolor(col) {
  background(col);
}
function loaded() {
  console.log('loaded');
  button = createButton('play');
  button.mousePressed(togglePlaying);
  buttonjump = createButton('jump');
  buttonjump.mousePressed(jumpSong);
  slider = createSlider(0, song.duration(), 0, 0.01);
}
function jumpSong() {
  song.jump(slider.value());
}
