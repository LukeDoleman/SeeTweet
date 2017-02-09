$( window ).on( "load", function() {
  twttr.widgets.createTweet(
      '20',
      document.getElementById("tweet-wrapper"), {
          theme: 'light'
      }
  );
});
