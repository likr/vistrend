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
      .nodePadding(5)
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
      .call(d3.behavior.drag()
        .origin(function(d) { return d; })
        .on("dragstart", function() { this.parentNode.appendChild(this); })
        .on("drag", dragmove));

    var nodeOpacityScale = d3.scale.linear()
      .domain(d3.extent(data.nodes, function(d) {return d.items.length;}))
      .range([0.9, 0.1]);
    node.append("rect")
        .attr("height", function(d) { return d.dy; })
        .attr("width", sankey.nodeWidth())
        .style("fill", function(d) { return d.color = color(d.name.replace(/ .*/, "")); })
        .style("opacity", function(d) {return nodeOpacityScale(d.items.length);})
        .style("stroke", function(d) { return d3.rgb(d.color).darker(2); })
      .append("title")
        .text(function(d) { return d.name + "\n" + format(d.value); });

    node.append("text")
        .attr("x", -6)
        .attr("y", function(d) { return d.dy / 2; })
        .attr("dy", ".35em")
        .attr("text-anchor", "end")
        .attr("transform", null)
        .text(function(d) { return d.name; })
      .filter(function(d) { return d.x < width / 2; })
        .attr("x", 6 + sankey.nodeWidth())
        .attr("text-anchor", "start");

    function dragmove(d) {
      d3.select(this).attr("transform", "translate(" + d.x + "," + (d.y = Math.max(0, Math.min(height - d.dy, d3.event.y))) + ")");
      sankey.relayout();
      link.attr("d", path);
    }
  });
});
