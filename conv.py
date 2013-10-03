from __future__ import print_function
import csv
import json


def parse_authors(s) :
    return [item.strip() for item in s.split(',')]


def parse_index_terms(s):
    return [item.lower().strip() for item in s[:-1].split(',')]


def main():
    infile = open('vistrend2.csv')
    reader = csv.reader(infile)
    objects = []
    for row in reader:
        obj = {
                'title' : row[0],
                'year' : int(row[1]),
                'category' : row[2],
                'sub category' : row[3],
                'authors' : parse_authors(row[4]),
                'index terms' : parse_index_terms(row[5]),
                'metrics' : {
                    'Speed' : int(row[6]),
                    'Accuracy' : int(row[7]),
                    'Scalability' : int(row[8]),
                    'Efficiency' : int(row[9]),
                    'Effectiveness' : int(row[10]),
                    'Satisfaction' : int(row[11]),
                    'Utility' : int(row[12]),
                    'Learnability' : int(row[13]),
                    'Adoption' : int(row[14]),
                    'Productivity' : int(row[15]),
                },
                'methods' : {
                    'Computational experiments' : int(row[16]),
                    'Subjective experiments' : int(row[17]),
                    'Case study' : int(row[18]),
                    'Comparison with other method' : int(row[19]),
                    'Empirical analysis' : int(row[20]),
                    'Informal comments' : int(row[21]),
                },
        }
        objects.append(obj)
    data = {
            'entries' : objects,
            'meta' : {
                'metrics' : [
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
                ],
                'methods' : [
                    'Computational experiments',
                    'Subjective experiments',
                    'Case study',
                    'Comparison with other method',
                    'Empirical analysis',
                    'Informal comments',
                ],
            }
    }
    outfile = open('vistrend.json', 'w')
    json.dump(data, outfile)


if __name__ == '__main__':
    main()
