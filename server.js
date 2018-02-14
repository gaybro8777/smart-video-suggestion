// -------------------------------------
// Import Node Modules
// -------------------------------------

require('dotenv').config();
const cors = require("cors");
const express = require("express");
const cloudinary = require("cloudinary");
const bodyParser = require("body-parser");
const multipart = require("connect-multiparty");
const request = require("request");

// -------------------------------------
// Create express app
// ------------------------------------

const app = express();

// -------------------------------------
// Load the middlewares
// -------------------------------------

app.use(cors());
app.use(bodyParser.json());
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));
app.use(bodyParser.urlencoded({ extended: false }));

// Multiparty middleware
const multipartMiddleware = multipart();

// ------------------------------------
// Configure cloudinary client
// ------------------------------------

cloudinary.config({
  cloud_name:`${process.env.CLOUD_NAME}`, 
  api_key: `${process.env.API_KEY}`, 
  api_secret: `${process.env.API_SECRET}` 
});

// Helper functions
function getMaxKey(arr) {
  var maxValue = 0;
  var maxKey = 0;
  for (key in arr) {
    if (arr[key] > maxValue) {
      maxValue = arr[key];
      maxKey = key;
    }
  }
  return maxKey;
}

function findOpposite(emotion){
  
}

// ------------------------------------
// Create app routes
// ------------------------------------

app.get("/", function(req, res) {
  res.render("index");
});

app.post("/suggest", multipartMiddleware, function(req, res) {
  
  cloudinary.uploader.upload( req.body.image , function(result) {
    emotions = result.info.detection.adv_face.data[0].attributes.emotion;
    let arr = JSON.parse(JSON.stringify(emotions));
    let visible_emotion = getMaxKey(arr);
    return res.json({
      status: true,
      mood: visible_emotion
    })
  },{ detection: "adv_face" }
  );

});

// Set port
app.listen("3128");
console.log("Listening on localhost:3128");