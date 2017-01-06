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

// var file = 'mentions.json';

router.get('/', function(req, res, next) {
  var twitter_handle = req.param('username');
  client.get('statuses/user_timeline', { screen_name: twitter_handle, count: 320}, function(error, tweets, response) {
    if (!error) {
      var favs=[]; var text=[];var retweets=[];
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

              //HERE can add a node to the list of dictionaries
              //Might aswell also add picture and any other stuff for the graph here in future

              mentions[arrayMatch] = 1;
            }
          }
        }
      }

      // res.status(200);

      //console.log(mentions);

      /*jshint loopfunc: true */
      // ^ Prevents function called in loop error warning, is this okay???
      // var f=0;
      // console.log(mentions.length);
      // for (var mention in mentions) {
      //   f++;
      //   //console.log(f);
      //   client.get('statuses/user_timeline', { screen_name: mention, count: 10}, function(error, tweets, response) {
      //     if (!error) {
      //       // console.log(mention);
      //       // console.log(tweets[0].text);
      //       for(var k = 0; k < tweets.length;k++) {
      //         var stringMatch = (tweets[k].text).match(pattern);
      //         if (!!stringMatch) {
      //           for (var l = 0; l < stringMatch.length;l++) {
      //             var arrayMatch = stringMatch[l];
      //             if (arrayMatch in mentions) {
      //               mentions[arrayMatch] = mentions[arrayMatch] += 1;
      //             } else {
      //               console.log(arrayMatch);
      //               mentions[arrayMatch] = 1;
      //             }
      //           }
      //         }
      //       }
      //       res.status(200);
      //     } else {
      //       console.log("ERROR: " + mention);
      //       res.status(500).json({error:error});
      //     }
      //   });
      // }

      //console.log(mentions);
      jsonfile.writeFile('public/info/mentions.json', mentions, function (err) {
        console.error(err);
      });
      res.status(200).render('timeline', {title:'Timeline',
        tweets: text, favs: favs, retweets:retweets, test:tweets,
        user:user, pic:thumbnail, followers:followers,
        description:description, mentions:mentions});
    } else {
      res.status(500).json({ error: error });
    }
  });

});

module.exports = router;
