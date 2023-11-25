let video;
let detections;
let eyeImages = [];
let eyeIndex = 0;

function preload() {
  eyeImages.push(loadImage('image/eye1.png'));
  eyeImages.push(loadImage('image/eye2.png'));
}

function setup() {
  createCanvas(640, 480);
  video = createCapture(VIDEO);
  video.size(width, height);
  video.hide();

  // 初始化 face-api.js
  faceapi.nets.tinyFaceDetector.loadFromUri('/models');
  faceapi.nets.faceLandmark68TinyNet.loadFromUri('/models');
}

function draw() {
  image(video, 0, 0, width, height);

  if (detections) {
    // 根据面部追踪数据调整眼睛图片的位置
    let eyePosX = detections.parts.leftEye[0].x; // 示例，获取左眼位置
    let eyePosY = detections.parts.leftEye[0].y;

    // 在这里调整眼睛图片位置
    image(eyeImages[eyeIndex], eyePosX, eyePosY, 50, 50);
  }
}

async function detectFace() {
  const options = new faceapi.TinyFaceDetectorOptions();
  const useTinyModel = true;

  const result = await faceapi.detectSingleFace(video.elt, options)
    .withFaceLandmarks(useTinyModel);
  
  if (result) {
    detections = result.landmarks;
  }
}

// 每隔一段时间检测一次
setInterval(detectFace, 100);
