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

/*
    Function to extract top 5 tweets of a particular metric
    metric denotes which information should be grabbed:
    Retweets // Likes //  Popularity (RTs + Likes)
*/
function getMaxMetric(tweets_list) {
  var tweet_ids = [];
  for (var i=0;i<3;i++) {
    var max_val = [];
    var internal_ids = [];
    for (var x=0;x<5;x++) {
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

//http://stackoverflow.com/questions/1531093/how-do-i-get-the-current-date-in-javascript
// function getCurrentDate() {
//
//   console.log(today);
// }
router.get('/', function(req, res, next) {
  var twitter_handle = req.param('username');
  client.get('statuses/user_timeline', { screen_name: twitter_handle, count: 320}, function(error, tweets, response) {
    if (!error) {
      var favs=[];var text=[];var retweets=[];
      var thumbnail = tweets[0].user.profile_image_url;
      var user = tweets[0].user.name;
      var description = tweets[0].user.description;
      var followers = tweets[0].user.followers_count;
      var statuses = tweets[0].user.statuses_count;
      var created = tweets[tweets.length-1].user.created_at;
      var daysSinceCreation = getDaysSinceFirstTweet(created);
      var tweet_ids_max = {};
      for(var i = 0; i < tweets.length;i++) {
        if (tweets[i].text.substring(0,2) != "RT" ) {
          var popularity = tweets[i].retweet_count + tweets[i].favorite_count;
          tweet_ids_max[tweets[i].id_str] = [tweets[i].retweet_count, tweets[i].favorite_count, popularity];
        }
      }
      var full_ids = getMaxMetric(tweet_ids_max);
      var avg_creation = (statuses/daysSinceCreation).toFixed(2);
      res.status(200).render('statistics', {title:'Statistics', metrics:full_ids,
                                            followers:followers, statuses:statuses,
                                            daysSinceCreation:daysSinceCreation,
                                            avg_creation:avg_creation});
    } else {
      res.status(500).json({ error: error });
    }
  });
});

// router.get('/', function(req, res){
//
//   res.render('index', {
//     title: 'Home'
//   });
// });

module.exports = router;
