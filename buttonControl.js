

export function startTimer() {
    if(!startStop){
        startStop = true;
        document.getElementById("start").innerHTML="Stop";
        resetlap = false;
        document.getElementById("reset").innerHTML="lap";
        T.timeStarted = new Date().getTime() - T.timeElapsed; 

	// Need setInterval as a variable so it can be cleared on stop/reset
	update = setInterval(postTime, 10);

	//Disable/enable appropriate buttons	
	document.getElementById("reset").disabled = false;	
	
	return update;
    }else{
        startStop = false;
        document.getElementById("start").innerHTML="start";
        resetlap = true;
        document.getElementById("reset").innerHTML="reset";
        clearInterval(update);


    }

	
}

//Freeze the timer
export function stopTimer(){
	clearInterval(update);
}

