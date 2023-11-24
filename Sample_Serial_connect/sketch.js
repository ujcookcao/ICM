let port;
let connectBtn;
let stageStatus = 1;


function setup() {
  createCanvas(400, 400);
  background(220);

  // setup ports
  port = createSerial();
  
  let usedPorts = usedSerialPorts();
  if (usedPorts.length > 0) {
    port.open(usedPorts[0], 9600);
  }
  
  connectBtn = createButton('_Connect_');
  connectBtn.position(80, 200);
  connectBtn.mousePressed(connectBtnClick);

}

function draw() {
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
  executeStages();
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
  if (str == 2){
    stageStatus = 2;
  }else if(str == 3){
    stageStatus = 3;
  }
}
function executeStages(){
   switch(stageStatus) {
    case 1:
      // Default stage
      console.log("Stage: 1");
      ellipse(200,200,10);
      // Do something for stage 0
      break;
    case 2:
      // Stage 1
      console.log("Stage: 2");
      // Do something for stage 1
      ellipse(width/2, height/2, 50); // For example
      break;
    case 3:
      // Stage 2
      console.log("Stage: 3");
      // Do something for stage 2
      ellipse(width/2, height/2, 100); // For example
      break;
    case 4:
      // Stage 3
      console.log("Stage: 4");
      // Do something for stage 3
      ellipse(width/2, height/2, 150); // For example
      break;
    default:
      // If stageStatus is not 0, 1, 2, or 3
      console.log("Unknown Stage: " + stageStatus);
      // Handle unknown stage
  }
}