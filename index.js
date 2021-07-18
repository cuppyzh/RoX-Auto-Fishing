const robot = require('robotjs')

const greenHexColor = "c4f16a";
const colorThreshold = 0.95;

let pointedColor = "";
let pointerLocationX = 0;
let pointerLocationY = 0;

let calibratingState = false;
let calibratingCounter = 5;

let fishingState = false;

const delay = ms => new Promise(resolve => setTimeout(resolve, ms))

Main()

async function Main(){
  do {
    const { currentPointerX, currentPointerY } = robot.getMousePos()

    if (!calibratingState){
      console.log("Calibrating Starting in 5 second.. Place your mouse where green area will appear (inside fishing icon), don't move it!")
      await delay(3000)

      do {
        console.log("..",calibratingCounter)
        await delay(1000)
        
        calibratingCounter -= 1
      } while(calibratingCounter>=1)

      const { x, y } = robot.getMousePos()
      pointedColor = robot.getPixelColor(x, y)

      calibratingState = true
      pointerLocationX = x
      pointerLocationY = y

      console.log("Calibrating done, set up on X: ",pointerLocationX, "Y: ", pointerLocationY, "Color: #", pointedColor)
    }

    if (!fishingState 
      && hexColorDelta(robot.getPixelColor(pointerLocationX, pointerLocationY), pointedColor) >= colorThreshold){
      robot.moveMouse(pointerLocationX, pointerLocationY)
      robot.mouseClick();
      robot.moveMouse(currentPointerX,currentPointerY)
      fishingState = true

      console.log("Start Fishing State")
    } else if (fishingState
      && hexColorDelta(robot.getPixelColor(pointerLocationX, pointerLocationY), greenHexColor) >= colorThreshold) {
      robot.moveMouse(pointerLocationX, pointerLocationY)
      robot.mouseClick();
      robot.moveMouse(currentPointerX,currentPointerY)

      console.log("Catch!")
      fishingState = false
    }

    await delay(100)
  } while(true!=false)
}


function hexColorDelta(hex1, hex2) {
  // get red/green/blue int values of hex1
  var r1 = parseInt(hex1.substring(0, 2), 16);
  var g1 = parseInt(hex1.substring(2, 4), 16);
  var b1 = parseInt(hex1.substring(4, 6), 16);

  // get red/green/blue int values of hex2
  var r2 = parseInt(hex2.substring(0, 2), 16);
  var g2 = parseInt(hex2.substring(2, 4), 16);
  var b2 = parseInt(hex2.substring(4, 6), 16);

  // calculate differences between reds, greens and blues
  var r = 255 - Math.abs(r1 - r2);
  var g = 255 - Math.abs(g1 - g2);
  var b = 255 - Math.abs(b1 - b2);

  // limit differences between 0 and 1
  r /= 255;
  g /= 255;
  b /= 255;

  // 0 means opposit colors, 1 means same colors
  return (r + g + b) / 3;
}