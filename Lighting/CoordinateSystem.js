/* 
 * @author Zachary Wartell && 
 */

/*****
 * 
 * GLOBALS
 * 
 *****/


/* @author Zachary Wartell && ...
 * Construct new CoordinateSystem Object
 * 
 * CoordinateSystem inherits from CoordinateRenderable.  CoordinateSystem represents a 2d coordinate system
 * It has child objects of type CoordinateSystem and type Shape.
 * 
 * Details of the design of CoordinateSystem are described in the assignment description and related lectures.
*/
class CoordinateSystem
{
	constructor()
	{
		// these properties describe where this CoordinateSystem is relative to it's parent CoordinateSystem 
		this.origin = new Vec3();       // location of origin
		this.scale = new Vec3([1,1,1]);   // scale factors
		this.orientation = 0.0;         // orientation (i.e. rotation)
		this.rotateSpeed = 0.0;
		
		this.children = new Array();
		this.objects = new Array();
	}
}

/* @author Zachary Wartell
 *
 * Return a Mat4 transform that maps local to parent coordinates, i.e. using the course lecture notation:
 * 
 *       M
 *        parent<-local
 *  
 *  @returns {Mat4}
 *  
 * Remark: Method Name
 *      The method name here, "parent_from_local", is meant to be a visual approximation to something like "parent<-local"
 *      It is tempting to name this method "parent_to_local" instead, but that would be an fundamental math _error_ because the
 *      matrix that transforms "parent to local" is:
 *
 *      M
 *        local<-parent
 *  
 *      which is the inverse the matrix this method is suppose to compute.
 *
 *      If JavaScript and all it's tools allowed programmers to use a left-arrow character as part of the identifier name (such Unicode character
 *      U+219x or ←), I would happily rename "parent_from_local" to be "parent←local".   But doing so at this stage in JavaScript's history
 *      has too many other problems.  So we have to live with "parent_from_local"
 *                        
 * 
 */
CoordinateSystem.prototype.parent_from_local = function ()
{
    var M = new Mat4();
    M.rotate(this.orientation);
    M.translate([this.origin.x,this.origin.y]);
    //M.scale([this.scale.x,this.scale.y]);
    return M;          
};

/* @author 
 * 
 * Return a Mat4 transform that maps parent to local coordinates, i.e. using the course's notation:
 * 
 *       M
 *        local<-parent
 *        
 * @returns {Mat4}
 */
CoordinateSystem.prototype.local_from_parent = function ()
{
	/*
    var M = new Mat4();
    M.setScale([(1.0/this.scale.x), (1.0/this.scale.y)]);
    M.rotate(-this.orientation);
    M.translate([-this.origin.x, -this.origin.y]);
    return M;   
	*/	
	var M = this.parent_from_local()
	M.inverse();
	return M;
};

/* @author 
 *
 * Return a Mat4 transform that maps local to world coordinates, i.e. using the course's notation:
 * 
 *     M
 *      world<-local
 *  
 * @returns {Mat4}
 */
CoordinateSystem.prototype.world_from_local = function ()
{
	
	pointCheckStack.push();
		//console.log(this);
	
	pointCheckStack.rotate(this.orientation);
	if(this.children.length == 0)
	{
		pointCheckStack.rotate(-this.orientation);
	}
	pointCheckStack.translate([this.origin.x,this.origin.y]);
	//pointCheckStack.scale([this.scale.x,this.scale.y]);
	
	//var M = new Mat4();
    //M.translate([this.origin.x,this.origin.y]);
    //M.rotate(this.orientation);
    //M.scale([this.scale.x,this.scale.y]);
	
	var T = new Mat4();
	T.setIdentity()
	
	if(this.parent != null)
	{
		//T = this.parent.world_from_local();
		T.multiply(this.parent.world_from_local());
		//T.leftMultiply(this.parent.world_from_local());
	}
	else{
		T = pointCheckStack.array[pointCheckStack.array.length-1];
	};
	
	pointCheckStack.pop();
	return T;
};

/* @author 
 *
 * Return a Mat4 transform that maps world to local coordinates, i.e. using the course's notation:
 * 
 *       M
 *        local<-world
 *        
 *  @returns {Mat4}
 */
CoordinateSystem.prototype.local_from_world = function ()
{
	
	var M = this.world_from_local()
	M.inverse();
	return M;
};

/*
 * Recursively traverse the tree structure rendering all children coordinate systems and all shapes.
 * @returns {undefined}
 */
CoordinateSystem.prototype.render = function ()
{
	//console.log(this.shapes);
	//console.log(modelViewStack);
		
	
		modelView3DStack.push();
		//console.log(this);
		//console.log("orientation");
		//console.log(this.orientation);
		//modelView3DStack.rotate(this.orientation);
		//console.log("translation");
		//console.log(this.origin);
		modelView3DStack.translate([this.origin.x,this.origin.y, this.origin.z]);
		modelView3DStack.scale([this.scale.x,this.scale.y,this.scale.z]);
		for(var i = 0; i < this.objects.length; i++)
		{	
			this.objects[i].renderable.render();	
		}
		for(var i = 0; i < this.children.length; i++)
		{		
			
			this.children[i].render();
		}
		modelView3DStack.pop();
	
};

/*
 * Attach the shape 'shape' to this CoordinateSystem's shapes
 * @param {Shape} shape
 * @returns {undefined}
 */
CoordinateSystem.prototype.add_object = function (object)
{
	shape.parent = this;
    this.objects.push(shape);
};

/*
 * Attach the CoordinateSystem 'child' to this CoordinateSystem's children
 * @param {CoordinateSystem} child
 * @returns {undefined}
 */
CoordinateSystem.prototype.add_child = function (child)
{
	child.parent = this;
    this.children.push(child);
};

