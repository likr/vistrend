/// <reference path="ts-definitions/DefinitelyTyped/d3/d3.d.ts"/>
/// <reference path="vistrend-view.ts" />

module VisTrend {
  export class CoOccurrenceView extends VisTrendView {
    private metricsCount = 0;
    private attributes = [];

    init(articles : Article[]) : VisTrendView {
      var attributes = this.attributes = this.metrics().concat(this.methods());
      var matrix = attributes.map(function(rowAttribute, i) {
        return attributes.map(function(columnAttribute, j) {
          return {
              i : i,
              j : j,
              count : d3.sum(articles, (entry : any) => {
                if (entry.attributes[rowAttribute] && entry.attributes[columnAttribute]) {
                  return 1;
                } else {
                  return 0;
                }
              })
          };
        });
      });

      this.metricsCount = this.metrics().length;

      var cellSize = this.cellSize();
      var offset = this.legendSize();
      var svgSize = offset + cellSize * (this.metrics().length + this.methods().length);
      var svg = this.rootSelection()
        .append("svg")
        .attr("width", svgSize)
        .attr("height", svgSize)
        ;

      svg.append("g")
        .attr("class", "co-occurrence-row-labels")
        .selectAll(".row-label")
        .data(attributes)
        .enter()
        .append("text")
        .attr("y", -2)
        .classed("row-label", true)
        .text(function(d) {return d;})
        .attr("text-anchor", "end")
        .attr("transform", function(_, i) {
          var x = offset,
            y = cellSize * (i + 1) + offset;
          return "translate(" + x + "," + y + ")";
        })
        ;

      svg.append("g")
        .attr("class", "co-occurrence-column-labels")
        .selectAll(".column-label")
        .data(attributes)
        .enter()
        .append("text")
        .attr("y", -2)
        .classed("column-label", true)
        .text(function(d) {return d;})
        .attr("text-anchor", "start")
        .attr("transform", function(_, i) {
          var x = cellSize * (i + 1) + offset;
          var y = offset;
          return "translate(" + x + "," + y + ")rotate(-90)";
        })
        ;

      svg.append("g")
        .attr("class", "co-occurrence-matrix")
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
        .attr("fill", (d) => {
          var k = this.metricsCount;
          if (d.i >= k && d.j >= k) {
            return "#0f0";
          } else if (d.i >= k || d.j >= k) {
            return "#0ff";
          } else  {
            return "#00f";
          }
        })
        ;

      return this;
    }

    draw(articles : Article[]) : VisTrendView {
      var attributes = this.attributes;
      var matrix = attributes.map(function(rowAttribute, i) {
        return attributes.map(function(columnAttribute, j) {
          return {
              i : i,
              j : j,
              count : d3.sum(articles, (entry : any) => {
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
      this.rootSelection()
        .selectAll(".co-occurrence-matrix-row")
        .data(matrix)
        .selectAll(".co-occurrence-matrix-cell")
        .data(d => d)
        .attr("opacity", (d) => {
          return countScale(d.count);
        })
        ;

      return this;
    }

    private cellSize() {
      return 16;
    }

    private legendSize() {
      return 230;
    }
  }
}
