/**
 * @author Zachary Wartell
 * @version 1.x-6
 * @file Implements class Mat4Stack
 *
 * Students are given skeleton code for an initial set of classes, methods, and functions and are expected to implement,
 * and extend them and add additional functions to this file as needed.
*/




/**
 * @author Zachary Wartell 
 * @description Mat4Stack mimics the classic OpenGL Matrix Stack functions described in:
 *    http://www.glprogramming.com/red/chapter03.html#name6
 *
 */
class Mat4Stack
{
    /**
     * @author Zachary Wartell
     * @description Construct Mat4Stack. Argument 'gl' must be a valid WebGLContext
     * 
     * @param {Object} gl - valid GL context
     */    
    constructor (gl)
    {
        this.array = new Array();
        this.array.push(new Mat4());
        this.gl = gl;
    }

    /**
     * @author Zachary Wartell
     * @description Assign the GLSL Uniform mat4 variable, u_matrix, the top Mat4 on this Mat4Stack.
     *
     * This method must be called whereever you would set the active shader's various uniform variables.
     * See other example code included with this project.
     * @param {WebGLUniformLocation} u_matrix
     */
    updateUniform (u_matrix)
    {
        if (!(u_matrix instanceof WebGLUniformLocation))
            throw new Error("Bad Type");
        this.gl.uniformMatrix3fv(u_matrix, false, this.array[this.array.length-1].array);
    }

    /**
     * @author Zachary Wartell
     * @description Push a copy of the current top Mat4 onto the Mat4Stack
     * @param {null}
     */
    push ()
    {
        this.array.push(new Mat4(this.array[this.array.length-1]));
    }

    /**
     * @author Zachary Wartell
     * @description Pop the current top of stack
     * @param {null}
     */
    pop ()
    {
        this.array.pop();
    }

    /**
     * @author Zachary Wartell
     * @description return copy of the top of stack
     * @param {null}
     */
    top ()
    {
        if (this.array.length === 0)
            throw new Error("Mat4Stack: Empty");
        return new Mat4(this.array [this.array.length-1]);
    }

    /** @author Zachary Wartell
     * @description set the top Mat4 to the identity matrix
     *
     * @param {null}
     */
    loadIdentity ()
    {
        this.array[this.array.length-1].setIdentity();
    }

    /** @author Zachary Wartell
     * @description set the top Mat4 to the matrix 'matrix'
     *
     * @param {Number[]} - Array of 9 Numbers storing matrix in column-major order
     */
    loadMatrix (matrix)
    {
        this.array[this.array.length-1].set(matrix);
    }

    /** @author Zachary Wartell
     * @description translate the top Mat4 by translation [x,y,z]
     *
     * @param {Number[]} translate_vector - [tx,ty,tz]
     */
    translate (translate_vector)
    {
        if (this.array.length === 0)
            throw new Error("Mat4Stack: Empty");

        if (arguments[0] instanceof Array)
        {
            /* translate top matrix */
            this.array[this.array.length-1].translate(translate_vector);
        }
        else
            throw new Error("Unsupported Type");
    }

    /** @author Zachary Wartell && ..
     * @description multiply top Mat4 by matrix M
     * @param {Mat4} M
     */
    multiply(M)
    {
        if (! M instanceof Mat4)
            throw new Error("Unsupported Type");
        /* @todo implement this */
         this.array[this.array.length-1].multiply(M);
    }

    /** @author Zachary Wartell && ..
     * @description scale the top Mat4 by scale matrix with scale factors [sx,sy,sz]
     * @param { Number[]} scale_factors - [sx,sy,sz]
     */
    scale (scale_factors)
    {
        /* @todo implement this */
		this.array[this.array.length-1].scale(scale_factors);
    }


    /** @author Zachary Wartell
     * @description rotate the top Mat4 around Y axis by angle 'angle'
     * @param {Number} - angle
     */
    rotateY (angle)
    {
        this.array[this.array.length-1].rotateY(angle);
    }

    /** @author Zachary Wartell && ..
     * @description rotate the top Mat4 by rotate matrix with rotation angle 'angle'
     * @param {Number} - angle
     * @param {Number} - x-coordinate of rotation axis
     * @param {Number} - y-coordinate of rotation axis
     * @param {Number} - z-coordinate of rotation axis
     */
    rotate (angle, x,y,z)
    {
        /* @todo implement this */
		 this.array[this.array.length-1].rotate(angle, x, y, z);
    }

    /** @todo [STUDENT] Add additional methods to Mat4Stack based on the classic OpenGL matrix stack API
     * as you see fit.
     */    
}

/*****
 *
 * GLOBALS
 *
 *****/

/**
 * @description modelView3DStack serves as a modelView matrix stack for 3D applications.
 *
 * See class lectures and http://www.glprogramming.com/red/chapter03.html#name6
 * @type Mat4Stack
 */
var modelView3DStack = new Mat4Stack();

/**
 * @description projection3DStack serves as a projection matrix stack for 3D applications.
 *
 * See class lectures and http://www.glprogramming.com/red/chapter03.html#name6
 * @type Mat4Stack
 */
var projection3DStack = new Mat4Stack();
