let synth;

function setup() {
    createCanvas(800, 600);
    synth = new Tone.Synth().toMaster();
    background(220);
    let startButton = createButton("Start Audio");
    startButton.mousePressed(() => {
        started = true;
        Tone.context.resume();
    });
}

function draw() {
    // 如果你想在画布上显示内容，可以在这里添加代码
}

function mousePressed() {
    if (Tone.context.state !== 'running') {
        Tone.context.resume();
    }
    // 计算音高，基于点击位置
    let pitch = map(mouseX, 0, width, 100, 1000);
    let frequency = Tone.Frequency(pitch, "midi");
    let note = frequency.toNote();

    // 播放音符
    synth.triggerAttackRelease(note, "8n");
}
