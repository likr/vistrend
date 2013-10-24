var SummaryView;

$(function() {
  function range(from, to, setp=1) {
    var result = [];
    var i;
    for (i = from; i < to; i += step) {
      result.push(i);
    }
    return result;
  }

  function summary(articles) {
    var result = {};
    var yearExtent = d3.extent(articles, function(article) {
      return article.year;
    });
    var years = range(yearExtent[0], yearExtent[1]);
    years.forEach(function(article) {
    });
    
  }

  SummaryView = function() {
    this.categories = [];
    this.metrics = [];
    this.methods = [];
    this.years = [];
  };

  SummaryView.title = "Summary";

  SummaryView.init = function(articles, metrics, methods) {
  };

  SummaryView.draw = function(articles) {
  };
});
