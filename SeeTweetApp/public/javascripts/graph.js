//http://bl.ocks.org/sathomas/11550728

var svg = d3.select("svg"),
    width = +svg.attr("width"),
    height = +svg.attr("height");

var simulation = d3.forceSimulation()
    .force("link", d3.forceLink().id(function(d) {return d.user;}))
    //.distance(function(d) {console.log(d.count);})
    //.force("link", d3.layout.force().linkDistance(100))
    .force("charge", d3.forceManyBody())
    .force("center", d3.forceCenter(width / 2, height / 2));

d3.json('info/mentions.json', function(error, jpeople) {
  console.log(error);
  console.log(jpeople.handles[0]);

    //
    // var link = svg.selectAll(".link")
    //     .data(json.links)
    //   .enter().append("line")
    //     .attr("class", "link");
    //
    // var node = svg.selectAll(".node")
    //     .data(json.nodes)
    //   .enter().append("g")
    //     .attr("class", "node")
    //     .call(force.drag);

    var link = svg.selectAll(".link")
        .data(jpeople.links)
      .enter().append("line")
        .attr("class", "links")
        .attr("stroke-width", function(d) {return d.count;});

    var node = svg.selectAll(".node")
        .data(jpeople.handles)
      .enter().append("g")
        .attr("class", "node");

      //.attr("class", "nodes")
      //.selectAll("circle")
      //.data(jpeople.handles)
      //.enter().append("circle")
      // .attr("r", 5)
      // .attr("fill", "purple");

    node.append("image")
      .attr("xlink:href", function(d) { return d.picture; })
      .attr("x", -8)
      .attr("y", -8)
      .attr("width", 16)
      .attr("height", 16);

    node.append("title")
        .text(function(d) { return d.user; });

    simulation
        .nodes(jpeople.handles)
        .on("tick", ticked);

    simulation.force("link")
        .links(jpeople.links);

    function ticked() {
        link
            .attr("x1", function(d) { return d.source.x; })
            .attr("y1", function(d) { return d.source.y; })
            .attr("x2", function(d) { return d.target.x; })
            .attr("y2", function(d) { return d.target.y; });
        node
            .attr("cx", function(d) { return d.x; })
            .attr("cy", function(d) { return d.y; })
            .attr("transform", function(d) { return "translate(" + d.x + "," + d.y + ")"; });
      }

  });
//
//   // node.append("span")
//   //     .attr("dx", 12)
//   //     .attr("dy", ".35em")
//   //     .text(function(d) { return d.user; });
//
//   // var text = svg.selectAll("circle")
//   //     .data(jpeople.handles)
//   //     .enter().append("text")
//   //     .attr("dy", ".35em");
//   //     text.text(function(d) { return d.user; });
//     	// .style("font-size", nominal_text_size + "px")
//
//     	// if (text_center)
//     	//  text.text(function(d) { return d.id; })
//     	// .style("text-anchor", "middle");
//     	// else
//     	// text.attr("dx", function(d) {return (size(d.size)||nominal_base_node_size);})
//       //   .text(function(d) { return '\u2002'+d.id; });
