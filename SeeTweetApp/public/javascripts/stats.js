$(window).on( "load", function() {
  console.log(user_metrics[2][0]);
  console.log(user_metrics[2][1]);
  for (var i=0;i<user_metrics[2][0].length;i++) {
    twttr.widgets.createTweet(
        user_metrics[2][0][i],
        document.getElementById("tweet-wrapper"), {
            theme: 'light',
            align: 'left',
            width: '370',
        }
    );

    twttr.widgets.createTweet(
        user_metrics[2][1][i],
        document.getElementById("likes-wrapper"), {
            theme: 'light',
            align: 'left',
            width: '370',
        }
    );
  }
});

var ctx = document.getElementById("myLineChart");

var myLineChart = new Chart(ctx, {
    type: 'line',
    data: {
        labels: ["Morning", "Afternoon", "Evening", "Early Hours"],
        datasets: [{
            label: "You",
            fill: false,
            lineTension: 0.1,
            backgroundColor: "rgba(75,192,192,0.4)",
            borderColor: "#FF6384",
            borderCapStyle: 'butt',
            borderDash: [],
            borderDashOffset: 0.0,
            borderJoinStyle: 'miter',
            pointBorderColor: "#FF6384",
            pointBackgroundColor: "#fff",
            pointBorderWidth: 1,
            pointHoverRadius: 5,
            pointHoverBackgroundColor: "#FF6384",
            pointHoverBorderColor: "rgba(220,220,220,1)",
            pointHoverBorderWidth: 2,
            pointRadius: 1,
            pointHitRadius: 10,
            data: user_metrics[4]
        }, {
            label: "Your Network",
            fill: false,
            lineTension: 0.1,
            backgroundColor: "rgba(75,192,192,0.4)",
            borderColor: "#36A2EB",
            borderCapStyle: 'butt',
            borderDash: [],
            borderDashOffset: 0.0,
            borderJoinStyle: 'miter',
            pointBorderColor: "#36A2EB",
            pointBackgroundColor: "#fff",
            pointBorderWidth: 1,
            pointHoverRadius: 5,
            pointHoverBackgroundColor: "#36A2EB",
            pointHoverBorderColor: "rgba(220,220,220,1)",
            pointHoverBorderWidth: 2,
            pointRadius: 1,
            pointHitRadius: 10,
            data: network_metrics[3]
        }],
    // options: options
  }
});

var ctx = document.getElementById("myRadarChart");

var myRadarChart = new Chart(ctx, {
    type: 'radar',
    data : {
      labels: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
      datasets: [
          {
              label: "You",
              backgroundColor: "rgba(179,181,198,0.2)",
              borderColor: "#FF6384",
              pointBackgroundColor: "#FF6384",
              pointBorderColor: "#fff",
              pointHoverBackgroundColor: "#fff",
              pointHoverBorderColor: "#FF6384",
              data: user_metrics[3]
          },
          {
              label: "Your Network",
              backgroundColor: "rgba(255,99,132,0.2)",
              borderColor: "#36A2EB",
              pointBackgroundColor: "#36A2EB",
              pointBorderColor: "#fff",
              pointHoverBackgroundColor: "#fff",
              pointHoverBorderColor: "#36A2EB",
              data: network_metrics[2]
          }
      ]
  },
});


var ctx = document.getElementById("myChart");

var myChart = new Chart(ctx, {
    type: 'doughnut',
    data: {
        labels: [
            "Desktop",
            "Mobile",
        ],
        datasets: [
            {
                data: user_metrics[1],
                backgroundColor: [
                    "#FF6384",
                    "#36A2EB",

                ],
                // borderColor: "transparent",
                hoverBackgroundColor: [
                    "#FF6384",
                    "#36A2EB",
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

var ctx = document.getElementById("myPieChart");

var myPieChart = new Chart(ctx, {
    type: 'doughnut',
    data: {
        labels: [
            "Desktop",
            "Mobile",
        ],
        datasets: [
            {
                data: network_metrics[1],
                backgroundColor: [
                    "#FF6384",
                    "#36A2EB",
                ],
                // borderColor: "transparent",
                hoverBackgroundColor: [
                    "#FF6384",
                    "#36A2EB",
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
