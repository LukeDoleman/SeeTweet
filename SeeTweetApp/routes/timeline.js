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

// http://www.sebastianseilund.com/nodejs-async-in-practice

var insertDocuments = function(collection_name, data, db, callback) {
  // Get the documents collection
  var collection = db.collection(collection_name);
  // Insert some documents
  collection.insertMany(data, function(err, result) {
    test.equal(err, null);
    console.log("Inserted documents into the document collection");
    callback(result);
  });
};

var insertDocument = function(collection_name, data, db, callback) {
  // Get the documents collection
  var collection = db.collection(collection_name);
  // Insert some documents
  collection.insert(data, function(err, result) {
    test.equal(err, null);
    console.log("Inserted documents into the document collection");
    callback(result);
  });
};

router.get('/', function(req, res) {

    var twitter_handle = req.query.username;
    //Time from querystring in form (e.g) ['0','24']
    var time = req.query.time.split(',').map(function(t) {
      if (t < 10) {
        return '0' + t;
      } else {
        return t;
      }
    });

    console.log(time);
    async.waterfall([

        //Determine if the twitter handle exists in the database already
        function(callback) {
          MongoClient.connect('mongodb://localhost:27017/tweetdb', function(err, db) {
              test.equal(null, err);
              console.log("Connected correctly to server");
              // Get the documents collection
              var collection = db.collection(twitter_handle);
              // Find some documents
              collection.find().toArray(function(err, existing_tweets) {
                  test.equal(err, null);
                  callback(null, existing_tweets);
              });
          });
        },

        function(existing_tweets, callback) {
          //Check if number of statuses could be read from the database
          if (typeof existing_tweets !== 'undefined' && existing_tweets.length > 0) {
            console.log(existing_tweets[0].user.statuses_count);
            //console.log(existing_tweets[0].statuses_count);
            callback(null, existing_tweets);
          } else {
            client.get('users/show', {
                screen_name: twitter_handle
            }, function(error, info, response) {
                if (!error) {
                    console.log(info.statuses_count);
                    callback(null, info.statuses_count);
                } else {
                    console.log(error);
                    console.log(twitter_handle + "- can't be found!!!");
                }
            });
          }
        },



        function(existing_tweets, callback) {
            var number; var exists;
            if (existing_tweets.constructor === Array) {
              number = existing_tweets.length;
              exists = true;
            } else {
              number = existing_tweets;
              exists = false;
            }
            var x = 0;
            if (number > 3200) number = 3200;
            var iterations = Math.ceil((number / 200));
            var max;
            var list_tweets = [];

            console.log("count is - " + number);

            if (!exists) {
              async.whilst(function() {
                      return x <= iterations;
                  },

                  function(next) {
                      client.get('statuses/user_timeline', {
                          screen_name: twitter_handle,
                          count: 200,
                          max_id: max
                      }, function(error, tweets, response) {
                          if (!error) {
                              console.log("First Tweets Crawled Successfully!");
                              for (var i = 0; i < tweets.length; i++) {
                                list_tweets.push(tweets[i]);
                              }
                          } else {
                              console.log(error);
                          }
                          console.log(list_tweets.length);
                          max = list_tweets[list_tweets.length - 1].id;
                          x++;
                          next();
                      });
                  },

                  function(err) {
                      callback(null, exists, list_tweets);
                      // console.log(err);
                  });
            } else {
              list_tweets = existing_tweets;
              callback(null, exists, list_tweets);
            }

        },

        // Append all tweets crawled to the Database
        function (exists, list_tweets, callback) {
          if (!exists) {
            MongoClient.connect('mongodb://localhost:27017/tweetdb', function(err, db) {
              test.equal(null, err);
              console.log("Connected correctly to server");
              insertDocuments(twitter_handle, list_tweets, db, function() {
                db.close();
                callback(null, list_tweets);
              });
            });
          } else {
            callback(null,list_tweets);
          }
        },

        //Extract appropriate list of user mentions from first crawl
        function(list_tweets, callback) {
            tweets = list_tweets;
            var mentions = {};
            mentions.handles = [{
                "user": ("@" + twitter_handle),
                count: 999,
                self: true
            }, ];
            mentions.links = [];
            var matched = [];
            var pattern = /\B@[a-z0-9_-]+/gi;
            for (var i = 0; i < tweets.length; i++) {
                var tweet_creation = tweets[i].created_at.substring(11, 13);
                if (tweet_creation >= time[0] && tweet_creation < time[1]) {
                    var stringMatch = (tweets[i].text).match(pattern);
                    if (!!stringMatch) {
                        for (var j = 0; j < stringMatch.length; j++) {
                            var arrayMatch = stringMatch[j];
                            if (matched.indexOf(arrayMatch) >= 0) {
                                for (var k = 0; k < mentions.handles.length; k++) {
                                    if (mentions.handles[k].user === arrayMatch) {
                                        mentions.handles[k].count = mentions.handles[k].count + 1;
                                    }
                                }
                            } else {
                                if (arrayMatch.toLowerCase() != ("@" + twitter_handle.toLowerCase())) {
                                    mentions.handles.push({
                                        "user": arrayMatch,
                                        "count": 1,
                                        "self": false
                                    });
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

            //Extract the 10 mentions and the user handle
            mentions.handles = mentions.handles.slice(0, 11);

            //Create links for each handle
            for (var l = 0; l < mentions.handles.length; l++) {
                if (!mentions.handles[l].self) {
                    mentions.links.push({
                        "source": mentions.handles[0].user,
                        "target": mentions.handles[l].user,
                        "weight": mentions.handles[l].count,
                        "stage": "first"
                    });
                }
            }
            console.log(mentions);
            callback(null, mentions, matched);
        },

        //Perform crawl on list of mentions from previous function
        function(mentions, matched, callback) {
            var full_mentions = mentions;
            var len = full_mentions.handles.length;
            var x = 1;
            var full_user_tweets = [];
            async.forEach(full_mentions.handles, function(mention, next) {
                if (mention.user.toLowerCase() != ("@" + twitter_handle.toLowerCase())) {
                    client.get('statuses/user_timeline', {
                        screen_name: mention.user,
                        count: 320
                    }, function(error, tweets, response) {
                        if (!error) {
                            console.log(x);
                            console.log(mention.user + " - Second Tweets Crawled Successfully!");
                            var temp_mentions = {};
                            temp_mentions.handles = [];
                            temp_mentions.links = [];
                            var matched = [];
                            var user_tweets = [];
                            for (var z = 0; z < full_mentions.handles.length; z++) {
                                matched.push(full_mentions.handles[z].user);
                            }
                            var pattern = /\B@[a-z0-9_-]+/gi;
                            for (var i = 0; i < tweets.length; i++) {
                                user_tweets.push(tweets[i]);
                                var stringMatch = (tweets[i].text).match(pattern);
                                if (!!stringMatch) {
                                    for (var j = 0; j < stringMatch.length; j++) {
                                        var arrayMatch = stringMatch[j];
                                        if (temp_mentions.handles.length === 0 && matched.indexOf(arrayMatch) == -1) {
                                            if (arrayMatch.toLowerCase() != (mention.user.toLowerCase())) {
                                                temp_mentions.handles.push({
                                                    "user": arrayMatch,
                                                    "count": 1,
                                                    "self": false
                                                });
                                                matched.push(arrayMatch);
                                            } else {
                                                temp_mentions.handles.push({
                                                    "user": arrayMatch,
                                                    "count": 1,
                                                    "self": true
                                                });
                                                matched.push(arrayMatch);
                                            }
                                        } else {
                                            if (matched.indexOf(arrayMatch) >= 0) {
                                                for (var k = 0; k < temp_mentions.handles.length; k++) {
                                                    if (temp_mentions.handles[k].user === arrayMatch) {
                                                        temp_mentions.handles[k].count = temp_mentions.handles[k].count + 1;
                                                    }
                                                }
                                            } else {
                                                if (arrayMatch.toLowerCase() != (mention.user.toLowerCase())) {
                                                    temp_mentions.handles.push({
                                                        "user": arrayMatch,
                                                        "count": 1,
                                                        "self": false
                                                    });
                                                    matched.push(arrayMatch);
                                                } else {
                                                    temp_mentions.handles.push({
                                                        "user": arrayMatch,
                                                        "count": 1,
                                                        "self": true
                                                    });
                                                    matched.push(arrayMatch);
                                                }
                                            }
                                        }
                                    }
                                }
                            }

                            //Add user tweets to full list for DB
                            full_user_tweets.push(user_tweets);

                            //Sort mentions in descending order
                            temp_mentions.handles.sort(function(a, b) {
                                return parseFloat(b.count) - parseFloat(a.count);
                            });

                            //Extract top 3 mentions only
                            temp_mentions.handles = temp_mentions.handles.slice(0, 3);

                            for (var l = 0; l < temp_mentions.handles.length; l++) {
                                if (!temp_mentions.handles[l].self) {
                                    temp_mentions.links.push({
                                        "source": mention.user,
                                        "target": temp_mentions.handles[l].user,
                                        "weight": temp_mentions.handles[l].count,
                                        "stage": "second"
                                    });
                                }
                            }

                            //Ensure at least one other profile was found and add to
                            //full list of mentions.
                            if (temp_mentions.handles.length !== 0) {
                                for (var m = 0; m < temp_mentions.handles.length; m++) {
                                    full_mentions.handles.push(temp_mentions.handles[m]);
                                    full_mentions.links.push(temp_mentions.links[m]);
                                }
                            } else {
                                console.log(temp_mentions.handles.length);
                            }

                        } else {
                            console.log(error);
                            console.log(mention.user + " - can't be found!!!");
                        }
                        if (x === len - 1) {
                            for (x in full_user_tweets) {
                              console.log(full_user_tweets[x].length);
                            }
                            callback(null, full_mentions, full_user_tweets);
                        } else {
                            x++;
                            next();
                        }
                    });
                } else {
                    console.log(mention.user);
                }
            }, function(err) {
                if (err) {
                    return callback(err);
                }
            });
        },

        //Take the full_user_tweets in a function and write to the database.
        //then pass full_mentions to next function
        function(full_mentions, full_user_tweets, callback) {
          var x = 0;
          var len = full_user_tweets.length - 1;
          async.forEach(full_user_tweets, function(user, next) {
            MongoClient.connect('mongodb://localhost:27017/tweetdb', function(err, db) {
              test.equal(null, err);
              console.log("Connected correctly to server");
              console.log(user.length);
              //Create new collection for inner ring of user tweets
              //include a hyphen so as not to conuse with a twitter handle
              //(illegal character)
              var network_collection = twitter_handle + "-network";
              var collection = db.collection(network_collection);
              // Insert some documents
              collection.insert(user, function(err, result) {
                test.equal(err, null);
                console.log("Inserted documents into the document collection");
                if (x === len) {
                    db.close();
                    callback(null, full_mentions);
                } else {
                    console.log("x is - " + x);
                    x++;
                    next();
                }
              });
              // insertDocuments(network_collection, user, db, function() {
              //   db.close();
              //   if (x === len - 1) {
              //       callback(null, full_mentions);
              //   } else {
              //       console.log("x is - " + x);
              //       x++;
              //       next();
              //   }
              // });
            });
          }, function(err) {
              if (err) {
                  return callback(err);
              }
          });
        },

        //Grab profile images for each user
        function(full_mentions, callback) {
            var len = full_mentions.handles.length - 1;
            var x = 0;
            async.forEach(full_mentions.handles, function(mention, next) {
                client.get('users/show', {
                    screen_name: mention.user
                }, function(error, info, response) {
                    if (!error) {
                        full_mentions.handles[full_mentions.handles.indexOf(mention)].picture = info.profile_image_url;
                    } else {
                        console.log(error);
                        console.log(mention.user + "- can't be found!!!");
                    }
                    if (x === len) {
                        callback(null, full_mentions);
                    } else {
                        x++;
                        next();
                    }
                });
            }, function(err) {
                if (err) return callback(err);
            });
        },

    ], function(err, result) {
        //Remove any broken Links from data
        result.links = result.links.filter(function(n) {
            return n !== undefined;
        });

        time = time.map(Number);

        res.status(200).render('timeline', {
            title: 'Home',
            result: result,
            name: twitter_handle,
            time:time
        });
    });
});

module.exports = router;
