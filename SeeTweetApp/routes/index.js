var express = require('express');
var router = express.Router();
var request = require('request');
var MongoClient = require('mongodb').MongoClient;
var test = require('assert');

router.get('/', function(req, res){

  //Remove all leftover documents from the collection
  MongoClient.connect('mongodb://localhost:27017/tweetdb', function(err, db) {
    var collection = db.collection('tweets_db');
    //http://stackoverflow.com/questions/25372297/mongodb-how-can-i-get-the-size-of-a-collection-using-node-js
    collection.count({}, function(error, numOfDocs) {
        console.log('I have '+numOfDocs+' documents in my collection.');
        if (numOfDocs !== 0) {
          collection.remove();
          console.log("Collection has been emptied");
        } else {
          console.log("Collection is empty.");
        }
    });
  });

  res.render('index', {
    title: 'Home'
  });
});

module.exports = router;
