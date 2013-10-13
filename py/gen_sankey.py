#!/usr/bin/env python
# coding: utf-8

from __future__ import print_function
import csv
import json
import os.path
import conv
import apriori


def main():
    infilename = os.path.dirname(__file__) + '/../vistrend.csv'
    outfilename = os.path.dirname(__file__) + '/../public/data/sankey.json'
    data = [conv.conv_row(row) for row in csv.reader(open(infilename))]
    categories = ['SciVis', 'InfoVis', 'VAST']

    metrics = set(conv.metrics)
    metrics_entries = [set(k for k, v in row['metrics'].items() if v) for row in data]
    metrics_sets = [s for s in apriori.apriori(metrics_entries, conv.metrics, 1)
                    if any(all(row['metrics'][m] for m in s)
                           and all(not row['metrics'][m] for m in metrics - s)
                           for row in data)]
    methods = set(conv.methods)
    methods_entries = [set(k for k, v in row['methods'].items() if v) for row in data]
    methods_sets = [s for s in apriori.apriori(methods_entries, conv.methods, 1)
                    if any(all(row['methods'][m] for m in s)
                           and all(not row['methods'][m] for m in methods - s)
                           for row in data)]

    metrics_offset = len(categories)
    methods_offset = metrics_offset + len(metrics_sets)

    nodes = []
    for category in categories:
        nodes.append({
            'name': category,
            'items': [category],
        })
    for metrics_set in metrics_sets:
        nodes.append({
            'name': ', '.join(metrics_set),
            'items': list(metrics_set),
        })
    for methods_set in methods_sets:
        nodes.append({
            'name': ', '.join(methods_set),
            'items': list(methods_set),
        })

    links = []
    for i, category in enumerate(categories):
        for j, metrics_set in enumerate(metrics_sets):
            j += metrics_offset
            count = len([row for row in data
                         if row['category'] == category
                         and all(row['metrics'][m] for m in metrics_set)
                         and all(not row['metrics'][m] for m in metrics - metrics_set)])
            if count > 0:
                links.append({
                    'source': i,
                    'target': j,
                    'value': count,
                })
    for i, metrics_set in enumerate(metrics_sets):
        i += metrics_offset
        for j, methods_set in enumerate(methods_sets):
            j += methods_offset
            count = len([row for row in data
                         if all(row['metrics'][m] for m in metrics_set)
                         and all(not row['metrics'][m] for m in metrics - metrics_set)
                         and all(row['methods'][m] for m in methods_set)
                         and all(not row['methods'][m] for m in methods - methods_set)])
            if count > 0:
                links.append({
                    'source': i,
                    'target': j,
                    'value': count,
                })
    json.dump({
        'nodes': nodes,
        'links': links,
    }, open(outfilename, 'w'))


if __name__ == '__main__':
    main()
