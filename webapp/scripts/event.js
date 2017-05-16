#!/usr/bin/env node
/*
 * usage:  node scripts/event.js <date/time> <location> <eventname>
 * example:
 * node scripts/event.js '2017-05-18 12:00' 'Ferry Building' Lunch
 *
 */
var program = require('commander');
var co = require('co');
var prompt = require('co-prompt');
var moment = require('moment');

// either today noon, or tomorrow if already past noon
function nextLunchTime() {
  var nextNoon = new Date();
  if (nextNoon.getHours()>=12) nextNoon.setDate(nextNoon.getDate()+1)
  nextNoon.setHours(12,0,0,0);
  return nextNoon;
}

/**
 * the date/time option should be:
 * "nextlunch": next noon-time
 * "nextweek": noon-time 1 week from today
 * OR any momemt-formatted string:
 *    https://momentjs.com/docs/#/parsing/string/
 */
function timeFromOption(optionText) {
  switch (option) {
    case "nextlunch":
      return nextLunchTime();
    case "nextweek":
      return moment(12, "HH").add(7, 'days').toDate();
    default:
      return moment(optionText);
  }
}

// future:
//   .option('-n, --num <num>', 'The number of events to generate', parseInt, 1)

var option = "nextweek"
var location = "TBD in San Francisco"
var name = "Get together!"
program
  .arguments('<option> <location> <name>')
  .action(function (givenOption, givenLocation, givenName) {
    console.log('args: %s %s', givenOption, givenLocation);
    option = givenOption || option;
    name = givenName || name;
    location = givenLocation || location;
  })
  .parse(process.argv)

console.log('generating event...');

var eventTime = timeFromOption(option)

// note: this script doesn't support creating 2 events at the same time
var id = moment(eventTime).format("YYYYMMDD-HH");
event = {
    "location": location,
    "name": name,
    "startAt": Number(eventTime)/1000,
    "endAt": Number(moment(eventTime).add(1, 'hour'))/1000,
    "state":"open"
}
console.log('event', event);

var sys = require('util');
var exec = require('child_process').exec;

eventBashArg = JSON.stringify(event)
  .replace(/"/g, '\\"');

exec(`echo "${eventBashArg}" | firebase database:set /events/${id} -y`,
  function (error, stdout, stderr) {      // one easy function to capture data/errors
    if (stdout) console.log('stdout: ' + stdout);
    if (stderr) console.log('stderr: ' + stderr);
    if (error !== null) {
      console.log('exec error: ' + error);
    }
  }
);



