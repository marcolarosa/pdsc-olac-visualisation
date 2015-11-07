#!/usr/bin/env python

import csv
import argparse
import logging
import os
import os.path
from lxml import html, etree
import json

class ProcessLanguage:
    def __init__(self, pages, code, coords, output):
        log.info("%s %s" % (olac_code, coords))
        self.page = os.path.join(pages, code)
        self.olac_code = code
        self.output = output

        self.language_resources = {
            'code': olac_code,
            'coords': coords,
            'url': self.page
        }

        log.debug(self.page)

    def process(self):
        # html.parse is getting the HTTP resource
        try:
            self.page = html.parse(self.page)
        except IOError:
            # for whatever reason - page not accessible
            log.error("Couldn't get: %s" % self.page)
            return

        name = self.page.find('//body/table[@class="doc_header"]/tr/td[2]').text_content()
        self.language_resources['name'] = name.replace('OLAC resources in and about the ', '')

        resources = {}
        for e in self.page.findall('//ol'):
            resource = e.getprevious().text_content()
            resource_list = e.findall('li')

            log.debug("Processing: %s, found: %s" % (resource, len(resource_list)))
            r = []
            for l in resource_list:
                r.append(etree.tostring(l))

            resources[resource] = {
                'count': len(resource_list),
                'resources': r
            }

        # write the data out
        self.language_resources['resources'] = resources
        with open(os.path.join(self.output, "%s.json" % self.olac_code), 'w') as f:
            f.write(json.dumps(self.language_resources))

if __name__ == "__main__":

    # read and check the options
    parser = argparse.ArgumentParser(description='Process OLAC Language Pages')

    parser.add_argument('--languages', dest='languages', help='The path to the CSV file containing the language codes', required=True)
    parser.add_argument('--pages',     dest='pages',     help='The base pages URL: Probably: http://www.language-archives.org/language', required=True)
    parser.add_argument('--output',    dest='output',    help='The folder to store the JSON representation.', required=True)
    parser.add_argument('--one',       dest='one',       help='Process only one language code.', action='store_true')
    parser.add_argument('--refresh',   dest='refresh',   help='Ignore data and reprocess.',      action='store_true')

    parser.add_argument('--info', dest='info', action='store_true', help='Turn on informational messages')
    parser.add_argument('--debug', dest='debug', action='store_true', help='Turn on full debugging (includes --info)')

    args = parser.parse_args()

    # unless we specify otherwise
    if args.debug:
        logging.basicConfig(level=logging.DEBUG)

    if args.info:
        logging.basicConfig(level=logging.INFO)

    if not (args.debug and args.info):
        # just give us error messages
        logging.basicConfig(level=logging.WARNING)

    # get the logger
    log = logging.getLogger('LANGUAGE_PROCESSOR')

    # create the output folder if required
    if not os.path.exists(args.output):
        os.mkdir(args.output)

    with open(args.languages, 'rb') as csvfile:
        d = csv.reader(csvfile)
        for row in d:
            try:
                (n, olac_code, name, coords) = (row[0], row[1], row[3], [row[4], row[5], row[6], row[7]])
            except IndexError:
                continue

            if args.one:
                if args.one == olac_code:
                    if not os.path.exists(os.path.join(args.output, "%s.json" % olac_code)) or args.refresh:
                        p = ProcessLanguage(args.pages, olac_code, coords, args.output)
                        p.process()

            else:
                # for each language in the csv
                if not os.path.exists(os.path.join(args.output, "%s.json" % olac_code)) or args.refresh:
                    p = ProcessLanguage(args.pages, olac_code, coords, args.output)
                    p.process()
 
