var express = require('express');
var router = express.Router();

var Twitter = require('twitter');
var client = new Twitter({
  consumer_key: 'izFoNkDtE3ZPo0incOx03Z0on',
  consumer_secret: 'YsBXESCPXk93j9y7qRQQMnUv0LD3c9EpsPMcOIf44WGFfJdgDQ',
  access_token_key: ' 212426002-O1E6bckvfII9i0hXxJcza2iiDBwd14i32y43zAu5',
  access_token_secret: 'spcmXDIrcics2IrchNuuME127kverK9ymvrmXU87HfTIo'
});


router.get('/', function(req, res){
  res.render('index', {
    title: 'Home'
  });
});

router.get('/', function(req, res, next) {
  client.get('statuses/user_timeline', { screen_name: 'nodejs', count: 20 }, function(error, tweets, response) {
    if (!error) {
      res.status(200).render('index', { title: 'Express', tweets: tweets });
    }
    else {
      res.status(500).json({ error: error });
    }
  });
});

module.exports = router;

  // https://dev.twitter.com/rest/reference/get/statuses/user_timeline
