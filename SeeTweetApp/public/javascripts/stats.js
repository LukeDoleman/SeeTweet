$(window).on( "load", function() {
  $('[data-toggle="tooltip"]').tooltip();
  for (var i=0;i<local_metrics[0].length;i++) {
    twttr.widgets.createTweet(
        local_metrics[0][i],
        document.getElementById("tweet-wrapper"), {
            theme: 'light',
            align: 'left',
            width: '370',
        }
    );
  }

  for (var j=0;j<local_metrics[1].length;j++) {
    twttr.widgets.createTweet(
        local_metrics[1][j],
        document.getElementById("likes-wrapper"), {
            theme: 'light',
            align: 'left',
            width: '370',
        }
    );
  }

  $("input[name='2']").change(function() {
    $("#r1").prop('checked', false);
    $("#tweet-wrapper").empty();
    for (var i=0;i<local_metrics[1].length;i++) {
      twttr.widgets.createTweet(
          local_metrics[1][i],
          document.getElementById("tweet-wrapper"), {
              theme: 'light',
          }
      );
    }
  });

  $("input[name='1']").change(function() {
    $("#r2").prop('checked', false);
    $("#tweet-wrapper").empty();
    for (var i=0;i<local_metrics[0].length;i++) {
      twttr.widgets.createTweet(
          local_metrics[0][i],
          document.getElementById("tweet-wrapper"), {
              theme: 'light',
          }
      );
    }
  });


});

var ctx = document.getElementById("myLineChart");

var myLineChart = new Chart(ctx, {
    type: 'line',
    data: {
        labels: ["Monday", "Tuesday", "Wednesday", "Thursday"],
        datasets: [{
            label: "You",
            fill: false,
            lineTension: 0.1,
            backgroundColor: "rgba(75,192,192,0.4)",
            borderColor: "rgba(75,192,192,1)",
            borderCapStyle: 'butt',
            borderDash: [],
            borderDashOffset: 0.0,
            borderJoinStyle: 'miter',
            pointBorderColor: "rgba(75,192,192,1)",
            pointBackgroundColor: "#fff",
            pointBorderWidth: 1,
            pointHoverRadius: 5,
            pointHoverBackgroundColor: "rgba(75,192,192,1)",
            pointHoverBorderColor: "rgba(220,220,220,1)",
            pointHoverBorderWidth: 2,
            pointRadius: 1,
            pointHitRadius: 10,
            data: [20, 30, 50, 20]
        }, {
            label: "Your Network",
            fill: false,
            lineTension: 0.1,
            backgroundColor: "rgba(75,192,192,0.4)",
            borderColor: "rgba(75,192,192,1)",
            borderCapStyle: 'butt',
            borderDash: [],
            borderDashOffset: 0.0,
            borderJoinStyle: 'miter',
            pointBorderColor: "rgba(75,192,192,1)",
            pointBackgroundColor: "#fff",
            pointBorderWidth: 1,
            pointHoverRadius: 5,
            pointHoverBackgroundColor: "rgba(75,192,192,1)",
            pointHoverBorderColor: "rgba(220,220,220,1)",
            pointHoverBorderWidth: 2,
            pointRadius: 1,
            pointHitRadius: 10,
            data: [60, 10, 40, 30]
        }],
    // options: options
  }
});

var ctx = document.getElementById("myRadarChart");

var myRadarChart = new Chart(ctx, {
    type: 'radar',
    data : {
      labels: ["Eating", "Drinking", "Sleeping", "Designing", "Coding", "Cycling", "Running"],
      datasets: [
          {
              label: "My First dataset",
              backgroundColor: "rgba(179,181,198,0.2)",
              borderColor: "rgba(179,181,198,1)",
              pointBackgroundColor: "rgba(179,181,198,1)",
              pointBorderColor: "#fff",
              pointHoverBackgroundColor: "#fff",
              pointHoverBorderColor: "rgba(179,181,198,1)",
              data: [65, 59, 90, 81, 56, 55, 40]
          },
          {
              label: "My Second dataset",
              backgroundColor: "rgba(255,99,132,0.2)",
              borderColor: "rgba(255,99,132,1)",
              pointBackgroundColor: "rgba(255,99,132,1)",
              pointBorderColor: "#fff",
              pointHoverBackgroundColor: "#fff",
              pointHoverBorderColor: "rgba(255,99,132,1)",
              data: [28, 48, 40, 19, 96, 27, 100]
          }
      ]
  },
});


// var ctx = document.getElementById("myChart");
//
// var myChart = new Chart(ctx, {
//     type: 'doughnut',
//     data: {
//         labels: [
//             "Morning",
//             "Afternoon",
//             "Evening",
//             "Early Hours"
//         ],
//         datasets: [
//             {
//                 data: tweet_times,
//                 backgroundColor: [
//                     "#FF6384",
//                     "#36A2EB",
//                     "#FFCE56",
//                     "#24ff00"
//
//                 ],
//                 // borderColor: "transparent",
//                 hoverBackgroundColor: [
//                     "#FF6384",
//                     "#36A2EB",
//                     "#FFCE56",
//                     "#24ff00"
//                 ]
//             }]
//     },
//     options: {
//         animation:{
//             animateRotate:true
//         },
//         //http://stackoverflow.com/questions/37257034/chart-js-2-0-doughnut-tooltip-percentages
//         tooltips: {
//           callbacks: {
//             label: function(tooltipItem, data) {
//               var dataset = data.datasets[tooltipItem.datasetIndex];
//               var total = dataset.data.reduce(function(previousValue, currentValue, currentIndex, array) {
//                 return previousValue + currentValue;
//               });
//               var currentValue = dataset.data[tooltipItem.index];
//               var precentage = Math.floor(((currentValue/total) * 100)+0.5);
//               return precentage + "%";
//             }
//           }
//       }
//     }
// });
//
// var ctx = document.getElementById("myPieChart");
//
// var myPieChart = new Chart(ctx, {
//     type: 'pie',
//     data: {
//         labels: [
//             "Desktop",
//             "Mobile",
//         ],
//         datasets: [
//             {
//                 data: device,
//                 backgroundColor: [
//                     "#FF6384",
//                     "#36A2EB",
//                 ],
//                 // borderColor: "transparent",
//                 hoverBackgroundColor: [
//                     "#FF6384",
//                     "#36A2EB",
//                 ]
//             }]
//     },
//     options: {
//         animation:{
//             animateRotate:true
//         },
//         //http://stackoverflow.com/questions/37257034/chart-js-2-0-doughnut-tooltip-percentages
//         tooltips: {
//           callbacks: {
//             label: function(tooltipItem, data) {
//               var dataset = data.datasets[tooltipItem.datasetIndex];
//               var total = dataset.data.reduce(function(previousValue, currentValue, currentIndex, array) {
//                 return previousValue + currentValue;
//               });
//               var currentValue = dataset.data[tooltipItem.index];
//               var precentage = Math.floor(((currentValue/total) * 100)+0.5);
//               return precentage + "%";
//             }
//           }
//       }
//     }
// });
//
// var ctx = document.getElementById("myBarChart");
//
// var myBarChart = new Chart(ctx, {
//     type: 'bar',
//     data: {
//       labels: ["Monday", "Tuesday", "Wednesday", "Thursday",
//                "Friday", "Saturday", "Sunday"],
//       datasets: [
//           {
//               // label: "",
//               backgroundColor: [
//                   'rgba(255, 99, 132, 0.2)',
//                   'rgba(54, 162, 235, 0.2)',
//                   'rgba(255, 206, 86, 0.2)',
//                   'rgba(75, 192, 192, 0.2)',
//                   'rgba(153, 102, 255, 0.2)',
//                   'rgba(255, 159, 64, 0.2)'
//               ],
//               borderColor: [
//                   'rgba(255,99,132,1)',
//                   'rgba(54, 162, 235, 1)',
//                   'rgba(255, 206, 86, 1)',
//                   'rgba(75, 192, 192, 1)',
//                   'rgba(153, 102, 255, 1)',
//                   'rgba(255, 159, 64, 1)'
//               ],
//               borderWidth: 1,
//               data: tweet_days,
//           }
//     ]
//   },
//   options:  {
//         scales: {
//             xAxes: [{
//                 stacked: true
//             }],
//             yAxes: [{
//             ticks: {
//                    min: 0,
//                    max: 100,
//                    callback: function(value){return value+ "%";}
//                 },
// 								scaleLabel: {
//                    display: true,
//                    labelString: "Percentage"
//                 }
//             }]
//         },
//         legend: {
//            display: false
//         },
//     }
// });
