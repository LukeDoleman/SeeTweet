$(document).ready(function() {
    $("#getTweets").click(function() {
        var username = $('#userInput').val();
        if (username) { //Ensure the input field is not empty
            var url = document.URL;
            window.location.href = url + 'timeline' + '?' + 'username=' + username;
        }
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
