#! /usr/bin/env node

var program = require('commander');
var chalk = require('chalk');
var fs = require("fs");
var co = require('co');
var prompt = require('co-prompt');
var path = require('path');


var packageJson = JSON.parse(fs.readFileSync(path.join(__dirname, '..', 'package.json')).toString());


program
  .command('fetch <url>')
  .alias('f')
  .description('Fetches a longscroll webpage')
  .action(function(url) {
    var fetchPage = require(path.join('..', 'lib', 'fetchPage.js'));
    console.log(fetchPage(url));

  }).on('--help', function() {
    console.log('  Examples:');
    console.log();
    console.log('    $ abelone transform https://full_url_here.html');
    console.log('    $ abelone t https://full_url_here.html');
    console.log(chalk.bold.bgGreen('    $ a t https://full_url_here.html'));
    console.log();
  });

program
  .command('sanitize')
  .alias('s')
  .description('Sanitizes HTML')
  .action(function(options) {
    abelone.santize(options);
    // do whatever
  }).on('--help', function() {
    console.log('  Examples:');
    console.log();
    console.log('    $ abelone sanitize ');
    console.log('    $ abelone s ');
    console.log(chalk.bold.bgGreen('    $ a s'));
    console.log();
  });

program
  .command('normalize')
  .alias('n')
  .description('Normalizes HTML')
  .action(function(url) {
    abelone.normalize(url);
    // do whatever
  }).on('--help', function() {
    console.log('  Examples:');
    console.log();
    console.log('    $ abelone normalize ');
    console.log('    $ abelone n ');
    console.log(chalk.bold.bgGreen('    $ a n'));
    console.log();
  });

program
  .command('paginate')
  .alias('p')
  .description('Paginate & templatize')
  .action(function(options) {
    abelone.paginate(options);
    // do whatever
  }).on('--help', function() {
    console.log('  Examples:');
    console.log();
    console.log('    $ abelone paginate ');
    console.log('    $ abelone p ');
    console.log(chalk.bold.bgGreen('    $ a p'));
    console.log();
  });



// Command catchall
program
  .command('*')
  .on('--help', function() {
    console.log('  Examples:');
    console.log();
    console.log('    $ abelone <fetch> <url>');
    console.log();
  });

// Command version
program
  .version(packageJson.version)
  .option('-v, --version', 'output the version number')
  .parse(process.argv);


if (!program.args.length) {
  program.help();
}