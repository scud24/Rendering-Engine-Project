/**
 * @author Zachary Wartell &&
 * @version 1.x-18
 *
 * @description This file provides two main classes "Shader3D" and "Renderable3D" plus several sub-classes
 * It follows a similar design as the classes in Renderable2D.js
 *
 * # Pedagogical Note
 * Students are given an implementation of the following classes in the indicated hierarchy:
 *
 * - Shader (Rendererable2D.js)
 *      - Shader3D
 *          - LitShader3D
 * - Renderable (Rendererable2D.js)
 *      - Renderable3D
 *          - LitRenderable3D
 *              - LitBox_Beta
 *
 * Except where noted otherwise, these classes can be used without modification.
 * LitBox_Beta is given as an example from which to build other sub-classes of LitRenderable3D.
 */



/** @author Zachary Wartell
 * @description Shader3D is a minimalist Object that encapsulates a GLSL Shader Program.
 * Shader3D inherits from Shader.
 *
 * Like a Shader, a Shader3D Object is used and shared by one or more objects of a Renderable sub-class.
 * 
 * Further, Shader3D makes the assumption the associated GLSL shader code has a set of several
 * attribute and uniform variables.  See the constructor code for details.
 *
 * STUDENT NOTE: this class should generally be used as is.
 */
class Shader3D extends Shader
{
    /** @author Zachary Wartell
     * @constructor
     * @description Constructor new Shader3D Object
     *
     * Option I:
     * @param {Object} gl - WebGLContext
     * @param {String} vshaderID - vertex shader source code's HTML Element ID
     * @param {String} fshaderID - fragment shader source code's HTML Element ID
     *
     * Option II:
     * @param {Object} gl - WebGLContext
     * @param {String} vshaderSrc - vertex shader source code stored as String
     * @param {String} fshaderSrc - fragment shader source code stored as String
     * @param {bool} - value should be true
     *
     */
    constructor()
    {
        super(...arguments); // call parent class constructor

        var gl = this.gl;
        /*
         *  get GL shader variable locations
         */
        this.a_Position = checked_getAttribLocation(gl,this.program, 'a_Position');

        /*
         *  This uniform is designed to be manipulated by a Mat4Stack Object, rather than
         *  directly by methods in class Shader3D or it's sub-class
         */
        this.u_ModelViewMatrix = checked_getUniformLocation(gl,this.program, 'u_ModelViewMatrix');
        this.u_ModelViewProjectionMatrix = checked_getUniformLocation(gl,this.program, 'u_ModelViewProjectionMatrix');
        this.u_NormalMatrix = checked_getUniformLocation(gl,this.program, 'u_NormalMatrix');
    }
}

/** @author Zachary Wartell
 *
 * @description LitShader3D is a minimalist Object that encapsulates a GLSL Shader Program.
 * LitShader3D Object is used and shared by one or more objects that are sub-classes of Renderable.
 * Further, LitShader3D makes the assumption the associated GLSL shader code has a set of several
 * attribute and uniform variables.  See the constructor code for details.
 *
 * @todo [STUDENT] NOTE: this class will need some modification
 */
class LitShader3D extends Shader3D
{
    /** @author Zachary Wartell
     * @constructor
     * @description Constructor new Shader3D Object
     *
     * Option I:
     * @param {Object} gl - WebGLContext
     * @param {String} vshaderID - vertex shader source code's HTML Element ID
     * @param {String} fshaderID - fragment shader source code's HTML Element ID
     *
     * Option II:
     * @param {Object} gl - WebGLContext
     * @param {String} vshaderSrc - vertex shader source code stored as String
     * @param {String} fshaderSrc - fragment shader source code stored as String
     * @param {bool} - value should be true

     */
    constructor()
    {
        super(...arguments); // call parent class constructor (this initializes the Shader3D uniform and attributes)

        const gl = this.gl;
        /*
         *  get additional LitShader3D attribute variable locations
         */
        this.a_Normal = checked_getAttribLocation(gl,this.program, 'a_Normal');

        /*
         *  get additional LitShader3D uniform variable locations
         */
        this.u_LightColor = checked_getUniformLocation(gl,this.program, 'u_LightColor');
        this.u_LightPosition_ecs = checked_getUniformLocation(gl,this.program, 'u_LightPosition_ecs');
        this.u_AmbientLight = checked_getUniformLocation(gl,this.program, 'u_AmbientLight');

        this.u_DiffuseReflection = checked_getUniformLocation(gl,this.program, 'u_DiffuseReflection');
        this.u_AmbientReflection = checked_getUniformLocation(gl,this.program, 'u_AmbientReflection');

        /**
         *  @todo [STUDENT] additions will need to be made here as your extend the GLSL shader tu support more advanced lighting
         */
    }
}

/** @author Zachary Wartell
 * @description Renderable3D uses a GL Shader Program encapsulated in a Shader Object
 * and a global Mat4Stack, called modelViewMatrix, for managing the model view transform.
 *
 * Multiple Renderable3D's can share a common Shader object.
 *
 * A sub-class's .render method must call the Renderable3D.render_begin() method.
 */
class Renderable3D extends Renderable
{
    /** @author Zachary Wartell
     * @description Construct new Renderable3D Object
     *
     * @param {Object} shader - a Shader object
     */
    constructor(shader)
    {
        super(shader);
    }

    /** @author Zachary Wartell
     * @description initialize GLSL program and set up the canonical OpenGL matrix uniforms based on the two
     * global Mat4Stack's.
     *
     * This method enables this.shader's associated GLSL Program and then sets up the canonical OpenGL matrix
     * GLSL uniforms.  Classes derived from Renderable3D, should have their .render method first call render_begin, then set any
     * additional GL uniforms and/or GL vertex attribute specific to the derived class.  Also, possibly, a derived class might
     * override .render_begin as well.  For examples, see {@link LitRenderable3D} and {@link LitBox_Beta}.
     *
     * @todo [STUDENT] REQUIRED: This function is only 95% complete, see @todo items inside the function for details
     */
    render_begin()
    {
        const gl = this.shader.gl;

        // enable shader
        gl.useProgram(this.shader.program);

        // set GLSL uniform matrices from global matrix stacks
        let
            modelViewMatrix,
            modelViewProjectionMatrix;
        const
            normalMatrix = new Mat4();

        // compute modelViewMatrix matrix
        modelViewMatrix = modelView3DStack.top();


        // compute modelViewProjectionMatrix matrix
        modelViewProjectionMatrix = projection3DStack.top();
        modelViewProjectionMatrix.multiply(modelViewMatrix);  // @todo [STUDENT] REQUIRED: enable this code after implementing Mat4.js

        // compute normal vector transform matrix
        //   (The reason for using inverse-transpose is discussed in class, textbook, etc.)
        //  @todo [STUDENT] REQUIRED: enable code below after implementing Mat4.js.
        normalMatrix.setInverseOf(modelViewMatrix);
		

        normalMatrix.transpose();

        // Pass the model view projection matrices to corresponding GLSL uniforms
        gl.uniformMatrix4fv(this.shader.u_ModelViewMatrix, false, modelViewMatrix.array);
        gl.uniformMatrix4fv(this.shader.u_ModelViewProjectionMatrix, false, modelViewProjectionMatrix.array);

        // Pass the normal matrix to GLSL u_NormalMatrix
        gl.uniformMatrix4fv(this.shader.u_NormalMatrix, false, normalMatrix.array);
    }
}

/** @author Zachary Wartell
 * @description LitRenderable3D uses a GL Shader Program encapsulated in a Shader Object
 * and a global Mat4Stack, called modelViewMatrix, for managing the model view transform as well
 * as various lighting related properties.
 *
 */
class LitRenderable3D extends Renderable3D
{
    /** @author Zachary Wartell
     * @description  Construct new LitRenderable3D Object
     *
     * @param {Object} shader - a Shader object
     */
    constructor(shader)
    {
        super(shader); // call parent class constructor
    }

    /** @author Zachary Wartell
     *
     * Usage: This method must be called by LitRenderable3D sub-classes .render method
     */
    render_begin ()
    {
        /*
         Enable this.shader's GLSL program and set the GLSL uniform variables that are inherited from Renderable3D
         */
        Renderable3D.prototype.render_begin.call(this);

        /*
         Set the GLSL uniform variables that are added by LitRenderable3D
         */        
        const gl = this.shader.gl;

        // set the additional GLSL uniform, attribute, and varying variables specific to LitRenderable3D
        gl.uniform3f(this.shader.u_LightColor, 0.8, 0.8, 0.8);
        // set the light direction (in the world coordinate)
        //gl.uniform3fv(this.shader.u_LightPosition_ecs, [1,1,-1]);
        // set the ambient light
        gl.uniform3f(this.shader.u_AmbientLight, 0.2, 0.2, 0.2);

        // set the material properties
        gl.uniform3fv(this.shader.u_DiffuseReflection, [1,1,1]);
        gl.uniform3fv(this.shader.u_AmbientReflection, [0.2,0.2,0.2]);

		var tempV4 = new Vec4([1,1,-1]);
        var modelViewMatrix = new Mat4();
		modelViewMatrix.set(modelView3DStack.top());
		//tempV4.multiply(world_to_eye);
		//console.log(tempV4);
        //gl.uniform3fv(this.shader.u_LightPosition_ecs, [tempV4.x,tempV4.y,tempV4.z]);
        /**
         *  @todo [STUDENT] additions will need to made here as you add more lighting calculations to the GLSL shader
         */
		 
        console.assert( gl.getError() === gl.NO_ERROR);
		
    }
}

/** @author Zachary Wartell
 * @description LitBox_Beta is a LitRenderable3D that displays a unit box, centered at the
 * origin of it's local (model) coordinate system.
 *
 * This is a minimal working example of a sub-class of LitRenderable3D that actually renders something.
 * A lot of things are hard coded that should probably not be, hence I refer this to this class as a '_Beta'
 * version, meant to inspire better implementations and get students started on the class Sphere.
 *
 */
class Test_Pyramid extends LitRenderable3D
{
    /**
     * @author Zachary Wartlel
     * @description construct this LixBox
     * @param {Object} shader - a LitShader3D (or sub-class)
     */
    constructor(shader)
    {
        super(shader);

        const gl = shader.gl;
        /*
         *  create GL buffers (but don't transfer data into it, see updateBuffers).
         */
        this.vertexBuffer = gl.createBuffer();
        if (!this.vertexBuffer) {
            alert('Failed to create the buffer object');
            throw new ShaderException();
        }
        
        this.normalBuffer = gl.createBuffer();
        if (!this.normalBuffer) {
            alert('Failed to create the buffer object');
            throw new ShaderException();
        }

        this.indexBuffer = gl.createBuffer();
        if (!this.indexBuffer) {
            console.log('Failed to create the buffer object');
            throw new ShaderException();
        }
		var zOffset = 0;
        /*
         *  Initialize JS arrays with vertices attributes
         */
        // create box vertices (relatively easy if you draw a picture first)
        this.vertices = 
            [
            [0,0.5, 0+zOffset], //Peak
			[0.5,-0.5, 0.5+zOffset],[-0.5,-0.5, 0.5+zOffset],  // front face
            [0.5,-0.5,-0.5+zOffset],[-0.5,-0.5,-0.5+zOffset]  // back face
            ];
        
        // create normals (actually for a box these should _not_ be done per vertex, but done per face instead
        // but the per vertex option is hard coded in the GLSL shader program because it is easier to extend to
        // 'smooth' surfaces like a sphere).
        this.normals = [];
        for(let i=0;i<this.vertices.length;i++)
        {
            let n = new Vec3(this.vertices[i]);
            n.normalize();
            this.normals.push([n.x,n.y,n.z]);
        }

        // create indices (also relatively easy if you draw a picture first)
        this.indices =
            [
                [0,1,2], // front face
                [0,3,4], // back face
                [0,1,3], // right face
                [0,2,4], // left face
                [1,2,3],  // bottom face tri 1
                [3,4,1]  // bottom face tri 2
            ];

        /*
         *  Update WebGL buffers with above JS array vertex attributes
         */
        this.updateBuffers ();
    }

    /** @author Zachary Wartell
     * @description update the GL buffers based on the current JS vertex data
     *
     * updateBuffers only has to be called if/when the JS vertex data changes.
     * (Further, for GL efficiency it should only be called when needed).
     *
     * @preconditions:  vertex buffer are already created
     */
    updateBuffers ()
    {
        const gl = this.shader.gl;

        // update vertex buffer
        gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexBuffer);
        // copy vertex data into ARRAY_BUFFER
        gl.bufferData(gl.ARRAY_BUFFER, flatten(this.vertices), gl.STATIC_DRAW);

        // update normal buffer
        gl.bindBuffer(gl.ARRAY_BUFFER, this.normalBuffer);
        // copy vertex data into ARRAY_BUFFER
        gl.bufferData(gl.ARRAY_BUFFER, flatten(this.normals), gl.STATIC_DRAW);

        // update index buffer
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.indexBuffer);
        gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(this.indices.flat(1)), gl.STATIC_DRAW);
    }

    /** @author Zachary Wartell
     * @description render this LitBox (subject to the current transformations on the two global Mat4Stack's).
     */
     render()
    {
        /*
         enable GLSL program and setup common uniforms
         */
        LitRenderable3D.prototype.render_begin.call(this);

        const gl=this.shader.gl;

        /*
         setup uniforms added by LitRenderable3D

         As a quick hack I hard code these here... other sub-classes of LitRenderable3D should
         be better designed and assign these uniform's by adding properties to the sub-class, etc.
         */
        gl.uniform3f(this.shader.u_LightColor, 0.8, 0.8, 0.8);
        // set the light direction (in the world coordinate)
        //gl.uniform3fv(this.shader.u_LightPosition_ecs, [0,0,-1]);   // note because NDC is left-handed the front face is on negative z-axis
        // set the ambient light
        gl.uniform3f(this.shader.u_AmbientLight, 0.5, 0.5, 0.5);
        gl.uniform3fv(this.shader.u_AmbientReflection, [0.2,0.2,0.2]);

        // set the material properties

        gl.uniform3fv(this.shader.u_DiffuseReflection, [1,1,1]);
        /*
         * @todo [STUDENT] Optional: after you add the required features to the GLSL shaders, you might want to add
         * appropriate calls here to set the additional GLSL uniforms you added to the shaders. This is only necessary if you
         * want to render a LitBox after you update the shaders.
         */

        /*
         setup vertex attributes and index buffer
         */

        gl.disable(gl.CULL_FACE);

        // bind the vertex buffer to the GL ARRAY_BUFFER
        gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexBuffer);

        // use the vertexBuffer for the vertex attribute variable 'a_Position'
        gl.vertexAttribPointer(this.shader.a_Position, 3, gl.FLOAT, false, 0, 0);
        gl.enableVertexAttribArray(this.shader.a_Position);

        // bind the normal buffer to the GL ARRAY_BUFFER
        gl.bindBuffer(gl.ARRAY_BUFFER, this.normalBuffer);

        // use the vertexBuffer for the vertex attribute variable 'a_Position'
        gl.vertexAttribPointer(this.shader.a_Normal, 3, gl.FLOAT, false, 0, 0);
        gl.enableVertexAttribArray(this.shader.a_Normal);

        // bind index buffer
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.indexBuffer);

        /*
         draw primitives

         ZJW: Note, I use TRIANGLE_FAN for the LitBox. For your Sphere class it may be simpler to just use TRIANGLES.
         The choice is yours.  For the Curious:  The most performance optimal choice would be TRIANGLE_STRIP.
         */
		 
        for (let i=0;i<this.indices.length;i++)
		{
			//console.log("Tri Start");
			//console.log(i);
			//console.log(this.indices[i]);
			//console.log("Tri End");
            gl.drawElements(gl.TRIANGLES, 3, gl.UNSIGNED_SHORT, i*3*2);
		}
    }
}
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/**
 * @author
 * @description a 3D sphere made of tris
 *
 * @todo [STUDENT] REQUIRED: implement a Sphere class that extends LitRenderable3D.  A suggestion is to copy LitBox_Beta class's code
 * into your Sphere class in order to get started. Significant modifications and additional will be needed.
 */
class TriSphere extends LitRenderable3D {
	/**
     * @author Zachary Wartlel
     * @description construct this sphere
     * @param {Object} shader - a LitShader3D (or sub-class)
     */
    constructor(shader)
    {
        super(shader);

        const gl = shader.gl;
        /*
         *  create GL buffers (but don't transfer data into it, see updateBuffers).
         */
        this.vertexBuffer = gl.createBuffer();
        if (!this.vertexBuffer) {
            alert('Failed to create the buffer object');
            throw new ShaderException();
        }
        
        this.normalBuffer = gl.createBuffer();
        if (!this.normalBuffer) {
            alert('Failed to create the buffer object');
            throw new ShaderException();
        }

        this.indexBuffer = gl.createBuffer();
        if (!this.indexBuffer) {
            console.log('Failed to create the buffer object');
            throw new ShaderException();
        }

        this.vertices = [[0,0,0]]; 
	    this.indices = [[0,0,0]];;
		generate_trisphere(20,this.vertices, this.indices);
		//console.log("indices", this.indices);
		//console.log("verts ", this.vertices);
		
		
        // create normals (actually for a box these should _not_ be done per vertex, but done per face instead
        // but the per vertex option is hard coded in the GLSL shader program because it is easier to extend to
        // 'smooth' surfaces like a sphere).
        this.normals = [];
        //console.log(this.vertices[0]); 
        //console.log(this.vertices[0] instanceof Array); 
        //console.log(this.vertices[1]); 
        //console.log(this.vertices[1] instanceof Array); 
        for(let i=0;i<this.vertices.length;i++)
        {
            let n = new Vec3(this.vertices[i]);
            n.normalize();
            this.normals.push([n.x,n.y,n.z]);
        }

       
        /*
         *  Update WebGL buffers with above JS array vertex attributes
         */
        this.updateBuffers ();
    }

    /** @author Zachary Wartell
     * @description update the GL buffers based on the current JS vertex data
     *
     * updateBuffers only has to be called if/when the JS vertex data changes.
     * (Further, for GL efficiency it should only be called when needed).
     *
     * @preconditions:  vertex buffer are already created
     */
    updateBuffers ()
    {
        const gl = this.shader.gl;

        // update vertex buffer
        gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexBuffer);
        // copy vertex data into ARRAY_BUFFER
        gl.bufferData(gl.ARRAY_BUFFER, flatten(this.vertices), gl.STATIC_DRAW);

        // update normal buffer
        gl.bindBuffer(gl.ARRAY_BUFFER, this.normalBuffer);
        // copy vertex data into ARRAY_BUFFER
        gl.bufferData(gl.ARRAY_BUFFER, flatten(this.normals), gl.STATIC_DRAW);

        // update index buffer
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.indexBuffer);
        gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(this.indices.flat(1)), gl.STATIC_DRAW);
    }

    /** @author Zachary Wartell
     * @description render this LitBox (subject to the current transformations on the two global Mat4Stack's).
     */
     render()
    {
        /*
         enable GLSL program and setup common uniforms
         */
        LitRenderable3D.prototype.render_begin.call(this);

        const gl=this.shader.gl;

        /*
         setup uniforms added by LitRenderable3D

         As a quick hack I hard code these here... other sub-classes of LitRenderable3D should
         be better designed and assign these uniform's by adding properties to the sub-class, etc.
         */
        gl.uniform3f(this.shader.u_LightColor, 0.8, 0.8, 0.8);
        // set the light direction (in the world coordinate)
        gl.uniform3fv(this.shader.u_LightPosition_ecs, [0,0,-1]);   // note because NDC is left-handed the front face is on negative z-axis
        // set the ambient light
        gl.uniform3f(this.shader.u_AmbientLight, 0.5, 0.5, 0.5);
        gl.uniform3fv(this.shader.u_AmbientReflection, [0.2,0.2,0.2]);

        // set the material properties

        gl.uniform3fv(this.shader.u_DiffuseReflection, [1,1,1]);
        /*
         * @todo [STUDENT] Optional: after you add the required features to the GLSL shaders, you might want to add
         * appropriate calls here to set the additional GLSL uniforms you added to the shaders. This is only necessary if you
         * want to render a LitBox after you update the shaders.
         */

        /*
         setup vertex attributes and index buffer
         */

        gl.disable(gl.CULL_FACE);

        // bind the vertex buffer to the GL ARRAY_BUFFER
        gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexBuffer);

        // use the vertexBuffer for the vertex attribute variable 'a_Position'
        gl.vertexAttribPointer(this.shader.a_Position, 3, gl.FLOAT, false, 0, 0);
        gl.enableVertexAttribArray(this.shader.a_Position);

        // bind the normal buffer to the GL ARRAY_BUFFER
        gl.bindBuffer(gl.ARRAY_BUFFER, this.normalBuffer);

        // use the vertexBuffer for the vertex attribute variable 'a_Position'
        gl.vertexAttribPointer(this.shader.a_Normal, 3, gl.FLOAT, false, 0, 0);
        gl.enableVertexAttribArray(this.shader.a_Normal);

        // bind index buffer
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.indexBuffer);

        /*
         draw primitives

         ZJW: Note, I use TRIANGLE_FAN for the LitBox. For your Sphere class it may be simpler to just use TRIANGLES.
         The choice is yours.  For the Curious:  The most performance optimal choice would be TRIANGLE_STRIP.
         */
        for (let i=0;i<this.indices.length;i++)
		{ 
            gl.drawElements(gl.TRIANGLES, 3, gl.UNSIGNED_SHORT, i*3*2);
		}

	}
}

	
	
	
	
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////	
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////	
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/**
 * @author
 * @description 3D object
 *
 */
class Object3D extends LitRenderable3D {
	/**
     * @author Zachary Wartlel
     * @description construct this sphere
     * @param {Object} shader - a LitShader3D (or sub-class)
     */
    constructor(shader)
    {
        super(shader);

        const gl = shader.gl;
        /*
         *  create GL buffers (but don't transfer data into it, see updateBuffers).
         */
        this.vertexBuffer = gl.createBuffer();
        if (!this.vertexBuffer) {
            alert('Failed to create the buffer object');
            throw new ShaderException();
        }
        
        this.normalBuffer = gl.createBuffer();
        if (!this.normalBuffer) {
            alert('Failed to create the buffer object');
            throw new ShaderException();
        }

        this.indexBuffer = gl.createBuffer();
        if (!this.indexBuffer) {
            console.log('Failed to create the buffer object');
            throw new ShaderException();
        }

        this.vertices = [[0,0,0]]; 
	    this.indices = [[0,0,0]];
		
		
        // create normals (actually for a box these should _not_ be done per vertex, but done per face instead
        // but the per vertex option is hard coded in the GLSL shader program because it is easier to extend to
        // 'smooth' surfaces like a sphere).
        this.normals = [];
        //console.log(this.vertices[0]); 
        //console.log(this.vertices[0] instanceof Array); 
        //console.log(this.vertices[1]); 
        //console.log(this.vertices[1] instanceof Array); 
        for(let i=0;i<this.vertices.length;i++)
        {
            let n = new Vec3(this.vertices[i]);
            n.normalize();
            this.normals.push([n.x,n.y,n.z]);
        }

       
        /*
         *  Update WebGL buffers with above JS array vertex attributes
         */
        this.updateBuffers ();
    }

    /** @author Zachary Wartell
     * @description update the GL buffers based on the current JS vertex data
     *
     * updateBuffers only has to be called if/when the JS vertex data changes.
     * (Further, for GL efficiency it should only be called when needed).
     *
     * @preconditions:  vertex buffer are already created
     */
    updateBuffers ()
    {
        const gl = this.shader.gl;

        // update vertex buffer
        gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexBuffer);
        // copy vertex data into ARRAY_BUFFER
        gl.bufferData(gl.ARRAY_BUFFER, this.vertices, gl.STATIC_DRAW);

        // update normal buffer
        gl.bindBuffer(gl.ARRAY_BUFFER, this.normalBuffer);
        // copy vertex data into ARRAY_BUFFER
        gl.bufferData(gl.ARRAY_BUFFER, this.normals, gl.STATIC_DRAW);

        // update index buffer
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.indexBuffer);
		console.log("indices to bind: ", this.indices);
        gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, this.indices, gl.STATIC_DRAW);
		console.log("buffer size: ",gl.getBufferParameter(gl.ELEMENT_ARRAY_BUFFER, gl.BUFFER_SIZE));
		this.indexBuffer.num = this.indices.length;
		//this.indexBuffer.type = gl.UNSIGNED_BYTE;
    }

    /** @author Zachary Wartell
     * @description render this LitBox (subject to the current transformations on the two global Mat4Stack's).
     */
     render()
    {
        /*
         enable GLSL program and setup common uniforms
         */
        LitRenderable3D.prototype.render_begin.call(this);

        const gl=this.shader.gl;

        /*
         setup uniforms added by LitRenderable3D

         As a quick hack I hard code these here... other sub-classes of LitRenderable3D should
         be better designed and assign these uniform's by adding properties to the sub-class, etc.
         */
        gl.uniform3f(this.shader.u_LightColor, 0.8, 0.8, 0.8);
        // set the light direction (in the world coordinate)
        gl.uniform3fv(this.shader.u_LightPosition_ecs, [0,0,-1]);   // note because NDC is left-handed the front face is on negative z-axis
        // set the ambient light
        gl.uniform3f(this.shader.u_AmbientLight, 0.5, 0.5, 0.5);
        gl.uniform3fv(this.shader.u_AmbientReflection, [0.2,0.2,0.2]);

        // set the material properties

        gl.uniform3fv(this.shader.u_DiffuseReflection, [1,1,1]);
        /*
         * @todo [STUDENT] Optional: after you add the required features to the GLSL shaders, you might want to add
         * appropriate calls here to set the additional GLSL uniforms you added to the shaders. This is only necessary if you
         * want to render a LitBox after you update the shaders.
         */

        /*
         setup vertex attributes and index buffer
         */

        gl.disable(gl.CULL_FACE);

        // bind the vertex buffer to the GL ARRAY_BUFFER
        gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexBuffer);

        // use the vertexBuffer for the vertex attribute variable 'a_Position'
        gl.vertexAttribPointer(this.shader.a_Position, 3, gl.FLOAT, false, 0, 0);
        gl.enableVertexAttribArray(this.shader.a_Position);

        // bind the normal buffer to the GL ARRAY_BUFFER
        gl.bindBuffer(gl.ARRAY_BUFFER, this.normalBuffer);

        // use the vertexBuffer for the vertex attribute variable 'a_Position'
        gl.vertexAttribPointer(this.shader.a_Normal, 3, gl.FLOAT, false, 0, 0);
        gl.enableVertexAttribArray(this.shader.a_Normal);

        // bind index buffer
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.indexBuffer);
        /*
         draw primitives

         ZJW: Note, I use TRIANGLE_FAN for the LitBox. For your Sphere class it may be simpler to just use TRIANGLES.
         The choice is yours.  For the Curious:  The most performance optimal choice would be TRIANGLE_STRIP.
         */
        //for (let i=0;i<this.indices.length;i++)
		//{ 
			//console.log("indices: ",this.indices);
			//console.log("i length: ", this.indices.length);
		    //console.log("buffer size: ",gl.getBufferParameter(gl.ELEMENT_ARRAY_BUFFER, gl.BUFFER_SIZE));
            gl.drawElements(gl.TRIANGLES, this.indices.length, gl.UNSIGNED_SHORT, 0);
		//}

	}
}
