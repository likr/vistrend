$(function() {
  function drawMetrics(data) {
    var margin = 40,
      width = 800 - margin,
      height = 400 - margin;
    var svg1 = d3.select("#trend-view-svg1")
      .attr("width", width + margin)
      .attr("height", height + margin)
      ;

    var color = d3.scale.category20();

    var lines = svg1
        .selectAll("g.line")
        .data(data["metrics"])
        .enter()
        .append("g")
        .classed("line", true)
        .style("fill", function (d) {
          return color(d["name"]);
        })
      ;

    lines.selectAll("circle.point")
      .data(function (d) {
        return d.counts;
      })
      .enter()
      .append("circle")
      .classed("point", true)
    ;


    var count_scale = d3.scale.linear()
      .domain([0, 25])
      .range([height, margin]);
    svg1.selectAll("circle")
      .attr("cy", function (d) {
        return count_scale(d.count);
      });

    var year_scale = d3.time.scale()
      .domain([2004, 2012])
      .range([margin, width]);
    svg1.selectAll("circle")
      .attr("cx", function (d) {
        return year_scale(d.year);
      });

    svg1.selectAll("circle")
      .attr("cy", function (d) {
        return count_scale(d.count);
      })
      .attr("cx", function (d) {
        return year_scale(d.year);
      })
      .attr("r", 3);
    var year_axis = d3.svg.axis()
      .scale(year_scale)
      .tickFormat(d3.format("d"));
    svg1
      .append("g")
      .attr("class", "x axis")
      .attr("transform", "translate(0," + height + ")")
      .call(year_axis);
    var count_axis = d3.svg.axis()
      .scale(count_scale)
      .orient("left");
    svg1
      .append("g")
      .attr("class", "y axis")
      .attr("transform", "translate(" + margin + ",0)")
      .call(count_axis);
    var line = d3.svg.line()
      .x(function (d) {
        return year_scale(d.year)
      })
      .y(function (d) {
        return count_scale(d.count)
      });

    lines.append("path")
      .attr("d", function (d) {
        return line(d["counts"]);
      })
      .style("stroke", function (d) {
        return color(d["name"]);
      })
    ;

    svg1.select(".y.axis")
      .append("text")
      .text("frequency of use")
      .attr("transform", "rotate (90, " + -margin + ", 0)")
      .attr("x", 80)
      .attr("y", 0);
    svg1.select(".x.axis")
      .append("text")
      .text("year")
      .attr("x", function () {
        return (width / 1.6) - margin
      })
      .attr("y", margin / 1.5);
  }

  function drawMethods(data) {
    var margin = 40,
      width = 800 - margin,
      height = 400 - margin;
    var svg2 = d3.select("#trend-view-svg2")
      .attr("width", width+margin)
      .attr("height", height+margin)
      ;

    var color = d3.scale.category20();

    var lines = svg2
        .selectAll("g.line")
        .data(data["methods"])
        .enter()
        .append("g")
        .classed("line", true)
        .style("fill", function (d) {
          return color(d["name"]);
        })
      ;

    lines.selectAll("circle.point")
      .data(function (d) {
        return d.counts;
      })
      .enter()
      .append("circle")
      .classed("point", true)
    ;

    var count_scale = d3.scale.linear()
      .domain([0, 30])
      .range([height, margin]);
    svg2.selectAll("circle")
      .attr("cy", function(d){return count_scale(d.count);});

    var year_scale = d3.time.scale()
      .domain([2004, 2012])
      .range([margin, width]);
    svg2.selectAll("circle")
      .attr("cx", function(d){return year_scale(d.year);});

    svg2.selectAll("circle")
      .attr("cy", function(d){return count_scale(d.count);})
      .attr("cx", function(d){return year_scale(d.year);})
      .attr("r", 3);
    var year_axis = d3.svg.axis()
      .scale(year_scale)
      .tickFormat(d3.format("d"));
    svg2
      .append("g")
      .attr("class", "x axis")
      .attr("transform", "translate(0," + height + ")")
      .call(year_axis);
    var count_axis = d3.svg.axis()
      .scale(count_scale)
      .orient("left");
    svg2
      .append("g")
      .attr("class", "y axis")
      .attr("transform", "translate(" + margin + ",0)")
      .call(count_axis);
    var line = d3.svg.line()
      .x(function(d){return year_scale(d.year)})
      .y(function(d){return count_scale(d.count)});

    lines.append("path")
      .attr("d", function (d) {
        return line(d["counts"]);
      })
      .style("stroke", function (d) {
        return color(d["name"]);
      })

    svg2.select(".y.axis")
      .append("text")
      .text("frequency of use")
      .attr("transform", "rotate (90, " + -margin + ", 0)")
      .attr("x", 80)
      .attr("y", 0);
    svg2.select(".x.axis")
      .append("text")
      .text("year")
      .attr("x", function(){return (width / 1.6) - margin})
      .attr("y", margin/1.5);
  }

  function draw(data) {
    drawMetrics(data);
    drawMethods(data);
  }

  d3.json("data/trend.json", draw);
});