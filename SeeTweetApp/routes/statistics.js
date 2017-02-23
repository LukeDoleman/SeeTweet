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

// http://stackoverflow.com/questions/1230233/how-to-find-the-sum-of-an-array-of-numbers
function add(a,b) {
  return (a + b);
}

function convertListToPercentage(list) {
  var listSum = list.reduce(add, 0);
  for (var i=0;i<list.length;i++) {
    list[i] = Math.floor(((list[i]/listSum) * 100)+0.5);
  }
  return list;
}

function extractMetrics(list) {

    //!!!!!!!!!!!
    //!!!!!!!!!!!!
    //Need to check DB before adding docs so cant use list length
    //here>  FIX THIS THE 200
    for (var l in list) {
      tweets = list[l];
      var statuses = tweets[0].user.statuses_count;
      var created = tweets[tweets.length-1].user.created_at;
      var daysSinceCreation = getDaysSinceFirstTweet(created);
      var tweet_ids_max = {};
      var tweet_times = [0,0,0,0];
      var tweet_days = [0,0,0,0,0,0,0];
      //Desktop Client || Mobile client
      var device = [0,0];
      for(var i = 0; i < 200;i++) {
        //Get the time tweet was created
        var time = getTweetTime(tweets[i].created_at);
        if (time === "Morning") {
          tweet_times[0]++;
        } else if (time == "Afternoon") {
          tweet_times[1]++;
        } else if (time == "Evening") {
          tweet_times[2]++;
        } else if (time == "Early Hours") {
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

        if (tweets[i].text.substring(0, 2) != "RT") {
            tweet_ids_max[tweets[i].id_str] = [tweets[i].retweet_count, tweets[i].favorite_count];
        }
        if (tweets[i].source.includes("Twitter for Mac") ||
            tweets[i].source.includes("Twitter Web Client") ||
            tweets[i].source.includes("TweetDeck") ||
            tweets[i].source.includes("Twitter for Websites")
        ) {
            device[0]++;
        } else if (tweets[i].source.includes("Twitter for iPhone") ||
            tweets[i].source.includes("Twitter for iPad") ||
            tweets[i].source.includes("Twitter for Android") ||
            tweets[i].source.includes("Twitter for Android Tablets") ||
            tweets[i].source.includes("Mobile Web")
        ) {
            device[1]++;
        }
      }
      tweet_days = convertListToPercentage(tweet_days);
      var full_ids = getMaxMetric(tweet_ids_max);
      var avg_creation = (statuses/daysSinceCreation).toFixed(2);
      console.log("Tweet Days:- " + tweet_days);
      console.log("Device Use:- " + device);
      console.log("Tweet Times:- " + tweet_times);
      console.log("Metrics:- " + full_ids);
      console.log("Average Creation:- " + avg_creation);
    }

}

//http://plnkr.co/edit/hAx36JQhb0RsvVn7TomS?p=preview
router.get('/', function(req, res, next) {
    var twitter_handle = req.param('username');

    async.waterfall([
        function(callback) {
            MongoClient.connect('mongodb://localhost:27017/tweetdb', function(err, db) {
                test.equal(null, err);
                console.log("Connected correctly to server");
                // Get the documents collection
                var collection = db.collection(twitter_handle);
                // Find some documents
                collection.find().toArray(function(err, docs) {
                    test.equal(err, null);
                    //test.equal(2, docs.length);
                    callback(null, docs);
                });
            });
        },

        //Get all docs from twitter_handle-network and pass to main result bit
        //So that average info can be calculated for all
        function (docs, callback) {
          MongoClient.connect('mongodb://localhost:27017/tweetdb', function(err, db) {
              test.equal(null, err);
              console.log("Connected correctly to server");
              // Get the documents collection
              var collection = db.collection(twitter_handle + "-network");
              // Find some documents
              collection.find().toArray(function(err, network_docs) {
                  test.equal(err, null);
                  //test.equal(2, docs.length);
                  callback(null, docs, network_docs);
              });
          });
        },

        function (docs, network_docs, callback) {
          var network_metrics = {};
          for (var i=0;i<network_docs.length;i++) {
            //is username a key already?
            if (network_docs[i].user.name in network_metrics) {
              network_metrics[network_docs[i].user.name].push(network_docs[i]);
            } else {
              network_metrics[network_docs[i].user.name] = [network_docs[i]];
            }
          }
          console.log(Object.keys(network_metrics).length);
          console.log(network_metrics.length);
          callback(null, docs, network_metrics);
        },

    ], function(err, docs, network_metrics) {
      console.log('Docs :- ' + docs.length);
      console.log('Network Docs :- ' + network_metrics.length);
      extractMetrics(network_metrics);
      tweets = docs;
      var statuses = tweets[0].user.statuses_count;
      var created = tweets[tweets.length-1].user.created_at;
      var daysSinceCreation = getDaysSinceFirstTweet(created);
      var tweet_ids_max = {};
      var tweet_times = [0,0,0,0];
      var tweet_days = [0,0,0,0,0,0,0];
      //Desktop Client || Mobile client
      var device = [0,0];
      for(var i = 0; i < tweets.length;i++) {
        //Get the time tweet was created
        var time = getTweetTime(tweets[i].created_at);
        if (time === "Morning") {
          tweet_times[0]++;
        } else if (time == "Afternoon") {
          tweet_times[1]++;
        } else if (time == "Evening") {
          tweet_times[2]++;
        } else if (time == "Early Hours") {
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

        if (tweets[i].text.substring(0, 2) != "RT") {
            tweet_ids_max[tweets[i].id_str] = [tweets[i].retweet_count, tweets[i].favorite_count];
        }
        if (tweets[i].source.includes("Twitter for Mac") ||
            tweets[i].source.includes("Twitter Web Client") ||
            tweets[i].source.includes("TweetDeck") ||
            tweets[i].source.includes("Twitter for Websites")
        ) {
            device[0]++;
        } else if (tweets[i].source.includes("Twitter for iPhone") ||
            tweets[i].source.includes("Twitter for iPad") ||
            tweets[i].source.includes("Twitter for Android") ||
            tweets[i].source.includes("Twitter for Android Tablets") ||
            tweets[i].source.includes("Mobile Web")
        ) {
            device[1]++;
        }
      }
      tweet_days = convertListToPercentage(tweet_days);
      var full_ids = getMaxMetric(tweet_ids_max);
      var avg_creation = (statuses/daysSinceCreation).toFixed(2);
      console.log("Tweet Days:- " + tweet_days);
      console.log("Device Use:- " + device);
      console.log("Tweet Times:- " + tweet_times);
      console.log("Metrics:- " + full_ids);
      console.log("Average Creation:- " + avg_creation);
      res.status(200).render('statistics', {title:'Statistics', metrics:full_ids,
                                            avg_creation:avg_creation,
                                            tweet_times:tweet_times, tweet_days:tweet_days,
                                            device:device});
  });
});

module.exports = router;
