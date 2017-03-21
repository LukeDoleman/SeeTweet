var express = require('express');
var router = express.Router();
// var request = require('request');
var Twitter = require('twitter');
var client = new Twitter({
  consumer_key: 'izFoNkDtE3ZPo0incOx03Z0on',
  consumer_secret: 'YsBXESCPXk93j9y7qRQQMnUv0LD3c9EpsPMcOIf44WGFfJdgDQ',
  bearer_token: 'AAAAAAAAAAAAAAAAAAAAAFT%2FxgAAAAAAG5djI51WpTcUGgbTNw%2BP3n30Xss%3DrLomzfrUXc1Ul2uWQ52S5gBYm3W0ru5afyCR0ziQ7DfzrPffRt'
});
var jsonfile = require('jsonfile');
var async = require('async');


//NExt ???
router.get('/', function(req, res, next) {
  var twitter_handle = req.param('username');
  client.get('statuses/user_timeline', { screen_name: twitter_handle, count: 320}, function(error, tweets, response) {
    if (!error) {
      var favs=[];var text=[];var retweets=[];
      var thumbnail = tweets[0].user.profile_image_url;
      var user = tweets[0].user.name;
      var description = tweets[0].user.description;
      var followers = tweets[0].user.followers_count;
      var following = tweets[0].user.friends_count;
      var likes = tweets[0].user.favourites_count;
      for(var i = 0; i < tweets.length;i++) {
        text[i] = tweets[i].text;
        favs[i] = tweets[i].favorite_count;
        retweets[i] = tweets[i].retweet_count;
      }
      res.status(200).render('profile', {title:'Your Profile',
      tweets: text, favs: favs, retweets:retweets, test:tweets, user:user,
      pic:thumbnail,followers:followers,name:twitter_handle, following:following,
      description:description, likes:likes});
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
