$(function(){

	b2Game.stage.resize(4096/30, 4096/30);
	
	$('#fullscreen').click(function(){
		document.getElementById('stage').webkitRequestFullscreen('stage');
		$('#fullscreen').replaceWith('')			
	})
	
	Wall = function(data) {
								
		this.__proto__ = new b2Game.Pawn({
			id: 'wall',
			type: 'static',
			image: 'images/walltile.jpg',
			width: data.width,
			height: data.height,
			position: {x:data.x,y:data.y},
			angle: ( data.angle === undefined ) ? 0 : data.angle,
			friction: 1,
			restitution: 0.3
		});			
		
	}
	Block = function(data) {
		
		this.__proto__ = new b2Game.Pawn({
			id: 'block',
			type: data.type === undefined ? 'dynamic' : data.type,
			image: 'images/firewall.png',
			width: data.width === undefined ? 30 : data.width,
			height: data.height === undefined ? 30 : data.height,
			restitution: 0.2,
			friction: 1,
			position: {
				x:data.x,
				y:data.y
			},
			velocity: data.velocity,
			density: data.density === undefined ? 1 : data.density
		});			

		b2Game.pawns[this.id] = this;
		
	}	

	Player = function() {
		
		this.__proto__ = new b2Game.Pawn({
			id: 'droid',
			image: 'images/droid.png',
			type: 'dynamic',
			width: 56,
			height: 81,
			animation: {
				cooldown: 15,
				framesWide: 3
			},
			position: { x: 1, y: b2Game.stage.height - 3 },
			fixedRotation: true,
			maxSpeed: 10,
			friction: 1,
			restitution: 0.2
		});
		
		b2Game.pawns[this.id] = this;	
		
		this.onTheGround = function() {
			
			if( collisions = this.body.GetContactList() ) {
				do {
					if( Math.abs(collisions.contact.m_manifold.m_localPlaneNormal.y) === 1 )
						return true
				} while( collisions = collisions.next );
			}
			
			return false;
		}
		
		this.update = function() {
			var position = this.body.GetPosition();
			
			for( var key in b2Game.keyPress ) {

				switch( key ) {

					case '37':
						
						if( this.onTheGround() ) {
							this.setScale({x: -1 });
							if( !this.beingAnimated() ) this.playAnimation({x:0,y:1}, 3);
							this.body.ApplyImpulse({x:-3, y:0}, position)
						}
						break;

					case '38':
						if( this.onTheGround() ) {
							this.playAnimation({x:0,y:2}, 2);
							this.body.ApplyImpulse({x:0, y:-4}, position)
						}
						break;
					
					case '39':
						if( this.onTheGround() ) {
							this.setScale({x: 1});
							if( !this.beingAnimated() ) this.playAnimation({x:0,y:1}, 3);
							this.body.ApplyImpulse({x:3, y:0}, position)
						}
						break;
					
				}

			}
			
			if( !this.beingAnimated() ) this.playAnimation({x:0,y:0}, 3);

			if( this.body.IsAwake() ) {
			
				if( $('#'+this.id).offset().left - window.scrollX < $(window).width()/2 - 100) 
					window.scrollTo(window.scrollX - 5, window.scrollY);

				else if( $('#'+this.id).offset().left - window.scrollX > $(window).width()/2 + 100 ) window.scrollTo(window.scrollX + 5, window.scrollY);							
			
			}
			
			this.__proto__.update();
		}
	
	}

	b2Game.background({
		image: 'images/ville.jpg',
		y: 400,
	})
	
	D = new Player();

	new Wall({ x: 0, y: b2Game.stage.height - 1, width: b2Game.stage.width*30, height: 50 });
	
	new Block({
		x: 10,
		y: b2Game.stage.height - 4,
		width: 90,
		height: 60,
		density: 5,
	})
	
	b2Game.run();
	
	setTimeout(function(){
		window.scrollTo(0, $('#droid_1').offset().top + $(window).height() - 100)		
	}, 100);

})
