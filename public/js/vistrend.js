$(function () {
  var filteredArticles = [];

  function filterArticles(entries) {
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
        if (!this.checked) {
          filterAttributes.push(d);
        }
      })
    ;
    d3.selectAll(".method input")
      .each(function(d) {
        if (!this.checked) {
          filterAttributes.push(d);
        }
      })
    ;
    return entries.filter(function(entry) {
      return  yearFrom <= entry.year && entry.year <= yearTo &&
        filterCategory[entry.category] &&
        !filterAttributes.some(function(attribute) {
          return entry.attributes[attribute];
        });
    });
  }

  function draw() {
    d3.select("#view-tab-headers .active")
      .datum()
      .draw(filteredArticles)
      ;
  }

  var summaryView = new VisTrend.SummaryView()
    .id("summary-view")
    .title("Summary")
    ;
  var trendView = new VisTrend.TrendView()
    .id("trend-view")
    .title("Trend")
    ;
  var associationView = new VisTrend.AssociationView()
    .id("association-view")
    .title("Association")
    ;
  var sankeyView = new VisTrend.SankeyView()
    .id("sankey-view")
    .title("Sankey")
    ;
  var coOccurrenceView = new VisTrend.CoOccurrenceView()
    .id("co-occurrence-view")
    .title("Co-Ocurrence")
    ;
  var views = [
    summaryView,
    trendView,
    associationView,
    sankeyView,
    coOccurrenceView,
  ];

  d3.json('data/vistrend.json', function (data) {
    var entryCount = data.entries.length,
      maxAssociationCount = entryCount,
      entries = data.entries,
      associations = [];

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

    views.forEach(function(view) {
      view
        .categories(["SciVis", "InfoVis", "VAST"])
        .metrics(data.meta.metrics)
        .methods(data.meta.methods)
        .years([2006, 2007, 2008, 2009, 2010, 2011, 2012, 2013])
        ;
    });
    d3.select("ul#view-tab-headers")
      .selectAll("li.view-tab-header")
      .data(views)
      .enter()
      .append("li")
      .classed("view-tab-header", true)
      .classed("active", function(_, i) {
        return i === 0 ? true : false;
      })
      .append("a")
      .attr("href", function(view) {
        return "#" + view.id();
      })
      .attr("data-toggle", "tab")
      .text(function(view) {
        return view.title();
      })
      ;
    d3.select("div#view-tab-contents")
      .selectAll("div.tab-pane")
      .data(views)
      .enter()
      .append("div")
      .attr("id", function(view) {
        return view.id();
      })
      .classed("tab-pane", true)
      .classed("active", function(_, i) {
        return i === 0 ? true : false;
      })
      .each(function(view) {
        view.init(data.entries);
      })
      ;

    var url = document.location.toString();
    if (url.match('#')) {
      $('.nav-tabs a[href=#' + url.split('#')[1] + ']').tab('show');
    }
    $('.nav-tabs a').on('shown.bs.tab', function(e) {
      draw();
    });

    filteredArticles = entries;
    draw();

    d3.selectAll("#filteredCount, #entryCount")
      .text(entryCount)
    ;

    function update() {
      var categories = d3.selectAll("#categories .category input")
        .filter(function() {
          return this.checked;
        })
        .data()
        ;
      var metrics = d3.selectAll("#metrics .metric input")
        .filter(function() {
          return this.checked;
        })
        .data()
        ;
      var methods = d3.selectAll("#methods .method input")
        .filter(function() {
          return this.checked;
        })
        .data()
        ;
      var yearFrom = +d3.select("#yearFrom").node().value;
      var yearTo = +d3.select("#yearTo").node().value;
      var i;
      var years = [];
      if (yearFrom < yearTo) {
        for (i = yearFrom; i <= yearTo; ++i) {
          years.push(i);
        }
      }

      d3.selectAll("#view-tab-headers .view-tab-header")
        .each(function(view) {
          view
            .categories(categories)
            .metrics(metrics)
            .methods(methods)
            .years(years)
            ;
        })
        ;
      filteredArticles = filterArticles(entries);
      d3.selectAll("#filteredCount")
        .text(filteredArticles.length)
        ;
      draw();
    }

    d3.selectAll("#yearFrom, #yearTo")
      .on("change", update)
      .selectAll(".year")
      .data([2006, 2007, 2008, 2009, 2010, 2011, 2012, 2013])
      .enter()
      .append("option")
      .text(function(d) {
        return d;
      })
      ;
    d3.select("#yearTo").node().value = 2013;

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
  });
});
