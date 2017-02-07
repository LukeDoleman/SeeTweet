$(document).ready(function() {
    $("#getTweets").click(function() {
      var username = $('#userInput').val();
        if(username) { //Ensure the input field is not empty
          var url = document.URL;
          window.location.href = url + 'timeline' + '?' + 'username=' + username;
        }

        // var n = username;
        // $("#twitter-wrapper").append( '<a id="twitter-embed" ' +
        //   'class="twitter-timeline" ' +
        //   'data-height="600" data-dnt="true"' +
        //   'data-screen-name="' + n + '" href="https://twitter.com/' + n +
        //   '"> Tweets by @' + n + '</a>' );
        // $('#twitter-wrapper').append();

//<a class="twitter-timeline" data-height="250" data-dnt="true" data-theme="light" data-link-color="#2B7BB9" href="https://twitter.com/nodejs">Tweets by nodejs</a>

        // a(id="twitter-embed" class="twitter-timeline" data-height="600" data-dnt="true" href="https://twitter.com/potus" data-screen-name=getName()) Tweets by #{name}
    });

    $("#getProfile").click(function() {
      var url = window.location.href;
      var new_url = url.replace("timeline", "profile");
      console.log(new_url);
      window.location.href = new_url;
    });

    $("#getStatistics").click(function() {
      var url = window.location.href;
      var new_url = url.replace("timeline", "statistics");
      console.log(new_url);
      window.location.href = new_url;
    });
    // var slider = new Slider('#ex2', {});
});
