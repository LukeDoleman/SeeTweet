// var svg = d3.select("svg"),
//     width = +svg.attr("width"),
//     height = +svg.attr("height");

//- var color = d3.scaleOrdinal(d3.schemeCategory20);
//-
//- var simulation = d3.forceSimulation()
//-     .force("link", d3.forceLink().id(function(d) { return d.id; }))
//-     .force("charge", d3.forceManyBody())
//-     .force("center", d3.forceCenter(width / 2, height / 2));

// var circleSelection = svg.append("circle")
//      .attr("cx", 25)
//      .attr("cy", 25)
//      .attr("r", 25)
//      .style("fill", "purple");
//

//var json = require('./mentions.json'); //with path

//var mentions = './mentions.json';
//var mentions = {"my":"mentions"};
//
//

//Need to convert {x:1,y:2} to [{x:1},{y:2}]


d3.json("/javascripts/mentions.json", function(data) {
  console.log(data);
});

//   d3.select("svg").selectAll("p")
//       .data(data)
//       .enter()
//       .append("p")
//       .text("New paragraph!");
//
// });
