class Object3D {
    constructor(gl, vshader, fshader)
    {
        this.objDoc = null;      // The information of OBJ file
        this.drawingInfo = null; // The information for drawing 3D model

        // Coordinate transformation matrix
        this.modelMatrix = new Matrix4();
        this.mvpMatrix   = new Matrix4();
        this.normalMatrix= new Matrix4();

        this.program = createProgram(gl, vshader, fshader);
        if (!this.program) {
            alert('Failed to create program');
            throw new ShaderException();
        }
        this.gl = gl;
        gl.useProgram(this.program);

        var program = this.program;
        program.a_Position     = gl.getAttribLocation( program, 'a_Position');
        program.a_Normal       = gl.getAttribLocation( program, 'a_Normal');
        program.a_Color        = gl.getAttribLocation( program, 'a_Color');
        program.u_MvpMatrix    = gl.getUniformLocation(program, 'u_MvpMatrix');
        program.u_NormalMatrix = gl.getUniformLocation(program, 'u_NormalMatrix');

        if ( program.a_Position < 0 ||
             program.a_Normal < 0   ||
             program.a_Color < 0    ||
            !program.u_MvpMatrix    ||
            !program.u_NormalMatrix ) {
          alert('attribute, Failed to get storage location of uniform variable'); 
          throw new ShaderException();
        }
    }
}