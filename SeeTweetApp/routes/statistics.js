var express = require('express');
var router = express.Router();
var request = require('request');
var Twitter = require('twitter');
var client = new Twitter({
  consumer_key: 'izFoNkDtE3ZPo0incOx03Z0on',
  consumer_secret: 'YsBXESCPXk93j9y7qRQQMnUv0LD3c9EpsPMcOIf44WGFfJdgDQ',
  bearer_token: 'AAAAAAAAAAAAAAAAAAAAAFT%2FxgAAAAAAG5djI51WpTcUGgbTNw%2BP3n30Xss%3DrLomzfrUXc1Ul2uWQ52S5gBYm3W0ru5afyCR0ziQ7DfzrPffRt'
});
var jsonfile = require('jsonfile');
var async = require('async');

var MongoClient = require('mongodb').MongoClient;
var test = require('assert');

/*
    Function to extract top 5 tweets of a particular metric
    metric denotes which information should be grabbed:
    Retweets // Likes //  Popularity (RTs + Likes)
*/
function getMaxMetric(tweets_list) {
  var tweet_ids = [];
  for (var i=0;i<2;i++) {
    var max_val = [];
    var internal_ids = [];
    for (var x=0;x<3;x++) {
      var max = 0;
      var max_id;
      for(var value in tweets_list) {
        var val = tweets_list[value][i];
        if (val > max && max_val.indexOf(val) == -1 ) {
          max = val;
          max_id = value;
        }
      }
      max_val.push(max);
      internal_ids.push(max_id);
    }
    tweet_ids.push(internal_ids);
  }
  return tweet_ids;
}

function getDaysSinceFirstTweet(date) {
  var text_month = date.substring(4,7);
  var day = date.substring(8,10);
  var year = date.substring(26,30);
  var month = "JanFebMarAprMayJunJulAugSepOctNovDec".indexOf(text_month) / 3 + 1;

  if(day<10) {
      day='0'+day;
  }
  if(month<10) {
      month='0'+month;
  }

  var today = new Date();
  var dd = today.getDate();
  var mm = today.getMonth()+1; //January is 0!
  var yyyy = today.getFullYear();
  if(dd<10) {
      dd='0'+dd;
  }
  if(mm<10) {
      mm='0'+mm;
  }

  var oneDay = 24*60*60*1000; // hours*minutes*seconds*milliseconds
  var firstDate = new Date(yyyy,mm,dd);
  var secondDate = new Date(year,month,day);
  var diffDays = Math.round(Math.abs((firstDate.getTime() - secondDate.getTime())/(oneDay)));
  return diffDays;
}

function getTweetTime(tweet_time) {
  var hour = tweet_time.substring(11,13);
  var time;
  switch (hour) {
      case "07": case "08": case "09": case "10": case "11": case "12":
          time = "Morning";
          break;
      case "13": case "14": case "15": case "16": case "17": case "18":
          time = "Afternoon";
          break;
      case "19": case "20": case "21": case "22": case "23": case "00":
          time = "Evening";
          break;
      case "01": case "02": case "03": case "04": case "05": case "06":
          time = "Early Hours";
          break;
  }
  return time;
}

//http://stackoverflow.com/questions/1531093/how-do-i-get-the-current-date-in-javascript
// function getCurrentDate() {
//
//   console.log(today);
// }

var findDocuments = function(db, callback) {
  MongoClient.connect('mongodb://localhost:27017/tweetdb', function(err, db) {
    test.equal(null, err);
    console.log("Connected correctly to server");
    // Get the documents collection
    var collection = db.collection('tweets_db');
    // Find some documents
    collection.find({}).toArray(function(err, docs) {
      test.equal(err, null);
      //test.equal(2, docs.length);
      console.log("Found the following records");
      // console.dir(docs);
      callback(docs);
    });
  });
};

//http://plnkr.co/edit/hAx36JQhb0RsvVn7TomS?p=preview
router.get('/', function(req, res, next) {
    var twitter_handle = req.param('username');

    async.waterfall([
        function(callback) {
            MongoClient.connect('mongodb://localhost:27017/tweetdb', function(err, db) {
                test.equal(null, err);
                console.log("Connected correctly to server");
                // Get the documents collection
                var collection = db.collection('tweets_db');
                // Find some documents
                collection.find({}).toArray(function(err, docs) {
                    test.equal(err, null);
                    //test.equal(2, docs.length);
                    console.log("Found the following records");
                    // console.dir(docs);
                    callback(null, docs);
                });
            });
        }

    ], function(err, docs) {
      console.log(docs[0]);
    });

  //   var x;
  //
  //
  //
  //   x = findDocuments(db, function() {
  //     db.close();
  //   });
  //
  //   console.log(x + "xxx");
  //
  // });


  client.get('statuses/user_timeline', { screen_name: twitter_handle, count: 3200}, function(error, tweets, response) {
    if (!error) {
      var texts=[];
      var followers = tweets[0].user.followers_count;
      var statuses = tweets[0].user.statuses_count;
      var created = tweets[tweets.length-1].user.created_at;
      var daysSinceCreation = getDaysSinceFirstTweet(created);
      var tweet_ids_max = {};
      var tweet_times = [0,0,0,0];
      var tweet_days = [0,0,0,0,0,0,0];
      for(var i = 0; i < tweets.length;i++) {
        //Add text for Tweet hover display
        texts.push(tweets[i].text);
        //Get the time tweet was created
        var time = getTweetTime(tweets[i].created_at);
        if (time === "Morning") {
          tweet_times[0]++;
        } else if (time == "Afternoon"){
          tweet_times[1]++;
        } else if (time == "Evening"){
          tweet_times[2]++;
        } else if (time == "Early Hours"){
          tweet_times[3]++;
        }
        //Get day tweet was created
        var day = tweets[i].created_at.substring(0,3);
        if (day === "Mon") {
          tweet_days[0]++;
        } else if (day === "Tue") {
          tweet_days[1]++;
        } else if (day === "Wed") {
          tweet_days[2]++;
        }else if (day === "Thu") {
          tweet_days[3]++;
        }else if (day === "Fri") {
          tweet_days[4]++;
        }else if (day === "Sat") {
          tweet_days[5]++;
        }else if (day === "Sun") {
          tweet_days[6]++;
        }

        if (tweets[i].text.substring(0,2) != "RT" ) {
          tweet_ids_max[tweets[i].id_str] = [tweets[i].retweet_count, tweets[i].favorite_count];
        }
      }
      console.log(tweet_days);
      var full_ids = getMaxMetric(tweet_ids_max);
      var avg_creation = (statuses/daysSinceCreation).toFixed(2);
      res.status(200).render('statistics', {title:'Statistics', metrics:full_ids,
                                            followers:followers, statuses:statuses,
                                            daysSinceCreation:daysSinceCreation,
                                            avg_creation:avg_creation, texts:texts,
                                            tweet_times:tweet_times, tweet_days:tweet_days});
    } else {
      res.status(500).json({ error: error });
    }
  });
});

module.exports = router;
