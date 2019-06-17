// Dependencies
// app setup
var express = require("express");
var app = express();
var fileUpload = require("express-fileupload");
var PORT = process.env.PORT || 3000;

// App configuration
// Sets Express app to handle data parsing
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(fileUpload());
app.use(express.static("./app/public/"));

//Set up routing
require("./app/routing/apiRoutes")(app);
require("./app/routing/htmlRoutes")(app);

app.listen(PORT, function(){
    console.log("Server listening on port: ", PORT);
});