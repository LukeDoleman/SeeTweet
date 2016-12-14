$(document).ready(function() {
    $("#getTweets").click(function() {
        var username = $('#userInput').val();
          if(username) { //Ensure the input field is not empty
            var url = document.URL;
            window.location.href = url + 'timeline' + '?' + 'username=' + username;
          }
    });
});
