// Dependencies
// =============================================================
var express = require("express");
var bodyParser = require("body-parser");
var path = require("path");

// Sets up the Express App
// =============================================================
var app = express();
var port = process.env.PORT || 8080;

// Sets up the Express app to handle data parsing
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.text());
app.use(bodyParser.json({ type: "application/vnd.api+json" }));

// =============================================================
//Muppet Characters (DATA)
var friends = [{
  name:"Nick",
  photo: "https://www.flaticon.com/free-icon/add-user_346569#term=friend&page=1&position=72",
  scores:[
      2,
      4,
      5,
      5,
      2,
      4,
      1,
      5,
      4,
      3
    ]
},
{
  name:"Jenna",
  photo:"https://www.flaticon.com/free-icon/add-user_346569#term=friend&page=1&position=72",
  scores:[
      5,
      3,
      2,
      4,
      1,
      2,
      5,
      1,
      2,
      5
    ]
},
{
  name:"Adam",
  photo:"https://www.flaticon.com/free-icon/add-user_346569#term=friend&page=1&position=72",
  scores:[
      1,
      5,
      5,
      2,
      5,
      4,
      1,
      2,
      4,
      4
    ]
},
{
  name:"Alyssa",
  photo:"https://www.flaticon.com/free-icon/add-user_346569#term=friend&page=1&position=72",
  scores:[
      3,
      5,
      5,
      2,
      3,
      3,
      4,
      3,
      2,
      3
    ]
},
{
  name:"Kevin",
  photo:"https://www.flaticon.com/free-icon/add-user_346569#term=friend&page=1&position=72",
  scores:[
      5,
      5,
      3,
      5,
      1,
      3,
      2,
      1,
      1,
      5
    ]
}];

// =============================================================
// ROUTES

// Default route to display home page
app.get( "/", function( req, res ) {
    res.sendFile( path.join( __dirname, "/app/public", "home.html" ));
  });

// Basic route that sends the user first to the AJAX Page
app.get("/survey", function(req, res) {
  res.sendFile(path.join(__dirname, "/app/public", "survey.html"));
});

// Route to display All Friends - provides JSON
app.get("/api/friends", function(req, res) {
        res.json(friends);
        return;
});

// Object to capture array of score comparisons to existing friends list
var scoreTallyObj = {};
var totalScore = [];
var matched;

// Tally Survey and create New Friends - takes in JSON input
app.post("/api/new", function(req, res) {
  var newFriend = req.body;
  newFriend.routeName = newFriend.name.replace(/\s+/g, "").toLowerCase();

  //Loop through friends list to compare scores to new entry's scores
  //Push score results into an array of objects, scoreTallyObj
  for (var i = 0; i < friends.length; i++) {
  	var indvScore = [];
  	for (var j = 0; j < 10; j++) {
  		var matchScore = 0;
  		var friendScore = friends[i].scores[j];
  		var newFriendScore = newFriend.scores[j]; 
  		if (friendScore > newFriendScore) {
  			matchScore = matchScore + (friendScore - newFriendScore);
	  	} else if (friendScore === newFriendScore) {
  			matchScore = matchScore + 0;
	  	} else {
	  		matchScore = matchScore + (newFriendScore - friendScore);
	  	}
  	indvScore.push(matchScore);
  	scoreTallyObj[i] = indvScore;
  	}
  	console.log("SCORE: " + indvScore);
   }
   	//Take the scoreTallyobject and get the sum of each index. Push that into the totalScore array
	for (var k = 0; k < friends.length; k++) {
		var ranking = scoreTallyObj[k];
		var sum = 0;
		for (var i = 0; i < ranking.length; i++) {
			sum = sum + ranking[i];
		}
		totalScore.push(sum);
		console.log("SUM: " + sum);
	}
	//Use Math.min to capture the minimum number of the totalScore array.
	//Use indexOf to capture the index of friends matched to the minimum number
	var minimum = Math.min.apply(null, totalScore);
	console.log("MINIMUM: " + minimum);
	matched = totalScore.indexOf(minimum);
	console.log("MATCHED INDEX: " + matched);
	var friendMatched = friends[matched].name;
	console.log("YOU ARE MATCHED TO: " + friendMatched);
	var friendPic = friends[matched].photo;

  // friends.push(newFriend);

  // res.json(newFriend);
});


//Display results on api/results page
app.get("/api/results", function(req, res) {
  var html = "<h1> Your Closest Match </h1>";
  html += "<h2> NAME: " + friends[matched].name + "</h2>";
  html += "<img src=" + friends[matched].photo + ">";
  res.send(html);
});


// Starts the server to begin listening
// =============================================================
app.listen(port, function() {
  console.log("App listening on PORT " + port);
});
