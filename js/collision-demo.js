$(function(){

	Wall = function(data) {
								
		this.__proto__ = new b2Game.Pawn({
			id: 'wall',
			type: 'static',
			image: 'images/walltile.jpg',
			width: data.width,
			height: data.height,
			position: {x:data.x,y:data.y}
		});			
		
	}

	new Wall({ x: 0, y: 0, width: b2Game.stage.width*30, height: 30});
	new Wall({ x: 0, y: b2Game.stage.height - 1, width: b2Game.stage.width*30, height: 30});
	new Wall({ x: 0, y: 0, width: 30, height: b2Game.stage.height*30});
	new Wall({ x: b2Game.stage.width - 1, y: 0, width: 30, height: b2Game.stage.height*30});
	
	Block = function(data) {
		
		this.__proto__ = new b2Game.Pawn({
			id: 'block',
			type: 'dynamic',
			image: 'images/firewall.png',
			height: 30,
			width: 30,
			restitution: 0.6,
			friction: 0.2,
			position: {
				x:data.x,
				y:data.y
			},
			velocity: data.velocity,
		});			

		b2Game.pawns[this.id] = this;
		
	}	

	
	for( var i = 0; i <= 25; i++ ) {
		new Block({
			x: Math.random()*10+5,
			y: Math.random()*10+2,
			velocity: {
				x: (Math.random()-0.5)*10,
				y: (Math.random()-0.5)*10
			}
		})
	}
	
	b2Game.world.m_allowSleep = false;
	
	b2Game.world.SetGravity({ x: 0, y: 0});
	
	b2Game.updateFunctions.controls = function() {
	
		var G = b2Game.world.GetGravity();
						
		for( var key in b2Game.keyPress ) {
			
			switch( key ) {
			
				case '37':
					b2Game.world.SetGravity({ x: G.x - 0.1, y: G.y});
					$('#grav-x').text( (G.x - 0.1).toFixed(1) );
					break;
			
				case '38':
					b2Game.world.SetGravity({ x: G.x, y: G.y - 0.1});
					$('#grav-y').text( (G.y - 0.1).toFixed(1) );
					break;
			
				case '39':
					b2Game.world.SetGravity({ x: G.x + 0.1, y: G.y});
					$('#grav-x').text( (G.x + 0.1).toFixed(1) );
					break;
			
				case '40':
					b2Game.world.SetGravity({ x: G.x, y: G.y + 0.1});
					$('#grav-y').text( (G.y + 0.1).toFixed(1) );
					break;
			
			}
		
		
		}
	
	}
	
	b2Game.run()
		
})		
