var storage = require('node-persist'),
    Twit = require('twit'),
    twit;

storage.initSync();

try {
  twit = new Twit({
    consumer_key:         process.env.TWITTER_CONSUMER_KEY,
    consumer_secret:      process.env.TWITTER_CONSUMER_SECRET,
    access_token:         process.env.TWITTER_ACCESS_TOKEN,
    access_token_secret:  process.env.TWITTER_ACCESS_TOKEN_SECRET
  });
  console.log("Ready to tweet! Send a GET or POST request");
} catch(err) {
  console.error( err );
  console.error( "You should double check your .env file is set up properly!" );
}

function postTweet(status){
  console.log( "In the process of tweeting!" );
  twit.post( 'statuses/update', { status: status }, function( err, data, response ) {
    console.log( `Posted status: ${status}` );
  });
}

module.exports.tryToTweet = function(status){
  var now = Date.now(), // time since epoch in millisecond
      lastRun = storage.getItemSync("lastRun") || 0, // last time we were run in milliseconds
      postDelay = process.env.POST_DELAY_IN_MINUTES || 1;// time to delay between tweets in minutes
  
  if (!twit){
    console.error("Sorry, you haven't setup twitter yet in your .env")
    return false;
  }
  if (now - lastRun <= (1000 * 60 * postDelay)) { // Only post every process.env.POST_DELAY_IN_MINUTES or 60 minutes
    console.error(`You can't post so soon! we only post every ${postDelay} minutes. It's only been ${ Math.floor((now - lastRun) / 60 / 1000 ) } minutes`);
    return false;
  }
  if (status.length > 280){
    console.error(`Status too long: ${status}`);
    return false;
  }
    
  storage.setItemSync("lastRun", now);
  postTweet(status);
  return true;
}