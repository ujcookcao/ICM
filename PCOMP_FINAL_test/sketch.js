var textEffects = []; // 存储所有文字特效的数组
var eyeImages = [];
var transformationVideo = [];
var timer = 0;
let interval = 3000;
var eyeIndex = 0;
var isVideoPlaying = false;
function setup() {
  createCanvas(1512, 945);

  //body text video code
  videoBodytext = createVideo('video/bodytext.mp4');
  slider = createSlider(0, 4, 0, 0.1);
  slider.position(10, 10);
  videoBodytext.speed(0);
  slider.input(function() {
    videoBodytext.speed(slider.value());
  });
  videoBodytext.hide();

  //transformation video code
  transformationVideo.push(createVideo('video/lychking.mp4'));
  transformationVideo[0].hide();
  transformationVideo[0].onended(videoEnded);

}
function preload() {
  robotImg = loadImage('image/robot.png');
  eyeImages.push(loadImage('image/eye1.png'));
  eyeImages.push(loadImage('image/eye2.png'));
}


function draw() {
  background(255);

  let currentTime = millis(); // 获取当前时间
  if (currentTime - timer > interval) {
    if(eyeIndex < eyeImages.length - 1){
      eyeIndex++;
    }else{
      eyeIndex = 0;
    }
    timer = currentTime; 
  }

  image(eyeImages[eyeIndex], 0, 0, 1512, 945);//眼睛形状蒙版，确保画面不会超出眼睛形状

  image(robotImg, 0, 0, 1512, 945);//人物形状蒙版，确保画面不会超出人物形状
  if(millis() < 2000){
    triggerVideo();
  }
  if (isVideoPlaying) {
    image(transformationVideo[0], 0, 0, width, height);
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