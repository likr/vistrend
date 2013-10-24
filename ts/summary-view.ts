/// <reference path="ts-definitions/DefinitelyTyped/d3/d3.d.ts"/>
/// <reference path="vistrend-view.ts" />

module VisTrend {
  export class SummaryView extends VisTrendView {
    private graph1Max : number = 0;
    private graph2Max : number = 0;
    private graph3Max : number = 0;
    private graph4Max : number = 0;

    init(articles : Article[]) : VisTrendView {
      var summary = this.summary(articles);

      this.graph1Max = d3.max(this.categories(), category => {
        return d3.max(this.years(), year => {
          return summary[category][year];
        });
      });

      this.graph2Max = d3.max(this.years(), year => {
        return d3.sum(this.categories(), category => {
          return summary[category][year];
        });
      });

      this.graph3Max = d3.max(this.categories(), category => {
        return d3.sum(this.years(), year => {
          return summary[category][year];
        });
      });

      this.graph4Max = articles.length;

      this.rootSelection()
        .append("svg")
        .classed("graph1", true)
        .attr("width", this.graphMargin() * 2 + this.graphWidth())
        .attr("height", this.graphMargin() * 2 + this.graphHeight())
        .call(selection => {
          this.initGraph(selection, this.graph1Max);
        })
        ;
      this.rootSelection()
        .append("svg")
        .classed("graph2", true)
        .attr("width", this.graphMargin() * 2 + this.graphWidth())
        .attr("height", this.graphMargin() * 2 + this.graphHeight())
        .call(selection => {
          this.initGraph(selection, this.graph2Max);
        })
        ;
      this.rootSelection()
        .append("svg")
        .classed("graph3", true)
        .attr("width", this.graphMargin() * 2 + this.graphWidth())
        .attr("height", this.graphMargin() * 2 + this.graphHeight())
        .call(selection => {
          this.initGraph(selection, this.graph3Max);
        })
        ;
      this.rootSelection()
        .append("svg")
        .classed("graph4", true)
        .attr("width", this.graphMargin() * 2 + this.graphWidth())
        .attr("height", this.graphMargin() * 2 + this.graphHeight())
        .call(selection => {
          this.initGraph(selection, this.graph4Max);
        })
        ;

      return this;
    }

    private initGraph(selection, countMax) {
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

      var countAxis = this.countAxis(countMax);
      selection.append("g")
        .classed("y", true)
        .classed("axis", true)
        .attr("transform", "translate(" + this.graphMargin() + "," + this.graphMargin() + ")")
        .call(countAxis)
        .call(selection => {
          selection.append("text")
            .text("number of articles")
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
    }

    draw(articles : Article[]) : VisTrendView {
      var graph1Data = this.summary(articles);
      var graph2Data = this.accumulateCategory(graph1Data);
      var graph3Data = this.accumulateYear(graph1Data);
      var graph4Data = this.accumulateCategory(graph3Data);

      this.rootSelection().selectAll(".x.axis")
        .call(this.yearAxis())
        ;
      this.drawSummary(this.rootSelection().select("svg.graph1 g.grapharea"), graph1Data, this.graph1Max, false);
      this.drawSummary(this.rootSelection().select("svg.graph2 g.grapharea"), graph2Data, this.graph2Max, true);
      this.drawSummary(this.rootSelection().select("svg.graph3 g.grapharea"), graph3Data, this.graph3Max, false);
      this.drawSummary(this.rootSelection().select("svg.graph4 g.grapharea"), graph4Data, this.graph4Max, true);

      return this;
    }

    private graphMargin() : number {
      return 50;
    }

    private graphWidth() : number {
      return 400;
    }

    private graphHeight() : number {
      return 400;
    }

    private categoryColor(category : string) : string {
      return {
        "SciVis" : "red",
        "InfoVis" : "green",
        "VAST" : "blue",
      }[category];
    }

    private yearScale() {
      return d3.scale.linear()
        .domain(d3.extent(this.years()))
        .range([0, this.graphWidth()])
        ;
    }

    private countScale(countMax) {
      return d3.scale.linear()
        .domain([0, countMax])
        .range([this.graphHeight(), 0])
        ;
    }

    private yearAxis() {
      return d3.svg.axis()
        .scale(this.yearScale())
        .tickFormat(d3.format("d"))
        ;
    }

    private countAxis(countMax) {
      return d3.svg.axis()
        .scale(this.countScale(countMax))
        .orient("left")
        ;
    }

    private drawSummary(selection, summary, countMax, fill) {
      var yearScale = this.yearScale();
      var countScale = this.countScale(countMax);
      var line = d3.svg.line()
        .x(d => yearScale(d.year))
        .y(d => countScale(d.count))
        ;
      if (fill) {
        line = d3.svg.area()
          .x(d => yearScale(d.year))
          .y0(this.graphHeight())
          .y1(d => countScale(d.count))
          ;
      }

      var data = this.categories().map(category => {
        return {
          category : category,
          data : this.years().map(year => {
            return {
              year : year,
              count : summary[category][year],
            };
          }),
        };
      });

      selection.selectAll("g.line")
        .data(data, d => d.category)
        .call(selection => {
          selection.exit()
            .remove()
            ;
          selection.enter()
            .append("g")
            .classed("line", true)
            .append("path")
            .attr("stroke", d => fill ? "black" : this.categoryColor(d.category))
            .attr("stroke-width", "2")
            .attr("fill", d => fill ? this.categoryColor(d.category) : "none")
            ;
          selection.call(selection => {
            selection.sort((d1, d2) => {
                return d2.data[0].count - d1.data[0].count;
              })
              ;
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
                  .attr("y", d => countScale(d.count))
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

    private emptySummary() {
      var result = {};

      this.categories().forEach(category => {
        result[category] = {};
        this.years().forEach(year => {
          result[category][year] = 0;
        });
      });

      return result;
    }

    private summary(articles : Article[]) {
      var result = this.emptySummary();

      articles.forEach(article => {
        if (result[article.category][article.year] !== undefined) {
          result[article.category][article.year] += 1;
        }
      });

      return result;
    }

    private accumulateYear(summary) {
      var result = this.emptySummary();

      this.categories().forEach(category => {
        var v = 0;
        this.years().forEach(year => {
          v += summary[category][year];
          result[category][year] = v;
        });
      });

      return result;
    }

    private accumulateCategory(summary) {
      var result = this.emptySummary();

      this.years().forEach(year => {
        var v = 0;
        this.categories().forEach(category => {
          v += summary[category][year];
          result[category][year] = v;
        });
      });

      return result;
    }
  }
}
