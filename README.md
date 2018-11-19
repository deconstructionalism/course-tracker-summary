# course-tracker-summary

Node CLI package for getting quick, per-dev summary from Course
Tracker hosted on WDI Google Sheets as JSON.

## Installation

1. clone this repository locally
2. run `npm install`
3. follow the directions for **Step 1** only [here](https://developers.google.com/sheets/api/quickstart/nodejs#step_1_turn_on_the)
4. move the `credentials.json` file created in the previous step to the root of
   your cloned repo

## Usage

1. `node . <path to JSON outfile (optional)>`
2. in the window that pops up, select your account and allow access, then close
   the window once you are done
3. retrieved data will be printed to the console, and if you specified an
   outfile, it will be written there too
