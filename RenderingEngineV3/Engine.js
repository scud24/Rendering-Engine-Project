// Engine.js started from OBJviewer (c) 2012 matsuda and itami
// Vertex shader program
var VSHADER_SOURCE = 
  'attribute vec4 a_Position;\n' +
  'attribute vec4 a_Color;\n' +
  'attribute vec4 a_Normal;\n' +
  'uniform mat4 u_MvpMatrix;\n' +
  'uniform mat4 u_NormalMatrix;\n' +
  'varying vec4 v_Color;\n' +
  'void main() {\n' +
  '  vec3 lightDirection = vec3(-0.35, 0.35, 0.87);\n' +
  '  gl_Position = u_MvpMatrix * a_Position;\n' +
  '  vec3 normal = normalize(vec3(u_NormalMatrix * a_Normal));\n' +
  '  float nDotL = max(dot(normal, lightDirection), 0.0);\n' +
  '  v_Color = vec4(a_Color.rgb * nDotL, a_Color.a);\n' +
  '}\n';

// Fragment shader program
var FSHADER_SOURCE =
  '#ifdef GL_ES\n' +
  'precision mediump float;\n' +
  '#endif\n' +
  'varying vec4 v_Color;\n' +
  'void main() {\n' +
  '  gl_FragColor = v_Color;\n' +
  '}\n';

function main() {
  // Retrieve <canvas> element
  var canvas = document.getElementById('webgl');

  // Get the rendering context for WebGL
  var gl = getWebGLContext(canvas);
  if (!gl) {
    console.log('Failed to get the rendering context for WebGL');
    return;
  }

  // Set the clear color and enable the depth test
  gl.clearColor(0.2, 0.5, 0.2, 1.0);
  gl.enable(gl.DEPTH_TEST);
  
  var myModel = [];
  for (i=0;i<2;i++) {
    myModel[i] = new Object3D(gl, VSHADER_SOURCE, FSHADER_SOURCE );
  }

  // Calculate view projection matrix
  var viewProjMatrix = new Matrix4();
  viewProjMatrix.setPerspective(30.0, canvas.width/canvas.height, 1.0, 1000.0);
  viewProjMatrix.lookAt(0.0, 500.0, 20.0, 0.0, 0.0, 0.0, 0.0, 1.0, 0.0);

  // Start reading the OBJ file
  readOBJFile('cube.obj', gl, myModel[0], 20, true);
  readOBJFile('XYZ_Blocks.obj', gl, myModel[1], 40, true);

  var currentAngle = 0.0; // Current rotation angle [degree]
  var tick = function() {   // Start drawing
    currentAngle = animate(currentAngle); // Update current rotation angle
    draw(gl, myModel[0].program, currentAngle, 100.0, viewProjMatrix, myModel[0] );
    currentAngle = animate(currentAngle); // Update current rotation angle
    draw(gl, myModel[1].program, currentAngle, -100.0, viewProjMatrix, myModel[1] );
    requestAnimationFrame(tick, canvas);
  };
  tick();
}

// Read a file
function readOBJFile(fileName, gl, model, scale, reverse) {
  var request = new XMLHttpRequest();

  request.onreadystatechange = function() {
    if (request.readyState === 4 && request.status !== 404) {
      onReadOBJFile(request.responseText, fileName, gl, model, scale, reverse, i);
    }
  }
  request.open('GET', fileName, true); // Create a request to acquire the file
  request.send();                      // Send the request
}

// OBJ File has been read
function onReadOBJFile(fileString, fileName, gl, model, scale, reverse) {
  var objDoc = new OBJDoc(fileName);  // Create a OBJDoc object
  var result = objDoc.parse(fileString, scale, reverse); // Parse the file
  model.drawingInfo = null;
  if (!result) {
    model.objDoc      = null;
    model.drawingInfo = null;
    console.log("OBJ file parsing error.");
    return;
  }
  model.objDoc = objDoc;
}

// Drawing function
function draw(gl, program, angle, x, viewProjMatrix, model ) {
  gl.useProgram(program);
  if (model.objDoc != null && model.objDoc.isMTLComplete()){ // OBJ and all MTLs are available
    model.drawingInfo = onReadComplete(gl, model, program, model.objDoc);
    model.objDoc = null;
  }
  if (!model.drawingInfo) return;   // determine if model has been loaded

  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);  // Clear color and depth buffers

  model.modelMatrix.setTranslate(x,0.0,0.0);
  //model.modelMatrix.setRotate(angle, 1.0, 0.0, 0.0); // Properly rotate
  model.modelMatrix.rotate(angle, 0.0, 1.0, 0.0);
  model.modelMatrix.rotate(angle, 0.0, 0.0, 1.0);

  // Calculate the normal transformation matrix and pass it to u_NormalMatrix
  model.normalMatrix.setInverseOf(model.modelMatrix);
  model.normalMatrix.transpose();
  gl.uniformMatrix4fv(program.u_NormalMatrix, false, model.normalMatrix.elements);

  // Calculate the model view project matrix and pass it to u_MvpMatrix
  model.mvpMatrix.set(viewProjMatrix);
  model.mvpMatrix.multiply(model.modelMatrix);
  gl.uniformMatrix4fv(program.u_MvpMatrix, false, model.mvpMatrix.elements);

  initAttributeVariable(gl, program.a_Position, model.vertexBuffer); // Vertex coordinates
  initAttributeVariable(gl, program.a_Normal,   model.normalBuffer);   // Normal
  initAttributeVariable(gl, program.a_Color,    model.colorBuffer);
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, model.indexBuffer);  // Bind indices

  // Draw
  gl.drawElements(gl.TRIANGLES, model.numIndices, gl.UNSIGNED_SHORT, 0);
}


// Assign the buffer objects and enable the assignment
function initAttributeVariable(gl, a_attribute, buffer) {
  gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
  gl.vertexAttribPointer(a_attribute, buffer.num, buffer.type, false, 0, 0);
  gl.enableVertexAttribArray(a_attribute);
}

// OBJ File has been read completely
function onReadComplete(gl, model, program, objDoc) {
  // Acquire the vertex coordinates and colors from OBJ file
  var drawingInfo = objDoc.getDrawingInfo();

  model.vertexBuffer = initArrayBufferForLaterUse(gl, drawingInfo.vertices, 3, gl.FLOAT);
  model.normalBuffer = initArrayBufferForLaterUse(gl, drawingInfo.normals, 3, gl.FLOAT);
  model.colorBuffer  = initArrayBufferForLaterUse(gl, drawingInfo.colors, 4, gl.FLOAT);

  model.indexBuffer = initElementArrayBufferForLaterUse(gl, drawingInfo.indices, gl.UNSIGNED_BYTE);

  if (!model.vertexBuffer ||
      !model.normalBuffer ||
      !model.colorBuffer  ||
      !model.indexBuffer) return null; 

  model.numIndices = drawingInfo.indices.length;

  // Unbind the buffer object
  gl.bindBuffer(gl.ARRAY_BUFFER, null);
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null);

  return drawingInfo;
}

function initArrayBufferForLaterUse(gl, data, num, type) {
  var buffer = gl.createBuffer();   // Create a buffer object
  if (!buffer) {
    console.log('Failed to create the buffer object');
    return null;
  }
  // Write date into the buffer object
  gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
  gl.bufferData(gl.ARRAY_BUFFER, data, gl.STATIC_DRAW);

  // Keep the information necessary to assign to the attribute variable later
  buffer.num = num;
  buffer.type = type;

  return buffer;
}

function initElementArrayBufferForLaterUse(gl, data, type) {
  var buffer = gl.createBuffer();　  // Create a buffer object
  if (!buffer) {
    console.log('Failed to create the buffer object');
    return null;
  }
  // Write date into the buffer object
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, buffer);
  gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, data, gl.STATIC_DRAW);

  buffer.type = type;

  return buffer;
}


var ANGLE_STEP = 30;   // The increments of rotation angle (degrees)

var last = Date.now(); // Last time that this function was called
function animate(angle) {
  var now = Date.now();   // Calculate the elapsed time
  var elapsed = now - last;
  last = now;
  // Update the current rotation angle (adjusted by the elapsed time)
  var newAngle = angle + (ANGLE_STEP * elapsed) / 1000.0;
  return newAngle % 360;
}