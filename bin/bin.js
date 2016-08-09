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
  .option("-f, --force", "Force a fetch")
  .action(function(url, options) {
    var original = require(path.join('..', 'lib', 'fetch.js'));
    original.fetch(url, options);
  }).on('--help', function() {
    console.log('  Examples:');
    console.log();
    console.log('    $ abelone fetch http(s)://url.html');
    console.log('    $ abelone f http://url.html');
    console.log(chalk.bold('    $ a f https://full_url_here.html    # shortform'));
    console.log();
  });


program
  .command('assetize')
  .alias('a')
  .description('Fill in assets / html')
  .action(function() {
    var page = require(path.join('..', 'lib', 'assetize.js'));
    page.assetize();
  }).on('--help', function() {
    console.log('  Examples:');
    console.log();
    console.log('    $ abelone assetize ');
    console.log('    $ abelone a ');
    console.log(chalk.bold('    $ a a   #shortform'));
    console.log();
  });

program
  .command('sanitize')
  .alias('s')
  .description('Sanitizes HTML')
  .action(function(options) {
    var html = require(path.join('..', 'lib', 'sanitize.js'));
    html.sanitize(options);
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
  .action(function() {
    var page = require(path.join('..', 'lib', 'normalize.js'));
    page.normalize();
  }).on('--help', function() {
    console.log('  Examples:');
    console.log();
    console.log('    $ abelone normalize ');
    console.log('    $ abelone n ');
    console.log(chalk.bold.bgGreen('    $ a n'));
    console.log();
  });

program
  .command('objectify')
  .alias('o')
  .description('Objectify into a Array-like Json')
  .action(function() {
    var page = require(path.join('..', 'lib', 'objectify.js'));
    page.objectify();
  }).on('--help', function() {
    console.log('  Examples:');
    console.log();
    console.log('    $ abelone objectify ');
    console.log('    $ abelone o ');
    console.log(chalk.bold('    $ a o   #shortform'));
    console.log();
  });


program
  .command('homogenize')
  .alias('h')
  .description('homogenize paragraphs')
  .action(function() {
    var page = require(path.join('..', 'lib', 'homogenize.js'));
    page.homogenize();
  }).on('--help', function() {
    console.log('  Examples:');
    console.log();
    console.log('    $ abelone homogenize ');
    console.log('    $ abelone h ');
    console.log(chalk.bold('    $ a h   #shortform'));
    console.log();
  });

program
  .command('bookify')
  .alias('b')
  .description('Bookify into a book Json')
  .action(function() {
    var page = require(path.join('..', 'lib', 'bookify.js'));
    page.bookify();
  }).on('--help', function() {
    console.log('  Examples:');
    console.log();
    console.log('    $ abelone bookify ');
    console.log('    $ abelone b ');
    console.log(chalk.bold('    $ a b   #shortform'));
    console.log();
  });

program
  .command('paginate')
  .alias('p')
  .description('Paginate & templatize')
  .action(function() {
    var page = require(path.join('..', 'lib', 'paginate.js'));
    page.paginate();
  }).on('--help', function() {
    console.log('  Examples:');
    console.log();
    console.log('    $ abelone paginate ');
    console.log('    $ abelone p ');
    console.log(chalk.bold('    $ a p   #shortform'));
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