var express = require('express');
var router = express.Router();
// var request = require('request');
var MongoClient = require('mongodb').MongoClient;
var test = require('assert');

router.get('/', function(req, res){

  // MongoClient.connect('mongodb://localhost:27017/tweetdb', function(err, db) {
  //   var collection = db.collection('nodejs-network');
  //   //http://stackoverflow.com/questions/25372297/mongodb-how-can-i-get-the-size-of-a-collection-using-node-js
  //   collection.count({}, function(error, numOfDocs) {
  //       console.log('I have '+numOfDocs+' documents in my collection.');
  //       if (numOfDocs !== 0) {
  //         collection.remove();
  //         console.log("Collection has been emptied");
  //       } else {
  //         console.log("Collection is empty.");
  //       }
  //   });
  // });

  // Remove all leftover documents from the collection
  MongoClient.connect('mongodb://localhost:27017/tweetdb', function(err, db) {

    db.listCollections().toArray(function(err, items) {
      test.ok(items.length >= 1);
      console.log(items);
      for (var item in items) {
        console.log(item);
      }
      db.close();
    });


  });
    // collection.count({}, function(error, numOfDocs) {
    //     console.log('I have '+numOfDocs+' documents in my collection.');
    //     if (numOfDocs !== 0) {
    //       collection.remove();
    //       console.log("Collection has been emptied");
    //     } else {
    //       console.log("Collection is empty.");
    //     }
    // });
    // if (err) throw err;
    // db.collectionNames(function(err, collections){
    //     console.log(collections);
    // });
    //var collection = db.collection('tweets_db');
    //http://stackoverflow.com/questions/25372297/mongodb-how-can-i-get-the-size-of-a-collection-using-node-js
    // collection.count({}, function(error, numOfDocs) {
    //     console.log('I have '+numOfDocs+' documents in my collection.');
    //     if (numOfDocs !== 0) {
    //       collection.remove();
    //       console.log("Collection has been emptied");
    //     } else {
    //       console.log("Collection is empty.");
    //     }
    // });

  res.render('index', {
    title: 'Home'
  });

});

module.exports = router;
