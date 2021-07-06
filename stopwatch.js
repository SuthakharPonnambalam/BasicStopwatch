const CHANGE_TO_RESET = "Reset";
const CHANGE_TO_START = "Start";
const CHANGE_TO_STOP = "Stop";
const CHANGE_TO_LAP = "Lap";

const RENDER_TO_GREEN = "green";
const RENDER_TO_RED = "red";
const RENDER_TO_WHITE = "white";

var startStop = false;
var resetlap = false;
var max = 0;
var min = 0;
var prevRenderTime = 0;
var t2 = 0;

var minOccurance = 1;
var maxOccurance = 2;
var prevMinOccurance = 0;
var prevMaxOccurance = 0;

var T = (function () {
    'use strict';

    var timeElapsed  = 0,
        timeStarted = 0,
        splitCount = 0,
        update;

    return {
        timeStarted: timeStarted,
        timeElapsed: timeElapsed,
        splitCount: splitCount,
        update: update
    };
}());

// const timerState = {
//   timeStarted: 0,
//   timeElapsed: 0,
//   splitCount: 0,
//   update: undefined,
// };

function startTimer() {
  console.log("hello");
  //use spaces between if and brackets
  if (!startStop) {
    startStop = true;
    document.getElementById("start").innerHTML = CHANGE_TO_STOP;
    resetlap = false;
    document.getElementById("reset").innerHTML = CHANGE_TO_LAP;
    T.timeStarted = new Date().getTime() - T.timeElapsed;  //try using Date.now

    // Need setInterval as a variable so it can be cleared on stop/reset
    //indenting issues to be fixed here
    update = setInterval(postTime, 10);

    //Disable/enable appropriate buttons
    document.getElementById("reset").disabled = false;
    //	startButtons();

    return update;
  } else {
    startStop = false;
    document.getElementById("start").innerHTML = CHANGE_TO_START;
    resetlap = true;
    document.getElementById("reset").innerHTML = CHANGE_TO_RESET;
    clearInterval(update);
  }
}

//Freeze the timer
function stopTimer() {
  // Stop the interval updating
  clearInterval(update);
}

// Record split without stopping timer. Will add lap time at some point
function split() {
  T.splitCount++;
  document.getElementById("splits").innerHTML +=
    "</br><div class='displayLapClass' id=" +
    T.splitCount +
    "><div>Lap " +
    T.splitCount +
    "</div><div> " +
    rendersplit(timerState.timeElapsed) +
    "</div></div>";
  if (T.splitCount == 1) {
    document.getElementById(T.splitCount).style.color = RENDER_TO_GREEN;
    min = t2;
  }
  if (T.splitCount == 2) {
    if (t2 < min) {
      max = min;
      min = t2;
      minOccurance = T.splitCount;
      maxOccurance = 1;
      document.getElementById("2").style.color = RENDER_TO_GREEN;
      document.getElementById("1").style.color = RENDER_TO_RED;
    } else {
      max = t2;
      maxOccurance = T.splitCount;
      document.getElementById("1").style.color = RENDER_TO_GREEN;
      document.getElementById("2").style.color = RENDER_TO_RED;
    }
  }
  if (T.splitCount > 2) {
    if (mintime(t2, min)) {
      document.getElementById(minOccurance).style.color = RENDER_TO_GREEN;
      document.getElementById(prevMinOccurance).style.color = RENDER_TO_WHITE;
    }
    if (maxtime(t2, max)) {
      document.getElementById(maxOccurance).style.color = RENDER_TO_RED;
      document.getElementById(prevMaxOccurance).style.color = RENDER_TO_WHITE;
    }
  }
}

function mintime(x1, x2) {
  if (x1 < x2) {
    min = x1;
    prevMinOccurance = minOccurance;
    minOccurance = T.splitCount;
    return true;
  } else false;
}

function maxtime(x1, x2) {
  if (x1 > x2) {
    max = x1;
    prevMaxOccurance = maxOccurance;
    maxOccurance = T.splitCount;
    return true;
  } else false;
}

//Reset the timer to zero and clear splits
function reset() {
  if (resetlap) {
    resetlap = true;
    document.getElementById("reset").innerHTML = CHANGE_TO_LAP;
    clearInterval(update);
    T.timeStarted = 0;
    T.timeElapsed = 0;
    T.splitCount = 0;
    document.getElementById("timer").innerHTML = "00:00.00";
    startStop = false;
    document.getElementById("start").innerHTML = CHANGE_TO_START;
    prevRenderTime = 0;

    document.getElementById("splits").innerHTML = "<br></br>";
  } else {
    startStop = true;
    document.getElementById("start").innerHTML = CHANGE_TO_STOP;
    split();
  }
}

function rendersplit() {
  t2 = new Date().getTime() - T.timeStarted - prevRenderTime;
  const t1 = T.timeElapsed;
  prevRenderTime = t1;

  console.log(T.timeElapsed);

  var toRender = t2;

  var mins = Math.floor(toRender / 60000);
  toRender -= mins * 60000;
  var secs = Math.floor(toRender / 1000);
  toRender -= secs * 1000;
  var cent = Math.round(toRender / 10);

  return (
    addLeadingZero(mins) +
    ":" +
    addLeadingZero(secs) +
    "." +
    addLeadingZero(cent)
  );
}

function render() {
  T.timeElapsed = new Date().getTime() - T.timeStarted;
  console.log(T.timeElapsed);

  var toRender = T.timeElapsed;

  var mins = Math.floor(toRender / 60000);
  toRender -= mins * 60000;
  var secs = Math.floor(toRender / 1000);
  toRender -= secs * 1000;
  var cent = Math.round(toRender / 10);

  return (
    addLeadingZero(mins) +
    ":" +
    addLeadingZero(secs) +
    "." +
    addLeadingZero(cent)
  );
}

//helper function to make render neater
function addLeadingZero(n) {
  if (n <= 9) {
    return "0" + n;
  } else {
    return "" + n;
  }
}

// Post the time in the timer div
function postTime(time) {
  document.getElementById("timer").innerHTML = render(time);
}

document.getElementById("start").onclick = startTimer;
document.getElementById("reset").onclick = reset;
