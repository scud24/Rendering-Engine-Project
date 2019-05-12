/*****
 * @author Zachary Wartell
 *
 * @version 1.x-32
 *
 *****/


/*****
 *
 * GLOBALS
 *
 *****/

/* stores time when repaint callback function was last called */
var lastTimestamp=null;

/* 'debug' enables/disables various debugging output */
var debug = {showDelta : false, showCurrentAngle : false};
var repaint;
var xLast, yLast, dragContinuous;
var inverseTestFlag = false;

/**
 * @author Zachary Wartell && ...
 * Vertex shader program
 *
 * @todo [STUDENT] the vertex shader is by-and-large completed for you/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
 */
var VSHADER_SOURCE =`
  attribute vec4 a_Position;      
  attribute vec4 a_Normal;  
  
  uniform mat4 u_ModelViewMatrix; // ModelView matrix
  uniform mat4 u_ModelViewProjectionMatrix; // ModelViewProjectionMatrix (= ProjectionMatrix * ModelViewMatrix)
  
  uniform mat4 u_NormalMatrix;    // Transformation matrix for normals (maps model to OpenGL Eye coordinates)
      
  varying vec3 v_Normal_ecs;    // normal in OpenGL eye coordinates 
  varying vec3 v_Position_ecs;  // position in OpenGL eye coordinates
  void main() {        
    // Calculate vertex in Normalized Device Coordinates 
    gl_Position = u_ModelViewProjectionMatrix * a_Position;
    
    // Calculate the vertex position in OpenGL Eye (akka 'view') coordinates
    v_Position_ecs = vec3(u_ModelViewMatrix * a_Position);
    v_Normal_ecs = normalize(vec3(u_NormalMatrix * a_Normal));         
  }  
`;

/**
 * @author Zachary Wartell && ...
 * Fragment shader program
 *
 * @todo [STUDENT] REQUIRED: additions are required to this shader to calculate specular reflection and material emission//////////////////////////////////////////////////////////////////////
 * Note: the reason for passing in the light position in Eye coordinates (and not World coordinates) should become
 * clear to you as you implement the specular reflection calculation... It will reduce calculations and also avoids
 * having to pass the Eye's world coordinates position to the shader.
 */
var FSHADER_SOURCE =`
  #ifdef GL_ES
  precision mediump float;
  #endif
      
  uniform vec3 u_LightColor;         // Light color
  uniform vec3 u_LightPosition_ecs;  // Position of the light source in OpenGL eye coordinates
  uniform vec3 u_AmbientLight;       // Ambient light color
      
  uniform vec3 u_DiffuseReflection;       // material diffuse reflection
  uniform vec3 u_AmbientReflection;       // material ambient reflection
  uniform float u_SpecCoef;               // material specular reflection coefficient
  uniform vec3 u_Emission;                // material emission reflection
    
  varying vec3 v_Normal_ecs;    // interpolated normal   of fragment in OpenGL eye coordinates 
  varying vec3 v_Position_ecs;  // interpolated position of fragment in OpenGL eye coordinates
    
  void main() {
    // Normalize the normal because it is interpolated and not 1.0 in length any more
    vec3 normal = normalize(v_Normal_ecs);
    
    // Calculate the light direction and make it 1.0 in length
    vec3 lightDirection = normalize(u_LightPosition_ecs - v_Position_ecs);
    
    // The dot product of the light direction and the normal
    float nDotL = dot(lightDirection, normal);
    
    vec3 diffuse; 
	float specular = 0.0;
	float d = max(dot(normal, lightDirection), 0.0);
    if (d > 0.0) {
		vec3 viewVec = vec3(0,0,1.0);
		vec3 reflectVec = reflect(-lightDirection, normal);
		specular = pow(max(dot(reflectVec, viewVec), 0.0), 120.0);
    }
    if (nDotL > 0.0)
	{		
        // Calculate the final color from diffuse reflection and ambient reflection
        diffuse = u_LightColor * u_DiffuseReflection.rgb * nDotL;
	}
    else
	{
        diffuse = vec3(0,0,0);
    }   
    vec3 ambient = u_AmbientLight * u_AmbientReflection.rgb;
         
    gl_FragColor = vec4(diffuse + ambient+specular, 1);
  }
`;


function main() {
	
	
    /**
     * Wartell's Boiler plate section for generating Demo and Skeleton App_Title
     */
    let skeleton = true;
    if (skeleton) {
        document.getElementById("App_Title").innerHTML += "-Skeleton " + product_version();
    }

    /**
     *  [DEBUGGING] Run some unit tests
     */
    /* enable for debugging only */
    if (0) {
        /* runs some module unit tests and then exit */
        Mat3_test();
        Mat4_test();
        return;
    }

    /**
     *  Setup WebGL
     */
        // Retrieve <canvas> element
    const canvas = document.getElementById('webgl');

    // Get the rendering context for WebGL
    const gl = getWebGLContext(canvas);//, true);
    if (!gl) {
        console.log('Failed to get the rendering context for WebGL');
        return;
    }

    const litShader3D = new LitShader3D(gl, VSHADER_SOURCE, FSHADER_SOURCE, true);
    //const litBox = new LitBox_Beta(litShader3D);
	//const litSphere = new Sphere(litShader3D);
	//const litSphere2 = new Sphere(litShader3D);
	const litTriSphere = new TriSphere(litShader3D);
	const testObject = new Object3D(litShader3D);
	//const litStripSphere = new TriangleStripSphere(litShader3D);
	//const litStripSphere2 = new TriangleStripSphere(litShader3D);
	//const litStripSphere3 = new TriangleStripSphere(litShader3D);
	//const testPyramid = new Test_Pyramid(litShader3D);
	
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	var request = new XMLHttpRequest();
	var fileReady=false;
	var doc = new OBJDoc("cube.obj");
	request.onreadystatechange = function() {
    if (request.readyState === 4 && request.status !== 404) {
		
			console.log(doc.parse(request.response, 60, true));
			console.log(doc.vertices);
			var drawingInfo = doc.getDrawingInfo();
			console.log(drawingInfo);
			if(drawingInfo != null)
			{
				console.log("Drawinginfo: ", drawingInfo.vertices);
				testObject.vertices = drawingInfo.vertices;
				testObject.indices = drawingInfo.indices;
				testObject.normals = drawingInfo.normals;
				console.log("testObject verts: ", testObject.vertices);
				console.log("testObject indices: ", testObject.indices);
				console.log("testObject normals ", testObject.normals);
				console.log("trisphere verts: ", litTriSphere.vertices);
				console.log("trisphere indices: ", litTriSphere.indices);
				console.log("trisphere normals: ", litTriSphere.normals);
				
				testObject.render();
			}
		}
	}
	request.open('GET', doc.fileName, true); // Create a request to acquire the file
	request.send();   
	
	
	

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	
	
	
	
	
	
	
	
	
    // Set the clear color and enable the depth test
    gl.clearColor(0.0, 0.0, 0.0, 1.0);
    gl.enable(gl.DEPTH_TEST);

    var
        startLightPosition = new Vec4(0, 0, 10, 1),
        lightPosition = new Vec4(startLightPosition);

    const lightColor = [0.8, 0.8, 0.8];  // Set the light color (white)

    const world_to_eye = new Mat4();     // M_eye<-world transform (akka world to eye); used to map lightPosition from world to eye space

    var eyeStart = new Vec4(0, 0, 6, 1);
    var eye = new Vec4(eyeStart);

    var upVectorStart = new Vec4(0, 1, 0, 0);
    var upVector = new Vec4(upVectorStart);

    /* Note, skeleton code leaves the modelViewMatrix and projection as Identity matrices,
    *  This creates a projection that is an orthogonal parallel projection and looking down the negative z-axis.
    */

    /**
     * Create object to make all animated objects and values available to animateFrame
     * @type {{angle: number}}
     */
    var scene = {
        angle : 0,
        autoRotate : true
    };


    // set clear color and depth buffer
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);



    /**
     **      Set Event Handlers
     **
     **  Student Note: the WebGL book uses an older syntax. The newer syntax, explicitly calling addEventListener, is preferred.
     **  See https://developer.mozilla.org/en-US/docs/Web/API/EventTarget/addEventListener
     **/

    // Register mouse rotation event handle
    const currentAngle = [0.0, 0.0]; // Current rotation angle ([x-axis, y-axis] degrees)
    mouseRotation_initEventHandlers(canvas, currentAngle);

    // register autorotate event handles
    document.getElementById("AutoRotate").addEventListener('change',
        (event) => { scene.autoRotate = event.target.checked; }
        );

    /** @todo [STUDENT] setup event listeners for keyboard keys here for rotation the lightPosition */////////////////////////////////////////////////////////////////////////////////
	lightRotation_initEventHandlers(canvas, currentAngle);

    /**
     **   Define the draw callback (i.e. animation loop)
     **/
    repaint = function(timestamp)
    {
        // draw and animate all objects for this frame
        if (lastTimestamp !== null)
        {
            /*
             *  update time stamp
             */
            let
                delta = timestamp-lastTimestamp; // 'delta' = time that has past between this call and previous call to this repaint function
            lastTimestamp = timestamp;

            /*
             * update/animate geometry, positions, colors, etc. of all JS Objects (Renderable sub-classes, etc.)
             */
            animateFrame(delta,scene);

            /*
             *  draw everything
             */

            // Clear color and depth buffer
            gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

            // set the Projection matrix
            let projectionMatrix = new Mat4();
			projectionMatrix.setIdentity();
            /*
            *  @todo [STUDENT] after implementing Mat4.js, enable the next line (this is a canonical place to set the projection matrix)
            */
            projectionMatrix.setPerspective(30, canvas.width/canvas.height, 1, 100);
            projection3DStack.loadMatrix(projectionMatrix);

            // reset the model view matrix
            modelView3DStack.loadIdentity();



            // rotate the view based on current values of currentAngle[]
            // @todo [STUDENT] REQUIRED: add code here to update eye and upVector variables based on angles in global variable currentAngle[]
			var tempM4 = new Mat4();
			//empM4.setRotateY(currentAngle[1]+scene.angle);
			tempM4.setRotate(currentAngle[1]+scene.angle, 0,1,0);
			eye=new Vec4(eyeStart);
			eye.multiply(tempM4);
			//console.log('eyestart');
			//console.log(eyeStart);
			//console.log('eye');
			//console.log(eye);
			upVector=new Vec4(upVectorStart);
			upVector.multiply(tempM4);
			//lightPosition = new Vec4(startLightPosition);
			//lightPosition.multiply(tempM4);
			
            // compute viewMatrix (i.e. OpenGL world to OpenGL Eye transform)
            let viewMatrix = new Mat4();
            viewMatrix.setIdentity();
            /*
            *  @todo [STUDENT] after implementing Mat4.js, this is a canonical place to compute the view matrix
            *  and update the modelView stack; hence, enable next line after completing Mat4.js
            */
            viewMatrix.lookAt(eye.x, eye.y, eye.z, 0, 0, 0, upVector.x, upVector.y, upVector.z);
			//gluLookAt(eye.x, eye.y, eye.z, 0, 0, 0, upVector.x, upVector.y, upVector.z);
            // put view matrix on modelView stack

			//viewMatrix.translate([eye.x,eye.y,eye.z]);
			//viewMatrix.translate([eye.x,eye.y,eye.z]);
            modelView3DStack.loadMatrix(viewMatrix);
            world_to_eye.set(viewMatrix); // remember world_to_eye transform (it will be needed later for converting light's position to OpenGL Eye space)

            // auto rotate view about world y-axis
            //modelView3DStack.rotateY(scene.angle);

			
			//////////////////////////////////////////////////////////////////////////
			//////////////////////////////////////////////////////////////////////////
			
            // render all Renderable3D objects and do all WebGL drawing..
            /**
             *    The skeleton code just calls the render method for an example class 'litBox' (see LitBox_Beta and
             *    associated classes in Renderable3D.js)
             *
             *    @todo [STUDENT] REQUIRED: replace this next line with pile of code that renders the cube of spheres using your implementation////////////////////////////////////////////////////////
             *    of class Mat4Stack, it's matrix stack transform functions, and your implementation of class Sphere
             */
            //litBox.render();
            //litSphere.render();
			//testObject.render();
			modelView3DStack.translate([0,0.5,0]);
            litTriSphere.render();
			//litStripSphere.render();
			//testPyramid.render();
			
			//modelView3DStack.translate([0.5,-0.5,0]);
			//litStripSphere2.render();
			//modelView3DStack.translate([1,0,0]);
			//litStripSphere3.render();
            //litSphere2.render();
			///////////////////////////////////////////////////////////////////////////
			///////////////////////////////////////////////////////////////////////////
			
			//modelView3DStack.translate([0,0,-10]);
			
			/*
			modelView3DStack.translate([0.75,0.75,0.75]);
			litStripSphere.render();			
			modelView3DStack.translate([-0.5,0,0]);
			litStripSphere.render();			
			modelView3DStack.translate([-0.5,0,0]);
			litStripSphere.render();			
			modelView3DStack.translate([-0.5,0,0]);
			litStripSphere.render();			
			
			modelView3DStack.translate([1.5,-0.5,0]);
			litStripSphere.render();			
			modelView3DStack.translate([-0.5,0,0]);
			litStripSphere.render();			
			modelView3DStack.translate([-0.5,0,0]);
			litStripSphere.render();			
			modelView3DStack.translate([-0.5,0,0]);
			litStripSphere.render();
			
			modelView3DStack.translate([1.5,-0.5,0]);
			litStripSphere.render();			
			modelView3DStack.translate([-0.5,0,0]);
			litStripSphere.render();			
			modelView3DStack.translate([-0.5,0,0]);
			litStripSphere.render();			
			modelView3DStack.translate([-0.5,0,0]);
			litStripSphere.render();
			
			modelView3DStack.translate([1.5,-0.5,0]);
			litStripSphere.render();			
			modelView3DStack.translate([-0.5,0,0]);
			litStripSphere.render();			
			modelView3DStack.translate([-0.5,0,0]);
			litStripSphere.render();			
			modelView3DStack.translate([-0.5,0,0]);
			litStripSphere.render();
			
			
			modelView3DStack.translate([1.5,1.5,-1.5]);
			litStripSphere.render();			
			modelView3DStack.translate([-0.5,0,0]);
			litStripSphere.render();			
			modelView3DStack.translate([-0.5,0,0]);
			litStripSphere.render();			
			modelView3DStack.translate([-0.5,0,0]);
			litStripSphere.render();
			
			modelView3DStack.translate([1.5,-0.5,0]);
			litStripSphere.render();			
			modelView3DStack.translate([-0.5,0,0]);
			litStripSphere.render();			
			modelView3DStack.translate([-0.5,0,0]);
			litStripSphere.render();			
			modelView3DStack.translate([-0.5,0,0]);
			litStripSphere.render();
			
			modelView3DStack.translate([1.5,-0.5,0]);
			litStripSphere.render();			
			modelView3DStack.translate([-0.5,0,0]);
			litStripSphere.render();			
			modelView3DStack.translate([-0.5,0,0]);
			litStripSphere.render();			
			modelView3DStack.translate([-0.5,0,0]);
			litStripSphere.render();
			
			modelView3DStack.translate([1.5,-0.5,0]);
			litStripSphere.render();			
			modelView3DStack.translate([-0.5,0,0]);
			litStripSphere.render();			
			modelView3DStack.translate([-0.5,0,0]);
			litStripSphere.render();			
			modelView3DStack.translate([-0.5,0,0]);
			litStripSphere.render();
			
			modelView3DStack.translate([1.5,1.5,0.5]);
			litStripSphere.render();			
			modelView3DStack.translate([-0.5,0,0]);
			litStripSphere.render();			
			modelView3DStack.translate([-0.5,0,0]);
			litStripSphere.render();			
			modelView3DStack.translate([-0.5,0,0]);
			litStripSphere.render();
			
			modelView3DStack.translate([1.5,0,0.5]);
			litStripSphere.render();			
			modelView3DStack.translate([-0.5,0,0]);
			litStripSphere.render();			
			modelView3DStack.translate([-0.5,0,0]);
			litStripSphere.render();			
			modelView3DStack.translate([-0.5,0,0]);
			litStripSphere.render();
			
			modelView3DStack.translate([1.5,-0.5,0]);
			litStripSphere.render();		
			modelView3DStack.translate([0,-0.5,0]);
			litStripSphere.render();		
			
			modelView3DStack.translate([0,0.5,-0.5]);
			litStripSphere.render();		
			modelView3DStack.translate([0,-0.5,0]);
			litStripSphere.render();	
			
			modelView3DStack.translate([-1.5,0.5,0.5]);
			litStripSphere.render();		
			modelView3DStack.translate([0,-0.5,0]);
			litStripSphere.render();		
			
			modelView3DStack.translate([0,0.5,-0.5]);
			litStripSphere.render();		
			modelView3DStack.translate([0,-0.5,0]);
			litStripSphere.render();		
			
			modelView3DStack.translate([1.5,-0.5,0]);
			litStripSphere.render();			
			modelView3DStack.translate([-0.5,0,0]);
			litStripSphere.render();			
			modelView3DStack.translate([-0.5,0,0]);
			litStripSphere.render();			
			modelView3DStack.translate([-0.5,0,0]);
			litStripSphere.render();
			
			modelView3DStack.translate([1.5,0,0.5]);
			litStripSphere.render();			
			modelView3DStack.translate([-0.5,0,0]);
			litStripSphere.render();			
			modelView3DStack.translate([-0.5,0,0]);
			litStripSphere.render();			
			modelView3DStack.translate([-0.5,0,0]);
			litStripSphere.render();
			*/
			///////////////////////////////////////////////////////////////////////////
			///////////////////////////////////////////////////////////////////////////

            // some debug output
            if (debug.showDelta)
                console.log("Delta: "+delta);
            // some debug output
            if (debug.showCurrentAngle)
                console.log("CurrentAngle: "+currentAngle[0] + " " + currentAngle[1]);
        }
        lastTimestamp = timestamp;

        // request another call to repaint function to render next frame
        requestAnimationFrame(repaint);
    };

    /**
     **   Start Animation Loop
     **/
    requestAnimationFrame(repaint);
}

const ANGLE_STEP = 10.0;
/** @author Zachary Wartell && ..
 * @description  Update all graphical objects for next animation frame
 *
 *  @todo [STUDENT] (as needed) add to this function/////////////////////////////////////////////////////////////////////////////////////////////////////////
 */
function animateFrame(delta,scene)
{
	//scene.autoRotate = false;///debug only
    // Update the current rotation angle (adjusted by the elapsed time)
    if (scene.autoRotate) {
        let angle = scene.angle + (ANGLE_STEP * delta) / 1000.0;
        if (angle > 360)
            angle = angle % 360;
        scene.angle = angle;
    }

    /**
    @todo [STUDENT] (as needed) add code to do other automatic updates to any animated object properties in the scene
     */
}
