let port;
let connectBtn;
let stageStatus = 1;
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
let previoussStageStatus = 0;
let bodyvideoStartTime = 0;
let iseyesPlaying = false;

function setup() {
  createCanvas(Screenwidth, Screenheight);

  //----------------------------------------------------------------------------
  // setup ports
  port = createSerial();
  
  let usedPorts = usedSerialPorts();
  if (usedPorts.length > 0) {
    port.open(usedPorts[0], 9600);
  }
  
  connectBtn = createButton('_Connect_');
  connectBtn.position(80, 200);
  connectBtn.mousePressed(connectBtnClick);

  //----------------------------------------------------------------------------
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
 
  //----------------------------------------------------------------------------
  //transformation video code
  transformationVideo.push(createVideo('video/lychking.mp4'));
  transformationVideo[0].hide();
  transformationVideo[0].onended(videoEnded);
  //----------------------------------------------------------------------------
  //video eye tracking code
  video = createCapture(VIDEO);
  
  video.hide();
  poseNet = ml5.poseNet(video, modelReady);
  poseNet.on('pose', gotPoses);


}



function draw() {
  background(255);
  // this makes received text scroll up
  //copy(0, 0, width, height, 0, -1, width, height);

  // reads in complete lines and prints them at the
  // bottom of the canvas
  let str = port.readUntil("\n");
  if (str.length > 0) {
    changStatus(int(str));
    text(str, 10, height-20);
    console.log("stageStatus: ");
    console.log(stageStatus);
  }

  //根据时间变换眼睛表情
  let currentTime = millis(); // 获取当前时间
  if (currentTime - timer > interval) {
    if(eyeIndex < eyeImages.length - 1){
      eyeIndex++;
    }else{
      eyeIndex = 0;
    }
    timer = currentTime; 
  }


  executeStages();
  //posenet code
  
  if (nosePosition) {
    // 根据鼻子的位置调整眼睛的位置
    let eyeX = map(nosePosition.x,0, Screenwidth, Screenwidth,0) - 440 ; // 这里你可能需要添加偏移量
    let eyeY = nosePosition.y+280; // 这里你可能需要添加偏移量
    eyeShiftx = map(eyeX, 0, Screenwidth, -70,70);
    eyeShifty = map(eyeY, 0, Screenheight, -70,70);
    //console.log(eyeX, eyeY);
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
 if (iseyesPlaying) {
  image(eyeImages[eyeIndex], 0+eyeShiftx, 0+eyeShifty, Screenwidth, Screenheight);//眼睛形状蒙版，确保画面不会超出眼睛形状
}


 image(robotImg, 0, 0, Screenwidth, Screenheight);//人物形状蒙版，确保画面不会超出人物形状

 if (isVideoPlaying) {
  image(transformationVideo[0], 0, 0, Screenwidth, Screenheight);
}
  // changes button label based on connection status
//   if (!port.opened()) {
//     connectBtn.html('_Connect_');
//   } else {
//     connectBtn.html('Disconnect');
}

function connectBtnClick() {
  if (!port.opened()) {
    port.open('Arduino', 9600);
  } else {
    port.close();
  }
}
function changStatus(str){
  if (str == 1){
    stageStatus = 2;
  }
}
function executeStages(){
   switch(stageStatus) {

    case 1:
      // Stage 1: someone hold the hand and start to show the bodytexting video
      console.log("Stage: 1");
      if(stageStatus != previoussStageStatus){
        previoussStageStatus = stageStatus;
      }
      // Do something for stage 0
      break;
    case 2:
      // Stage 1
      if(bodyvideoStartTime == 0){
        bodyvideoStartTime = millis();
      }
      if(stageStatus != previoussStageStatus){
        triggerbodytextvideo();
        previoussStageStatus = stageStatus;
      }
      console.log("Stage: 2");
      // Do something for stage 1
  
      break;
    case 3:
      // Stage 2
      if(stageStatus != previoussStageStatus){
        triggerVideo();
        previoussStageStatus = stageStatus;
      }
      console.log("Stage: 3");
      // Do something for stage 2

      break;
    case 4:
      // Stage 3
      if(stageStatus != previoussStageStatus){
        iseyesPlaying = true;
        previoussStageStatus = stageStatus;
      }
      console.log("Stage: 4");
      // Do something for stage 3

      break;
    default:
      // If stageStatus is not 0, 1, 2, or 3
      console.log("Unknown Stage: " + stageStatus);
      // Handle unknown stage
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
  stageStatus = 4;
  // 在这里添加视频播放结束后的逻辑
}
function bodytextvideoEnded() {
  console.log('bodytext视频播放结束');
  isbodytextPlaying = false; // 更新播放状态
  videoBodytext.hide(); // 隐藏视频
  // 在这里添加视频播放结束后的逻辑
  //播放完bodyvideo后，开始播放transformation video
  stageStatus = 3;
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

function preload() {
  robotImg = loadImage('image/robot.png');
  eyeImages.push(loadImage('image/eye1.png'));
  eyeImages.push(loadImage('image/eye2.png'));
}

