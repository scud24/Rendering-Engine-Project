/*****
 * @author Zachary Wartell
 *
 * @version 1.x-5
 *
 *****/

/**
 * @author Zachary Wartell using Code Listing 10.1 from Matsuda, Kouichi; Lea, Rodger (see REFERENCE)
 * @description
 * This functions initializes several event handlers that implement a simple mouse user interface for 3D object rotation.
 *
 * The event handlers detect mouse motion when the left-button is held down.   The xy cursor
 * motion is used to compute and update two rotation angles stored in Array "currentAngle" . The values are:
 *
 *      [x-axis rotation angle, y-axis rotation angle]
 *
 * After mouseRotation_initEventHandlers is called the rotation angles stored in "currentAngle" will be continuously updated.
 * x-axis rotation is clamps to [-90,90] degrees. y-axis rotation is allowed to have arbitrary value.
 *
 *
 * @param {Object} canvas - HTML 5 Canvas
 * @param {Number[]} currentAngle - Array of 2 numbers contain x-axis and y-axis rotation angles
 **/
 
 
function mouseRotation_initEventHandlers(canvas, currentAngle) {
canvas.addEventListener(
        "mousedown",
        function(ev) {
            handleMouseDown(ev, canvas);
        });
canvas.addEventListener(
        "mousemove",
        function(ev) {
            handleMouseDrag(ev, canvas, currentAngle);
        });
canvas.addEventListener(
        "mouseup",
        function(ev) {
            handleMouseUp(ev, canvas);
        });
}
function handleMouseDrag(ev, canvas, currentAngle) {
    //console.log("Drag");
	var x = ev.clientX; // x coordinate of a mouse pointer
    var y = ev.clientY; // y coordinate of a mouse pointer
    var rect = ev.target.getBoundingClientRect();
	    // Student Note: 'ev' is a MouseEvent (see https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent)

    // convert from canvas mouse coordinates to GL normalized device coordinates
    x = ((x - rect.left) - canvas.width / 2) / (canvas.width / 2);
    y = (canvas.height / 2 - (y - rect.top)) / (canvas.height / 2);
	
	
	var turnRate = -20;
	if(dragContinuous)
	{
		
		var xdist = x-xLast;
		var ydist = y-yLast;
		
		currentAngle[0]+=ydist*turnRate;
		currentAngle[1]+=xdist*turnRate;
	}
	xLast = x;
	yLast = y;
}
function handleMouseDown(ev, canvas) {
	
	var x = ev.clientX; // x coordinate of a mouse pointer
    var y = ev.clientY; // y coordinate of a mouse pointer
    var rect = ev.target.getBoundingClientRect();
	    // Student Note: 'ev' is a MouseEvent (see https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent)

    // convert from canvas mouse coordinates to GL normalized device coordinates
    x = ((x - rect.left) - canvas.width / 2) / (canvas.width / 2);
    y = (canvas.height / 2 - (y - rect.top)) / (canvas.height / 2);
	
    //console.log("down");
	xLast = x;
	yLast = y;
    dragContinuous = true;
	
}
function handleMouseUp(ev, canvas) {
    //console.log("up");
    dragContinuous = false;
}

function lightRotation_initEventHandlers(canvas, currentAngle) {

}