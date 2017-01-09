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
      var favs=[];var text=[];var retweets=[];
      var thumbnail = tweets[0].user.profile_image_url;
      var user = tweets[0].user.name;
      var description = tweets[0].user.description;
      var followers = tweets[0].user.followers_count;
      var mentions={}; mentions.handles = [];
      var matched=[];
      var pattern = /\B@[a-z0-9_-]+/gi;
      for(var i = 0; i < tweets.length;i++) {
        text[i] = tweets[i].text;
        favs[i] = tweets[i].favorite_count;
        retweets[i] = tweets[i].retweet_count;
        var stringMatch = (tweets[i].text).match(pattern);
        if (!!stringMatch) {
          for (var j = 0; j < stringMatch.length;j++) {
            var arrayMatch = stringMatch[j];
            console.log(arrayMatch);
            // if (arrayMatch in mentions) {
            //   mentions[arrayMatch] = mentions[arrayMatch] += 1;
            // } else {
            //   //[{"@luke":1},{"@evan":2},{"@john":2}]
            //   //HERE can add a node to the list of dictionaries
            //   //Might aswell also add picture and any other stuff for the graph here in future
            //   mentions[arrayMatch] = 1;
            // }
            //console.log(Object.values(mentions.handles[0]));
            if (mentions.handles.length === 0) {
              mentions.handles.push({"user":arrayMatch, "count":1});
              matched.push(arrayMatch);
            } else {
                if(matched.indexOf(arrayMatch) >= 0) {
                  for (var k=0;k<mentions.handles.length;k++) {
                    if (mentions.handles[k].user === arrayMatch){
                      mentions.handles[k].count = mentions.handles[k].count + 1;
                    }  
                  }
                } else {
                  mentions.handles.push({"user":arrayMatch, "count":1});
                  matched.push(arrayMatch);
                }
            }
          }
        }
      }
      //console.log(mentions.handles[0].count);
      jmentions = JSON.stringify(mentions);
      console.log(jmentions);
      // jsonfile.writeFile('public/info/mentions.json', mentions, function (err) {
      //   console.error(err);
      // });
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

// for(var i=0;i<tweets.length;i++) {
//   text[i] = tweets[i].text;
//   favs[i] = tweets[i].favorite_count;
//   retweets[i] = tweets[i].retweet_count;
//   var stringMatch = (tweets[i].text).match(pattern);
//   if (!!stringMatch) {
//     for (var j=0;j<stringMatch.length;j++) {
//       var arrayMatch = stringMatch[j];
//       if (mentions.length !== 0){
//         for (var mention in mentions) {
//           if (arrayMatch === Object.keys(mentions[mention])[0]) {
//             mentions[mention][Object.keys(mentions[mention])[0]] =
//             mentions[mention][Object.keys(mentions[mention])[0]] + 1;
//           } else {
//             //[{"@luke":1},{"@evan":2},{"@john":2}]
//             mentions.push({[arrayMatch]:1});
//           }
//         }
//       } else {
//         mentions.push({[arrayMatch]:1});
//       }
//     }
//   } console.log(mentions);
// }
