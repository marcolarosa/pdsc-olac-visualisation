# OLAC Visualisation

# About this project
    This work is led by Nick Thieberger at the University of Melbourne as part of the
    [Centre of Excellence for the Dynamics of Language](http://www.dynamicsoflanguage.edu.au/)
    (ARC grant CE140100041).
    [
        ![alt text](http://www.dynamicsoflanguage.edu.au/design/main/images/logo-2x.png)
    ](http://www.dynamicsoflanguage.edu.au/)

# Preamble

This code is in two parts:
- app: is an angular app that presents a map based visualization of the data at http://www.language-archives.org/.
- process-language-pages: a python script to scrape the data at http://www.language-archives.org/ and create json files for the angular app to consume.

## Hacking on the angular app

After you've cloned the repo:
```
- cd app
- npm install
- bower install
- grunt serve
```

The app will be available at http://{YOUR HOST}:9000

## Hacking on the python scraper

Ensure you have `python 2.7` and `lxml` and you should be good to go.o

There are two modes of invocation: one to scrape the language pages and produce a json representation of each and a second to produce the summary pages. The invocations are as follows:
```
./process-language-pages.py --languages languages.csv --pages http://www.language-archives.org/language --output $OUTPUT --info
./create-summary.py --languages $OUTPUT --info
```

Here's the help:
```
 ./process-language-pages.py --help
usage: process-language-pages.py [-h] --languages LANGUAGES --pages PAGES
                                 --output OUTPUT [--one] [--refresh] [--info]
                                 [--debug]

Process OLAC Language Pages

optional arguments:
  -h, --help            show this help message and exit
  --languages LANGUAGES
                        The path to the CSV file containing the language codes
  --pages PAGES         The base pages URL: Probably: http://www.language-
                        archives.org/language
  --output OUTPUT       The folder to store the JSON representation.
  --one                 Process only one language code.
  --refresh             Ignore data and reprocess.
  --info                Turn on informational messages
  --debug               Turn on full debugging (includes --info)
```

## Installing the app on your server

Assuming you have a linux server with the pre-requisites installed and ready (python 2.7, lxml and a web server), installation consists of downloading the scraper scripts into a suitable location and cloning the web app into a folder configured to be served via the webserver.

To get the app clone `testing` branch viz (assuming you're in the folder you want the code):

```
git clone -b testing git@github.com:MLR-au/olac-visualisation.git .
```

To get the scraper scripts clone master viz (again, assuming you're in the folder you want to install the code):
```
git clone git@github.com:MLR-au/olac-visualisation.git
```

Then you can set up cron jobs to scrape the language archives site nightly / weekly as desired. See the section `Hacking on the python scraper` for an example invocation. Note that you must set `$OUTPUT` to the the folder `data` in the web app folder.

