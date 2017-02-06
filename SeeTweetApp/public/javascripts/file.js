$(document).ready(function() {
    $("#getTweets").click(function() {
      var username = $('#userInput').val();
        if(username) { //Ensure the input field is not empty
          var url = document.URL;
          window.location.href = url + 'timeline' + '?' + 'username=' + username;
        }
        // var e = $('<a> id="twitter-embed" class="twitter-timeline" data-height="600" data-dnt="true" data-screen-name=getName()) Tweets by #{name} ')
        // $('#twitter-wrapper').append(e);
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

    function getName() {
      return "potus";
    }

    // var slider = new Slider('#ex2', {});

});
