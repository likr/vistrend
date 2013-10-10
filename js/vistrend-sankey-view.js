$(function() {
  var margin = {top: 1, right: 1, bottom: 6, left: 1},
    width = 940 - margin.left - margin.right,
    height = 1600 - margin.top - margin.bottom;

  var formatNumber = d3.format("d"),
    format = function(d) {return formatNumber(d);},
    color = d3.scale.category20();

  var svg = d3.select("#sankey-svg").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  var sankey = d3.sankey()
    .nodeWidth(15)
    .nodePadding(0)
    .size([width, height]);

  var path = sankey.link();

  d3.json("data/sankey.json", function(data) {

    sankey
      .nodes(data.nodes)
      .links(data.links)
      .layout(32);

    var link = svg.append("g").selectAll(".link")
      .data(data.links)
      .enter().append("path")
      .attr("class", "link")
      .attr("d", path)
      .style("stroke-width", function(d) { return Math.max(1, d.dy); })
      .sort(function(a, b) { return b.dy - a.dy; });

    link.append("title")
      .text(function(d) { return d.source.name + " → " + d.target.name + "\n" + format(d.value); });

    var node = svg.append("g").selectAll(".node")
      .data(data.nodes)
      .enter().append("g")
      .attr("class", "node")
      .attr("transform", function(d) { return "translate(" + d.x + "," + d.y + ")"; })
      .call(mouseclickNode)
      .call(mouseroverNode);

    node.append("rect")
      .attr("height", function(d) { return d.dy; })
      .attr("width", sankey.nodeWidth())
      .each(function(d) {
        if (d.x === 0) {
          d.color = color(d.name.replace(/ .*/, ""));
        } else {
          d.color = "#888";
        }
      })
      .style("fill", function(d) {
        return d.color;
      })
      .style("stroke", function(d) {
        return d3.rgb(d.color).darker(2);
      })
      .append("title")
      .text(function(d) {
        return d.name + "\n" + format(d.value);
      });

    node.append("text")
      .attr("x", -6)
      .attr("y", function(d) { return d.dy / 2; })
      .attr("dy", ".35em")
      .attr("text-anchor", "end")
      .attr("transform", null)
      .text(function(d) { return d.name; })
      .filter(function(d) { return d.x === 0; })
      .attr("x", 6 + sankey.nodeWidth())
      .attr("text-anchor", "start");


    function mouseclickNode(selection) {
      selection
        .on("click", function() {
          var set = d3.select(this).datum();

          var y = 0;

          var upperNodes = svg.selectAll(".node")
            .filter(function(d) {
              return d.x == set.x && d.y < set.y;
            })
            .data()
            ;
          upperNodes.sort(function(d1, d2) {
            var b1 = set.items.every(function(e) {return d1.items.indexOf(e) >= 0;});
            var b2 = set.items.every(function(e) {return d2.items.indexOf(e) >= 0;});
            if (b1 == b2) {
              return d1.y - d2.y;
            } else {
              return b1 - b2;
            }
          });
          upperNodes.forEach(function(d) {
            d.y = y;
            y += d.dy;
          });

          y += set.dy;

          var lowerNodes = svg.selectAll(".node")
            .filter(function(d) {
              return d.x == set.x && d.y > set.y;
            })
            .data()
            ;
          lowerNodes.sort(function(d1, d2) {
            var b1 = set.items.every(function(e) {return d1.items.indexOf(e) >= 0;});
            var b2 = set.items.every(function(e) {return d2.items.indexOf(e) >= 0;});
            return b2 - b1;
          });
          lowerNodes.forEach(function(d) {
            d.y = y;
            y += d.dy;
          });

          node
            .filter(function(d) {
              return d.x == set.x;
            })
            .each(function(d) {
              d.emphasized = set.items.every(function(e) {
                return d.items.indexOf(e) >= 0;
              });
            })
            .classed("transparent", function(d) {
              return !d.emphasized;
            })
            ;
          link
            .classed("emphasized", function(d) {
              return d.source.emphasized || d.target.emphasized;
            })
            .style("stroke", function(d) {
              if (d.source.emphasized && d.target.emphasized) {
                return "#f0f";
              } else if (d.source.emphasized) {
                return "#00f";
              } else if (d.target.emphasized) {
                return "#f00";
              } else {
                return "#000";
              }
            })
            .style("stroke-opacity", function(d) {
              if (d.source.emphasized && d.target.emphasized) {
                return 0.5;
              } else if (d.source.emphasized || d.target.emphasized) {
                return 0.3;
              } else {
                return 0.1;
              }
            })
            ;

          sankey.relayout();
          node.transition()
            .attr("transform", function(d) {
              return "translate(" + d.x + "," + d.y + ")";
            });
          link.transition()
            .attr("d", path);
        });
    }


    function mouseroverNode(selection) {
      selection
        .on("mouseover", function() {
          var node = d3.select(this).datum();
          svg.selectAll(".link")
            .filter(function(d) {return d.source == node || d.target == node;})
            .classed("active", true)
            ;
        })
        .on("mouseout", function() {
          svg.selectAll(".link.active")
            .classed("active", false)
            ;
        })
        ;
    }
  });
});
