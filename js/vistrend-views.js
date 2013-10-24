/// <reference path="ts-definitions/DefinitelyTyped/d3/d3.d.ts"/>
var VisTrend;
(function (VisTrend) {
    var VisTrendView = (function () {
        function VisTrendView() {
            this.id_ = "";
            this.categories_ = [];
            this.metrics_ = [];
            this.methods_ = [];
            this.years_ = [];
            this.title_ = "";
        }
        VisTrendView.prototype.id = function (arg) {
            if (arg === undefined) {
                return this.id_;
            }
            this.id_ = arg;
            return this;
        };

        VisTrendView.prototype.categories = function (arg) {
            if (arg === undefined) {
                return this.categories_;
            }
            this.categories_ = arg;
            return this;
        };

        VisTrendView.prototype.metrics = function (arg) {
            if (arg === undefined) {
                return this.metrics_;
            }
            this.metrics_ = arg;
            return this;
        };

        VisTrendView.prototype.methods = function (arg) {
            if (arg === undefined) {
                return this.methods_;
            }
            this.methods_ = arg;
            return this;
        };

        VisTrendView.prototype.years = function (arg) {
            if (arg === undefined) {
                return this.years_;
            }
            this.years_ = arg;
            return this;
        };

        VisTrendView.prototype.title = function (arg) {
            if (arg === undefined) {
                return this.title_;
            }
            this.title_ = arg;
            return this;
        };

        VisTrendView.prototype.rootSelection = function () {
            return d3.select("#" + this.id());
        };

        VisTrendView.prototype.init = function (articles) {
            return this;
        };

        VisTrendView.prototype.draw = function (articles) {
            return this;
        };
        return VisTrendView;
    })();
    VisTrend.VisTrendView = VisTrendView;
})(VisTrend || (VisTrend = {}));
/// <reference path="ts-definitions/DefinitelyTyped/d3/d3.d.ts"/>
/// <reference path="vistrend-view.ts" />
var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var VisTrend;
(function (VisTrend) {
    var SummaryView = (function (_super) {
        __extends(SummaryView, _super);
        function SummaryView() {
            _super.apply(this, arguments);
            this.graph1Max = 0;
            this.graph2Max = 0;
            this.graph3Max = 0;
            this.graph4Max = 0;
        }
        SummaryView.prototype.init = function (articles) {
            var _this = this;
            var summary = this.summary(articles);

            this.graph1Max = d3.max(this.categories(), function (category) {
                return d3.max(_this.years(), function (year) {
                    return summary[category][year];
                });
            });

            this.graph2Max = d3.max(this.years(), function (year) {
                return d3.sum(_this.categories(), function (category) {
                    return summary[category][year];
                });
            });

            this.graph3Max = d3.max(this.categories(), function (category) {
                return d3.sum(_this.years(), function (year) {
                    return summary[category][year];
                });
            });

            this.graph4Max = articles.length;

            this.rootSelection().append("svg").classed("graph1", true).attr("width", this.graphMargin() * 2 + this.graphWidth()).attr("height", this.graphMargin() * 2 + this.graphHeight()).call(function (selection) {
                _this.initGraph(selection, _this.graph1Max);
            });
            this.rootSelection().append("svg").classed("graph2", true).attr("width", this.graphMargin() * 2 + this.graphWidth()).attr("height", this.graphMargin() * 2 + this.graphHeight()).call(function (selection) {
                _this.initGraph(selection, _this.graph2Max);
            });
            this.rootSelection().append("svg").classed("graph3", true).attr("width", this.graphMargin() * 2 + this.graphWidth()).attr("height", this.graphMargin() * 2 + this.graphHeight()).call(function (selection) {
                _this.initGraph(selection, _this.graph3Max);
            });
            this.rootSelection().append("svg").classed("graph4", true).attr("width", this.graphMargin() * 2 + this.graphWidth()).attr("height", this.graphMargin() * 2 + this.graphHeight()).call(function (selection) {
                _this.initGraph(selection, _this.graph4Max);
            });

            return this;
        };

        SummaryView.prototype.initGraph = function (selection, countMax) {
            var _this = this;
            var yearAxis = this.yearAxis();
            selection.append("g").classed("x", true).classed("axis", true).attr("transform", "translate(" + this.graphMargin() + "," + (this.graphMargin() + this.graphHeight()) + ")").call(yearAxis).call(function (selection) {
                selection.append("text").text("year").attr("x", _this.graphWidth() / 2).attr("y", _this.graphMargin() - 5).attr("text-anchor", "middle");
                selection.select("path").attr("stroke", "black").attr("stroke-width", "2").attr("fill", "none");
            });

            var countAxis = this.countAxis(countMax);
            selection.append("g").classed("y", true).classed("axis", true).attr("transform", "translate(" + this.graphMargin() + "," + this.graphMargin() + ")").call(countAxis).call(function (selection) {
                selection.append("text").text("number of articles").attr("transform", "rotate(90," + -_this.graphMargin() + ",0)").attr("x", _this.graphHeight() / 2).attr("y", 0).attr("text-anchor", "middle");
                selection.select("path").attr("stroke", "black").attr("stroke-width", "2").attr("fill", "none");
            });

            selection.append("g").classed("grapharea", true).attr("transform", "translate(" + this.graphMargin() + "," + this.graphMargin() + ")");
        };

        SummaryView.prototype.draw = function (articles) {
            var graph1Data = this.summary(articles);
            var graph2Data = this.accumulateCategory(graph1Data);
            var graph3Data = this.accumulateYear(graph1Data);
            var graph4Data = this.accumulateCategory(graph3Data);

            this.rootSelection().selectAll(".x.axis").call(this.yearAxis());
            this.drawSummary(this.rootSelection().select("svg.graph1 g.grapharea"), graph1Data, this.graph1Max, false);
            this.drawSummary(this.rootSelection().select("svg.graph2 g.grapharea"), graph2Data, this.graph2Max, true);
            this.drawSummary(this.rootSelection().select("svg.graph3 g.grapharea"), graph3Data, this.graph3Max, false);
            this.drawSummary(this.rootSelection().select("svg.graph4 g.grapharea"), graph4Data, this.graph4Max, true);

            return this;
        };

        SummaryView.prototype.graphMargin = function () {
            return 50;
        };

        SummaryView.prototype.graphWidth = function () {
            return 400;
        };

        SummaryView.prototype.graphHeight = function () {
            return 400;
        };

        SummaryView.prototype.categoryColor = function (category) {
            return {
                "SciVis": "red",
                "InfoVis": "green",
                "VAST": "blue"
            }[category];
        };

        SummaryView.prototype.yearScale = function () {
            return d3.scale.linear().domain(d3.extent(this.years())).range([0, this.graphWidth()]);
        };

        SummaryView.prototype.countScale = function (countMax) {
            return d3.scale.linear().domain([0, countMax]).range([this.graphHeight(), 0]);
        };

        SummaryView.prototype.yearAxis = function () {
            return d3.svg.axis().scale(this.yearScale()).tickFormat(d3.format("d"));
        };

        SummaryView.prototype.countAxis = function (countMax) {
            return d3.svg.axis().scale(this.countScale(countMax)).orient("left");
        };

        SummaryView.prototype.drawSummary = function (selection, summary, countMax, fill) {
            var _this = this;
            var yearScale = this.yearScale();
            var countScale = this.countScale(countMax);
            var line = d3.svg.line().x(function (d) {
                return yearScale(d.year);
            }).y(function (d) {
                return countScale(d.count);
            });
            if (fill) {
                line = d3.svg.area().x(function (d) {
                    return yearScale(d.year);
                }).y0(this.graphHeight()).y1(function (d) {
                    return countScale(d.count);
                });
            }

            var data = this.categories().map(function (category) {
                return {
                    category: category,
                    data: _this.years().map(function (year) {
                        return {
                            year: year,
                            count: summary[category][year]
                        };
                    })
                };
            });

            selection.selectAll("g.line").data(data, function (d) {
                return d.category;
            }).call(function (selection) {
                selection.exit().remove();
                selection.enter().append("g").classed("line", true).append("path").attr("stroke", function (d) {
                    return fill ? "black" : _this.categoryColor(d.category);
                }).attr("stroke-width", "2").attr("fill", function (d) {
                    return fill ? _this.categoryColor(d.category) : "none";
                });
                selection.call(function (selection) {
                    selection.sort(function (d1, d2) {
                        return d2.data[0].count - d1.data[0].count;
                    });
                    selection.selectAll("circle").data(function (d) {
                        return d.data;
                    }, function (d) {
                        return d.year;
                    }).call(function (selection) {
                        selection.exit().remove();
                        selection.enter().append("circle");
                        selection.transition().attr("x", function (d) {
                            return yearScale(d.year);
                        }).attr("y", function (d) {
                            return countScale(d.count);
                        });
                    });
                    selection.select("path").transition().attr("d", function (d) {
                        return line(d.data);
                    });
                });
            });
        };

        SummaryView.prototype.emptySummary = function () {
            var _this = this;
            var result = {};

            this.categories().forEach(function (category) {
                result[category] = {};
                _this.years().forEach(function (year) {
                    result[category][year] = 0;
                });
            });

            return result;
        };

        SummaryView.prototype.summary = function (articles) {
            var result = this.emptySummary();

            articles.forEach(function (article) {
                if (result[article.category][article.year] !== undefined) {
                    result[article.category][article.year] += 1;
                }
            });

            return result;
        };

        SummaryView.prototype.accumulateYear = function (summary) {
            var _this = this;
            var result = this.emptySummary();

            this.categories().forEach(function (category) {
                var v = 0;
                _this.years().forEach(function (year) {
                    v += summary[category][year];
                    result[category][year] = v;
                });
            });

            return result;
        };

        SummaryView.prototype.accumulateCategory = function (summary) {
            var _this = this;
            var result = this.emptySummary();

            this.years().forEach(function (year) {
                var v = 0;
                _this.categories().forEach(function (category) {
                    v += summary[category][year];
                    result[category][year] = v;
                });
            });

            return result;
        };
        return SummaryView;
    })(VisTrend.VisTrendView);
    VisTrend.SummaryView = SummaryView;
})(VisTrend || (VisTrend = {}));
/// <reference path="ts-definitions/DefinitelyTyped/d3/d3.d.ts"/>
/// <reference path="vistrend-view.ts" />
var VisTrend;
(function (VisTrend) {
    var TrendView = (function (_super) {
        __extends(TrendView, _super);
        function TrendView() {
            _super.apply(this, arguments);
            this.attributeColor = d3.scale.category20();
        }
        TrendView.prototype.init = function (articles) {
            var _this = this;
            this.rootSelection().append("svg").classed("metric-graph", true).attr("width", this.graphMargin() * 2 + this.graphWidth() + this.legendWidth()).attr("height", this.graphMargin() * 2 + this.graphHeight()).call(function (selection) {
                _this.initGraph(selection, _this.metrics());
            });
            this.rootSelection().append("svg").classed("method-graph", true).attr("width", this.graphMargin() * 2 + this.graphWidth() + this.legendWidth()).attr("height", this.graphMargin() * 2 + this.graphHeight()).call(function (selection) {
                _this.initGraph(selection, _this.methods());
            });

            return this;
        };

        TrendView.prototype.draw = function (articles) {
            var _this = this;
            var articleCount = {};
            this.years().forEach(function (year) {
                articleCount[year] = 0;
            });
            var metricData = {};
            this.metrics().forEach(function (metric) {
                metricData[metric] = {};
                return _this.years().map(function (year) {
                    metricData[metric][year] = 0;
                });
            });
            var methodData = {};
            this.methods().forEach(function (method) {
                methodData[method] = {};
                return _this.years().map(function (year) {
                    methodData[method][year] = 0;
                });
            });
            articles.forEach(function (article) {
                articleCount[article.year] += 1;
                _this.metrics().forEach(function (metric) {
                    if (article.metrics[metric]) {
                        metricData[metric][article.year] += 1;
                    }
                });
                _this.methods().forEach(function (method) {
                    if (article.methods[method]) {
                        methodData[method][article.year] += 1;
                    }
                });
            });
            metricData = this.metrics().map(function (metric) {
                return {
                    name: metric,
                    data: _this.years().map(function (year) {
                        return {
                            year: year,
                            ratio: metricData[metric][year] / articleCount[year] || 0
                        };
                    })
                };
            });
            methodData = this.methods().map(function (method) {
                return {
                    name: method,
                    data: _this.years().map(function (year) {
                        return {
                            year: year,
                            ratio: methodData[method][year] / articleCount[year] || 0
                        };
                    })
                };
            });

            this.rootSelection().selectAll(".x.axis").call(this.yearAxis());
            this.drawAttributes(this.rootSelection().select("svg.metric-graph g.grapharea"), metricData);
            this.drawAttributes(this.rootSelection().select("svg.method-graph g.grapharea"), methodData);
            return this;
        };

        TrendView.prototype.initGraph = function (selection, attributes) {
            var _this = this;
            var yearAxis = this.yearAxis();
            selection.append("g").classed("x", true).classed("axis", true).attr("transform", "translate(" + this.graphMargin() + "," + (this.graphMargin() + this.graphHeight()) + ")").call(yearAxis).call(function (selection) {
                selection.append("text").text("year").attr("x", _this.graphWidth() / 2).attr("y", _this.graphMargin() - 5).attr("text-anchor", "middle");
                selection.select("path").attr("stroke", "black").attr("stroke-width", "2").attr("fill", "none");
            });

            var ratioAxis = this.ratioAxis();
            selection.append("g").classed("y", true).classed("axis", true).attr("transform", "translate(" + this.graphMargin() + "," + this.graphMargin() + ")").call(ratioAxis).call(function (selection) {
                selection.append("text").text("ratio").attr("transform", "rotate(90," + -_this.graphMargin() + ",0)").attr("x", _this.graphHeight() / 2).attr("y", 0).attr("text-anchor", "middle");
                selection.select("path").attr("stroke", "black").attr("stroke-width", "2").attr("fill", "none");
            });

            selection.append("g").classed("grapharea", true).attr("transform", "translate(" + this.graphMargin() + "," + this.graphMargin() + ")");

            var legendRowSize = this.legendRowSize();
            var color = this.attributeColor;
            selection.append("g").attr("transform", "translate(" + (this.graphWidth() + this.graphMargin()) + "," + this.graphMargin() + ")").selectAll("g.legend").data(attributes).enter().append("g").classed("legend", true).call(function (selection) {
                selection.append("rect").attr("width", legendRowSize - 2).attr("height", legendRowSize - 2).attr("fill", color).attr("transform", "translate(1, 4)");
                selection.append("text").text(function (d) {
                    return d;
                }).attr("transform", "translate(" + legendRowSize + "," + legendRowSize + ")");
            }).attr("transform", function (_, i) {
                return "translate(0, " + i * legendRowSize + ")";
            });
        };

        TrendView.prototype.drawAttributes = function (selection, data) {
            var _this = this;
            var yearScale = this.yearScale();
            var ratioScale = this.ratioScale();
            var line = d3.svg.line().x(function (d) {
                return yearScale(d.year);
            }).y(function (d) {
                return ratioScale(d.ratio);
            });

            selection.selectAll("g.line").data(data, function (d) {
                return d.name;
            }).call(function (selection) {
                selection.exit().remove();
                selection.enter().append("g").classed("line", true).append("path").attr("stroke", function (d) {
                    return _this.attributeColor(d.name);
                }).attr("stroke-width", "2").attr("fill", "none");
                selection.call(function (selection) {
                    selection.selectAll("circle").data(function (d) {
                        return d.data;
                    }, function (d) {
                        return d.year;
                    }).call(function (selection) {
                        selection.exit().remove();
                        selection.enter().append("circle");
                        selection.transition().attr("x", function (d) {
                            return yearScale(d.year);
                        }).attr("y", function (d) {
                            return ratioScale(d.ratio);
                        });
                    });
                    selection.select("path").transition().attr("d", function (d) {
                        return line(d.data);
                    });
                });
            });
        };

        TrendView.prototype.graphMargin = function () {
            return 45;
        };

        TrendView.prototype.graphWidth = function () {
            return 350;
        };

        TrendView.prototype.graphHeight = function () {
            return 400;
        };

        TrendView.prototype.legendWidth = function () {
            return 120;
        };

        TrendView.prototype.legendRowSize = function () {
            return 16;
        };

        TrendView.prototype.yearScale = function () {
            return d3.scale.linear().domain(d3.extent(this.years())).range([0, this.graphWidth()]);
        };

        TrendView.prototype.ratioScale = function () {
            return d3.scale.linear().domain([0, 1]).range([this.graphHeight(), 0]);
        };

        TrendView.prototype.yearAxis = function () {
            return d3.svg.axis().scale(this.yearScale()).tickFormat(d3.format("d"));
        };

        TrendView.prototype.ratioAxis = function () {
            return d3.svg.axis().scale(this.ratioScale()).orient("left");
        };
        return TrendView;
    })(VisTrend.VisTrendView);
    VisTrend.TrendView = TrendView;
})(VisTrend || (VisTrend = {}));
/// <reference path="ts-definitions/DefinitelyTyped/d3/d3.d.ts"/>
/// <reference path="vistrend-view.ts" />
var VisTrend;
(function (VisTrend) {
    var AssociationView = (function (_super) {
        __extends(AssociationView, _super);
        function AssociationView() {
            _super.apply(this, arguments);
            this.associations = [];
            this.maxAssociationCount = 0;
        }
        AssociationView.prototype.init = function (articles) {
            var _this = this;
            d3.json("data/association.json", function (data) {
                _this.associations = data;
                _this.maxAssociationCount = d3.max(_this.associations, function (association) {
                    return association.count;
                });
            });

            this.rootSelection().append("table").append("tr").call(function (selection) {
                selection.append("th").style("width", "450px").style("padding-right", "10px").append("span").style("float", "right").text("Attributes");
                selection.append("th").style("width", "550").style("padding-left", "10px").append("span").style("float", "left").text("Frequency");
            });

            return this;
        };

        AssociationView.prototype.draw = function (articles) {
            this.associations.forEach(function (association) {
                association.count = articles.filter(function (entry) {
                    return association.attributes.every(function (attribute) {
                        return entry.attributes[attribute];
                    });
                }).length;
            });
            var associations = this.associations.filter(function (association) {
                return association.count > 0;
            });

            var scale = d3.scale.linear().domain([0, this.maxAssociationCount]).range([0, 400]);

            this.rootSelection().select("table").selectAll(".association").data(associations, function (association) {
                return association.attributes.join();
            }).call(function (selection) {
                selection.exit().remove();
                selection.enter().append("tr").classed("association", true).call(function (selection) {
                    selection.append("td").attr("data-toggle", "tooltip").classed("attributes", true).style("float", "right").append("span");
                    selection.append("td").classed("frequency", true).call(function (selection) {
                        selection.append("div").style("float", "left").style("height", "20px").style("background-color", "blue");
                        selection.append("span");
                    });
                });
            });
            this.rootSelection().selectAll(".association").sort(function (a, b) {
                if (b.count == a.count) {
                    return a.attributes.join() < b.attributes.join() ? -1 : 1;
                } else {
                    return b.count - a.count;
                }
            }).call(function (selection) {
                selection.select(".attributes span").text(function (d) {
                    var s = d.attributes.join();
                    var maxSize = 60;
                    if (s.length > maxSize) {
                        return s.substr(0, maxSize) + "...";
                    } else {
                        return s;
                    }
                });
                selection.select(".frequency").call(function (selection) {
                    selection.select("div").style("width", function (d) {
                        return scale(d.count) + "px";
                    });
                    selection.select("span").text(function (d) {
                        var percentage = (d.count / articles.length * 100).toFixed(2);
                        return d.count + "(" + percentage + "%)";
                    });
                });
            });
            return this;
        };
        return AssociationView;
    })(VisTrend.VisTrendView);
    VisTrend.AssociationView = AssociationView;
})(VisTrend || (VisTrend = {}));
/// <reference path="ts-definitions/DefinitelyTyped/d3/d3.d.ts"/>
/// <reference path="vistrend-view.ts" />
var VisTrend;
(function (VisTrend) {
    var SankeyView = (function (_super) {
        __extends(SankeyView, _super);
        function SankeyView() {
            _super.apply(this, arguments);
        }
        SankeyView.prototype.init = function (articles) {
            return this;
        };

        SankeyView.prototype.draw = function (articles) {
            return this;
        };
        return SankeyView;
    })(VisTrend.VisTrendView);
    VisTrend.SankeyView = SankeyView;
})(VisTrend || (VisTrend = {}));
/// <reference path="ts-definitions/DefinitelyTyped/d3/d3.d.ts"/>
/// <reference path="vistrend-view.ts" />
var VisTrend;
(function (VisTrend) {
    var CoOccurrenceView = (function (_super) {
        __extends(CoOccurrenceView, _super);
        function CoOccurrenceView() {
            _super.apply(this, arguments);
            this.metricsCount = 0;
            this.attributes = [];
        }
        CoOccurrenceView.prototype.init = function (articles) {
            var _this = this;
            var attributes = this.attributes = this.metrics().concat(this.methods());
            var matrix = attributes.map(function (rowAttribute, i) {
                return attributes.map(function (columnAttribute, j) {
                    return {
                        i: i,
                        j: j,
                        count: d3.sum(articles, function (entry) {
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
            var svg = this.rootSelection().append("svg").attr("width", svgSize).attr("height", svgSize);

            svg.append("g").attr("class", "co-occurrence-row-labels").selectAll(".row-label").data(attributes).enter().append("text").attr("y", -2).classed("row-label", true).text(function (d) {
                return d;
            }).attr("text-anchor", "end").attr("transform", function (_, i) {
                var x = offset, y = cellSize * (i + 1) + offset;
                return "translate(" + x + "," + y + ")";
            });

            svg.append("g").attr("class", "co-occurrence-column-labels").selectAll(".column-label").data(attributes).enter().append("text").attr("y", -2).classed("column-label", true).text(function (d) {
                return d;
            }).attr("text-anchor", "start").attr("transform", function (_, i) {
                var x = cellSize * (i + 1) + offset;
                var y = offset;
                return "translate(" + x + "," + y + ")rotate(-90)";
            });

            svg.append("g").attr("class", "co-occurrence-matrix").selectAll(".co-occurrence-matrix-row").data(matrix).enter().append("g").classed("co-occurrence-matrix-row", true).selectAll(".co-occurrence-matrix-cell").data(function (d) {
                return d;
            }).enter().append("rect").classed("co-occurrence-matrix-cell", true).attr("width", cellSize - 2).attr("height", cellSize - 2).attr("transform", function (d) {
                var x = d.i * cellSize + offset + 1, y = d.j * cellSize + offset + 1;
                return "translate(" + x + "," + y + ")";
            }).attr("fill", function (d) {
                var k = _this.metricsCount;
                if (d.i >= k && d.j >= k) {
                    return "#0f0";
                } else if (d.i >= k || d.j >= k) {
                    return "#0ff";
                } else {
                    return "#00f";
                }
            });

            return this;
        };

        CoOccurrenceView.prototype.draw = function (articles) {
            var attributes = this.attributes;
            var matrix = attributes.map(function (rowAttribute, i) {
                return attributes.map(function (columnAttribute, j) {
                    return {
                        i: i,
                        j: j,
                        count: d3.sum(articles, function (entry) {
                            if (entry.attributes[rowAttribute] && entry.attributes[columnAttribute]) {
                                return 1;
                            } else {
                                return 0;
                            }
                        })
                    };
                });
            });

            var maxCount = d3.max(matrix, function (row) {
                return d3.max(row, function (cell) {
                    return cell.count;
                });
            });
            var countScale = d3.scale.linear().domain([0, maxCount]).range([0, 1]);
            this.rootSelection().selectAll(".co-occurrence-matrix-row").data(matrix).selectAll(".co-occurrence-matrix-cell").data(function (d) {
                return d;
            }).attr("opacity", function (d) {
                return countScale(d.count);
            });

            return this;
        };

        CoOccurrenceView.prototype.cellSize = function () {
            return 16;
        };

        CoOccurrenceView.prototype.legendSize = function () {
            return 230;
        };
        return CoOccurrenceView;
    })(VisTrend.VisTrendView);
    VisTrend.CoOccurrenceView = CoOccurrenceView;
})(VisTrend || (VisTrend = {}));
