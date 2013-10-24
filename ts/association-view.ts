/// <reference path="ts-definitions/DefinitelyTyped/d3/d3.d.ts"/>
/// <reference path="vistrend-view.ts" />

module VisTrend {
  export class AssociationView extends VisTrendView {
    private associations = [];
    private maxAssociationCount = 0;

    init(articles : Article[]) : VisTrendView {
      d3.json("data/association.json", data => {
        this.associations = data;
        this.maxAssociationCount = d3.max(this.associations, association => {
          return association.count;
        });
      });

      this.rootSelection()
        .append("table")
        .append("tr")
        .call(selection => {
          selection.append("th")
            .style("width", "450px")
            .style("padding-right", "10px")
            .append("span")
            .style("float", "right")
            .text("Attributes")
            ;
          selection.append("th")
            .style("width", "550")
            .style("padding-left", "10px")
            .append("span")
            .style("float", "left")
            .text("Frequency")
            ;
        })
        ;

      return this;
    }

    draw(articles : Article[]) : VisTrendView {
      this.associations.forEach(function(association) {
        association.count = articles.filter(function(entry) {
          return association.attributes.every(function(attribute) {
            return entry.attributes[attribute];
          });
        }).length;
      });
      var associations = this.associations.filter(function(association) {
        return association.count > 0;
      });

      var scale = d3.scale.linear()
        .domain([0, this.maxAssociationCount])
        .range([0, 400])
        ;

      this.rootSelection().select("table")
        .selectAll(".association")
        .data(associations, function(association) {
          return association.attributes.join();
        })
        .call((selection : D3.UpdateSelection) => {
          selection.exit()
            .remove()
            ;
          selection.enter()
            .append("tr")
            .classed("association", true)
            .call(function(selection) {
              selection.append("td")
                .attr("data-toggle", "tooltip")
                //.each(function(d) {
                //  $(this).tooltip({
                //    html : true,
                //    title : d.attributes.join("<br/>")
                //  });
                //})
                .classed("attributes", true)
                .style("float", "right")
                .append("span")
                //.style("font-size", "8pt")
                ;
              selection.append("td")
                .classed("frequency", true)
                .call(function(selection) {
                  selection.append("div")
                    .style("float", "left")
                    .style("height", "20px")
                    .style("background-color", "blue")
                    ;
                  selection.append("span")
                    ;
                })
                ;
            })
            ;
        })
        ;
      this.rootSelection().selectAll(".association")
        .sort(function(a, b) {
          if (b.count == a.count) {
            return a.attributes.join() < b.attributes.join() ? -1 : 1;
          } else {
            return b.count - a.count;
          }
        })
        .call(function(selection) {
          selection.select(".attributes span")
            .text(function(d) {
              var s = d.attributes.join();
              var maxSize = 60;
              if (s.length > maxSize) {
                return s.substr(0, maxSize) + "...";
              } else {
                return s;
              }
            })
            ;
          selection.select(".frequency")
            .call(function(selection) {
              selection.select("div")
                .style("width", function(d) {
                  return scale(d.count) + "px";
                })
                ;
              selection.select("span")
                .text(function(d) {
                  var percentage = (d.count / articles.length * 100).toFixed(2);
                  return d.count + "(" + percentage + "%)";
                })
                ;
            })
            ;
        })
        ;
      return this;
    }
  }
}
