$(function(){
	
	var paused = true;

	b2Game.pause();
	
	$('#game-stage').click(function(){ 
		// document.getElementById('game-stage').webkitRequestFullscreen('game-stage');
		if( paused ) { 
			b2Game.run();
			paused = false; 
		}
		$('#game-stage').css('opacity', 1)
		$('#pause').replaceWith('');
	});
	
	$(document).click(function(event){
		if( !paused && $(event.target).closest('#game-stage').length === 0 ) {
			b2Game.pause();
			paused = true;
			$('#game-stage').css('opacity', 0.7).append('<h4 id="pause" style="padding: 0 20px; color: black;">Click to Play</h4>');
		}
	});
	
	$(document).keydown(function(event){
		if( !paused ) event.preventDefault();
	});
	
	$('#game-stage').css('opacity', 0.7).append('<h4 id="pause" style="padding: 0 20px; color: black;">Click to Play</h4>');

});