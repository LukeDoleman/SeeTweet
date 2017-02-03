//http://bl.ocks.org/sathomas/11550728
var svg = d3.select("svg"),
    width = +svg.attr("width"),
    height = +svg.attr("height");

var jpeople = local_data;

var simulation = d3.forceSimulation()
    .force("link", d3.forceLink().strength(function(d) {
      if (d) {
        return d.weight*2;
      }
    }))   //function(d) {return d.distance;}).strength(0.1))
    .force("link", d3.forceLink().id(function(d) {
          return d.user;
    }))
    .force("charge", d3.forceManyBody()) //.strength((function(d) {
    .force("center", d3.forceCenter(width / 2, height / 2));


console.log(jpeople.handles[0]);

var link = svg.selectAll(".link")
    .data(jpeople.links)
  .enter().append("line")
    .attr("class", "links")
    .attr("stroke-width", function(d) {
      if (d) {
        return d.weight;
      } else {
        return 1;
      }
    });

var node = svg.selectAll(".node")
    .data(jpeople.handles)
  .enter().append("g")
    .attr("class", "node");

node.append("a")
  .attr("xlink:href", function(d) { return "https://twitter.com/" + d.user; });

node.append("image")
  .attr("xlink:href", function(d) { return d.picture; })
  .attr("x", -16)
  .attr("y", -16)
  .attr("width", 32)
  .attr("height", 32)
  .on("click", function(d) {
    $(document).ready(function(){
      console.log("xox");
      var x = document.getElementById('twitter-embed').getAttribute("data-screen-name");
      console.log(x);
      // location.href = 'https://twitter.com/' + d.user;
      return;
    });
  });
  // node.append("a")
  //   .attr("xlink:href", function(d) {return "https://twitter.com/" + d.user; });


    //  .on("click", click);
    // node.append("text")
    //   .attr("dx", 12)
    //   .attr("dy", ".35em")
    //   .text(function(d) { return d.user; });


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














































  // //http://bl.ocks.org/sathomas/11550728
  //
  // var svg = d3.select("svg"),
  //     width = +svg.attr("width"),
  //     height = +svg.attr("height");
  //
  // console.log(width + " " + height);
  //
  // console.log("BITCH" + local_data.handles[0].user);
  //
  // var simulation = d3.forceSimulation()
  //     // .force("link", d3.forceLink().distance(function(d) {return d.weight;}))   //function(d) {return d.distance;}).strength(0.1))
  //     .force("link", d3.forceLink().id(function(d) {
  //           return d.user;
  //     }))
  //     .force("charge", d3.forceManyBody()) //.strength((function(d) {
  //     .force("center", d3.forceCenter(width / 2, height / 2));
  //
  // d3.json('info/mentions.json', function(error, jpeople) {
  //     console.log(jpeople.handles[0]);
  //     console.log(error);
  //     var link = svg.selectAll(".link")
  //         .data(jpeople.links)
  //       .enter().append("line")
  //         .attr("class", "links")
  //         .attr("stroke-width", function(d) {console.log(d.weight);return d.weight;});
  //
  //     var node = svg.selectAll(".node")
  //         .data(jpeople.handles)
  //       .enter().append("g")
  //         .attr("class", "node");
  //
  //     node.append("a")
  //       .attr("xlink:href", function(d) { return "https://twitter.com/" + d.user; });
  //
  //     node.append("image")
  //       .attr("xlink:href", function(d) { return d.picture; })
  //       .attr("x", -16)
  //       .attr("y", -16)
  //       .attr("width", 32)
  //       .attr("height", 32)
  //       .on("click", function(d) {
  //         location.href = 'https://twitter.com/' + d.user;
  //         return;
  //       });
  //       // node.append("a")
  //       //   .attr("xlink:href", function(d) {return "https://twitter.com/" + d.user; });
  //
  //
  //     //  .on("click", click);
  //     // node.append("text")
  //     //   .attr("dx", 12)
  //     //   .attr("dy", ".35em")
  //     //   .text(function(d) { return d.user; });
  //
  //
  //     node.append("title")
  //         .text(function(d) { return d.user; });
  //
  //     simulation
  //         .nodes(jpeople.handles)
  //         .on("tick", ticked);
  //
  //     simulation.force("link")
  //         .links(jpeople.links);
  //
  //     function ticked() {
  //         link
  //             .attr("x1", function(d) { return d.source.x; })
  //             .attr("y1", function(d) { return d.source.y; })
  //             .attr("x2", function(d) { return d.target.x; })
  //             .attr("y2", function(d) { return d.target.y; });
  //         node
  //             .attr("cx", function(d) { return d.x; })
  //             .attr("cy", function(d) { return d.y; })
  //             .attr("transform", function(d) { return "translate(" + d.x + "," + d.y + ")"; });
  //       }
  //
  //   });
  //
