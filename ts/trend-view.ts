/// <reference path="ts-definitions/DefinitelyTyped/d3/d3.d.ts"/>
/// <reference path="vistrend-view.ts" />

module VisTrend {
  export class TrendView extends VisTrendView {
    init(articles : Article[]) : VisTrendView {
      this.rootSelection()
        .append("svg")
        .classed("metric-graph", true)
        .attr("width", this.graphMargin() * 2 + this.graphWidth() + this.legendWidth())
        .attr("height", this.graphMargin() * 2 + this.graphHeight())
        .call(selection => {
          this.initGraph(selection, this.metrics());
        })
        ;
      this.rootSelection()
        .append("svg")
        .classed("method-graph", true)
        .attr("width", this.graphMargin() * 2 + this.graphWidth() + this.legendWidth())
        .attr("height", this.graphMargin() * 2 + this.graphHeight())
        .call(selection => {
          this.initGraph(selection, this.methods());
        })
        ;

      return this;
    }

    draw(articles : Article[]) : VisTrendView {
      var articleCount = {};
      this.years().forEach(year => {
        articleCount[year] = 0;
      });
      var metricData = {};
      this.metrics().forEach(metric => {
        metricData[metric] = {};
        return this.years().map(year => {
          metricData[metric][year] = 0;
        });
      });
      var methodData = {};
      this.methods().forEach(method => {
        methodData[method] = {};
        return this.years().map(year => {
          methodData[method][year] = 0;
        });
      });
      articles.forEach(article => {
        articleCount[article.year] += 1;
        this.metrics().forEach(metric => {
          if (article.metrics[metric]) {
            metricData[metric][article.year] += 1;
          }
        });
        this.methods().forEach(method => {
          if (article.methods[method]) {
            methodData[method][article.year] += 1;
          }
        });
      });
      metricData = this.metrics().map(metric => {
        return {
          name : metric,
          data : this.years().map(year => {
            return {
              year : year,
              ratio : metricData[metric][year] / articleCount[year] || 0,
            };
          }),
        }
      });
      methodData = this.methods().map(method => {
        return {
          name : method,
          data : this.years().map(year => {
            return {
              year : year,
              ratio : methodData[method][year] / articleCount[year] || 0,
            };
          }),
        }
      });

      this.rootSelection().selectAll(".x.axis")
        .call(this.yearAxis())
        ;
      this.drawAttributes(this.rootSelection().select("svg.metric-graph g.grapharea"), metricData);
      this.drawAttributes(this.rootSelection().select("svg.method-graph g.grapharea"), methodData);
      return this;
    }

    private initGraph(selection, attributes) {
      var yearAxis = this.yearAxis();
      selection.append("g")
        .classed("x", true)
        .classed("axis", true)
        .attr("transform", "translate(" + this.graphMargin() + "," + (this.graphMargin() + this.graphHeight()) + ")")
        .call(yearAxis)
        .call(selection => {
          selection.append("text")
            .text("year")
            .attr("x", this.graphWidth() / 2)
            .attr("y", this.graphMargin() - 5)
            .attr("text-anchor", "middle")
            ;
          selection.select("path")
            .attr("stroke", "black")
            .attr("stroke-width", "2")
            .attr("fill", "none")
            ;
        })
        ;

      var ratioAxis = this.ratioAxis();
      selection.append("g")
        .classed("y", true)
        .classed("axis", true)
        .attr("transform", "translate(" + this.graphMargin() + "," + this.graphMargin() + ")")
        .call(ratioAxis)
        .call(selection => {
          selection.append("text")
            .text("ratio")
            .attr("transform", "rotate(90," + -this.graphMargin() + ",0)")
            .attr("x", this.graphHeight() / 2)
            .attr("y", 0)
            .attr("text-anchor", "middle")
            ;
          selection.select("path")
            .attr("stroke", "black")
            .attr("stroke-width", "2")
            .attr("fill", "none")
            ;
        })
        ;

      selection.append("g")
        .classed("grapharea", true)
        .attr("transform", "translate(" + this.graphMargin() + "," + this.graphMargin() + ")")
        ;

      var legendRowSize = this.legendRowSize();
      var color = this.attributeColor;
      selection.append("g")
        .attr("transform", "translate(" + (this.graphWidth() + this.graphMargin()) + "," + this.graphMargin() + ")")
        .selectAll("g.legend")
        .data(attributes)
        .enter()
        .append("g")
        .classed("legend", true)
        .call(function(selection) {
          selection.append("rect")
            .attr("width", legendRowSize - 2)
            .attr("height", legendRowSize - 2)
            .attr("fill", color)
            .attr("transform", "translate(1, 4)")
            ;
          selection.append("text")
            .text(function(d) {
              return d;
            })
            .attr("transform", "translate(" + legendRowSize + "," + legendRowSize + ")")
            ;
        })
        .attr("transform", function(_, i) {
          return "translate(0, " + i * legendRowSize + ")";
        })
        ;
    }

    private drawAttributes(selection, data) {
      var yearScale = this.yearScale();
      var ratioScale = this.ratioScale();
      var line = d3.svg.line()
        .x(d => yearScale(d.year))
        .y(d => ratioScale(d.ratio))
        ;

      selection.selectAll("g.line")
        .data(data, d => d.name)
        .call(selection => {
          selection.exit()
            .remove()
            ;
          selection.enter()
            .append("g")
            .classed("line", true)
            .append("path")
            .attr("stroke", d => this.attributeColor(d.name))
            .attr("stroke-width", "2")
            .attr("fill", "none")
            ;
          selection.call(selection => {
            selection.selectAll("circle")
              .data(d => d.data, d => d.year)
              .call(selection => {
                selection.exit()
                  .remove()
                  ;
                selection.enter()
                  .append("circle")
                  ;
                selection
                  .transition()
                  .attr("x", d => yearScale(d.year))
                  .attr("y", d => ratioScale(d.ratio))
                  ;
              })
              ;
            selection.select("path")
              .transition()
              .attr("d", d => line(d.data))
              ;
          })
          ;
        })
        ;
    }

    private graphMargin() : number {
      return 45;
    }

    private graphWidth() : number {
      return 350;
    }

    private graphHeight() : number {
      return 400;
    }

    private legendWidth() : number {
      return 120;
    }

    private legendRowSize() : number {
      return 16;
    }

    private yearScale() {
      return d3.scale.linear()
        .domain(d3.extent(this.years()))
        .range([0, this.graphWidth()])
        ;
    }

    private ratioScale() {
      return d3.scale.linear()
        .domain([0, 1])
        .range([this.graphHeight(), 0])
        ;
    }

    private yearAxis() {
      return d3.svg.axis()
        .scale(this.yearScale())
        .tickFormat(d3.format("d"))
        ;
    }

    private ratioAxis() {
      return d3.svg.axis()
        .scale(this.ratioScale())
        .orient("left")
        ;
    }

    private attributeColor = d3.scale.category20();
  }
}
