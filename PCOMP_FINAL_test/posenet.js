let video;
let poseNet;
let poses = [];

function setup() {
    createCanvas(640, 480);
    video = createCapture(VIDEO);
    video.size(width, height);

    // 创建 PoseNet 模型
    poseNet = ml5.poseNet(video, modelReady);
    poseNet.on('pose', gotPoses);

    video.hide();
}

function modelReady() {
    console.log('Model Ready');
}

function gotPoses(results) {
    poses = results;
}

function draw() {
    image(video, 0, 0, width, height);

    // 绘制检测到的姿态
    drawPoses();
}

function drawPoses() {
    for (let i = 0; i < poses.length; i++) {
        // 对于每个姿态，绘制关键点和骨架
        let pose = poses[i].pose;

        for (let j = 0; j < pose.keypoints.length; j++) {
            let keypoint = pose.keypoints[j];
            if (keypoint.score > 0.2) {
                fill(255, 0, 0);
                noStroke();
                ellipse(keypoint.position.x, keypoint.position.y, 10, 10);
            }
        }

        let skeleton = poses[i].skeleton;
        for (let j = 0; j < skeleton.length; j++) {
            let partA = skeleton[j][0];
            let partB = skeleton[j][1];
            stroke(255, 0, 0);
            line(partA.position.x, partA.position.y, partB.position.x, partB.position.y);
        }
    }
}
