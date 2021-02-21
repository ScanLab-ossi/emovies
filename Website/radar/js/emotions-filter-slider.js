	$( function() {
		var handle = $( "#s-anger" );
		$( "#slider-anger" ).slider({
			range: "min",
			min: 0,
			max: 100,
			create: function() {
				handle.text( $( this ).slider( "value" ) );
			},
			slide: function( event, ui ) {
				handle.text( ui.value );
			}
		});
	} );
	
	$( function() {
		var handle = $( "#s-joy" );
		$( "#slider-joy" ).slider({
			range: "min",
			min: 0,
			max: 100,
			create: function() {
				handle.text( $( this ).slider( "value" ) );
			},
			slide: function( event, ui ) {
				handle.text( ui.value );
			}
		});
	} );

	$( function() {
		var handle = $( "#s-trust" );
		$( "#slider-trust" ).slider({
			range: "min",
			min: 0,
			max: 100,
			create: function() {
				handle.text( $( this ).slider( "value" ) );
			},
			slide: function( event, ui ) {
				handle.text( ui.value );
			}
		});
	} );
	
	$( function() {
		var handle = $( "#s-fear" );
		$( "#slider-fear" ).slider({
			range: "min",
			min: 0,
			max: 100,
			create: function() {
				handle.text( $( this ).slider( "value" ) );
			},
			slide: function( event, ui ) {
				handle.text( ui.value );
			}
		});
	} );
	
	$( function() {
		var handle = $( "#s-surprise" );
		$( "#slider-surprise" ).slider({
			range: "min",
			min: 0,
			max: 100,
			create: function() {
				handle.text( $( this ).slider( "value" ) );
			},
			slide: function( event, ui ) {
				handle.text( ui.value );
			}
		});
	} );
	
	$( function() {
		var handle = $( "#s-sadness" );
		$( "#slider-sadness" ).slider({
			range: "min",
			min: 0,
			max: 100,
			create: function() {
				handle.text( $( this ).slider( "value" ) );
			},
			slide: function( event, ui ) {
				handle.text( ui.value );
			}
		});
	} );
	
	$( function() {
		var handle = $( "#s-disgust" );
		$( "#slider-disgust" ).slider({
			range: "min",
			min: 0,
			max: 100,
			create: function() {
				handle.text( $( this ).slider( "value" ) );
			},
			slide: function( event, ui ) {
				handle.text( ui.value );
			}
		});
	} );
	
	$( function() {
		var handle = $( "#s-anticipation" );
		$( "#slider-anticipation" ).slider({
			range: "min",
			min: 0,
			max: 100,
			create: function() {
				handle.text( $( this ).slider( "value" ) );
			},
			slide: function( event, ui ) {
				handle.text( ui.value );
			}
		});
	} );
	

  
  
  
  
  
  
  
  
  