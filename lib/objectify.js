function objectify() {

    const fsp = require('fs-promise');
    const path = require('path');
    const chalk = require('chalk');
    const cheerio = require("cheerio");
    const wordcount = require('wordcount');

    const headerTags = ['h1', 'h2', 'h3', 'h4', 'h5', 'h6'];

    let book = {};

    fsp.readJson(path.join('.', '.abelonerc'))
        .then((abelonerc) => {
            
            book.START_PAGE   = abelonerc.START_PAGE;

            fsp.readFile(path.join('interim', 'normalized.html'), { encoding: 'utf8' })
                .then((contents) => {

                    const $ = cheerio.load(contents);

                    $('body').children().each((i, elem) => {

                        let key = '';
                        let val = '';
                        let len = '';


                        if ($(elem)[0].name === 'p' || headerTags.indexOf($(elem)[0].name) > -1) {
                            key = $(elem)[0].name;
                            val = $(elem).text();
                            len = wordcount($(elem).text());
                        } else if ($(elem)[0].name === 'img') {
                            key = $(elem)[0].name;
                            val = $(elem).attr('src');
                            len = '';
                        } else {
                            console.log('We have a situation Houston.');
                        }

                        const elemObj = {};

                        elemObj[key] = val;
                        elemObj.len = len;

                        book[ i ] = elemObj;


                    });


                }).then(() => {

                    fsp.mkdirs(path.join('interim', 'tmp'))
                        .then(() => {
                            fsp.writeFile(path.join('.', 'interim', 'tmp', '.prebook'), JSON.stringify(book, null, 2))
                                .then(() => {
                                    console.log(chalk.blue('Prebook object saved.'));
                                }).catch((err) => {
                                    if (err)
                                        return console.log(chalk.bold.red('Failed to write abelone URL', err));
                                });
                        })
                        .catch((err) => {
                            if (err)
                                return console.log(chalk.bold.red('Failed to write abelone URL', err));

                        });


                }).catch((err) => {
                    if (err)
                        console.log(chalk.bold.red('Failed to pick up contents', err));

                });




        }).catch((err) => {
            if (err)
                console.log(chalk.red('Couldn\'t read abelonerc', err));
        });

}

module.exports.objectify = objectify; // Should return boolean true/false
