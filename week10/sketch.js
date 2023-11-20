
var song;
var amp;
var button;
var weight = 3;
var volhistory = [];
var shapeList = [];
var threshhold;
var fft;
var x = 10;
var speed;
function toggleSong() {
  if (song.isPlaying()) {
    song.pause();
  } else {
    song.play();
  }
}

function preload() {
  song = loadSound('song2.mp3',loaded);
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  angleMode(DEGREES);
  button = createButton('toggle');
  button.mousePressed(toggleSong);
  song.play();
  amp = new p5.Amplitude();
  fft = new p5.FFT(0.9, 1024);
  song.setVolume(0.05);
}

function draw() {
  background(0);
  fft.analyze()
  threshhold = fft.getEnergy(20,200)

  var vol = amp.getLevel();
  console.log(vol);
  volhistory.push(vol);
  stroke(255);
  noFill();
  if(vol<0.02){
    shake = 0;
  }else{
    var shake = map(vol, 0.02, 0.03, 0, 20);
  }
  translate(width / 2+random(-shake, shake), height / 2+random(-shake, shake));
  var p = new shapeobject();
  shapeList.push(p);

  for (var i = shapeList.length-1; i >= 0; i--) {
    if(shapeList[i] && !shapeList[i].edges()){
      if (vol>0.01 && vol < 0.02) {
        speed = 1
      }else if(vol>0.02 && vol < 0.03){
        speed = 2
      }else if(vol>0.03){
        speed = 3
      }else{
        speed = 0
      }
    shapeList[i].update(speed);
    shapeList[i].show(vol);
  }else{
    shapeList.splice(i,1);
  }
  }
  strokeWeight(random(1,5));
  stroke(random(0,255),random(0,255),random(0,255));
  noFill();
  beginShape();
  for (var i = 0; i < 360; i++) {
    var r = map(volhistory[i], 0, 1, 10, (width+height)/2); 
    var x = 4*r * cos(i);
    var y = 4*r * sin(i);
    vertex(x, y);
  }
  if (volhistory.length > 360) {
    volhistory.splice(0, 1);
  }
  endShape();

}


class shapeobject{
  constructor(){
    this.pos = p5.Vector.random2D().mult(80);
    this.vel = createVector(0,0);
    this.acc = this.pos.copy().mult(random(0.0001,0.00001));
    this.w = random(3,20);
    this.color = [random(0,255),random(0,255),random(0,255)];
    this.shapeType = random(1, 3);
    this.pivot = [this.pos.x,this.pos.y, this.pos.x+this.w,this.pos.y, this.pos.x+this.w/2,this.pos.y+this.w];
  }
  update(speed){
    this.vel.add(this.acc);
    this.pos.add(this.vel);
    if(speed == 1){
      this.pos.add(this.vel)
    }else if(speed == 2){
      this.pos.add(this.vel)
      this.pos.add(this.vel)
      this.pos.add(this.vel)
    }else if(speed == 3){
      this.pos.add(this.vel)
      this.pos.add(this.vel)
      this.pos.add(this.vel)
      this.pos.add(this.vel)
      this.pos.add(this.vel)
    }

  }
  edges(){
    if(this.pos.x<-width/2 || this.pos.x>width/2 || this.pos.y<-height/2 || this.pos.y>height/2){
      return true;
    }else{
      return false;
    }
  }
  show(vol){
    var trans = map(vol, 0.015, 0.03, 30, 180);
    stroke(this.color[0], this.color[1], this.color[2], trans);
    fill(this.color[0], this.color[1], this.color[2], trans)
   
    if(this.shapeType < 2){
      ellipse(this.pos.x,this.pos.y,this.w,this.w);
    }else if(this.shapeType < 3){
      rect(this.pos.x,this.pos.y,this.w,this.w);
  } else{
    triangle(this.pivot[0], this.pivot[1], this.pivot[2], this.pivot[3], this.pivot[4], this.pivot[5]);

}
  }
}
function loaded(){
  console.log('loaded');
}
function mousePressed() {
  song.jump(x);
  x+=10;
}