from __future__ import print_function
import csv

def main():
    reader = csv.reader(open('vistrend.csv'))
    writer = csv.writer(open('vistrend2.csv', 'w'))
    for row in reader:
        row[6:] = ['0' if s == '' else s for s in row[6:]]
        writer.writerow(row)


if __name__ == '__main__':
    main()
