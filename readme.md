# HW Week 13 - {Express - Friend Finder}
Homework week 13 for Northwestern's Coding Bootcamp

"FriendFinder" is a compatibility-based full-stack site application that will take in entries from user surveys, then compare the answers with those from other users. 

The app will then display the name and picture of the "friend" with the best overall match.

## Routing
Using Express to handle routing, users will be able to view the home page, friends list, survey and results.
    - GET Route to /survey which should display the survey page.
    - GET route that leads to home.html which displays the home page by default.
    - GET route with the url /api/friends.
    - GET route to view matched results.
    - POST routes /api/friends to handle incoming survey results. This route will also be used to handle the compatibility logic.

## Technologies Used
-HTML
-Node.js
-Node Package Module Express
-Node Package Module body-parser
-Node Package Module path


## CODE EXPLANATION - Routes
```
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
```


## CODE EXPLANATION - Tallying Survey Results
To determine the user's most compatible friend, the user's results were converted into a simple array of numbers (ex: [5, 1, 4, 4, 5, 1, 2, 5, 4, 1]).

Then, the user's scores were compared to those from other users, question by question.  The differences were added in order to calculate the total Difference.

The closest match will be the user with the least amount of difference.

Using the POST route to handle incoming surveys, I loop through the existing friends list to compare scores to the new entry's scores, then push the score results into an array of objects.

Sample code:

```
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