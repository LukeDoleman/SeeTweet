$(window).on( "load", function() {
  $('[data-toggle="tooltip"]').tooltip();
  for (var i=0;i<local_metrics[0].length;i++) {
    twttr.widgets.createTweet(
        local_metrics[0][i],
        document.getElementById("tweet-wrapper"), {
            theme: 'light',
        }
    );
  }
});
