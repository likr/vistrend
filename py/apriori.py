from __future__ import print_function
import os
import json
from functools import reduce


def entry_count(entries, c):
    return len([entry for entry in entries
                if all([item in entry for item in c])])


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
    return reduce(lambda a, b: a | b, L)


def main():
    infilename = os.path.dirname(__file__) + '/../public/data/vistrend.json'
    outfilename = os.path.dirname(__file__) + '/../public/data/association.json'
    data = json.load(open(infilename))
    entries = []
    for entry in data['entries']:
        attributes = set()
        for metric in data['meta']['metrics']:
            if entry['metrics'][metric]:
                attributes.add(metric)
        for method in data['meta']['methods']:
            if entry['methods'][method]:
                attributes.add(method)
        entries.append(attributes)
    items = data['meta']['metrics'] + data['meta']['methods']
    minsup = len(entries) // 10
    minsup = 1
    res = apriori(entries, items, minsup)
    rep = [{'attributes': list(s), 'count': entry_count(entries, s)} for s in res]
    rep.sort(key=lambda s: s['count'], reverse=True)
    for e in rep:
        print(e['count'], ', '.join(e['attributes']))
    json.dump(rep, open(outfilename, 'w'))


if __name__ == '__main__':
    main()
