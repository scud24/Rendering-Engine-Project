/**
 * @author Zachary Wartell &&
 *
 * @file This file provides two basic classes "Shader" and "Renderable" plus several sub-classes.
 * These classes provide a primitive object-oriented scaffolding that wraps a GLSL shader program and WebGL
 * vertex buffer management.  Students are expected to derive additional sub-classes.  Modification of
 * the given classes is also an option.
 *
 * @version 1.x-6
 */

/*****
 * 
 * GLOBALS
 * 
 *****/

/**
 * modelView2DStack serves as a modelView matrix stack for 2D applications.
 *
 * 
 * This should be initialize in main().
 * @type Mat3Stack
 */
var modelView2DStack;

/*****
 * 
 * Object Prototypes
 * 
 *****/

/**
 * Constructor for Shader specific Exception
 * @returns {ShaderException}
 */
function ShaderException() {   
   this.name = "ShaderException";
}

/** @author Zachary Wartell
 * @description Perform standard gl.getUniformLocation(program,uniform_string) and return
 * the WebGLUniformLocation. If any error occurs throw ShaderException and display an alert window.
 *
 * @param {Object} gl
 * @param {Object} program
 * @param {String}  uniform_string
 * @returns {WebGLUniformLocation}
 */
function checked_getUniformLocation(gl,program,uniform_string)
{
    const u_location = gl.getUniformLocation(program, uniform_string);
    if (u_location === null) {
        alert('Failed to get the storage location of ' + uniform_string);
        throw new ShaderException();
    }
    return u_location;
}

/** @author Zachary Wartell
 * @description Perform standard gl.getAttribLocation(program, attribute_string) and return
 * the WebGLUniformLocation. If any error occurs throw ShaderException and display an alert window.
 *
 * @param {Object} gl
 * @param {Object} program
 * @param {String} attribute_string
 * @returns {WebGLUniformLocation}
 */
function checked_getAttribLocation(gl,program,attribute_string)
{
    const a_location = gl.getAttribLocation(program, attribute_string);
    if (a_location < 0) {
        alert('Failed to get the storage location of ' + attribute_string);
        throw new ShaderException();
    }
    return a_location;
}


/**
 * @author Zachary Wartell (but see REFERENCE)
 * @description "flatten" a 1D or 2D Array of Number's 'v' into a 1D Float32Array suitable for passing to
 * various WebGL functions.
 *
 * @todo [OPTIONAL] might be useful to extend this function to support flattening Arrays of Vec2, Vec3, Vec4, etc.
 *
 * REFERENCE:
 * - ZJW: I've lost track of the prevanance of the original version of this function.
 *   it waw either the WebGL book examples, or the Textbook examples... :(
 *
 * @param {Number[] | Number[][] } v
 * @returns {Float32Array}
 */
function flatten(v)
{
    let n = v.length;
    let elemsAreArrays = false;

    if (Array.isArray(v[0])) {
        elemsAreArrays = true;
        n *= v[0].length;
    }

    var floats = new Float32Array(n);

    if (elemsAreArrays) {
        let idx = 0;
        for (let i = 0; i < v.length; ++i) {
            for (let j = 0; j < v[i].length; ++j) {
                floats[idx++] = v[i][j];
            }
        }
    }
    else {
        for (let i = 0; i < v.length; ++i) {
            floats[i] = v[i];
        }
    }

    return floats;
}


/** @author Zachary Wartell
 *
 * Shader is a very minimalist Object that encapsulates a GLSL Shader Program.
 * A Shader Object is an abstract class.
 *
 */
class Shader
{
    /** @author Zachary Wartell
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
        let gl;

        if (arguments.length === 3) {// handle Option I arguements
            gl = arguments [0];
            const vshaderID = arguments[1];
            const fshaderID = arguments[2];

            /*
             *  create GLSL Program
             */
            let vertElem = document.getElementById(vshaderID);
            if (!vertElem) {
                alert("Unable to load vertex shader " + vshaderID);
                throw new ShaderException();
            }

            let fragElem = document.getElementById(fshaderID);
            if (!fragElem) {
                alert("Unable to load vertex shader " + fshaderID);
                throw new ShaderException();
            }

            this.program = createProgram(gl, vertElem.text, fragElem.text);
            if (!this.program) {
                alert('Failed to create program');
                throw new ShaderException();
            }
        } else if (arguments.length === 4) {// handle Option II arguements
            gl = arguments[0];
            this.program = createProgram(gl, arguments[1], arguments[2]);
            if (!this.program) {
                alert('Failed to create program');
                throw new ShaderException();
            }
        }
        else
            throw new Error("Unsupported Type");

        this.gl = gl;
        gl.useProgram(this.program);
    }
}

/** @author Zachary Wartell
 *
 * Shader2D is a minimalist Object that encapsulates a GLSL Shader Program.
 * Shader2D inherits from Shader.
 *
 * Like a Shader, a Shader2D Object is used and shared by one or more objects of class Renderable.
 * 
 * Further, Shader2D makes the assumption the associated GLSL shader code has a set of several
 * attribute and uniform variables.  See the constructor code for details.
 *
 */
class Shader2D extends Shader
{
    /** @author Zachary Wartell
     * @description construct new Shader2D Object
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

        const gl = this.gl;
        /*
         *  get GL shader variable locations
         */
        this.a_Position = checked_getAttribLocation(gl,this.program, 'a_Position');

        /*
         *  This uniform is designed to be manipulated by a Mat3Stack Object, rather than
         *  directly by methods in class Shader2D or class SimpleRenderable
         */
        this.u_modelView = checked_getUniformLocation(gl,this.program, 'u_modelView');

        this.u_FragColor = checked_getUniformLocation(gl,this.program, 'u_FragColor');
    }
}


/** @author Zachary Wartell
 * Construct new Renderable Object
 * 
 * Renderable is an abstract class.  It has a method, 'render()' which draws something to the OpenGL Canvas
 * and a property .shader which is a Shader Object (or sub-class).
 *   
 */
class Renderable
{
    /** @author Zachary Wartell
     * @description Construct Shader2DRenderable Object
     *
     * @param {Object} shader - a Shader object
     * @constructor
     */
    constructor(shader)
    {
        this.shader = shader;
    }

    /* @author Zachary Wartell
     * render this Renderable
     */
    render()
    {
        throw new Error("Unimplemented abstract class method");
    }
}

/** @author Zachary Wartell
 * @description Shader2DRenderable is a minimalist Object that uses a GL Shader Program encapsulated in a Shader Object
 * and a global Mat3Stack, called modelViewMatrix, for managing the model view transform.
 * 
 * Multiple Shader2DRenderable's can share a common Shader object.
 * 
 * A Shader2DRenderable's associated Shader Object must:
 *      - contain a property .u_modelView that is a WebGLUniformLocation
 *      - this WebGLUniformLocation must be associated with a uniform mat3 called u_modelView in the vertex shader
 *        that is used for the model view transform 
 * 
 * A sub-class's .render method must call the Shader2DRenderable.render_begin() method.
 */
class Shader2DRenderable extends Renderable
{
    /** @author Zachary Wartell
     * @description Construct Shader2DRenderable Object
     *
     * @param {Object} shader - a Shader object
     * @constructor
     */
    constructor(shader)
    {
        super(shader); // call parent class constructor
    }

    /**
     * @author Zachary Wartell
     * @description This method must be called by Shader2DRenderable sub-classes .render method.
     *
     * Conceptually this method enables the this.shader's associated GLSL Program and then sets several commonly
     * used GL uniforms (see code below).  Derived class's .render method should typically call render_begin, then set any
     * additional GL uniforms or GL vertex attribute associated with the derived class.  Possibly, a derived class might
     * override .render_begin as well.
     */
    render_begin ()
    {
        const gl = this.shader.gl;

        // enable shader
        gl.useProgram(this.shader.program);

        // update modelView uniform
        modelView2DStack.updateShader(this.shader.u_modelView);
    }
}

/**
 * @author Zachary Wartell
 *
 * SimpleRenderable encapsulates a GL Shader Program and further adds vertex information.
 *  
 * Note, multiple SimpleRenderable's can share a common Shader object.
 * 
 * Student Note:  Feel free to modify this class as needed OR create a new sub-class of Shader2DRenderable using SimpleRenderable as guide.
 *
 * @constructor
 * @param {Object} shader - a Shader object
 */
class SimpleRenderable extends Shader2DRenderable
{

    /** @author Zachary Wartell
     * @constructor Construct new SimpleRenderable Object
     *
     * @param {Object} shader - a Shader object
     */
    constructor(shader)
    {
        super(shader); // call parent class constructor

        const gl = this.shader.gl;

        /* color to use for this SimpleRenderable */
        this.color = new Float32Array(4);
        /* Array of 2D vertex coordinates (each coordinate is Array size 2) */
        this.vertices = [];
        /* default GL primitive type */
        this.primitive = gl.TRIANGLES;

        /*
         *  create GL buffer (but don't transfer data into it, see updateBuffers).
         */
        this.vertexBuffer = gl.createBuffer();
        if (!this.vertexBuffer) {
            alert('Failed to create the buffer object');
            throw new ShaderException();
        }
    }

    /** @author Zachary Wartell
     * @description update the GL buffers based on the current JS vertex data
     *
     * updateBuffers only has to be called if/when the JS vertex data changes.
     * (Further, for GL efficiency it should only be called when needed).
     *
     * preconditions:  GLSL program and vertex buffer are already created
     */
    updateBuffers ()
    {
        const gl = this.shader.gl;

        // bind to the GL ARRAY_BUFFER
        gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexBuffer);
        // copy vertex data into ARRAY_BUFFER
        gl.bufferData(gl.ARRAY_BUFFER, flatten(this.vertices), gl.STATIC_DRAW);
    }

    /** @author Zachary Wartell
     * @description draw this SimpleRenderable
     *
     * preconditions:  GLSL program and vertex buffer are already created
     * @returns {undefined}
     */
    render ()
    {
        this.render_begin();

        const gl = this.shader.gl;

        // draw primitives
        if (this.vertices.length)
        {
            // bind the vertex buffer to the GL ARRAY_BUFFER
            gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexBuffer);

            // use the vertexBuffer for the vertex attribute variable 'a_Position'
            gl.vertexAttribPointer(this.shader.a_Position, 2, gl.FLOAT, false, 0, 0);
            gl.enableVertexAttribArray(this.shader.a_Position);

            // set the various uniform variables
            gl.uniform4fv(this.shader.u_FragColor,this.color);

            // draw the triangles
            gl.drawArrays(this.primitive, 0, this.vertices.length);
        }
    }
}



