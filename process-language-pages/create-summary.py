#!/usr/bin/env python

import argparse
import logging
import os
import os.path
import json

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

    # delete previous summary if exists
    summary_file = os.path.join(args.languages, "index.json")
    if os.path.exists(summary_file):
        os.remove(summary_file)

    summary = []
    for root, dirs, files in os.walk(args.languages):
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


 
