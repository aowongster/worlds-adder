import csv

spoilers = 'dok-spoilers-2019-10-14.csv'
output_csv = 'worlds.csv'
with open(spoilers) as read_file:
    lines = [line for line in read_file]

with open(output_csv, 'w') as out_file:
    writer = csv.writer(out_file, delimiter=',', quotechar='"', quoting=csv.QUOTE_MINIMAL)
    for l in  csv.reader(lines, quotechar='"', delimiter=',',
                         quoting=csv.QUOTE_ALL, skipinitialspace=True):
        card_name = l[0]
        value = l[9]

        csv_line = [card_name, value]
        # print [card_name, value]
        writer.writerow(csv_line)
