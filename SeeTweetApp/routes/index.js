var express = require('express');
var router = express.Router();
var request = require('request');
var MongoClient = require('mongodb').MongoClient;
var test = require('assert');

router.get('/', function(req, res){

  MongoClient.connect('mongodb://localhost:27017/tweetdb', function(err, db) {
    var collection = db.collection("simple_document_insert_collection_no_safe");
    // Insert a single document
    collection.insertOne({hello:'world_no_safe'});

    // Wait for a second before finishing up, to ensure we have written the item to disk
    setTimeout(function() {

      // Fetch the document
      collection.findOne({hello:'world_no_safe'}, function(err, item) {
        console.log("Success! - " + item.hello);
        test.equal(null, err);
        test.equal('world_no_safe', item.hello);
        db.close();
      });
    }, 100);
  });

  res.render('index', {
    title: 'Home'
  });
});

module.exports = router;
