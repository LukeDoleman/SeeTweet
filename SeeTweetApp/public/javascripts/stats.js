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
            "Morning",
            "Afternoon",
            "Evening",
            "Early Hours"
        ],
        datasets: [
            {
                data: tweet_times,
                backgroundColor: [
                    "#FF6384",
                    "#36A2EB",
                    "#FFCE56",
                    "#24ff00"

                ],
                borderColor: "#333",
                // borderWidth:5,
                hoverBackgroundColor: [
                    "#FF6384",
                    "#36A2EB",
                    "#FFCE56",
                    "#24ff00"
                ]
            }]
    },
    options: {
        animation:{
            animateRotate:true
        },
        //http://stackoverflow.com/questions/37257034/chart-js-2-0-doughnut-tooltip-percentages
        tooltips: {
          callbacks: {
            label: function(tooltipItem, data) {
              var dataset = data.datasets[tooltipItem.datasetIndex];
              var total = dataset.data.reduce(function(previousValue, currentValue, currentIndex, array) {
                return previousValue + currentValue;
              });
              var currentValue = dataset.data[tooltipItem.index];
              var precentage = Math.floor(((currentValue/total) * 100)+0.5);
              return precentage + "%";
            }
          }
      }
    }
});
