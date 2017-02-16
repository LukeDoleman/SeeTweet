var express = require('express');
var router = express.Router();
var request = require('request');
var MongoClient = require('mongodb').MongoClient;
var test = require('assert');

router.get('/', function(req, res){

  MongoClient.connect('mongodb://localhost:27017/tweetdb', function(err, db) {
    var collection = db.collection('tweets_db');
    // Insert a single document
    collection.remove();

    // Wait for a second before finishing up, to ensure we have written the item to disk
    setTimeout(function() {
        test.equal(null, err);
        console.log("Document sucessfully removed from the collection");
        db.close();
    }, 100);
  });

  res.render('index', {
    title: 'Home'
  });
});

module.exports = router;
