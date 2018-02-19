var express = require( 'express'),
		twitter = require( './twitter.js' ),
		axios = require( 'axios' );

var app = express();

app.use( express.static( 'public' ) ); // Serve static files.

app.all( "/" + process.env.BOT_ENDPOINT, function (request, response) { // Send GET or POST to endpoint to trigger.
  
  let tweetText = "";
  
  // Grab genre story tweet.
	axios.get( 'https://binaryjazz.us/wp-json/genrenator/v1/story' )
		.then( function ( result ) {

      // Response data.
      tweetText = result.data;
    
    	if ( twitter.tryToTweet( tweetText ) ){
    		response.sendStatus( 200 );  // Success!
    	} else {
    		response.sendStatus( 500 ); // Uh oh, it didn't work.
    	}
		} )
		.catch(function ( error ) {
			console.log( error, "Trouble with getting genre story" );
		});
  
} );

// Listen for requests.
var listener = app.listen( process.env.PORT, function () {
	console.log( 'Your app is listening on port ' + listener.address().port );
});