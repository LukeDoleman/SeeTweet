var express = require('express');
var router = express.Router();
var Twitter = require('twitter');
var client = new Twitter({
  consumer_key: 'izFoNkDtE3ZPo0incOx03Z0on',
  consumer_secret: 'YsBXESCPXk93j9y7qRQQMnUv0LD3c9EpsPMcOIf44WGFfJdgDQ',
  bearer_token: 'AAAAAAAAAAAAAAAAAAAAAFT%2FxgAAAAAAG5djI51WpTcUGgbTNw%2BP3n30Xss%3DrLomzfrUXc1Ul2uWQ52S5gBYm3W0ru5afyCR0ziQ7DfzrPffRt'
});
var request = require('request');

router.get('/', function(req, res){
  res.render('index', {
    title: 'Home'
  });
});

router.get('/timeline', function(req, res, next) {
  client.get('statuses/user_timeline', { screen_name: 'dmanisking', count: 320}, function(error, tweets, response) {
    if (!error) {
      var favs=[]; var text=[];var retweets=[];
      console.log(tweets);
      var thumbnail = tweets[0].user.profile_image_url;
      var user = tweets[0].user.name;
      var description = tweets[0].user.description;
      var followers = tweets[0].user.followers_count;
      for(var i = 0; i < tweets.length;i++){
                text[i] = tweets[i].text;
        favs[i] = tweets[i].favorite_count;
        retweets[i] = tweets[i].retweet_count;
      }
      res.status(200).render('layout', {title:'Timeline',
      tweets: text, favs: favs, retweets:retweets, test:tweets,
      user:user, pic:thumbnail, followers:followers,
      description:description});
    }
    else {
      res.status(500).json({ error: error });
    }
  });
});

// PROBLEMS
// Can't pass data from front to back to front
// (for username info)
//
// Can't the one page multiple times (for many different calls)
//

module.exports = router;
