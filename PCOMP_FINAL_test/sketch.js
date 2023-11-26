var textEffects = []; // 存储所有文字特效的数组
var eyeImages = [];
var transformationVideo = [];
var timer = 0;
let interval = 3000;
var eyeIndex = 0;
var isVideoPlaying = false;
var isbodytextPlaying = false;
let poseNet;
let nosePosition = null;
let video;
let Screenwidth = 1512;
let Screenheight = 945;
let eyeShiftx;
let eyeShifty;

function setup() {
  createCanvas(Screenwidth, Screenheight);

  //body text video code
  videoBodytext = createVideo('video/bodytext.mp4');
  slider = createSlider(0, 4, 0, 0.1);
  slider.position(10, 10);
  videoBodytext.speed(0);
  slider.input(function() {
    videoBodytext.speed(slider.value());
  });
  videoBodytext.hide();
  videoBodytext.onended(bodytextvideoEnded);

  //transformation video code
  transformationVideo.push(createVideo('video/lychking.mp4'));
  transformationVideo[0].hide();
  transformationVideo[0].onended(videoEnded);

  //video eye tracking code
  video = createCapture(VIDEO);
  
  video.hide();
  poseNet = ml5.poseNet(video, modelReady);
  poseNet.on('pose', gotPoses);

}
function preload() {
  robotImg = loadImage('image/robot.png');
  eyeImages.push(loadImage('image/eye1.png'));
  eyeImages.push(loadImage('image/eye2.png'));
}


function draw() {
  background(255);


  //image(video, 0, 0, width, height);
  let currentTime = millis(); // 获取当前时间
  if (currentTime - timer > interval) {
    if(eyeIndex < eyeImages.length - 1){
      eyeIndex++;
    }else{
      eyeIndex = 0;
    }
    timer = currentTime; 
  }

  image(eyeImages[eyeIndex], 0+eyeShiftx, 0+eyeShifty, Screenwidth, Screenheight);//眼睛形状蒙版，确保画面不会超出眼睛形状

  image(robotImg, 0, 0, Screenwidth, Screenheight);//人物形状蒙版，确保画面不会超出人物形状
  if(millis() < 2000){
    //triggerVideo();
    triggerbodytextvideo();
  }
  if (isVideoPlaying) {
    image(transformationVideo[0], 0, 0, Screenwidth, Screenheight);
  }

  //posenet code
  

  if (nosePosition) {
    // 根据鼻子的位置调整眼睛的位置
    let eyeX = map(nosePosition.x,0, Screenwidth, Screenwidth,0) - 440 ; // 这里你可能需要添加偏移量
    let eyeY = nosePosition.y+280; // 这里你可能需要添加偏移量
    eyeShiftx = map(eyeX, 0, Screenwidth, -70,70);
    eyeShifty = map(eyeY, 0, Screenheight, -70,70);
    console.log(eyeX, eyeY);
    // let eyeX = nosePosition.x;
    // let eyeY = nosePosition.y;
    fill(255, 0, 0);
    rectMode(CENTER);
    //ellipse(eyeX, eyeY, 50);
  }

//bodytexting code while charging energy
  if (isbodytextPlaying) {
    image(videoBodytext, 0, 0, Screenwidth, Screenheight);
 }
}

function triggerbodytextvideo(){
  if(!isbodytextPlaying){
    videoBodytext.play();
    isbodytextPlaying = true;
  }
}
function triggerVideo() {
  // 检查视频是否已经在播放
  if (!isVideoPlaying) {
    transformationVideo[0].play();
    //transformationVideo[0].show(); // 显示视频
    isVideoPlaying = true; // 更新播放状态
  }
}
function videoEnded() {
  console.log('视频播放结束');
  isVideoPlaying = false; // 更新播放状态
  transformationVideo[0].hide(); // 隐藏视频
  // 在这里添加视频播放结束后的逻辑
}
function bodytextvideoEnded() {
  console.log('视频播放结束');
  isbodytextPlaying = false; // 更新播放状态
  videoBodytext.hide(); // 隐藏视频
  // 在这里添加视频播放结束后的逻辑
}

function modelReady() {
  console.log("Model Ready");
}

function gotPoses(poses) {
  if (poses.length > 0) {
    let pose = poses[0].pose;
    // 获取鼻子的位置
    nosePosition = pose.nose;
  }
}