var textEffects = []; // 存储所有文字特效的数组

function setup() {
  createCanvas(1512, 945);
  textEffects.push(new TextEffect(200, 300, "Hello"));
  slider = createSlider(0, 4, 0, 0.1);
  slider.position(10, 10);
  slider.input(function() {
    video.speed(slider.value());
  });
  video.play();
  video.speed(0);
}
function preload() {
  robotimg = loadImage('robot.png');
  //video = createVideo('video/bodytext.mp4');
}


function draw() {
  background(160, 0, 0);
  image(robotimg, 0, 0, 1512, 945);

  for (let textEffect of textEffects) {
    textEffect.move();
    textEffect.display();
  }
  image(video, 0, 0); 
}
//image(robotimg, 0, 0, 1512, 945);

class TextEffect {
  constructor(startX, startY, textContent) {
    this.pos = createVector(startX, startY); // 文字的起始位置
    this.velocity = createVector(1, 0); // 文字的移动速度和方向
    this.text = textContent; // 要显示的文本内容
  }

  move() {
    // 更新文字的位置
    this.pos.add(this.velocity);
  }

  display() {
    // 显示文字
    fill(255);
    strokeWeight(100);
    text(this.text, this.pos.x, this.pos.y);
  }

  // 如果需要，可以添加其他方法，例如检查文字是否超出了边界等
}
