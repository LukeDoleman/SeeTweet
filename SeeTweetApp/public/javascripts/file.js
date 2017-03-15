$(document).ready(function() {
    $("#splash").fadeIn(2000);
    $("#searchBar").fadeIn(6000);
    $("#getTweets").click(function() {
        var username = $('#userInput').val();
        $("#welcome").empty();
        $("#loader").attr("style", "");

        // progressbar.js@1.0.0 version is used
        // Docs: http://progressbarjs.readthedocs.org/en/1.0.0/
        var bar = new ProgressBar.Circle(container, {
          color: '#aaa',
          // This has to be the same size as the maximum width to
          // prevent clipping
          strokeWidth: 4,
          trailWidth: 1,
          easing: 'easeInOut',
          duration: 1400,
          text: {
            autoStyleContainer: false
          },
          from: { color: '#aaa', width: 1 },
          to: { color: '#333', width: 4 },
          // Set default step function for all animate calls
          step: function(state, circle) {
            circle.path.setAttribute('stroke', state.color);
            circle.path.setAttribute('stroke-width', state.width);

            var value = Math.round(circle.value() * 100);
            if (value === 0) {
              circle.setText('');
            } else {
              circle.setText(value);
            }

          }
        });
        bar.text.style.fontFamily = '"Raleway", Helvetica, sans-serif';
        bar.text.style.fontSize = '2rem';

        bar.animate(1.0);  // Number from 0.0 to 1.0
        if (username) { //Ensure the input field is not empty
            var url = document.URL;
            window.location.href = url + 'timeline' + '?' + 'username=' +
            username + '&time=0,24';
        }
    });

    $("#searchAgain").click(function() {
      var url = window.location.href;
      var new_url;
      new_url = url.substr(0, url.lastIndexOf("/"));
      console.log(url);
      console.log(new_url);
      window.location.href = new_url;
    });

    $("#getProfile").click(function() {
        var url = window.location.href;
        var new_url;
        if (url.includes("timeline")) {
          new_url = url.replace("timeline", "profile");
        } else if (url.includes("statistics")) {
          new_url = url.replace("statistics", "profile");
        } else {
          new_url = url;
        }
        console.log(new_url);
        window.location.href = new_url;
    });

    $("#getStatistics").click(function() {
        var url = window.location.href;
        //var new_url = url.replace("timeline", "statistics");
        var new_url;
        if (url.includes("timeline")) {
          new_url = url.replace("timeline", "statistics");
        } else if (url.includes("profile")) {
          new_url = url.replace("profile", "statistics");
        } else {
          new_url = url;
        }
        console.log(new_url);
        window.location.href = new_url;
    });

    // var slider = new Slider('#ex2', {});
});
