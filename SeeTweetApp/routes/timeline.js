var express = require('express');
var router = express.Router();
var request = require('request');
var Twitter = require('twitter');
var client = new Twitter({
  consumer_key: 'izFoNkDtE3ZPo0incOx03Z0on',
  consumer_secret: 'YsBXESCPXk93j9y7qRQQMnUv0LD3c9EpsPMcOIf44WGFfJdgDQ',
  bearer_token: 'AAAAAAAAAAAAAAAAAAAAAFT%2FxgAAAAAAG5djI51WpTcUGgbTNw%2BP3n30Xss%3DrLomzfrUXc1Ul2uWQ52S5gBYm3W0ru5afyCR0ziQ7DfzrPffRt'
});
// var twitter = require('twitter-text');
// twitter.autoLink(twitter.htmlEscape('#hello < @world >'));


router.get('/', function(req, res, next) {
  var twitter_handle = req.param('username');
  client.get('statuses/user_timeline', { screen_name: twitter_handle, count: 320}, function(error, tweets, response) {
    if (!error) {
      var favs=[]; var text=[];var retweets=[];
      //console.log(tweets);
      var thumbnail = tweets[0].user.profile_image_url;
      var user = tweets[0].user.name;
      var description = tweets[0].user.description;
      var followers = tweets[0].user.followers_count;
      var mentions={};
      var pattern = /\B@[a-z0-9_-]+/gi;
      for(var i = 0; i < tweets.length;i++) {
        text[i] = tweets[i].text;
        favs[i] = tweets[i].favorite_count;
        retweets[i] = tweets[i].retweet_count;
        var stringMatch = (tweets[i].text).match(pattern);
        if (!!stringMatch) {
          for (var j = 0; j < stringMatch.length;j++) {
            var arrayMatch = stringMatch[j];
            if (arrayMatch in mentions) {
              mentions[arrayMatch] = mentions[arrayMatch] += 1;
            } else {
              mentions[arrayMatch] = 1;
            }
          }
        }
      }
      console.log(mentions);
      res.status(200).render('timeline', {title:'Timeline',
      tweets: text, favs: favs, retweets:retweets, test:tweets,
      user:user, pic:thumbnail, followers:followers,
      description:description});
    }
    else {
      res.status(500).json({ error: error });
    }
  });
});

module.exports = router;
