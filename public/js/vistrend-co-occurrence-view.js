$(function() {
  function draw(data) {
    var cellSize = 16,
      offset = 200,
      metrics = data.meta.metrics,
      methods  = data.meta.methods,
      attributes = metrics.concat(methods);

    data.entries.forEach(function(entry) {
      entry.attributes = {};
      data.meta.metrics.forEach(function(metric) {
        if (entry.metrics[metric]) {
          entry.attributes[metric] = 1;
        }
      });
      data.meta.methods.forEach(function(method) {
        if (entry.methods[method]) {
          entry.attributes[method] = 1;
        }
      });
    });

    var matrix = attributes.map(function(rowAttribute, i) {
      return attributes.map(function(columnAttribute, j) {
        return {
            i : i,
            j : j,
            count : d3.sum(data.entries, function(entry) {
              if (entry.attributes[rowAttribute] && entry.attributes[columnAttribute]) {
                return 1;
              } else {
                return 0;
              }
            })
        };
      });
    });

    var maxCount = d3.max(matrix, function(row) {
      return d3.max(row, function(cell) {
        return cell.count;
      });
    });
    var countScale = d3.scale.linear()
      .domain([0, maxCount])
      .range([0, 1])
      ;

    var svg = d3.select("#co-occurrence-svg")
      .attr("width", offset + cellSize * attributes.length)
      .attr("height", offset + cellSize * attributes.length)
      ;

    svg.append("g")
      .attr("id", "co-occurrence-row-labels")
      .selectAll(".row-label")
      .data(attributes)
      .enter()
      .append("text")
      .classed("row-label", true)
      .text(function(d) {return d;})
      .each(function(d) {
        var width = this.getBBox().width;
        if (width > offset) {
          offset = width;
        }
      })
      .attr("text-anchor", "end")
      .attr("transform", function(_, i) {
        var x = offset,
          y = cellSize * (i + 1) + offset;
        return "translate(" + x + "," + y + ")";
      })
      ;

    svg.append("g")
      .attr("id", "co-occurrence-column-labels")
      .selectAll(".column-label")
      .data(attributes)
      .enter()
      .append("text")
      .classed("column-label", true)
      .text(function(d) {return d;})
      .attr("text-anchor", "start")
      .attr("transform", function(_, i) {
        var x = cellSize * (i + 1) + offset;
          y = offset;
        return "translate(" + x + "," + y + ")rotate(-90)";
      })
      ;

    svg.append("g")
      .attr("id", "co-occurrence-matrix")
      .selectAll(".co-occurrence-matrix-row")
      .data(matrix)
      .enter()
      .append("g")
      .classed("co-occurrence-matrix-row", true)
      .selectAll(".co-occurrence-matrix-cell")
      .data(function(d) {return d;})
      .enter()
      .append("rect")
      .classed("co-occurrence-matrix-cell", true)
      .attr("width", cellSize - 2)
      .attr("height", cellSize - 2)
      .attr("transform", function(d) {
        var x = d.i * cellSize + offset + 1,
          y = d.j * cellSize + offset + 1;
        return "translate(" + x + "," + y + ")";
      })
      .attr("fill", function(d) {
        var k = data.meta.metrics.length;
        if (d.i > k && d.j > k) {
          return "#0f0";
        } else if (d.i > k || d.j > k) {
          return "#0ff";
        } else  {
          return "#00f";
        }
      })
      .attr("opacity", function(d) {
        return countScale(d.count);
      })
      ;

  }

  d3.json("data/vistrend.json", draw);
});
