var fs = require("fs");

var keys = require("./keys.js");

var request = require("request");

var Twitter = require('twitter');

var Spotify = require('node-spotify-api');

var fs = require("fs");

 

/*8. Make it so liri.js can take in one of the following commands:

   * `my-tweets`

   * `spotify-this-song`

   * `movie-this`

   * `do-what-it-says` */

var nodeArgs = process.argv;

var opperator = process.argv[2]

var songName = "";

var movieName = "";


for (var i = 3; i < nodeArgs.length; i++) {

  if (i > 3 && i < nodeArgs.length) {

    songName = songName + " " + nodeArgs[i];
    movieName = movieName + "+" + nodeArgs[i];

  }

  else {

    songName += nodeArgs[i];
    movieName += nodeArgs[i];

  }
}


switch (opperator) {
  case "my-tweets":
    twitter();
    break;

  case "spotify-this-song":
    spotify();
    break;

  case "movie-this":
    imdb();
    break;

  case "do-what-it-says":
    doWhatItSays();
    break;
};


function twitter() {
	var client = new Twitter({
	  consumer_key: keys.twitterKeys.consumer_key,
	  consumer_secret: keys.twitterKeys.consumer_secret,
	  access_token_key: keys.twitterKeys.access_token_key,
	  access_token_secret: keys.twitterKeys.access_token_secret
	});

	var params = {
		screen_name: 'ChristinaMatson',
		count: 10
	};
	client.get('statuses/user_timeline', params, function(error, tweets, response) {
	  if (!error) {
	    // console.log(tweets);
	    for (var i = tweets.length - 1; i >= 0; i--) {
	    	console.log("tweet: "+ tweets[i].created_at + tweets[i].text);
	    }
	  
	  }
	  else {
	  	console.log(error);
	  }

	});

};



function spotify() {

  var spotify = new Spotify({
    id: keys.spotifyKeys.client_id,
    secret: keys.spotifyKeys.client_secret
  });
   
  spotify.search({ type: 'track', query: songName }, function(err, data) {
    if (err) {
      return console.log('Error occurred: ' + err);
    }
   
  // console.log(data.tracks.items[0]);   
  console.log(data.tracks.items[0].name); 
  console.log(data.tracks.items[0].artists[0].name); 
  console.log(data.tracks.items[0].preview_url); 
  console.log(data.tracks.items[0].album.name); 

  });
};


function imdb() {

  var queryUrl = "http://www.omdbapi.com/?t=" + movieName + "&y=&plot=short&apikey=40e9cece";

  request(queryUrl, function(error, response, body) {

    // If the request is successful
    if (!error && response.statusCode === 200) {

      // console.log(body);

      // Parse the body of the site and recover just the imdbRating
      // (Note: The syntax below for parsing isn't obvious. Just spend a few moments dissecting it).
      // console.log(JSON.parse(body, null, 2));
      console.log("Title: " + JSON.parse(body).Title);
      console.log("Year: " + JSON.parse(body).Year);
      console.log("IMDB Rating: " + JSON.parse(body).Ratings[0].Value);
      console.log("Rotten Tomatoes Rating: " + JSON.parse(body).Ratings[1].Value);
      console.log("Country: " + JSON.parse(body).Country);
      console.log("Language: " + JSON.parse(body).Language);
      console.log("Plot: " + JSON.parse(body).Plot);
      console.log("Actors: " + JSON.parse(body).Actors);


    }
  });



};

function doWhatItSays() {
  
  // Running the readFile module that's inside of fs.
  // Stores the read information into the variable "data"
  fs.readFile("random.txt", "utf8", function(err, data) {
    if (err) {
      return console.log(err);
    }
   
    // Break the string down by comma separation and store the contents into the output array.
    var output = data.split(",");

    opperator = output[0];
    if (opperator == "spotify-this-song") {
      songName = output[1];
      spotify();
    };

  });


};




