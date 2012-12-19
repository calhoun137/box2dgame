$(function(){

	Player = function(data) {
		
		var impulse = 3,
			cooldown = 25,
			cooldownTimer = 0;
		
		this.__proto__ = new b2Game.Pawn({
			id: 'player',
			type: 'dynamic',
			image: '/b2Game/images/playerA.png',
			width: 75,
			height: 44,
			maxSpeed: 25,
			animation: {
				cooldown: 15
			},
			position: {
				x:10,
				y:10
			},
			categoryBits: 2, 
			maskBits: 4
		});			

		b2Game.pawns[this.id] = this;
		this.body.SetLinearDamping(2.5);
		
		
		this.update = function() {
		
			var position = this.body.GetPosition();
		
			for ( var key in b2Game.keyPress ) {
			
				switch( key ) {

					case '65':
						if( cooldownTimer === 0 ) {
							new Shot(position);
							this.playAnimation({x:0,y:1}, 4);
							cooldownTimer = cooldown;
						}
						break;
					
					case '37':
						this.body.ApplyImpulse({x:-impulse,y:0}, position)
						break;
				
					case '38':
						this.body.ApplyImpulse({x:0,y:-impulse}, position)
						break;
				
					case '39':
						this.body.ApplyImpulse({x:impulse,y:0}, position)
						break;
				
					case '40':
						this.body.ApplyImpulse({x:0,y:impulse}, position)
						break;
					
					// default:
						// console.log(key);
						// break;
				
				}
			
			};
			
		// Keep Bounded by the Stage
			if( position.x < 1.25 ) this.body.m_linearVelocity.x = 1;
			if( position.x > b2Game.stage.width ) this.body.m_linearVelocity.x = -1;
			if( position.y < 0.7 ) this.body.m_linearVelocity.y = 1;
			if( position.y > b2Game.stage.height ) this.body.m_linearVelocity.y = -1;	

		// Cooldown for shooting
			if( cooldownTimer > 0 ) cooldownTimer--;
			
		// Check for collisions with enemy pawns
			if( collision = this.body.GetContactList() ) {
				if( collision.other.m_userData.type === 'enemy' ) {
					new Explosion(collision.other.GetPosition());
					new Explosion(this.body.GetPosition());
					b2Game.pawns[collision.other.m_userData.id].die();
					this.die();
				}
			}			
			
			this.__proto__.update();
				
		}
		
	}

	Shot = function(position) {
		
			this.__proto__ =  new b2Game.Pawn({
			
				id: 'shot', 
				image:'/b2Game/images/shot.png', 
				type: 'dynamic',
				position: {
					x: position.x+2,
					y: position.y
				},
				height: 20,
				width: 20,
				velocity: { x: 30, y: 0 },
				categoryBits: 8,
				maskBits: 4
				
			});
			
			b2Game.pawns[this.id] = this;
		
			this.body.SetBullet(true);
		
			this.update = function() {
			
				if( this.outOfBounds() ) this.die();

				if( collision = this.body.GetContactList() ) {
					if( collision.other.m_userData.type === 'enemy' ) {
						new Explosion(collision.other.GetPosition());
						b2Game.pawns[collision.other.m_userData.id].die();
						this.die();
					}
				}				
				
				this.__proto__.update();
			}
	
	}
	
	Enemy = function() {
		
		this.__proto__ = new b2Game.Pawn({
		
			id:'enemy', 
			image:'/b2Game/images/enemy.png', 
			type: 'dynamic',
			position:{
				x: b2Game.stage.width - 1, 
				y: Math.random()*(b2Game.stage.height)
			},
			height: 62,
			width: 40, 
			velocity: { x: -20, y: 0 },
			categoryBits: 4,
			maskBits: 8 | 2
		});			
		
		b2Game.pawns[this.id] = this;
		
		this.update = function() {
		
			if( this.outOfBounds() ) this.die();
			
			this.__proto__.update();
		
		}

	}	
 
	Explosion = function(position) {

		var timer = 0;
	 
		this.__proto__ = new b2Game.Pawn({
		
			id: 'explosion',
			image: '/b2Game/images/explosion.png',
			animation: {
				anchor: { x:64, y: 64 },
				framesWide: 5,
				framesTall: 5,
				cooldown: 4
			},
			position: {
				x: position.x - 1,
				y: position.y - 1
			},
			height: 64,
			width: 64
			
		});		

		b2Game.pawns[this.id] = this;

		this.playAnimation({ x: 0, y: 0 }, 25);	
		
		this.update = function() {
		
			if( ++timer > 100 ) this.die();
			
			this.__proto__.update();
		}

	}


// Run the Game

	P = new Player();
	
	b2Game.world.SetGravity({ x:0, y:0 });

	b2Game.background({ 
		image: '/b2Game/images/spacebig.jpg',
		velocity: { x: -2, y: 0 },
	});
	
	var timer = 50;
	
	b2Game.updateFunctions.spawnEnemy = function() { 
	
		if( timer > 0 ) timer--;
		else {
			new Enemy();
			timer = 50;
		}

	}
			
	b2Game.run();
	
});