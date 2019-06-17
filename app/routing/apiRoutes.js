require("dotenv").config();
var friendsList = require("../data/friends");
var uuid = require("uuid/v4");
var AWS = require("aws-sdk");
var s3 = new AWS.S3({
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
})

module.exports = function (app) {
    // A GET route with the url /api/friends. This will be used to display a JSON of all possible friends.
    app.get("/api/friends", function (req, res) {
        return res.json(friendsList);
    });

    app.post("/api/friends", function (req, res) {
        var imageName = req.body.name.toLowerCase();
        imageName = imageName.replace(/\s/g, '');
        imageName = imageName + uuid();

        // take new friend's scores and compare scores against each of the friends in the friends list
        // create variable that holds the array of new friends scores
        // create a variable that holds arbitrary large number to compare against
        var newFriend = {
            name: req.body.name,
            scores: req.body.scores.split(","),
            image: imageName
        };

        var match = null;

        if(friendsList.length > 0) {
            var newFriendScores = newFriend.scores;
            var lowestDiff = 1000;

            for (var i = 0; i < friendsList.length; i++) {
                // create variable that holds the score array of the current friend loops 
                // create nested loop that then loops through score array and compares each index of the score to new friends score 
                // subract each value from each other and save the total to a variable and compare that variable to the arbitrary large number already created
                // if lower than that number than they are friend match 
                var currentFriend = friendsList[i];
                var currentFriendScores = friendsList[i].scores;
                var currentDiff = 0;
    
                for (var j = 0; j < currentFriendScores.length; j++) {
                    currentDiff = parseInt(currentDiff) + Math.abs(parseInt(currentFriendScores[j]) - parseInt(newFriendScores[j]));
                }

                if(currentDiff < lowestDiff) {

                    lowestDiff = currentDiff
                    match = currentFriend
                }
            }
        }

        uploadImage(req, newFriend.image, function(){
            friendsList.push(newFriend);
            res.json(match); 
        });
        
    });
}
function uploadImage(req,image, cb) {
    
    var imageFile = req.files.file.data;

    s3.createBucket(function(){
        var params = {
            Bucket: process.env.S3_BUCKET_NAME,
            ACL:'public-read', 
            Key: `${image}.jpg`,
            Body: imageFile 
        }
        s3.upload(params,function(err, data) {
            if(err) {
                console.log("error with upload");
                console.log(err);
            }
            console.log("Upload Success");
            console.log(data);
            cb();
        })
    })
}