var express = require('express');
var router = express.Router();

var Twitter = require('twitter');
var client = new Twitter({
  consumer_key: 'izFoNkDtE3ZPo0incOx03Z0on',
  consumer_secret: 'YsBXESCPXk93j9y7qRQQMnUv0LD3c9EpsPMcOIf44WGFfJdgDQ',
  bearer_token: 'AAAAAAAAAAAAAAAAAAAAAFT%2FxgAAAAAAG5djI51WpTcUGgbTNw%2BP3n30Xss%3DrLomzfrUXc1Ul2uWQ52S5gBYm3W0ru5afyCR0ziQ7DfzrPffRt'
});

var request = require('request');

//var myJSONObject = {'grant_type':'client_credentials'};

//token : AAAAAAAAAAAAAAAAAAAAAFT%2FxgAAAAAAG5djI51WpTcUGgbTNw%2BP3n30Xss%3DrLomzfrUXc1Ul2uWQ52S5gBYm3W0ru5afyCR0ziQ7DfzrPffRt

/*request({
    url: "https://api.twitter.com/oauth2/token",
    method: "POST",
    //json: true,   // <--Very important!!!
    body: 'grant_type=client_credentials',
    headers: {
      'Authorization': 'Basic aXpGb05rRHRFM1pQbzBpbmNPeDAzWjBvbjpZc0JYRVNDUFhrOTNqOXk3cVJRUU1uVXYwTEQzYzlFcHNQTWNPSWY0NFdHRmZKZGdEUQ==',
      'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8.'
    }
}, function (error, response, body){
    console.log(response);
}); */

router.get('/post', function(req,res,next) {
  client.post('statuses/update', {status: '...'}, function(error, tweet, response) {
    if (!error) {
      console.log(tweet);
    }
  });
});

router.get('/', function(req, res){
  res.render('index', {
    title: 'Home'
  });
});

router.get('/timeline', function(req, res, next) {
  client.get('statuses/user_timeline', { screen_name: 'nodejs', count: 2 }, function(error, tweets, response) {
    if (!error) {
      res.status(200).render('index', { title: 'Express', tweets: tweets });
      console.log(tweets);
    }
    else {
      res.status(500).json({ error: error });
    }
  });
});

module.exports = router;

// https://dev.twitter.com/rest/reference/get/statuses/user_timeline
