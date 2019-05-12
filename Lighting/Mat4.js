/**
 * @author Zachary Wartell, ...
 * @version 1.x-20
 *
 * @file Mat4.js is a set of geometry and linear algebra functions related to 4x4 Matrices.
 *
 * Students are given skeleton code for an initial set of classes, methods, and functions and are expected to implement,
 * and extend them and add additional functions to this file as needed.
 *
 */


/**
 * @author Zachary Wartell
 *
 * @description  Return determinant of a 4x4 matrix
 *
 * @param {Number} M_00
 * @param {Number} M_10
 * @param {Number} M_20
 * @param {Number} M_30
 * @param {Number} M_01
 * @param {Number} M_11
 * @param {Number} M_21
 * @param {Number} M_31
 * @param {Number} M_02
 * @param {Number} M_12
 * @param {Number} M_22
 * @param {Number} M_32
 * @param {Number} M_03
 * @param {Number} M_13
 * @param {Number} M_23
 * @param {Number} M_33
 */
function det4(M_00, M_10, M_20, M_30,
              M_01, M_11, M_21, M_31,
              M_02, M_12, M_22, M_32,
              M_03, M_13, M_23, M_33)
{
	return M_00*det3(M_11, M_21, M_31, M_12, M_22, M_32, M_13, M_23, M_33)+
			-M_10*det3(M_01, M_21, M_31, M_02, M_22, M_32, M_03, M_23, M_33)+
			M_20*det3(M_11, M_01, M_31, M_12, M_02, M_32, M_13, M_03, M_33)+
			-M_30*det3(M_11, M_21, M_01, M_12, M_22, M_02, M_13, M_23, M_03);
}

/*
*   Misc constants related to Mat4 class
 */
const Mat4_ROWS=4;
const Mat4_COLUMNS=4;
const Mat4_SIZE=Mat4_ROWS*Mat4_COLUMNS;

/**
 * @author Zachary Wartell
 * @version 1.x-20
 * @class Mat4 is a 4x4 linear algebra matrix
 *
 * Elements are internally stored in 'column major' layout [{@link Cite.2}], i.e. for matrix M with math convention M_rc (r=row,c=column)
 * ```javascript
 *    this.array = [ M_00, M_10, M_20, M_30,  // 1st _column_
 *                   M_01, M_11, M_21, M_31,  // 2nd _column_
 *                   M_02, M_12, M_22, M_32.  // 3rd _column_
 *                   M_03, M_13, M_23, M_33]; // 4th _column_
 * ```
 *
 * Equivalently:
 * ```javascript
 *    this.array [0]  = M_00;  this.array  [4] = M_01;  this.array  [8] = M_02; this.array [12] = M_03;
 *    this.array [1]  = M_10;  this.array  [5] = M_11;  this.array  [9] = M_12; this.array [13] = M_13;
 *    this.array [2]  = M_20;  this.array  [6] = M_21;  this.array [10] = M_22; this.array [14] = M_23;
 *    this.array [3]  = M_30;  this.array  [7] = M_31;  this.array [11] = M_32; this.array [15] = M_33;
 * ```
 *
 * When the constructor is called with a Array or Float32Array parameter the above convention should be followed.
 *
 * Details:
 *
 * - Note, column major order is consistent with OpenGL and GLSL [{@link Cite.3}].
 * - For efficiency and GLSL compatibility we use a TypedArray [{@link Cite.1}].
 */
class Mat4
{

    /**
     * Constructor of Mat4, a 4x4 matrix
     *
     * Argument Options [Overloaded]:
     * - null  | default, initializes to I
     * - Number[] | initial value (size 16)
     * - Float32Array | initial value (size 16)
     * - Mat4 | initial value
     * - Number, Number ..., Number | M_00,M_10,M_20,M_30,  M_01, M_11, M_21, M_31,  M_02,M_12,M_22,M_32, M_03,M_13,M_23,M_33
     *
     * @param {*} - multiple options, see description for details
     * @author Zachary Wartell
     * @@param {(null | Number[] | Float32Array | Mat4 | ...Number )} matrix - INITIAL VALUE - null | Array (size 16) | Float32Array (size 16) | Mat4 | or 16 Number's in column major order
     * @@param {null | Number[] | Float32Array | Mat4 | ...Number } matrix - initial value for this Mat4
     * @@param {null | Number[] | Float32Array | Mat4 | M_00,M_10,M_20,M_30,  M_01, M_11, M_21, M_31,  M_02,M_12,M_22,M_32, M_03,M_13,M_23,M_33 } matrix - initial value for this Mat4
     * @@param {*} - multiple options, see description for details
     */    
    constructor()
    {
        if (arguments.length === Mat4_SIZE)
        {
            this.array.set(
                argument[0], argument[1], argument[2], argument[3],
                argument[4], argument[5], argument[6], argument[7],
                argument[8], argument[9], argument[10],argument[11],
                argument[12],argument[13],argument[14],argument[15]);
    
        } else if (arguments.length === 1)
        {
            if (arguments[0] instanceof Array)
            {
                this.array = new Float32Array(Mat4_SIZE);
                this.array.set(arguments[0]);
            } else if (arguments[0] instanceof Mat4)
            {
                this.array = new Float32Array(Mat4_SIZE);
                this.array.set(arguments[0].array);
            } else
                throw new Error("Unsupported Type");
        } else
        {
            this.array = new Float32Array(Mat4_SIZE);
            this.array.set(
                [1.0, 0.0, 0.0, 0.0,
                    0.0, 1.0, 0.0, 0.0,
                    0.0, 0.0, 1.0, 0.0,
                    0.0, 0.0, 0.0, 1.0]);
        }
    }
    /**
     * @author Zachary Wartell
     * @description  returns element in row r, column c of this Mat4
     * @param {Number} r - row
     * @param {Number} c - column
     * @returns {Number}
     */
    get (r, c)
    {
        return this.array[c * Mat4_ROWS + r];  // note use of column-major ordering, @see #R3
    }

    /**
     * @author Zachary Wartell
     *
     * @description  set elements in this Mat4
     *
     * Argument Options (Overloaded):
     *
     * - Mat4 | Mat4 whose values are copied to this Mat4
     * - Number, Number, Number | row, column , value - set element 'row','column' to to 'value'
     *
     * @param {*} - multiple options, see description for details
     * @@param {(Mat4 | Number, Number, Number )} - Mat4 or row, column , value
     * @@param {Mat4 | Number} - Mat4 or row
     * @@param {null | Number} [column] column of element to set
     * @@param {null | Number} [value] new value of single element
     * @@todo ZJW: [12/7/18] regarding above .. JSDoc seems to have poor support for function overloading
     */
    set ()
    {
        if (arguments.length === 3)
        {
            const r = arguments[0], c = arguments [1];
            this.array[c * Mat4_ROWS + r] = arguments[2];   // note use of column-major ordering, @see #R3
        } else if (arguments.length === 1)
        {
            if (arguments[0] instanceof Array)
            {
                this.array = new Float32Array(Mat4_SIZE);
                this.array.set(arguments[0]);
            } else if (arguments[0] instanceof Mat4)
            {
                this.array = new Float32Array(Mat4_SIZE);
                this.array.set(arguments[0].array);
            } else
                throw new Error("Unsupported Type");
        }  else
            throw new Error("Unsupported Type");
    }



    /**
     * @author Zachary Wartell
     * @description   returns the determinant of this Mat4
     * @returns {Number}
     */
    det ()
    {
        //return det4(...this.array); // ES6 spread operator
        return det4.apply(null,this.array); // ES6 spread operator failing when using javascript-obfuscator
    }

    /**
     * @author Zachary Wartell
     *
     * @description  Right side multiply this Mat4 by a matrix 'matrix', i.e.
     * in mathematical notation, let M equal this Mat4, and let M1 equal the argument 'matrix':
     *
     *     M' = M * M1
     *
     * @param {Mat4} matrix
     */
    multiply (matrix)
    {
        if (!(matrix instanceof Mat4))
            throw new Error("Unsupported Type");
		this.array = new Float32Array ([
			(this.array[0]*matrix.array[0]) + (this.array[4]*matrix.array[1]) + (this.array[8]*matrix.array[2]) + (this.array[12]*matrix.array[3]), 
			(this.array[1]*matrix.array[0]) + (this.array[5]*matrix.array[1]) + (this.array[9]*matrix.array[2]) + (this.array[13]*matrix.array[3]),
			(this.array[2]*matrix.array[0]) + (this.array[6]*matrix.array[1]) + (this.array[10]*matrix.array[2]) + (this.array[14]*matrix.array[3]),
			(this.array[3]*matrix.array[0]) + (this.array[7]*matrix.array[1]) + (this.array[11]*matrix.array[2]) + (this.array[15]*matrix.array[3]),
		
			(this.array[0]*matrix.array[4]) + (this.array[4]*matrix.array[5]) + (this.array[8]*matrix.array[6]) + (this.array[12]*matrix.array[7]), 
			(this.array[1]*matrix.array[4]) + (this.array[5]*matrix.array[5]) + (this.array[9]*matrix.array[6]) + (this.array[13]*matrix.array[7]),
			(this.array[2]*matrix.array[4]) + (this.array[6]*matrix.array[5]) + (this.array[10]*matrix.array[6]) + (this.array[14]*matrix.array[7]),
			(this.array[3]*matrix.array[4]) + (this.array[7]*matrix.array[5]) + (this.array[11]*matrix.array[6]) + (this.array[15]*matrix.array[7]),
			
			(this.array[0]*matrix.array[8]) + (this.array[4]*matrix.array[9]) + (this.array[8]*matrix.array[10]) + (this.array[12]*matrix.array[11]), 
			(this.array[1]*matrix.array[8]) + (this.array[5]*matrix.array[9]) + (this.array[9]*matrix.array[10]) + (this.array[13]*matrix.array[11]),
			(this.array[2]*matrix.array[8]) + (this.array[6]*matrix.array[9]) + (this.array[10]*matrix.array[10]) + (this.array[14]*matrix.array[11]),
			(this.array[3]*matrix.array[8]) + (this.array[7]*matrix.array[9]) + (this.array[11]*matrix.array[10]) + (this.array[15]*matrix.array[11]),
			
			(this.array[0]*matrix.array[12]) + (this.array[4]*matrix.array[13]) + (this.array[8]*matrix.array[14]) + (this.array[12]*matrix.array[15]), 
			(this.array[1]*matrix.array[12]) + (this.array[5]*matrix.array[13]) + (this.array[9]*matrix.array[14]) + (this.array[13]*matrix.array[15]),
			(this.array[2]*matrix.array[12]) + (this.array[6]*matrix.array[13]) + (this.array[10]*matrix.array[14]) + (this.array[14]*matrix.array[15]),
			(this.array[3]*matrix.array[12]) + (this.array[7]*matrix.array[13]) + (this.array[11]*matrix.array[14]) + (this.array[15]*matrix.array[15]),
		]);
    }
    /**
     * @author Zachary Wartell
     *
     * @description  Left side multiply this Mat4 by a matrix 'matrix' (denoted M1).
     * In mathematical notation, let M equal this Mat4, and M1 equal argument 'matrix':
     *
     *    M' = M1 * M
     *
     * For many calculations Mat4.multiply (a 'right hand side multiply') is sufficient, but occasionally being able to leftMultiply is useful.
     *
     * @param {Mat4} matrix - matrix to multiply this Mat4 by
     */
    leftMultiply (matrix)
    {
        if (!(matrix instanceof Mat4))
            throw new Error("Unsupported Type");
        matrix.multiply(this);
        this.set(matrix);
    }

    /**
     * @author Zachary Wartell
     * @description  Set this Mat4 to a new 2D translation matrix that translates by vector [x,y,z]
     *
     * @param { Number[] } translation translation vector
     * @param { Number } translation[].0 x
     * @param { Number } translation[].1 y
     * @param { Number } translation[].2 z
     */
    setTranslate (translate)
    {
        if (translate instanceof Array)
        {
            this.set(
                [1.0, 0.0, 0.0, 0.0,
                    0.0, 1.0, 0.0, 0.0,
                    0.0, 0.0, 1.0, 0.0,
                    translate[0], translate[1], translate[2], 1.0]);
        } else
            throw new Error("Unsupported Type");
    }

    /**
     * @author Zachary Wartell
     *
     * @description  Right side multiply this Mat4 by a 3D translation matrix that translates by vector [x,y,z], i.e.
     * in mathematical notation, let M equal this Mat4, and M_t equal the translate matrix:
     *
     *     M' = M * M_t
     *
     * @param { Number[] } translation translation vector
     * @param { Number } translation[].0 x
     * @param { Number } translation[].1 y
     * @param { Number } translation[].2 z
     */
    translate (translate)
    {
        if (translate instanceof Array && translate.length === 3)
        {
            const M_t = new Mat4();
            M_t.setTranslate(translate);
            this.multiply(M_t);
        } else
            throw new Error("Unsupported Type");
    }

    /**
     * @author Zachary Wartell
     *
     * @description  Left multiply this Mat4 by a 2D translation matrix that translates by vector [x,y,z], i.e.
     * in mathematical notation, let M equal this Mat4, and M_t equal the translate matrix:
     *
     *     M' = M_t * M
     *
     * @see comment on Mat4.prototype.leftMultiply
     *
     * @param { Number[] } translation translation vector
     * @param { Number } translation[].0 x
     * @param { Number } translation[].1 y
     * @param { Number } translation[].2 z
     */
    leftTranslate (translate)
    {
        if (translate instanceof Array && translate.length === 3)
        {
            const M_t = new Mat4(
                [1.0, 0.0, 0.0, 0.0,
                    0.0, 1.0, 0.0, 0.0,
                    0.0, 0.0, 1.0, 0.0,
                    translate[0], translate[1], translate[2], 1.0]);
            this.leftMultiply(M_t);
        } else
            throw new Error("Unsupported Type");
    }

    /**
     * @author Zachary Wartell && ..
     * @description  set this Mat4 to a new 3D scale matrix that scales by scale factors [sx,sy,sz]
     *
     * @param { Number[] } scale_factors scale factors
     * @param { Number } scale_factors[].0 x
     * @param { Number } scale_factors[].1 y
     * @param { Number } scale_factors[].2 z
     */
    setScale (scale_factors)
    {
        /** [STUDENT] REQUIRED: implement *////////////////////
        this.array = new Float32Array([
			scale_factors[0],   0.0,  0.0, 0.0,  
			0.0,  scale_factors[1],   0.0, 0.0,
			0.0,  0.0,  scale_factors[2],  0.0,
			0.0, 0.0, 0.0, 1.0
		]);
    }

    /**
     * @author Zachary Wartell && ..
     * @description  Right multiply this Mat4 by the 3D scale matrix that scales by scale factors [sx,sy,sz], i.e.
     * in mathematical notation, let M equal this Mat4, and 'M_s' equal the scale matrix:
     *
     *      M' = M * M_s
     *
     * @param { Number[] } scale_factors scale factors
     * @param { Number } scale_factors[].0 x
     * @param { Number } scale_factors[].1 y
     * @param { Number } scale_factors[].2 z
     */
    scale (scale_factors)
    {
        /** [STUDENT] REQUIRED: implement////////////////
           @hint follow design pattern of Mat4.prototype.translate
        * */
        var scale = new Mat4();
		scale.setScale(scale_factors);
		this.multiply(scale);
    }

    /**
     * @author Zachary Wartell && ..
     * @description  Left multiply this Mat4 by the 3D scale matrix that scales by scale factors [sx,sy,sz], i.e.
     * in mathematical notation, let M equal this Mat4, and 'M_s' equal the scale matrix:
     *
     *      M' = M_s * M
     *
     * @see comment on Mat4.prototype.leftMultiply
     *
     * @param { Number[] } scale_factors scale factors
     * @param { Number } scale_factors[].0 x
     * @param { Number } scale_factors[].1 y
     * @param { Number } scale_factors[].2 z
     */
    leftScale (scale_factors)
    {
        /**[STUDENT] implement (as needed)/////////////////////
       * Hint: follow design pattern of {@link Mat4.leftTranslate}
       * */
        var scale = new Mat4();
		scale.setScale(scale_factors);
		this.leftMultiply(scale);
    }

    /**
     * @author Zachary Wartell && ..
     * @description  set this Mat4 to a new 3D rotation matrix that rotates by angle 'angle' around Z axis
     *
     * @param {Number} angle angle in degrees
     */
    setRotateY (angle)
    {
        const a = angle * (Math.PI / 180),
            c = Math.cos(a),
            s = Math.sin(a);
        this.array.set(      // note column-order convention makes this 'look' transposed
            [ c,   0.0,  -s, 0.0,
              0.0, 1.0, 0.0, 0.0,
              s,   0.0,   c, 0.0,
              0.0, 0.0, 0.0, 1.0]);
    }

    /**
     * @author Zachary Wartell && ..
     * @description  Right multiply this Mat4 by the 3D rotation matrix that rotates by angle 'angle' around Z axis, e.g.
     * in mathematical notation, let M equal this Mat4, and 'M_r' equal the rotation matrix:
     *
     *      M' = M * M_r
     *
     * @param {Number} angle angle in degrees
     */
    rotateY (angle)
    {
        const a = angle * (Math.PI / 180),
            c = Math.cos(a),
            s = Math.sin(a);
        if(1)
        {   // Note: [STUDENT] generally you should follow the approach below (it's the 'easy way' for handling the "right side multiply" functions)
            const M = new Mat4(      // note the column-order convention makes this look incorrect (like the transpose of the desired matrix)
                [c,   0.0,  -s, 0.0,
                 0.0, 1.0, 0.0, 0.0,
                 s,   0.0,   c, 0.0,
                 0.0, 0.0, 0.0, 1.0]);
            this.multiply(M);
        } else
        {   /* Note: For the curious:  Just for fun below is the more 'optimal' solution (i.e. much less arithmetic and memory copies)
               If you ever looked at the source code for a professional rendering engine's matrix library, you'd be amazed how many
               code optimizations you'd find, just in the matrix routines....
             */
            const
                M_00 = this.array[0], M_02 = this.array[8],
                M_10 = this.array[1], M_12 = this.array[9],
                M_20 = this.array[2], M_22 = this.array[10];
            this.array[0]  = M_00 * c + M_02 * -s;
            this.array[1]  = M_10 * c + M_12 * -s;
            this.array[2]  = M_20 * c + M_22 * -s;

            this.array[8]  = M_00 * s + M_02 *  c;
            this.array[9]  = M_10 * s + M_12 *  c;
            this.array[10] = M_20 * s + M_22 *  c;
        }
    }

    /**
     * @author Zachary Wartell && ..
     * @description  Left multiply this Mat4 by the 3D rotation matrix that rotates by angle 'angle' around axis Z, e.g.
     * in mathematical notation, let M equal this Mat4, and 'M_r' equal the rotation matrix:
     *
     *      M' = M_r * M
     *
     * @see comment on Mat4.prototype.leftMultiply
     *
     * @param {Number} angle - measured in degrees
     */
    leftRotateY (angle)
    {
        /** [STUDENT] implement (as needed)//////////////////
         *  @hint follow design pattern of Mat4.leftTranslate
         */
        const a = angle * (Math.PI / 180),
            c = Math.cos(a),
            s = Math.sin(a);
        if(1)
        {   // Note: [STUDENT] generally you should follow the approach below (it's the 'easy way' for handling the "right side multiply" functions)
            const M = new Mat4(      // note the column-order convention makes this look incorrect (like the transpose of the desired matrix)
                [c,   0.0,  -s, 0.0,
                 0.0, 1.0, 0.0, 0.0,
                 s,   0.0,   c, 0.0,
                 0.0, 0.0, 0.0, 1.0]);
            this.leftMultiply(M);
        } else
        {   /* Note: For the curious:  Just for fun below is the more 'optimal' solution (i.e. much less arithmetic and memory copies)
               If you ever looked at the source code for a professional rendering engine's matrix library, you'd be amazed how many
               code optimizations you'd find, just in the matrix routines....
             */
            const
                M_00 = this.array[0], M_02 = this.array[8],
                M_10 = this.array[1], M_12 = this.array[9],
                M_20 = this.array[2], M_22 = this.array[10];
            this.array[0]  = M_00 * c + M_02 * -s;
            this.array[1]  = M_10 * c + M_12 * -s;
            this.array[2]  = M_20 * c + M_22 * -s;

            this.array[8]  = M_00 * s + M_02 *  c;
            this.array[9]  = M_10 * s + M_12 *  c;
            this.array[10] = M_20 * s + M_22 *  c;
        }
    }

    /**
     * @author Zachary Wartell
     * @description  set this Mat4 to the identity matrix
     */
    setIdentity ()
    {
        this.array.set(
            [
                1,0,0,0,
                0,1,0,0,
                0,0,1,0,
                0,0,0,1
            ]);
    }


    /**
     * @author Zachary Wartell && ..
     * @description  Set this Mat4 to the canonical OpenGL perspective projection matrix based on fovy, aspect, near and far.
     *
     * (see https://www.khronos.org/registry/OpenGL-Refpages/gl2.1/xhtml/gluPerspective.xml ).
     *
     * @param {Number} - fovy : angle between the upper and lower sides of the frustum
     * @param {Number} - aspect : aspect ratio of the frustum. (width/height)
     * @param {Number} - near : distance to the nearer depth clipping plane; value should be > 0.
     * @param {Number} - far : distance to the farther depth clipping plane; value should be > 0.
     * 
     */
    setPerspective(fovy, aspect, near, far)
    {
        /**[STUDENT] REQUIRED: implement//////////////////
        **/
		var fovyRad = fovy * (Math.PI/180);
		//console.log(fovyRad);
        var f = 1/Math.tan(fovyRad/2);
        //var f = 1/Math.tan(fovy/2 * Math.PI/180);
		this.array.set(
            [
                f/aspect,0,0,0,
                0,f,0,0,
                0,0,(far+near)/(near-far),(2*far*near)/(near-far),
                0,0,-1,0
            ]);
			this.transpose();
    }

    /**
     * @author Zachary Wartell && ...
     *
     * @description Right multiply this matrix by canonical OpenGL lookat view matrix (see
     * https://www.khronos.org/registry/OpenGL-Refpages/gl2.1/xhtml/gluLookAt.xml )
     *
     * @param eyeX the position of the eye point.
     * @param eyeY the position of the eye point.
     * @param eyeZ  the position of the eye point.
     * @param centerX the position of the looked at reference point.
     * @param centerY  the position of the looked at reference point.
     * @param centerZ  the position of the looked at reference point.
     * @param upX the direction of the up vector.
     * @param upY the direction of the up vector.
     * @param upZ the direction of the up vector.
     * 
     */
    lookAt(eyeX, eyeY, eyeZ, centerX, centerY, centerZ, upX, upY, upZ)
    {
        /* [STUDENT] REQUIRED: implement/
        *  @hint see Mat4.setLookAt and follow design pattern of Mat4.translate
        **/
		var tempM4 = new Mat4();
		//console.log("Look at");
		tempM4.setLookAt(eyeX, eyeY, eyeZ, centerX, centerY, centerZ, upX, upY, upZ);
		this.multiply(tempM4);
    }

    /**
     * @author Zachary Wartell
     *
     * @description Set this Mat4 to a rotation matrix the rotates around the axis through the origin
     * along vector (x,y,z) by 'angle'
     *
     * (x,y,z) need not be normalized.
     *
     *
     * @param {Number} angle : the angle of rotation (degrees)
     * @param {Number} x : X coordinate of vector of rotation axis.
     * @param {Number} y : Y coordinate of vector of rotation axis.
     * @param {Number} z : Z coordinate of vector of rotation axis.
     * 
     */
    setRotate(angle, x, y, z)
    {
        /**[STUDENT] REQUIRED: implement//
        *  Hint: see class lecture material, "ITCS 4120-3D Transforms.ppt" - "Rotation About An Arbitrary Axis"
        * */
       // Create a rotation matrix
		var radian = Math.PI * angle / 180.0; // Convert to radians
		var cosB = Math.cos(radian);
		var sinB = Math.sin(radian);
		this.array = new Float32Array([
			(x*x)*(1-cosB)+cosB, (x*y)*(1-cosB)-(z*sinB), (x*z)*(1-cosB)+(y*sinB), 0.0,
			(y*x)*(1-cosB)+(z*sinB), (y*y)*(1-cosB)+cosB, (y*z)*(1-cosB)-(x*sinB), 0.0,
			(z*x)*(1-cosB)-(y*sinB),  (z*y)*(1-cosB)+(x*sinB), (z*z)*(1-cosB)+cosB, 0.0,
			0.0, 0.0, 0.0, 1.0
		]);
		
		this.transpose();
    }

    /**
     * @author Zachary Wartell
     *
     * @description  Right multiply this matrix by the rotation matrix specified by the given angle and axis.
     *
     * @param {Number}  angle : the angle of rotation (degrees)
     * @param {Number}  x : X coordinate of vector of rotation axis
     * @param {Number}  y : Y coordinate of vector of rotation axis
     * @param {Number}  z : Z coordinate of vector of rotation axis
     * 
     */
    rotate(angle, x, y, z)
    {
        /**[STUDENT] REQUIRED: implement//
        *  Hint: follow pattern of Mat4.prototype.translate
        * */
        var rot = new Mat4();
		rot.setRotate(angle, x, y, z);
		this.multiply(rot);
	}

    /**
     * @author Zachary Wartell
     * @description Let M be this Mat4: compute and return the minor, M_ij, of this matrix.
     *
     * (see {@link http://mathworld.wolfram.com/Minor.html})
     * @param {Number} i row to strike out
     * @param {Number} j column to strike out
     * @return determinant of the minor M_ij of this Mat4
     */
    minor (i, j)
    {
		var tempM3 = new Mat3();
		var currentIndex = 0;
        for (var y = 0; y < 4; y+=1)
		{
			if(y==i) continue;
			for (var x = 0; x < 4; x+=1)
			{
				if(x==j) continue;
				tempM3.array[currentIndex] = this.array[(y*4)+x];
				currentIndex += 1;
			}
		}
		//console.log(tempM3);
		//console.log(tempM3.det());
		return tempM3.det();
    }

    /**
     * @author Zachary Wartell && ..
     * @description  Set this Mat4 to a new matrix equal to cofactor matrix of matrix 'M'
     *
     * See {@link http://mathworld.wolfram.com/Cofactor.html }
     *
     * @param {Mat4} M
     */
    setCofactorMatrix (M)
    {
        /* [STUDENT REQUIREMENT] implement this.////////////
        *  Hints:
        *    - utilize Mat4.prototype.minor
        *    - use the cofactor definition in class (see also http://mathworld.wolfram.com/Cofactor.html)
        * */
		var tempM4 = new Mat4();
		//console.log("cofactor");
		var currentIndex = 0;
        for (var j = 0; j < 4; j+=1)
		{
			for (var i = 0; i < 4; i+=1)
			{
				tempM4.array[currentIndex] = Math.pow(-1, i+j) * M.minor(i,j);
				//console.log(tempM4.array[currentIndex]);
				//console.log("in");
				//console.log(Math.pow(-1, i+j));
				//console.log(M.minor(i,j));
				currentIndex += 1;
			}
		}
		//console.log(tempM4);
		this.array.set(tempM4.array);
    }
    /**
     * @author Zachary Wartell && ..
     * @description  set this matrix to the inverse of matrix 'M'
     *
     * @param {Mat4} - M : the matrix to compute inverse of
     * @throw throw Error() if matrix is not invertible
     */
    setInverseOf(M)
    {
        /*[STUDENT REQUIREMENT] implement//////////////
        Hint: leverage Mat4.prototype.setCofactorMatrix, etc., using mathematical definition of matrix inverse given in class
        ("ITCS 4120 - 2D Coordinates.ppt")
        */
		/*
		//console.log("start");
        var tempM4 = new Mat4();
		//console.log(M);
		tempM4.setCofactorMatrix(M);
		//console.log(tempM4);
		var detM = M.det();
		//console.log(detM);
		this.array.set([
			tempM4.array[0]/detM, tempM4.array[1]/detM, tempM4.array[2]/detM, tempM4.array[3]/detM, 
			tempM4.array[4]/detM, tempM4.array[5]/detM, tempM4.array[6]/detM, tempM4.array[7]/detM, 
			tempM4.array[8]/detM, tempM4.array[9]/detM, tempM4.array[10]/detM, tempM4.array[11]/detM, 
			tempM4.array[12]/detM, tempM4.array[13]/detM, tempM4.array[14]/detM, tempM4.array[15]/detM, 
		]);
		//console.log(this);
		*/
		 var i, s, d, inv, det;

		  s = M.array;
		  d = this.array;
		  inv = new Float32Array(16);

		  inv[0]  =   s[5]*s[10]*s[15] - s[5] *s[11]*s[14] - s[9] *s[6]*s[15]
					+ s[9]*s[7] *s[14] + s[13]*s[6] *s[11] - s[13]*s[7]*s[10];
		  inv[4]  = - s[4]*s[10]*s[15] + s[4] *s[11]*s[14] + s[8] *s[6]*s[15]
					- s[8]*s[7] *s[14] - s[12]*s[6] *s[11] + s[12]*s[7]*s[10];
		  inv[8]  =   s[4]*s[9] *s[15] - s[4] *s[11]*s[13] - s[8] *s[5]*s[15]
					+ s[8]*s[7] *s[13] + s[12]*s[5] *s[11] - s[12]*s[7]*s[9];
		  inv[12] = - s[4]*s[9] *s[14] + s[4] *s[10]*s[13] + s[8] *s[5]*s[14]
					- s[8]*s[6] *s[13] - s[12]*s[5] *s[10] + s[12]*s[6]*s[9];

		  inv[1]  = - s[1]*s[10]*s[15] + s[1] *s[11]*s[14] + s[9] *s[2]*s[15]
					- s[9]*s[3] *s[14] - s[13]*s[2] *s[11] + s[13]*s[3]*s[10];
		  inv[5]  =   s[0]*s[10]*s[15] - s[0] *s[11]*s[14] - s[8] *s[2]*s[15]
					+ s[8]*s[3] *s[14] + s[12]*s[2] *s[11] - s[12]*s[3]*s[10];
		  inv[9]  = - s[0]*s[9] *s[15] + s[0] *s[11]*s[13] + s[8] *s[1]*s[15]
					- s[8]*s[3] *s[13] - s[12]*s[1] *s[11] + s[12]*s[3]*s[9];
		  inv[13] =   s[0]*s[9] *s[14] - s[0] *s[10]*s[13] - s[8] *s[1]*s[14]
					+ s[8]*s[2] *s[13] + s[12]*s[1] *s[10] - s[12]*s[2]*s[9];

		  inv[2]  =   s[1]*s[6]*s[15] - s[1] *s[7]*s[14] - s[5] *s[2]*s[15]
					+ s[5]*s[3]*s[14] + s[13]*s[2]*s[7]  - s[13]*s[3]*s[6];
		  inv[6]  = - s[0]*s[6]*s[15] + s[0] *s[7]*s[14] + s[4] *s[2]*s[15]
					- s[4]*s[3]*s[14] - s[12]*s[2]*s[7]  + s[12]*s[3]*s[6];
		  inv[10] =   s[0]*s[5]*s[15] - s[0] *s[7]*s[13] - s[4] *s[1]*s[15]
					+ s[4]*s[3]*s[13] + s[12]*s[1]*s[7]  - s[12]*s[3]*s[5];
		  inv[14] = - s[0]*s[5]*s[14] + s[0] *s[6]*s[13] + s[4] *s[1]*s[14]
					- s[4]*s[2]*s[13] - s[12]*s[1]*s[6]  + s[12]*s[2]*s[5];

		  inv[3]  = - s[1]*s[6]*s[11] + s[1]*s[7]*s[10] + s[5]*s[2]*s[11]
					- s[5]*s[3]*s[10] - s[9]*s[2]*s[7]  + s[9]*s[3]*s[6];
		  inv[7]  =   s[0]*s[6]*s[11] - s[0]*s[7]*s[10] - s[4]*s[2]*s[11]
					+ s[4]*s[3]*s[10] + s[8]*s[2]*s[7]  - s[8]*s[3]*s[6];
		  inv[11] = - s[0]*s[5]*s[11] + s[0]*s[7]*s[9]  + s[4]*s[1]*s[11]
					- s[4]*s[3]*s[9]  - s[8]*s[1]*s[7]  + s[8]*s[3]*s[5];
		  inv[15] =   s[0]*s[5]*s[10] - s[0]*s[6]*s[9]  - s[4]*s[1]*s[10]
					+ s[4]*s[2]*s[9]  + s[8]*s[1]*s[6]  - s[8]*s[2]*s[5];

		  det = s[0]*inv[0] + s[1]*inv[4] + s[2]*inv[8] + s[3]*inv[12];
		  if (det === 0) {
			return;
		  }

		  det = 1 / det;
		  for (i = 0; i < 16; i++) {
			d[i] = inv[i] * det;
		  }

    }

    /** Zachary Wartell && ..
     * @description set to this Mat4 its own inverse
     * 
     */
    invert()
    {
        this.setInverseOf(this);
    }


    /**
     * @author Zachary Wartell && ...
     * @description  set this matrix to the matrix transpose of itself.
     * 
     */
    transpose()
    {
		var tempM4 = new Mat4(this);
        this.array[0]=tempM4.array[0];
        this.array[1]=tempM4.array[4];
        this.array[2]=tempM4.array[8];
        this.array[3]=tempM4.array[12];
        this.array[4]=tempM4.array[1];
        this.array[5]=tempM4.array[5];
        this.array[6]=tempM4.array[9];
        this.array[7]=tempM4.array[13];
        this.array[8]=tempM4.array[2];
        this.array[9]=tempM4.array[6];
        this.array[10]=tempM4.array[10];
        this.array[11]=tempM4.array[14];
        this.array[12]=tempM4.array[3];
        this.array[13]=tempM4.array[7];
        this.array[14]=tempM4.array[11];
        this.array[15]=tempM4.array[15];
    }

    /**
     * @author Zachary Wartell && ...
     * @description  Set this Mat4 to the standard OpenGL viewing matrix (see https://www.khronos.org/registry/OpenGL-Refpages/gl2.1/xhtml/gluLookAt.xml )
     *
     * @param eyeX the position of the eye point.
     * @param eyeY the position of the eye point.
     * @param eyeZ  the position of the eye point.
     * @param centerX the position of the looked at reference point.
     * @param centerZ  the position of the looked at reference point.
     * @param centerZ  the position of the looked at reference point.
     * @param upX the direction of the up vector.
     * @param upY the direction of the up vector.
     * @param upZ the direction of the up vector.
     * 
     */
    setLookAt(eyeX, eyeY, eyeZ, centerX, centerY, centerZ, upX, upY, upZ)
    {
		//console.log("Start");
    /** [STUDENT] REQUIRED: implement */
		
		var diff = new Vec3(centerX-eyeX, centerY-eyeY, centerZ-eyeZ);
		var F = new Vec3(centerX-eyeX, centerY-eyeY, centerZ-eyeZ);
		var UP = new Vec3(upX, upY, upZ);
		//console.log(F);
		F.normalize();
		//console.log(F);
		UP.normalize();
		//console.log(UP);
		//console.log(F);
		var s = F;
		//console.log(s);
		s = s.cross(UP);
		//console.log(s);
		var sNorm = new Vec3(s);
		sNorm.normalize();
		//console.log(sNorm);
		//s.normalize();
		var u = sNorm;
		//console.log(u);
		u = u.cross(F);
		//console.log(u);
		
		var tempEye = new Vec3(eyeX,eyeY,eyeZ);
		var tempM4 = new Mat4();
		
		/*
		tempM4.array.set([s.x, s.y, s.z, -s.dot(tempEye),
						u.x, u.y, u.z, -u.dot(tempEye),
						-F.x, -F.y, -F.z, F.dot(tempEye),
						0, 0, 0, 1]);*/		
		
		tempM4.array.set([s.x, s.y, s.z, 0,
						  u.x, u.y, u.z, 0,
						 -F.x, -F.y, -F.z, 0,
						  0, 0, 0, 1]);
						
		tempM4.transpose();
						
		this.setIdentity();
		this.multiply(tempM4);
		this.translate([-eyeX,-eyeY,-eyeZ]);
    }
}


const Vec4_SIZE=4;

/**
 * @author Zachary Wartell 
 * @class  Vec4 represents one of several different types of geometric objects or linear algebra objects.
 * Vec4 represents either:
 *    - homogenous coordinates of points in 3D projective space, i.e. points or points-at-infinity, stored as (x,y,z,w)
 *    OR
 *    - 'regular' coordinates of points or vectors in 3D affine space, encoded as (x,y,z,1) or (x,y,z,0)
 * 
 * For operations combining Mat4 and Vec4, Vec4 is typically treated as a column matrix:
 * ```
 *         | x |
 *         | y |
 *         | z | 
 *         | w |
 * ```
 * However, some Mat4 methods treat Vec4 as a row matrix [x y z w]
 */
class Vec4
{
    /**
     * Construct new Vec4
     * @author Zachary Wartell
     *
     * @param {null | Number[] | Float32Array | Vec4 | ...Number } x,y,z,w - [default] [0,0,0,1] | Array (size 4) | Float32Array (size 4) | Vec4 | 4 Numbers
     */
    constructor()
    {
        this.array = new Float32Array(Vec4_SIZE);
        if (arguments.length === 0)
            // no arguments, so initialize to (0,0,0,1)
            this.array.set([0.0, 0.0, 0.0,1.0]);
        else if (arguments.length === 1)
        {
            if ( arguments[0] instanceof Array)
                this.array.set(arguments[0]);
            else if ( arguments[0] instanceof Vec4)
                this.array.set(arguments[0].array);
            else
                throw new Error("Unsupported Type");//
        } else
            this.set(...arguments); // ES6 'spread' operator
    }

    /**
     * @author Zachary Wartell && ..
     *
     * @description  Treat this Vec4 as a column matrix and multiply it by Mat4 M on it's left, i.e.
     * mathematically, denoting this Vec4 as "v":
     *   v' = M v
     *
     * @param {Mat4} M
     */
    multiply (M)
    {
        if (!(M instanceof Mat4))
            throw new Error("Unsupported Type");
        this.array.set([this.array[0] * M.array[0] + this.array[1] * M.array[4] + this.array[2] * M.array[8]+ this.array[3] * M.array[12],
						this.array[0] * M.array[1] + this.array[1] * M.array[5] + this.array[2] * M.array[9]+ this.array[3] * M.array[13],
						this.array[0] * M.array[2] + this.array[1] * M.array[6] + this.array[2] * M.array[10]+ this.array[3] * M.array[14],
						this.array[0] * M.array[3] + this.array[1] * M.array[7] + this.array[2] * M.array[11]+ this.array[3] * M.array[15]]);

    }

    /**
     * @author Zachary Wartell && ..
     *
     * @description  Treat this Vec4 as a row matrix and multiply it by Mat4 M on it's right, i.e.
     * mathematically, denoting this Vec4 as "v"
     *    v' = v M
     *
     * For many calculations Vec4.multiply (a 'left multiply') is sufficient, but occasionally being able to rightMultiply is useful.
     *
     * @param {Mat4} M
     */
    rightMultiply (M)
    {
        if (!(M instanceof Mat4))
            throw new Error("Unsupported Type");
	//Student added///////////////////
        this.array.set([this.array[0] * M.array[0] + this.array[0] * M.array[4] + this.array[0] * M.array[8]+ this.array[0] * M.array[12],
						this.array[1] * M.array[1] + this.array[1] * M.array[5] + this.array[1] * M.array[9]+ this.array[1] * M.array[13],
						this.array[2] * M.array[2] + this.array[2] * M.array[6] + this.array[2] * M.array[10]+ this.array[2] * M.array[14],
						this.array[3] * M.array[3] + this.array[3] * M.array[7] + this.array[3] * M.array[11]+ this.array[3] * M.array[15]]);
	}

    /**
     * @author Zachary Wartell
     * 
     * @description initialize a new Vec4
     *
     * Arguement Options [Overloaded]:
     * - Number[] : x,y,w,z values (size 4)
     * - Float32Array : x,y,w,z values (size 4)
     * - Vec4 : x,y,w,z values
     * - Vec3 , Number : x,y,w,z values (Vec3 -> x,y,z; Number -> w)
     * - Number, Number , Number, Number : x,y,w,z values
     * @param {*} - initial value see description for for details
     */
    set ()
    {
        if (arguments.length === 1)
        {
            if (arguments[0] instanceof Array)
                this.array.set(arguments[0]);
            else if (arguments[0] instanceof Float32Array)
                this.array.set(arguments[0]);
            else if (arguments[0] instanceof Vec4)
                this.array.set(arguments[0].array);
            else
                throw new Error("Unsupported Type");
        } else if (arguments.length === 2) {
            if (arguments[0] instanceof Vec3 && typeof arguments[1] === 'number')
            {
                this.x = arguments[0].x;
                this.y = arguments[0].y;
                this.z = arguments[0].z;
                this.w = arguments[1];
            } else
                throw new Error("Unsupported Type");
        } else if (arguments.length === Vec4_SIZE) {
            this.array.set(arguments);
        } else
            throw new Error("Unsupported Type");
    }

    /**
     * @todo [STUDENT] (as needed) add other methods based on common linear algebra vector operations
      */

    /**
     * @author Zachary Wartell
     * @description getter for x-coordinate
     */
    get x(){
        return this.array[0];
    }

    /**
     * @author Zachary Wartell
     * @description setter for x-coordinate
     */
    set x(x_){
        this.array[0] = x_;
    }

    /**
     * @author Zachary Wartell
     * @description getter for y-coordinate
     */
    get y(){
        return this.array[1];
    }

    /**
     * @author Zachary Wartell
     * @description setter for y-coordinate
     */
    set y(y_){
        this.array[1] = y_;
    }

    /**
     * @author Zachary Wartell
     * @description getter for z-coordinate
     */
    get z(){
        return this.array[2];
    }

    /**
     * @author Zachary Wartell
     * @description setter for z-coordinate
     */
    set z(z_){
        this.array[2] = z_;
    }

    /**
     * @author Zachary Wartell
     * @description getter for w-coordinate
     */
    get w(){
        return this.array[3];
    }

    /**
     * @author Zachary Wartell
     * @description setter for w-coordinate 
     */
    set w(w_){
        this.array[3] = w_;
    }
}


/**
 * @author Zachary Wartell && ... 
 * @description  This contains misc. code for testing and demonstrating the functions in this file.
 * 
 * Student Note: The tests are not meant to be comprehensive, but rather only provide examples.
 * @todo [STUDENT] (as needed) add/alter this function for testing your Mat4 code, etc.
 *
 */
function Mat4_test()
{
    var M1 = new Mat3();
    var M2 = new Mat4();
    var v0 = new Vec3(), v1 = new Vec3([5.0, 5.0,5.0]), v2,
        vx = new Vec3([1.0, 0.0,0.0]),
        vy = new Vec3([0.0, 1.0,0.0]),
        vx_h = new Vec4([1.0, 0.0, 0.0,0.0]), /* 'h' is for homogenous coordinate */
        vy_h = new Vec4(0.0, 1.0, 0.0,0.0),
        po_h = new Vec4();

	
    var rad = 45 * Math.PI / 180;
    M1.set(0, 0, Math.cos(rad));
    M1.set(0, 1, -Math.sin(rad));
    M1.set(1, 0, Math.sin(rad));
    M1.set(1, 1, Math.cos(rad));

    M2.set(0, 0, Math.cos(rad));
    M2.set(0, 1, -Math.sin(rad));
    M2.set(1, 0, Math.sin(rad));
    M2.set(1, 1, Math.cos(rad));

    v0.x = 1.0;
    v0.y = 2.0;
    v0.y += 1.0;
    v0.z = 3.0;
    v2 = new Vec3(v0);
    v2.add(v1);
    console.assert(v2.x === 6 && v2.y === 8 && v2.z === 8);

    vx.multiply(M1);
    vy.multiply(M1);

    console.assert(equalfd(vy.x, -Math.sin(rad)) && equalfd(vy.y, Math.cos(rad)) &&
            equalfd(vx.x, Math.cos(rad)) && equalfd(vx.y, Math.sin(rad)));


    var po = new Vec3([0,0]);
    po_h.set (po,1);

    vx_h.multiply(M2);
    vy_h.multiply(M2);
    //po_h.multiply(M2);
    console.assert(equalfd(vy_h.x, -Math.sin(rad)) && equalfd(vy_h.y, Math.cos(rad)) &&
            equalfd(vx_h.x, Math.cos(rad)) && equalfd(vx_h.y, Math.sin(rad)));

    var M3 = new Mat4();
    M3.setTranslate([10.0, 15.0,20.0]);
    M3.translate([5.0, 5.0,5.0]);
    po_h.multiply(M3);

    console.assert(equalfd(po_h.x, 15) && equalfd(po_h.y, 20));

    var M4 = new Mat4(), M5 = new Mat4();

    M4.setTranslate([10, 10, 10]);
    M4.rotateY(50);//////////RotateZ?????//////////////
    M4.scale([5, 10, 15]);

    M5.setTranslate([-10, -10, -10]);
    M5.leftRotateY(-50);///Rotate Z????///////////////////////////////
    M5.leftScale([1 / 5, 1 / 10, 1/ 15]);

    MI = new Mat4(M5);
    MI.multiply(M4);

    var M6 = new Mat4();
    M6.set([1, 2, 3, 4, 5, 3, 5, 2, 9, 12, 31, 12, 13, 12, 255, 16])
    var M7 = new Mat4();
    M7.setCofactorMatrix(M6);
    var M6_cf = new Mat4([2, 2, -3, 4, -11, 6,-3, 6, -3]);
    /* @todo add more tests as needed */
	
	
	///////////////////////////////////////////////////////////////////////////////
	///////////////////////////////////////////////////////////////////////////////
	///////////////////////////////////////////////////////////////////////////////
	
	
	var eyeStart = new Vec4(0, 0, 6, 1);
    var eye = new Vec4(eyeStart);

    var upVectorStart = new Vec4(0, 1, 0, 0);
    var upVector = new Vec4(upVectorStart);
	
	var viewMatrix1 = new Mat4();
	viewMatrix1.setIdentity();
	viewMatrix1.lookAt(eye.x, eye.y, eye.z, 0, 0, 0, upVector.x, upVector.y, upVector.z);	
	console.log(viewMatrix1)
	
	
	var tempM4 = new Mat4();
	tempM4.setRotateY(90);
	eye=new Vec4(eyeStart);
	eye.multiply(tempM4);
	upVector=new Vec4(upVectorStart);
	upVector.multiply(tempM4);

	//console.log(eyeStart);
	console.log(eye);
	console.log(upVector);
	

	
	var viewMatrix2 = new Mat4();
	viewMatrix2.setIdentity();
	viewMatrix2.lookAt(eye.x, eye.y, eye.z, 0, 0, 0, upVector.x, upVector.y, upVector.z);
	console.log(viewMatrix2)
	//viewMatrix.translate([0,0, 1]);	
	//console.log(viewMatrix)
	
    var MJ1 = new Mat4();
    MJ1.set([1, 2, 3, 4, 1, 2, 3, 4, 1, 2, 3, 4, 1, 2, 3, 4]);	
    var MG1 = new Mat4();
    MG1.set([0.000000000000001, 0,-1,0, 0, 1, 0, 0, 1, 0, 0.000000000000001, 0, 0, 0, 0, 1]);
	//console.log(MG1);
	MJ1.multiply(MG1);
	//console.log(MJ1);
	
	var MJ2 = new Mat4();
    MJ2.set([1, 2, 3, 4, 1, 2, 3, 4, 1, 2, 3, 4, 1, 2, 3, 4]);	
    var MI2 = new Mat4();
    MI2.set([5, 5, 5, 5, 9, 9, 9, 9, 7, 7, 7, 7, 1, 1, 1, 1]);
	MJ2.leftMultiply(MI2);
	//console.log(MJ2);
	
	
	var MJ3 = new Mat4();
    MJ3.set([1, 2, 3, 4, 1, 2, 3, 4, 1, 2, 3, 4, 1, 2, 3, 4]);	
    var MI3 = new Mat4();
    MI3.set([5, 5, 5, 5, 9, 9, 9, 9, 7, 7, 7, 7, 1, 1, 1, 1]);
	MI3.multiply(MJ3);
	//console.log(MI3);
	
	var rotYM4 = new Mat4();
	rotYM4.setRotateY(90);
	//console.log(rotYM4);
	var MJ4 = new Mat4();
    MJ4.set([1, 2, 3, 4, 1, 2, 3, 4, 1, 2, 3, 4, 1, 2, 3, 4]);	
	MJ4.rotateY(90);
	//console.log(MJ4);
	
	var rotYM42 = new Mat4();
	rotYM42.setRotateY(90);
	var MJ5 = new Mat4();
    MJ5.set([1, 2, 3, 4, 1, 2, 3, 4, 1, 2, 3, 4, 1, 2, 3, 4]);	
	MJ5.multiply(rotYM42);
	//console.log(MJ5);
	
	
	
	
    console.log("Mat4_test");
    return;
}
