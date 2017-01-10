var svg = d3.select("svg"),
    width = +svg.attr("width"),
    height = +svg.attr("height");

var simulation = d3.forceSimulation()
    //.force("link", d3.forceLink().id(function(d) { return d.id; }))
    .force("charge", d3.forceManyBody())
    .force("center", d3.forceCenter(width / 2, height / 2));

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

  node.append("title")
      .text(function(d) { return d.user; });

  simulation
      .nodes(jpeople.handles)
      .on("tick", ticked);

  function ticked() {
      node
          .attr("cx", function(d) { return d.x; })
          .attr("cy", function(d) { return d.y; });
    }

});
