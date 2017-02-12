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

var ctx = document.getElementById("myChart");

var myChart = new Chart(ctx, {
    type: 'doughnut',
    data: {
        labels: [
            "Red",
            "Blue",
            "Yellow"
        ],
        datasets: [
            {
                data: [300, 50, 100],
                backgroundColor: [
                    "#FF6384",
                    "#36A2EB",
                    "#FFCE56"
                ],
                // borderColor: "#36A2EB",
                // borderWidth:5,
                hoverBackgroundColor: [
                    "#FF6384",
                    "#36A2EB",
                    "#FFCE56"
                ]
            }]
    },
    options: {
        animation:{
            animateRotate:true
        }
    }
});
