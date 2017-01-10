var svg = d3.select("svg"),
    width = +svg.attr("width"),
    height = +svg.attr("height");

d3.json('info/mentions.json', function(error, people) {

  var jpeople = JSON.parse(people);
  console.log(jpeople.handles[0]);

  // var circleSelection = svg.append("circle")
  //     .attr("cx", 25)
  //     .attr("cy", 25)
  //     .attr("r", 25)
  //     .style("fill", "purple");

  var node = svg.append("g")
      .attr("class", "handles")
      .selectAll("circle")
      .data(jpeople.handles)
      .enter().append("circle")
      .attr("r", 5)
      .attr("fill", "purple");
});
