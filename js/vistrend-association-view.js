$(function () {
  function draw(entries, associations, maxEntries) {
    associations.forEach(function(association) {
      association.count = entries.filter(function(entry) {
        return association.attributes.every(function(attribute) {
          return entry.attributes[attribute];
        });
      }).length;
    });
    associations = associations.filter(function(association) {
      return association.count > 0;
    });

    var scale = d3.scale.linear()
      .domain([0, maxEntries])
      .range([0, 250])
      ;

  d3.select("#associations")
    .selectAll(".association")
    .data(associations, function(association) {
      return association.attributes.join();
    })
    .call(function (selection) {
      selection.exit()
        .remove()
        ;
      selection.enter()
        .append("tr")
        .classed("association", true)
        .call(function(selection) {
          selection.append("td")
            .attr("data-toggle", "tooltip")
            .each(function(d) {
              $(this).tooltip({
                html : true,
                title : d.attributes.join("<br/>")
              });
            })
            .classed("attributes", true)
            .style("float", "right")
            .style("font-size", "8pt")
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
    d3.selectAll(".association")
      .sort(function(a, b) {
        if (b.count == a.count) {
          return a.attributes.join() < b.attributes.join() ? -1 : 1;
        } else {
          return b.count - a.count;
        }
      })
      .call(function(selection) {
        selection.select(".attributes")
          .text(function(d) {
            var s = d.attributes.join();
            var maxSize = 40;
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
                var percentage = (d.count / entries.length * 100).toFixed(2);
                return d.count + "(" + percentage + "%)";
              })
              ;
          })
          ;
      })
      ;
  }


  function filterEntries(entries) {
    var yearFrom = d3.select("#yearFrom").node().value,
      yearTo = d3.select("#yearTo").node().value,
      filterCategory = {},
      filterAttributes = [];

    d3.selectAll(".category input")
      .each(function(d) {
        if (this.checked) {
          filterCategory[d] = 1;
        }
      })
    ;

    d3.selectAll(".metric input")
      .each(function(d) {
        if (this.checked) {
          filterAttributes.push(d);
        }
      })
    ;
    d3.selectAll(".method input")
      .each(function(d) {
        if (this.checked) {
          filterAttributes.push(d);
        }
      })
    ;
    return entries.filter(function(entry) {
      return  yearFrom <= entry.year && entry.year <= yearTo &&
        filterCategory[entry.category] &&
        filterAttributes.every(function(attribute) {
          return entry.attributes[attribute];
        });
    });
  }


  d3.json('data/vistrend.json', function (data) {
    var entryCount = data.entries.length,
      maxAssociationCount = entryCount,
      entries = data.entries,
      associations = [];

    function update() {
      var filteredEntries = filterEntries(entries);
      d3.select("#filteredCount")
        .text(filteredEntries.length)
        ;
      draw(filteredEntries, associations, maxAssociationCount);
    }

    entries.forEach(function(entry) {
      entry.attributes = {};
      data.meta.metrics.forEach(function(metric) {
        if (entry.metrics[metric]) {
          entry.attributes[metric] = true;
        }
      });
      data.meta.methods.forEach(function(method) {
        if (entry.methods[method]) {
          entry.attributes[method] = true;
        }
      });
    });

    d3.selectAll("#filteredCount, #entryCount")
      .text(entryCount)
    ;

    d3.selectAll("#yearFrom, #yearTo")
      .on("change", update)
      .selectAll(".year")
      .data([2004, 2005, 2006, 2007, 2008, 2009, 2010, 2011, 2012])
      .enter()
      .append("option")
      .text(function(d) {
        return d;
      })
      ;
    d3.select("#yearTo").node().value = 2012;

    d3.select("#categories")
      .selectAll(".category")
      .data(["SciVis", "InfoVis", "VAST"])
      .enter()
      .append("label")
      .classed("checkbox-inline", true)
      .classed("category", true)
      .call(function(selection) {
        selection.append("input")
          .on("change", update)
          .attr("type", "checkbox")
          .each(function() {
            this.checked = true;
          })
          ;
        selection.append("span")
          .text(function(d) {
            return d;
          })
          ;
      })
      ;

    d3.select("#metrics")
      .selectAll(".metric")
      .data(data.meta.metrics)
      .enter()
      .append("label")
      .classed("checkbox-inline", true)
      .classed("metric", true)
      .call(function(selection) {
        selection.append("input")
          .on("change", update)
          .attr("type", "checkbox")
          ;
      selection.append("span")
        .text(function(d) {
          return d;
        })
        ;
      })
      ;
    d3.select("#methods")
      .selectAll(".method")
      .data(data.meta.methods)
      .enter()
      .append("label")
      .classed("checkbox-inline", true)
      .classed("method", true)
      .call(function(selection) {
        selection.append("input")
          .on("change", update)
          .attr("type", "checkbox")
          ;
      selection.append("span")
        .text(function(d) {
          return d;
        })
        ;
      })
      ;

    d3.json("data/association.json", function(data) {
      associations = data;
      maxAssociationCount = d3.max(associations, function(association) {
        return association.count;
      });
      draw(entries, associations, maxAssociationCount);
    });
  });
});
