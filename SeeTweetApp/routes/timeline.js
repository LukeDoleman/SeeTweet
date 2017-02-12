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

// http://www.sebastianseilund.com/nodejs-async-in-practice

router.get('/', function(req, res) {
    var twitter_handle = req.param('username');

    async.waterfall([

        //Perform crawl on user given twitter handle
        function(callback) {
            client.get('statuses/user_timeline', {
                screen_name: twitter_handle,
                count: 320
            }, function(error, tweets, response) {
                if (!error) {
                    console.log("First Tweets Crawled Successfully!");
                } else {
                    console.log(error);
                }
                callback(null, tweets);
            });
        },

        //Extract appropriate list of user mentions from first crawl
        function(tweets, callback) {
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
                            for (var z = 0; z < full_mentions.handles.length; z++) {
                                matched.push(full_mentions.handles[z].user);
                            }
                            var pattern = /\B@[a-z0-9_-]+/gi;
                            for (var i = 0; i < tweets.length; i++) {
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
                        }
                        if (x === len - 1) {
                            callback(null, full_mentions);
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

        //Grab profile images for each user
        function(full_mentions, callback) {
            var len = full_mentions.handles.length;
            var x = 1;
            async.forEach(full_mentions.handles, function(mention, next) {
                client.get('users/show', {
                    screen_name: mention.user
                }, function(error, info, response) {
                    if (!error) {
                        full_mentions.handles[full_mentions.handles.indexOf(mention)].picture = info.profile_image_url;
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
            }, function(err) {
                if (err) return callback(err);
            });
        },
    ], function(err, result) {
        console.log(result);
        //result.handles = result.handles.filter(function(n){ return n !== undefined; });
        result.links = result.links.filter(function(n) {
            return n !== undefined;
        });
        res.status(200).render('timeline', {
            title: 'Home',
            result: result,
            name: twitter_handle
        });
    });
});

module.exports = router;
