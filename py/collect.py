#!/usr/bin/env python
# coding: utf-8

import os.path
import csv


def main():
    root = os.path.dirname(__file__) + '/../'
    infilenames = [
        'orig/Evaluation Method - 2008info.csv',
        'orig/Evaluation Method - 2009info.csv',
        'orig/Evaluation Method - 2010sci.csv',
        'orig/Evaluation Method - 2010info.csv',
        'orig/Evaluation Method - 2010vast.csv',
        'orig/Evaluation Method - 2011sci.csv',
        'orig/Evaluation Method - 2011info.csv',
        'orig/Evaluation Method - 2011vast.csv',
        'orig/Evaluation Method - 2012sci.csv',
        'orig/Evaluation Method - 2012info.csv',
        'orig/Evaluation Method - 2012vast.csv',
    ]
    outfilename = root + 'vistrend.csv'
    writer = csv.writer(open(outfilename, 'w'))
    for infilename in infilenames:
        infilename = root + infilename
        reader = csv.reader(open(infilename))
        for row in list(reader)[1:]:
            writer.writerow(row)


if __name__ == '__main__':
    main()
