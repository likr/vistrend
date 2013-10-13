$(function() {
  function drawAttributes(selection, attributes) {
    var margin = 40,
      width = 600 - margin,
      height = 400 - margin,
      legendRowSize = 16;
    var svg = selection
      .attr("width", width + margin + 200 + legendRowSize)
      .attr("height", height + margin)
      ;

    var color = d3.scale.category20();

    svg.append("g")
      .attr("transform", "translate(" + (width + margin) + "," + margin + ")")
      .selectAll("g.legend")
      .data(attributes)
      .enter()
      .append("g")
      .classed("legend", true)
      .call(function(selection) {
        selection.append("rect")
          .attr("width", legendRowSize - 2)
          .attr("height", legendRowSize - 2)
          .attr("fill", function(_, i) {
            return color(i);
          })
          .attr("transform", "translate(1, 4)")
          ;
        selection.append("text")
          .text(function(d) {
            return d.name;
          })
          .attr("transform", "translate(" + legendRowSize + "," + legendRowSize + ")")
          ;
      })
      .attr("transform", function(_, i) {
        return "translate(0, " + i * legendRowSize + ")";
      })
      ;

    var lines = svg
        .selectAll("g.line")
        .data(attributes)
        .enter()
        .append("g")
        .classed("line", true)
        .style("fill", function (d, i) {
          return color(i);
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


    var countMax = d3.max(attributes, function(attribute) {
      return d3.max(attribute.counts, function(d) {
        return d.count;
      });
    });
    var count_scale = d3.scale.linear()
      .domain([0, countMax])
      .range([height, margin]);
    svg.selectAll("circle")
      .attr("cy", function (d) {
        return count_scale(d.count);
      });

    var yearExtent = d3.extent(attributes[0].counts, function(d) {
      return d.year;
    });
    var year_scale = d3.time.scale()
      .domain(yearExtent)
      .range([margin, width]);
    svg.selectAll("circle")
      .attr("cx", function (d) {
        return year_scale(d.year);
      });

    svg.selectAll("circle")
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
    svg
      .append("g")
      .attr("class", "x axis")
      .attr("transform", "translate(0," + height + ")")
      .call(year_axis);
    var count_axis = d3.svg.axis()
      .scale(count_scale)
      .orient("left");
    svg
      .append("g")
      .attr("class", "y axis")
      .attr("transform", "translate(" + margin + ",0)")
      .call(count_axis);
    var line = d3.svg.line()
      .x(function (d) {
        return year_scale(d.year);
      })
      .y(function (d) {
        return count_scale(d.count);
      });

    lines.append("path")
      .attr("d", function (d) {
        return line(d.counts);
      })
      .style("stroke", function (_, i) {
        return color(i);
      })
    ;

    svg.select(".y.axis")
      .append("text")
      .text("count")
      .attr("transform", "rotate (90, " + -margin + ", 0)")
      .attr("x", 80)
      .attr("y", 0);
    svg.select(".x.axis")
      .append("text")
      .text("year")
      .attr("x", function () {
        return (width / 1.6) - margin;
      })
      .attr("y", margin / 1.5);
  }


  function draw(data) {
    var i;
    var yearExtent = d3.extent(data.entries, function(d) {
      return d.year;
    });
    var years = [];
    for (i = yearExtent[0]; i <= yearExtent[1]; ++i) {
      years.push(i);
    }

    var metrics = data.meta.metrics.map(function(metric) {
      return {
        name : metric,
        counts : years.map(function(year) {
          return {
            year : year,
            count : d3.sum(data.entries, function(entry) {
              if (entry.year == year && entry.metrics[metric]) {
                return 1;
              } else {
                return 0;
              }
            })
          };
        })
      };
    });
    d3.select("#trend-view-svg1")
      .call(function(selection) {
        return drawAttributes(selection, metrics);
      })
      ;

    var methods = data.meta.methods.map(function(method) {
      return {
        name : method,
        counts : years.map(function(year) {
          return {
            year : year,
            count : d3.sum(data.entries, function(entry) {
              if (entry.year == year && entry.methods[method]) {
                return 1;
              } else {
                return 0;
              }
            })
          };
        })
      };
    });
    d3.select("#trend-view-svg2")
      .call(function(selection) {
        return drawAttributes(selection, methods);
      })
      ;
  }

  d3.json("data/vistrend.json", draw);
});
