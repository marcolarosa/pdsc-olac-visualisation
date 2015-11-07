#!/usr/bin/env python

import argparse
import logging
import os
import os.path
from lxml import html, etree
import json
import sys

class CreateSummary:
    def __init__(self, languages):
        self.languages = languages

    def process(self):
        # delete previous summaries if any
        for summary in [ 'index.json', 'regions.json', 'countries.json' ]:
            summary_file = os.path.join(self.languages, summary)
            if os.path.exists(summary_file):
                os.remove(summary_file)

        summary = []
        for root, dirs, files in os.walk(self.languages):
            for f in files:
                log.info("Processing: %s" % os.path.join(f));

                with open(os.path.join(root, f), 'r') as f:
                    data = json.loads(f.read())
                    s = {
                        'name': data['name'],
                        'url': data['url'],
                        'coords': data['coords'],
                    }
                    r = {}
                    for resource in data['resources']:
                        r[resource] = data['resources'][resource]['count']
                    s['resources'] = r
                    summary.append(s)

        with open(summary_file, 'w') as f:
            f.write(json.dumps(summary))


class CreateRegionSummaries:
    def __init__(self, languages):
        self.languages = languages
        self.region_pages = [
            'http://www.language-archives.org/area/africa',
            'http://www.language-archives.org/area/americas',
            'http://www.language-archives.org/area/asia',
            'http://www.language-archives.org/area/europe',
            'http://www.language-archives.org/area/pacific'
        ]

    def process(self):
        regions = {}
        for region in self.region_pages:
            log.info("Processing region: %s" % region)
            base_url = region.split('area')[0].rstrip('/')

            region_data = []

            tree = html.parse(region)
            for e in tree.findall('//table[2]/tr/td/ul/li'):
                region_data.append({
                    'name': e.text_content().split('(')[0].strip(),
                    'count': e.text_content().split('(')[1].split(')')[0],
                    'url': "%s%s" % (base_url, e.xpath('a/@href')[0])
                })

            regions[region.split('/')[-1:][0]] = region_data

        with open(os.path.join(self.languages, 'regions.json'), 'w') as f:
            f.write(json.dumps(regions))

        countries = {}
        for region in regions:
            for country in regions[region]:
                log.info("Processing country: %s" % country['name'])
                base_url = country['url'].split('country')[0].rstrip('/')
                tree = html.parse(country['url'])

                language_data = []

                for e in tree.findall('//table[2]/tr/td/ul/li'):
                    language_data.append({
                        'name': e.text_content().split('(')[0].strip(),
                        'url': "%s%s" % (base_url, e.xpath('a/@href')[0]),
                        'code': e.xpath('a/@href')[0].split('/')[2]
                    })

                country['language_data'] = language_data
                countries[country['name']] = country

        with open(os.path.join(self.languages, 'countries.json'), 'w') as f:
            f.write(json.dumps(countries))

if __name__ == "__main__":

    # read and check the options
    parser = argparse.ArgumentParser(description='Create Summary Page')

    parser.add_argument('--languages', dest='languages', help='The path to the JSON data files', required=True)

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

    # create summary file
    s = CreateSummary(args.languages)
    s.process()
    
    # create region / country summaries
    s = CreateRegionSummaries(args.languages)
    s.process()
