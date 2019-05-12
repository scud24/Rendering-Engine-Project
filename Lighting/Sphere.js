/**
 * @author Zachary Wartell && ..
 * @version 1.x-9
 *
 * @file Sphere.js contains routines for tessellation of a sphere
 *
 * Students are given a initial set of classes and functions are expected to extend these and add
 * additional functions to this file as needed.
 */


/**
 * @author ..
 * @description generate vertices that tessellate a sphere of radius 1.
 *
 * @param {Number} divisions number of sub-divisions with which to create the tessellated sphere
 * @param {Number[][]} positions Array of x,y,z positions of vertices of triangles that tessellate a unit sphere
 * @param {Number[][]} indices Array of triples of integer indices into "positions" where each triple specifies a triangle on the sphere
 */
function generate_sphere(divisions,positions, indices) {
    /**
     @todo [STUDENT] REQUIRED: Tessellation:  Use parametric equation of a sphere using spherical coordinates as the
     two parameters of the equation to generate points on the sphere, see http://mathworld.wolfram.com/Sphere.html.

     The easiest approach is to create the indices assuming rendering will be done with GL_TRIANGLES.
     */
		//console.log(positions);
		/*
         *  Initialize JS arrays with vertices attributes
         */
        // create sphere vertices 
        //var maxIndex = divisions;
        var maxIndex = 16;
		var r = 0.25;
		
/*/////////////////////
		var thetaOffset = Math.PI/maxIndex;
		var phiOffset = Math.PI/maxIndex;
		for (var j = 0; j < 2*Math.PI/thetaOffset; j++)
		{
			var theta = j*thetaOffset;
			console.log(theta);
			for (var i = 0; i < Math.PI/phiOffset; i++)
			{		
				var phi = i*phiOffset-Math.PI/2;
				
				positions[j*maxIndex+i] = [r*Math.cos(theta)*Math.sin(phi)-r, r*Math.sin(theta)*Math.sin(phi)-r, r*Math.cos(phi)-r];
				indices[j*maxIndex+i] = [j*maxIndex+i, j*maxIndex+i+1, (j+1)*maxIndex+i, (j+1)*maxIndex+i+1];
			}
		}
		//console.log(positions);
*/////////////////////////////
		var zOffset = 0;
		var thetaOffset = 2*Math.PI/maxIndex;
				//console.log("thetaoffset:");
				//console.log(thetaOffset);
		var phiOffset = Math.PI/maxIndex;
				//console.log("phioffset:");
				//console.log(phiOffset);
		for (var j = 0; j < 2*Math.PI/thetaOffset; j++)
		{
			var theta = j*thetaOffset;
			//console.log(theta);
			for (var i = 0; i < (Math.PI)/phiOffset; i++)
			{		
				var phi = i*phiOffset;
				
				positions[j*maxIndex+i] = [r*Math.cos(theta)*Math.sin(phi), r*Math.sin(theta)*Math.sin(phi), r*Math.cos(phi)+zOffset];
				//positions[j*maxIndex+i*4+1] = [r*Math.cos(theta)*Math.sin(phi+phiOffset), r*Math.sin(theta)*Math.sin(phi+phiOffset), r*Math.cos(phi+phiOffset)+zOffset];
				//positions[j*maxIndex+i*4+2] = [r*Math.cos(theta+thetaOffset)*Math.sin(phi+phiOffset), r*Math.sin(theta+thetaOffset)*Math.sin(phi+phiOffset), r*Math.cos(phi+phiOffset)+zOffset];
				//positions[j*maxIndex+i*4+3] = [r*Math.cos(theta+thetaOffset)*Math.sin(phi), r*Math.sin(theta+thetaOffset)*Math.sin(phi), r*Math.cos(phi)+zOffset];
				
				//console.log("stats"); 
				//console.log(j+1); 
				//console.log((2*Math.PI/thetaOffset));
				//console.log(i+1); 
				//console.log(Math.PI/phiOffset); 
				if((j+1) < (2*Math.PI/thetaOffset))
				{
					if((i+1) < (Math.PI/phiOffset))
					{
					    indices[j*maxIndex+i] = [j*maxIndex+i, j*maxIndex+(i+1), (j+1)*maxIndex+(i+1),(j+1)*maxIndex+i];
						}
					else
					{
						indices[j*maxIndex+i] = [j*maxIndex+i, j*maxIndex+(0), (j+1)*maxIndex+(0),(j+1)*maxIndex+i];
						}
				}
				else
				{
					if(i+1 < Math.PI/phiOffset)
					{
						//console.log("else i"); 
						indices[j*maxIndex+i] = [j*maxIndex+i, j*maxIndex+(i+1), (0)*maxIndex+(i+1),(0)*maxIndex+i];
						}
					else
					{
						//console.log("else else"); 
						indices[j*maxIndex+i] = [j*maxIndex+i, j*maxIndex+(0), (0)*maxIndex+(0),(0)*maxIndex+i];
						}
				}
				
				/*console.log("i:");
				console.log(i);
				console.log("j:");
				console.log(j);
				console.log("indices[i]:");
				console.log(indices[j*maxIndex+i]);
				console.log(positions[j*maxIndex+i*4]);
				console.log(positions[j*maxIndex+i*4+1]);
				console.log(positions[j*maxIndex+i*4+1]);
				console.log(positions[j*maxIndex+i*4+1]);*/
			}
		}
		//console.log(positions.length);
		//console.log(indices.length);
		//console.log(positions);
		
		
		/*var j = 0;
		//for (var theta = 0; theta < 2*Math.PI-Math.PI/maxIndex; theta += Math.PI/maxIndex)
		for (var theta = 0; theta < 2*Math.PI-Math.PI/maxIndex+0.00001; theta += Math.PI/maxIndex)
		{
			var i = 0;
			//for (var phi = -Math.PI/2; phi < (Math.PI/2)-Math.PI/maxIndex; phi += Math.PI/maxIndex)
			for (var phi = 0; phi < ((Math.PI)-Math.PI/maxIndex/2); phi += Math.PI/maxIndex/2)
			{	
				indices[j*maxIndex+i] = [j*maxIndex+i, j*maxIndex+i+1, (j+1)*maxIndex+i, (j+1)*maxIndex+i+1];
				i++;
			}
			j++;
		}
		console.log("i:");
		console.log(i);
		console.log("j:");
		console.log(j);*/
		//console.log(indices);
		
}		

/**
 * @author ..
 * @description generate vertices that tessellate a sphere of radius 1.
 *
 * @param {Number} divisions number of sub-divisions with which to create the tessellated sphere
 * @param {Number[][]} positions Array of x,y,z positions of vertices of triangles that tessellate a unit sphere
 * @param {Number[][]} indices Array of triples of integer indices into "positions" where each triple specifies a triangle on the sphere
 */
function generate_trisphere(divisions,positions, indices) {
    /**
     @todo [STUDENT] REQUIRED: Tessellation:  Use parametric equation of a sphere using spherical coordinates as the
     two parameters of the equation to generate points on the sphere, see http://mathworld.wolfram.com/Sphere.html.

     The easiest approach is to create the indices assuming rendering will be done with GL_TRIANGLES.
     */
	 
		console.log("trisphere generate");
		//console.log(positions);
		/*
         *  Initialize JS arrays with vertices attributes
         */
        // create sphere vertices 
        //var maxIndex = divisions;
        var maxIndex = 16;
		var r = 0.25;
		var zOffset = 0;
		var thetaOffset = 2*Math.PI/maxIndex;
		var phiOffset = Math.PI/maxIndex;
		
		for (var j = 0; j < 2*Math.PI/thetaOffset; j++)
		{
			var theta = j*thetaOffset;
			//console.log(theta);
			for (var i = 0; i < Math.PI/phiOffset; i++)
			{		
				var phi = i*phiOffset;
				
				positions[j*maxIndex+i] = [r*Math.cos(theta)*Math.sin(phi), r*Math.sin(theta)*Math.sin(phi), r*Math.cos(phi)+zOffset];
				
				if((j+1) < (2*Math.PI/thetaOffset))
				{
					if((i+1) < (Math.PI/phiOffset))
					{
					    indices[(j*maxIndex+i)*2] = [j*maxIndex+i, j*maxIndex+(i+1), (j+1)*maxIndex+(i+1)];
						indices[(j*maxIndex+i)*2+1] = [j*maxIndex+i,  (j+1)*maxIndex+(i+1),(j+1)*maxIndex+i];
					}
					else
					{
						indices[(j*maxIndex+i)*2] = [j*maxIndex+i, j*maxIndex+(0), (j+1)*maxIndex+(0)];
						indices[(j*maxIndex+i)*2+1] = [j*maxIndex+i, (j+1)*maxIndex+(0),(j+1)*maxIndex+i];
					}
				}
				else
				{
					if(i+1 < Math.PI/phiOffset)
					{
						//console.log("else i"); 
						indices[(j*maxIndex+i)*2] = [j*maxIndex+i, j*maxIndex+(i+1), (0)*maxIndex+(i+1)];
						indices[(j*maxIndex+i)*2+1] = [j*maxIndex+i,  (0)*maxIndex+(i+1),(0)*maxIndex+i];
					}
					else
					{
						//console.log("else else"); 
						indices[(j*maxIndex+i)*2] = [j*maxIndex+i, j*maxIndex+(0), (0)*maxIndex+(0)];
						indices[(j*maxIndex+i)*2+1] = [j*maxIndex+i,  (0)*maxIndex+(0),(0)*maxIndex+i];
					}
				}
			}
		}
		//console.log(positions.length);
		//console.log(indices.length);
}		

/**
 * @author ..
 * @description generate vertices that tessellate a sphere of radius 1.
 *
 * @param {Number} divisions number of sub-divisions with which to create the tessellated sphere
 * @param {Number[][]} positions Array of x,y,z positions of vertices of triangles that tessellate a unit sphere
 * @param {Number[][]} indices Array of triples of integer indices into "positions" where each triple specifies a triangle on the sphere
 */
function generate_triangleStripSphere(divisions,positions, indices, stripLengths, sphereOffset) {
    /**
     @todo [STUDENT] REQUIRED: Tessellation:  Use parametric equation of a sphere using spherical coordinates as the
     two parameters of the equation to generate points on the sphere, see http://mathworld.wolfram.com/Sphere.html.

     The easiest approach is to create the indices assuming rendering will be done with GL_TRIANGLES.
     */
		console.log("stripsphere generate");
		
		/*
         *  Initialize JS arrays with vertices attributes
         */
        // create sphere vertices 
        var maxIndex = divisions;
		var r = 0.25;
		var zOffset = 0;
		var thetaOffset = 2*Math.PI/maxIndex;
		var phiOffset = Math.PI/maxIndex;
		
		var jMax = Math.PI/phiOffset + 1;
		var iMax = 2*Math.PI/thetaOffset +0;
		for (var j = 0; j < jMax; j++)
		{
			indices[j]=[];
			for (var i = 0; i < iMax; i++)
			{		
				var theta = i*thetaOffset + (j%2*0.5*thetaOffset);
				//console.log(theta);
				var phi = j*phiOffset ;
				
				positions[j*iMax+i] = [r*Math.cos(theta)*Math.sin(phi), r*Math.sin(theta)*Math.sin(phi), r*Math.cos(phi)+zOffset];
				
				//console.log("index, vert"); 
				//console.log(j*iMax+i); 
				//console.log(positions[j*iMax+i]); 
				
				//if(j%2 == 0)
				//{
					if(indices[j][i*2] != null)
					{
						console.log("Error: indices overwrite");
					}
					if((j+1) < (jMax))
					{
						if((i+1) < (iMax))
						{
							indices[j][i*2] = j*iMax+i;
							indices[j][i*2+1] = (j+1)*iMax+i;
						}
						else
						{
							//console.log("warn: if-else");
							indices[j][i*2] = j*iMax+i;
							indices[j][i*2+1] = (j+1)*iMax+i;
							
							indices[j][i*2+2] = j*iMax+0;
							indices[j][i*2+3] = (j+1)*iMax+0;
						}
					}
					else
					{
						if(iMax)
						{
							indices[j][i*2] = j*iMax+i;
							indices[j][i*2+1] = (0)*iMax+i;
						}
						else
						{
							//console.log("warn: else-else");
							indices[j][i*2] = j*iMax+i;
							indices[j][i*2+1] = (0)*iMax+i;
							
							indices[j][i*2+2] = j*iMax+0;
							indices[j][i*2+3] = (0)*iMax+0;
						}
					}
				//}
				
			}
			//console.log("Inner len");
			//console.log(indices[j].length);
			stripLengths[j]=indices[j].length;
		}
		console.log("vertices len, indices len, stripLengths len");
		console.log(positions.length);
		console.log(indices.length);
		console.log(stripLengths.length);
}		