$(window).on( "load", function() {

  $('[data-toggle="tooltip"]').tooltip();

  console.log(local_metrics[0][0]);
  //var name = local_metrics[0][0];
  for (var i=0;i<local_metrics[0].length;i++) {
    twttr.widgets.createTweet(
        local_metrics[0][i],
        document.getElementById("tweet-wrapper"), {
            theme: 'light',
        }
    );
  }
});
