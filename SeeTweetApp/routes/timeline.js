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

//Find initial 10 mentions
//For each mention
  //Crawl their 5 most frequently contacted and add to master mentions list
//Get photos and link for all and pass through to D3

// http://www.sebastianseilund.com/nodejs-async-in-practice

//Get JSON of most frequently contacted users for graph
//including profile image & link

router.get('/',function(req,res) {
  var twitter_handle = req.param('username');

  async.waterfall([

    function(callback) {
      client.get('statuses/user_timeline', { screen_name: twitter_handle, count: 320},function(error, tweets, response) {
        if (!error) {
          console.log("First Tweets Crawled Successfully!");
        } else {
          console.log(error);
        }
        callback(null, tweets);
      });
    },

    function(tweets, callback) {
      var mentions={};mentions.handles=[];mentions.links=[];
      var matched=[];
      var pattern = /\B@[a-z0-9_-]+/gi;
      for(var i = 0; i < tweets.length;i++) {
        var stringMatch = (tweets[i].text).match(pattern);
        if (!!stringMatch) {
          for (var j = 0; j < stringMatch.length;j++) {
            var arrayMatch = stringMatch[j];
            if (mentions.handles.length === 0) {
              if (arrayMatch != ("@" + twitter_handle)){
                mentions.handles.push({"user":arrayMatch,"count":1, "self":false});
                matched.push(arrayMatch);
              } else {
                mentions.handles.push({"user":arrayMatch,"count":1, "self":true});
                matched.push(arrayMatch);
              }
            } else {
                if(matched.indexOf(arrayMatch) >= 0) {
                  for (var k=0;k<mentions.handles.length;k++) {
                    if (mentions.handles[k].user === arrayMatch){
                      mentions.handles[k].count = mentions.handles[k].count + 1;
                    }
                  }
                } else {
                  if (arrayMatch != ("@" + twitter_handle)){
                    mentions.handles.push({"user":arrayMatch,"count":1, "self":false});
                    matched.push(arrayMatch);
                  } else {
                    mentions.handles.push({"user":arrayMatch,"count":1, "self":true});
                    matched.push(arrayMatch);
                  }
                }
            }
          }
        }
      }
      //Sort mentions in descending order
      mentions.handles.sort(function(a, b) {
          return parseFloat(b.count) - parseFloat(a.count);
      });
      mentions.handles = mentions.handles.slice(0,11);

      for (var l=0;l<mentions.handles.length;l++) {
          if (!mentions.handles[l].self) {
            mentions.links.push({"source":mentions.handles[0].user,
            "target":mentions.handles[l].user, "weight":mentions.handles[l].count});
          }
      }
      callback(null, mentions, matched);
    },

    function(mentions, matched, callback) {
        var full_mentions = mentions;
        var len = full_mentions.handles.length - 1;
        var x = 1;
        async.forEach(full_mentions.handles,function(mention,next) {
          if (mention.user != ("@" + twitter_handle)) {
            client.get('statuses/user_timeline', { screen_name: mention.user, count: 320},function(error, tweets, response) {
              if (!error) {
                console.log(mention.user + " - Second Tweets Crawled Successfully!");
                var temp_mentions={};temp_mentions.handles=[];temp_mentions.links=[];
                var matched=[];
                for (var z = 0; z < full_mentions.handles.length;z++) {
                    matched.push(full_mentions.handles[z].user);
                }
                var pattern = /\B@[a-z0-9_-]+/gi;
                for(var i = 0; i < tweets.length;i++) {
                  var stringMatch = (tweets[i].text).match(pattern);
                  if (!!stringMatch) {
                    for (var j = 0; j < stringMatch.length;j++) {
                      var arrayMatch = stringMatch[j];
                      // console.log(arrayMatch);
                      // console.log(mention.user);
                      if (temp_mentions.handles.length === 0 && matched.indexOf(arrayMatch) == -1) {
                        if (arrayMatch != (mention.user)){
                          temp_mentions.handles.push({"user":arrayMatch,"count":1, "self":false});
                          matched.push(arrayMatch);
                        } else {
                          temp_mentions.handles.push({"user":arrayMatch,"count":1, "self":true});
                          matched.push(arrayMatch);
                        }
                      } else {
                          if(matched.indexOf(arrayMatch) >= 0) {
                            for (var k=0;k<temp_mentions.handles.length;k++) {
                              if (temp_mentions.handles[k].user === arrayMatch){
                                temp_mentions.handles[k].count = temp_mentions.handles[k].count + 1;
                              }
                            }
                          } else {
                            if (arrayMatch != (mention.user)){
                              temp_mentions.handles.push({"user":arrayMatch,"count":1, "self":false});
                              matched.push(arrayMatch);
                            } else {
                              temp_mentions.handles.push({"user":arrayMatch,"count":1, "self":true});
                              matched.push(arrayMatch);
                            }
                          }
                      }
                    }
                  }
                }

                //Sort mentions in descending order
                temp_mentions.handles.sort(function(a, b) {
                    return parseFloat(b.count) - parseFloat(a.count);
                });

                //Extract top 3 mentions only
                temp_mentions.handles = temp_mentions.handles.slice(0,3);

                for (var l=0;l<temp_mentions.handles.length;l++) {
                    if (!temp_mentions.handles[l].self) {
                      temp_mentions.links.push({"source":mention.user,
                      "target":temp_mentions.handles[l].user, "weight":temp_mentions.handles[l].count});
                    }
                }

                for (var m=0;m<temp_mentions.handles.length;m++) {
                  full_mentions.handles.push(temp_mentions.handles[m]);
                  full_mentions.links.push(temp_mentions.links[m]);
                }

                console.log(mention.user);
                console.log(temp_mentions);

              } else {
                console.log(error);
              }
            if (x == len) {
              callback(null, full_mentions);
            } else {
              x++;
              next();
            }
          });
        }
        }, function(err) {
          if (err) return callback(err);
        });
    },

    // function(full_mentions, callback) {
    //   callback(null, full_mentions);
    // },

  ], function (err, result) {
      // result now equals 'done'
      console.log("RESULT");
      console.log(result);
      jsonfile.writeFile('public/info/mentions.json', result, function (err) {
        console.log("yo x");
        console.error(err);
      });
      res.status(200).render('timeline', {title: 'Home'});
  });
});

module.exports = router;

//   var full_mentions = mentions;
//   var contacts = [];
//   for (var i=0;i<full_mentions.handles.length;i++) {
//     if (!full_mentions.handles[i].self) {
//       contacts.push(full_mentions.handles[i].user);
//     }
//   }
//
//   console.log(contacts);
//
//   console.log("hey there");
//
//   async.forEach(contacts,function(contact,callback) {
//     console.log("bitch");
//     console.log(contact);
//     callback();
//   }, function(err) {
//     if (err) return callback(err);
//   });
//   res.status(200).render('timeline', {title:'Timeline'});
// });
//     //Crawl each of the 10 mentions and add to main mentions dictionary
//     // async.forEach(contacts, function(contact, callback) {
//     //   client.get('statuses/user_timeline', { screen_name: contact, count: 320},function(error, tweets, response) {
//     //         if (!error) {
//     //           console.log("Tweets Crawled Successfully!");
//     //           var mentions={};mentions.handles=[];mentions.links=[];
//     //           var matched=[];
//     //           var pattern = /\B@[a-z0-9_-]+/gi;
//     //           for(var i = 0; i < tweets.length;i++) {
//     //             var stringMatch = (tweets[i].text).match(pattern);
//     //             if (!!stringMatch) {
//     //               for (var j = 0; j < stringMatch.length;j++) {
//     //                 var arrayMatch = stringMatch[j];
//     //                 if (mentions.handles.length === 0) {
//     //                   if (arrayMatch != ("@" + twitter_handle)){
//     //                     mentions.handles.push({"user":arrayMatch,"count":1, "self":false});
//     //                     matched.push(arrayMatch);
//     //                   } else {
//     //                     mentions.handles.push({"user":arrayMatch,"count":1, "self":true});
//     //                     matched.push(arrayMatch);
//     //                   }
//     //                 } else {
//     //                     if(matched.indexOf(arrayMatch) >= 0) {
//     //                       for (var k=0;k<mentions.handles.length;k++) {
//     //                         if (mentions.handles[k].user === arrayMatch){
//     //                           mentions.handles[k].count = mentions.handles[k].count + 1;
//     //                         }
//     //                       }
//     //                     } else {
//     //                       if (arrayMatch != ("@" + twitter_handle)){
//     //                         mentions.handles.push({"user":arrayMatch,"count":1, "self":false});
//     //                         matched.push(arrayMatch);
//     //                       } else {
//     //                         mentions.handles.push({"user":arrayMatch,"count":1, "self":true});
//     //                         matched.push(arrayMatch);
//     //                       }
//     //                     }
//     //                 }
//     //               }
//     //             }
    //           }
    //
    //           //Sort mentions in descending order
    //           mentions.handles.sort(function(a, b) {
    //               return parseFloat(b.count) - parseFloat(a.count);
    //           });
    //           mentions.handles = mentions.handles.slice(0,5);
    //
    //           for (var l=0;l<mentions.handles.length;l++) {
    //               console.log(mentions.handles[l].user);
    //               if (!mentions.handles[l].self) {
    //                 mentions.links.push({"source":mentions.handles[0].user,
    //                 "target":mentions.handles[l].user, "weight":mentions.handles[l].count});
    //               }
    //           }
    //           console.log(mentions);
    //         } else {
    //           console.log(error);
    //         }
    //       }); //GET ends
    //       //callback(null, mentions);
    // }, function(err) { //ASYNC For each ends
    //   if (err) return callback(err);
    // });


  // async.parallel([
  //
  //   function(next) {
  //     client.get('statuses/user_timeline', { screen_name: twitter_handle, count: 320},function(error, tweets, response) {
  //       if (!error) {
  //         console.log("Tweets Crawled Successfully!");
  //         var test = tweets[2].text;
  //       } else {
  //         console.log(error);
  //       }
  //       next(null, test);
  //     });
  //   },
  //
  //   function(next) {
  //
  //     //Wanna do for each guy in tweets, client.get etc
  //     client.get('statuses/user_timeline',{ screen_name: twitter_handle, count: 5},function(error, tweets, response) {
  //       if (!error) {
  //         console.log(test);
  //       } else {
  //         console.log(error);
  //       }
  //       next(null, tweets[1].text);
  //     });
  //   }
  //
  // ], function(err, results) {
  //   // results is [firstData, secondData]
  //   console.log(results[0]);
  //   res.status(200).render('timeline', {title:'Index'});
  // });


// router.get('/', function(req, res, next) {
//   var twitter_handle = req.param('username');
//   client.get('statuses/user_timeline', { screen_name: twitter_handle, count: 320}, function(error, tweets, response) {
//     if (!error) {
//       var favs=[];var text=[];var retweets=[];
//       var thumbnail = tweets[0].user.profile_image_url;
//       var user = tweets[0].user.name;
//       var description = tweets[0].user.description;
//       var followers = tweets[0].user.followers_count;
//       var mentions={}; mentions.handles = []; mentions.links = [];
//       var matched=[];
//       var pattern = /\B@[a-z0-9_-]+/gi;
//       for(var i = 0; i < tweets.length;i++) {
//         text[i] = tweets[i].text;
//         favs[i] = tweets[i].favorite_count;
//         retweets[i] = tweets[i].retweet_count;
//         var stringMatch = (tweets[i].text).match(pattern);
//         if (!!stringMatch) {
//           for (var j = 0; j < stringMatch.length;j++) {
//             var arrayMatch = stringMatch[j];
//             if (mentions.handles.length === 0) {
//               if (arrayMatch != ("@" + twitter_handle)){
//                 mentions.handles.push({"user":arrayMatch,"count":1, "self":false});
//                 matched.push(arrayMatch);
//               } else {
//                 mentions.handles.push({"user":arrayMatch,"count":1, "self":true});
//                 matched.push(arrayMatch);
//               }
//             } else {
//                 if(matched.indexOf(arrayMatch) >= 0) {
//                   for (var k=0;k<mentions.handles.length;k++) {
//                     if (mentions.handles[k].user === arrayMatch){
//                       mentions.handles[k].count = mentions.handles[k].count + 1;
//                     }
//                   }
//                 } else {
//                   if (arrayMatch != ("@" + twitter_handle)){
//                     mentions.handles.push({"user":arrayMatch,"count":1, "self":false});
//                     matched.push(arrayMatch);
//                   } else {
//                     mentions.handles.push({"user":arrayMatch,"count":1, "self":true});
//                     matched.push(arrayMatch);
//                   }
//                 }
//             }
//           }
//         }
//       }
//
//       //Sort mentions in descending order
//       mentions.handles.sort(function(a, b) {
//           return parseFloat(b.count) - parseFloat(a.count);
//       });
//       mentions.handles = mentions.handles.slice(0,11);
//       console.log(mentions);
//
//       for (var l=0;l<mentions.handles.length;l++) {
//           console.log(mentions.handles[l].user);
//           if (!mentions.handles[l].self) {
//             mentions.links.push({"source":mentions.handles[0].user,
//             "target":mentions.handles[l].user, "weight":mentions.handles[l].count});
//           }
//       }
//
//       console.log(mentions);
//
//       //jmentions = JSON.stringify(mentions);
//       //console.log(jmentions);
//       jsonfile.writeFile('public/info/mentions.json', mentions, function (err) {
//         console.error(err);
//       });
//     }
//   });
//   console.log("xxxx");
//   res.status(200).render('timeline', {title:'Timeline',
//     tweets: text, favs: favs, retweets:retweets, test:tweets,
//     user:user, pic:thumbnail, followers:followers,
//     description:description, mentions:mentions});
//   //res.status(500).json({ error: error });
// });

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
