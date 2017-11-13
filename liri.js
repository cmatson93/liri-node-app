//npm packages...
var fs = require("fs");

var keys = require("./keys.js");

var request = require("request");

var Twitter = require('twitter');

var Spotify = require('node-spotify-api');

var fs = require("fs");

var inquirer = require("inquirer");

// Created a series of questions that will eventually determine what function to call and what data to pass into it.
inquirer.prompt([

  {
    type: "input",
    name: "name",
    message: "What is your name?"
  },

  {
    type: "list",
    name: "opperator",
    message: "What would you like me to do for you?",
    choices: ["Show your tweets", "Spotify a song", "IMDB a movie", "Do what ever it says"]
  }

]).then(function(answers) {

  if (answers.opperator == "Spotify a song") {
    inquirer.prompt([
      {
        type: "input",
        name: "songName",
        message: "What song?"
      }
    ]).then(function(answers) {
      songName = answers.songName;
      spotify();
    })
  }
  else if (answers.opperator == "Show your tweets") {
    twitter();
  }
  else if (answers.opperator == "Do what ever it says") {
    doWhatItSays();
  }
  else if (answers.opperator == "IMDB a movie") {
    inquirer.prompt([
      {
        type: "input",
        name: "movieName",
        message: "What movie?"
      }
    ]).then(function(answers) {
      movieName = answers.movieName;
      imdb();
    })
  }

});

//Function that retrieves the last 20 tweets from my twitter account
function twitter() {
	var client = new Twitter({
	  consumer_key: keys.twitterKeys.consumer_key,
	  consumer_secret: keys.twitterKeys.consumer_secret,
	  access_token_key: keys.twitterKeys.access_token_key,
	  access_token_secret: keys.twitterKeys.access_token_secret
	});

	var params = {
		screen_name: 'ChristinaMatson',
		count: 20
	};
	client.get('statuses/user_timeline', params, function(error, tweets, response) {
	  if (!error) {
	    console.log(tweets.length);
	    for (var i = tweets.length - 1; i >= 0; i--) {
	    	console.log("tweet "+[i+1]+": "+ tweets[i].created_at + tweets[i].text);
	    }
	  
	  }
	  else {
	  	console.log(error);
	  }

	});

};


//Function that will hit spotify's api to get specific data back on a song.
function spotify() {

  if (songName == "") {
    songName = "The Sign";
  }

  var spotify = new Spotify({
    id: keys.spotifyKeys.client_id,
    secret: keys.spotifyKeys.client_secret
  });
   
  spotify.search({ type: 'track', query: songName }, function(err, data) {
    if (err) {
      return console.log('Error occurred: ' + err);
    }
   
  // console.log(data.tracks.items[0]);   
  console.log("Song Title: ",data.tracks.items[0].name); 
  console.log("Album Title: ",data.tracks.items[0].album.name); 
  console.log("Atrist: ", data.tracks.items[0].artists[0].name); 
  console.log("Preview link: ",data.tracks.items[0].preview_url); 

  });
};

//Function that hits imdb's api to get information about specific movie title.
function imdb() {

  var queryUrl = "http://www.omdbapi.com/?t=" + movieName + "&y=&plot=short&apikey=40e9cece";

  request(queryUrl, function(error, response, body) {

    // If the request is successful
    if (!error && response.statusCode === 200) {

      // Parse the body of the site 
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

//Function that will do what the text in the random.txt file says
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




