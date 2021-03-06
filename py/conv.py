from __future__ import print_function
import os.path
import csv
import json


metrics = [
    'Speed',
    'Accuracy',
    'Scalability',
    'Efficiency',
    'Effectiveness',
    'Satisfaction',
    'Utility',
    'Learnability',
    'Adoption',
    'Productivity',
]
methods = [
    'Computational Experiments',
    'Subjective Experiments',
    'Case Study',
    'Comparison with other method',
    'Empirical Analysis',
    'User Study',
    'Theoretical Analysis',
]


def parse_authors(s):
    return [item.strip() for item in s.split(',')]


def parse_index_terms(s):
    return [item.lower().strip() for item in s[:-1].split(',')]


def conv_row(row):
    return {
        'title': row[0],
        'year': int(row[1]),
        'category': row[2],
        'sub category': row[3],
        'authors': parse_authors(row[4]),
        'index terms': parse_index_terms(row[5]),
        'metrics': {
            'Speed': int(row[6]) if row[6] else 0,
            'Accuracy': int(row[7]) if row[7] else 0,
            'Scalability': int(row[8]) if row[8] else 0,
            'Efficiency': int(row[9]) if row[9] else 0,
            'Effectiveness': int(row[10]) if row[10] else 0,
            'Satisfaction': int(row[11]) if row[11] else 0,
            'Utility': int(row[12]) if row[12] else 0,
            'Learnability': int(row[13]) if row[13] else 0,
            'Adoption': int(row[14]) if row[14] else 0,
            'Productivity': int(row[15]) if row[15] else 0,
            },
        'methods': {
            'Computational Experiments': int(row[16]) if row[16] else 0,
            'Subjective Experiments': int(row[17]) if row[17] else 0,
            'Case Study': int(row[18]) if row[18] else 0,
            'Comparison with other method': int(row[19]) if row[19] else 0,
            'Empirical Analysis': int(row[20]) if row[20] else 0,
            'User Study': int(row[21]) if row[21] else 0,
            'Theoretical Analysis': int(row[22]) if row[22] else 0,
        },
    }


def main():
    infilename = os.path.dirname(__file__) + '/../vistrend.csv'
    outfilename = os.path.dirname(__file__) + '/../public/data/vistrend.json'
    infile = open(infilename)
    reader = csv.reader(infile)
    objects = []
    for row in reader:
        objects.append(conv_row(row))
    data = {
        'entries': objects,
        'meta': {
            'metrics': metrics,
            'methods': methods,
        }
    }
    outfile = open(outfilename, 'w')
    json.dump(data, outfile)


if __name__ == '__main__':
    main()
