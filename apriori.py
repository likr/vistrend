from __future__ import print_function
import csv
import json
from functools import reduce


def entry_count(entries, c):
    return len([entry for entry in entries
        if all([item in entry['attributes'] for item in c])])


def gen(L0, items):
    C = set()
    for c in L0:
        for item in items:
            new_c = frozenset(c | set([item]))
            if all((new_c - set([item])) in L0 for item in new_c):
                C.add(new_c)
    return C


def apriori(entries, items, minsup):
    C = set(c for c in [frozenset([item]) for item in items]
            if entry_count(entries, c) >= minsup)
    L = [C]
    k = 1

    while L[k - 1]:
        L.append(set([c for c in gen(L[k - 1], items)
            if entry_count(entries, c) >= minsup]))
        k += 1
    return L


def main():
    data = json.load(open('vistrend.json'))
    for entry in data['entries']:
        entry['attributes'] = set()
        for metric in data['meta']['metrics']:
            if entry['metrics'][metric]:
                entry['attributes'].add(metric)
        for method in data['meta']['methods']:
            if entry['methods'][method]:
                entry['attributes'].add(method)
    items = data['meta']['metrics'] + data['meta']['methods']
    minsup = len(data['entries']) // 10
    minsup = 1
    res = reduce(lambda a, b : a | b, apriori(data['entries'], items, minsup))
    rep = [{'attributes' : list(s), 'count' : entry_count(data['entries'], s)}
            for s in res]
    rep.sort(key=lambda s : s['count'], reverse=True)
    for e in rep:
        print(e['count'], ', '.join(e['attributes']))
    json.dump(rep, open('association.json', 'w'))


if __name__ == '__main__':
    main()
