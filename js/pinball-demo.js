$(function(){
	
	var	b2DistanceJointDef = Box2D.Dynamics.Joints.b2DistanceJointDef,
		b2RevoluteJointDef = Box2D.Dynamics.Joints.b2RevoluteJointDef;

	Paddle = function(data) {

		var angularVelocity = 0,
			maxSpeed = 30;
			
		this.__proto__ = new b2Game.Pawn({
			id: 'paddle',
			type: 'dynamic',
			image: data.image,
			width: 100,
			height: 30,
			position: data.position,
			density: 1,
			categoryBits: 1
		});			
		
		b2Game.pawns[this.id] = this;

		revoluteDef = new b2RevoluteJointDef;
		revoluteDef.Initialize(this.body, b2Game.world.GetGroundBody(), this.body.GetWorldPoint(data.revolutePos));  
		revoluteDef.enableLimit = true;  
		revoluteDef.upperAngle = .6;  
		revoluteDef.lowerAngle = -.6;  
		b2Game.world.CreateJoint(revoluteDef);  							

		springDef = new b2DistanceJointDef;
		springDef.Initialize(this.body, b2Game.world.GetGroundBody(), this.body.GetWorldPoint(data.springPos1), this.body.GetWorldPoint(data.springPos2));  
		springDef.frequencyHz = 8;
		springDef.dampingRatio = 1;
		
		this.spring = b2Game.world.CreateJoint(springDef);  	
		
		this.update = function() {
		
			if( b2Game.keyPress[data.button] ) {
				this.body.SetAwake(true);
				this.spring.SetLength(1.5)			
			}
			else if( b2Game.keyPress[data.button] === undefined ) {
				this.body.SetAwake(true);
				this.spring.SetLength(3.5)						
			}
			
			this.__proto__.update();
		
		}

	}
		
	Ball = function(vector) {
				
		this.__proto__ = new b2Game.Pawn({
			id: 'ball',
			type: 'dynamic',
			image: 'images/silverball.png',
			shape: 'circle',
			radius: 32/(30*2),
			height: 32,
			width: 32,
			density: 3,
			position: vector,
			categoryBits: 2
		});			
		
		b2Game.pawns[this.id] = this;
		
	}
	
	Launcher = function() {
	
		this.__proto__ = new b2Game.Pawn({
			id: 'launcher',
			type: 'dynamic',
			image: 'images/walltile.jpg',
			width: 30,
			height: 10,
			position: {x: b2Game.stage.width - 33/30, y: b2Game.stage.height - 3 },
			density: 1,
			categoryBits: 2,
			fixedRotation: true
		});		

		b2Game.pawns[this.id] = this;

		springDef = new b2DistanceJointDef;
		springDef.Initialize(this.body, b2Game.world.GetGroundBody(), this.body.GetWorldPoint({x:0, y:0}), this.body.GetWorldPoint({x:0, y:3}));  
		springDef.frequencyHz = 8;
		springDef.dampingRatio = 0.7;

		this.spring = b2Game.world.CreateJoint(springDef); 

		this.update = function() {
		
			if( b2Game.keyPress[32] ) {
				this.body.SetAwake(true);
				this.spring.SetLength(0.5)			
			}
			else if( b2Game.keyPress[32] === undefined ) {
				this.body.SetAwake(true);
				this.spring.SetLength(3)						
			}
				
			this.__proto__.update();
		
		}

		
	}
	
	
	Bumper = function(vector) {
	
		this.__proto__ = new b2Game.Pawn({
			id: 'launcher',
			type: 'dynamic',
			image: 'images/bumper.png',
			width: 90,
			height: 90,
			position: vector,
			density: 2,
			categoryBits: 2,
			shape: 'circle',
			radius: 1.45,
			fixedRotation: true,
			restitution: 1.37
		});		

		b2Game.pawns[this.id] = this;

		springDef = new b2DistanceJointDef;
		springDef.Initialize(this.body, b2Game.world.GetGroundBody(), this.body.GetWorldPoint({x:0, y:0}), this.body.GetWorldPoint({x:0, y:0}));  
		springDef.frequencyHz = 8;
		springDef.dampingRatio = 4.2;

		this.spring = b2Game.world.CreateJoint(springDef); 

		
	}

	b2Game.edge.setProperties({
		friction: 1,
		maskBits: 2
	});
	
	b2Game.edge.create(
		{x: 0, y: b2Game.stage.height},
		{x: 0, y: 1},
		{x: 1 - Math.cos(Math.PI*(1/10)), y: 1 - Math.sin(Math.PI*(1/10))}, // Make this automated when i fig it out!
		{x: 1 - Math.cos(Math.PI*(2/10)), y: 1 - Math.sin(Math.PI*(2/10))},
		{x: 1 - Math.cos(Math.PI*(3/10)), y: 1 - Math.sin(Math.PI*(3/10))},
		{x: 1 - Math.cos(Math.PI*(4/10)), y: 1 - Math.sin(Math.PI*(4/10))},
		{x: 1, y: 0},
		{x: b2Game.stage.width-2, y: 0},
		{x: b2Game.stage.width - 1/30 - 1 + Math.cos(Math.PI*(4/10)), y: 1 - Math.sin(Math.PI*(4/10))},
		{x: b2Game.stage.width - 1/30 - 1 + Math.cos(Math.PI*(3/10)), y: 1 - Math.sin(Math.PI*(3/10))},
		{x: b2Game.stage.width - 1/30 - 1 + Math.cos(Math.PI*(2/10)), y: 1 - Math.sin(Math.PI*(2/10))},
		{x: b2Game.stage.width - 1/30 - 1 + Math.cos(Math.PI*(1/10)), y: 1 - Math.sin(Math.PI*(1/10))},
		{x: b2Game.stage.width - 1/30, y: 1},
		{x: b2Game.stage.width - 1/30, y: b2Game.stage.height},
		{x: b2Game.stage.width - 35/30, y: b2Game.stage.height},
		{x: b2Game.stage.width - 35/30, y: b2Game.stage.height - 18},
		{x: b2Game.stage.width - 2, y: b2Game.stage.height - 18.5}
	);
	
	b2Game.edge.create(
		{ x: 1.77, y: b2Game.stage.height },
		{ x: 1.77, y: b2Game.stage.height - 7 }
	);
	
	b2Game.edge.create(
		{ x: b2Game.stage.width - 1.77 - 35/30, y: b2Game.stage.height },
		{ x: b2Game.stage.width - 1.77 - 35/30, y: b2Game.stage.height - 7 }
	);
	
	b2Game.edge.create(
		{ x: 1.77, y: b2Game.stage.height - 4 },
		{ x: 4, y: b2Game.stage.height - 3.4 }
	);
	
	b2Game.edge.create(
		{ x: 13.77, y: b2Game.stage.height - 4 },
		{ x: 11.6, y: b2Game.stage.height - 3.4 }
	);
	
	new Paddle({
		image: 'images/flipper_icon_left.png',
		button: 37,
		position: {x:3.6, y:16.5},
		revolutePos: {x: -1.7, y: 0},
		springPos1: {x:0.5, y:0},
		springPos2: {x:1, y:-3}
	});
	
	new Paddle({
		image: 'images/flipper_icon_right.png',
		button: 39,
		position: {x: 8.6, y:16.5},
		revolutePos: {x: 1.7, y: 0},
		springPos1: {x:-0.5, y:0},
		springPos2: {x:-1, y:-3}
	});
		
	new Ball({ x: b2Game.stage.width - 1.11, y: b2Game.stage.height - 5 });
	
	new Launcher()
	new Bumper({ x: 3, y: 4})
	new Bumper({ x: 10, y: 4})

	b2Game.background({ image: 'images/pball.png' })
	b2Game.run();
	
	
	
});