function paginate() {
    const fsp = require('fs-promise');
    const path = require('path');
    const chalk = require('chalk');
    const cheerio = require("cheerio");
    const wc = require('wordcount');

    const headerTags = ['h1', 'h2', 'h3', 'h4', 'h5', 'h6'];

    let book = {};
    let page_count = 1;


    fsp.readJson(path.join('.', 'interim', 'tmp', '.prebook'))
        .then((prebook) => {

            page_count = parseInt(prebook.START_PAGE);

            var html = ''; // Assign p tags to it.
            var wordcount = 0;
            var charcount = 0;


            for (var key in prebook) {
                if (prebook.hasOwnProperty(key)) {

                    let elem = prebook[key];

                    for (var tag in elem) {
                        if (elem.hasOwnProperty(tag)) {

                            if (tag === 'img') {
                                let image = '<' + tag + ' width = "100%" src = "' + elem[tag] + '" />';

                                book[`page-${ page_count }`] = image;

                                page_count += 1;


                            } else if (headerTags.indexOf(tag) > -1) {
                                let heading = '<' + tag + '>' + elem[tag] + '</' + tag + '>';

                                book[`page-${ page_count }`] = heading;

                                page_count += 1;

                            } else if (tag === 'p') {

                                const CHAR_LIMIT = 850; // Based on visual readability tests
                                const LOWER_WORD_LIMIT = 100; // Full page
                                const UPPER_WORD_LIMIT = 140; // Full page 

                                wordcount += wc(elem[tag]);

                                charcount += elem[tag].length;

                                if (wordcount < LOWER_WORD_LIMIT) {
                                    html += '<' + tag + '>' + elem[tag] + '</' + tag + '>';
                                }


                                if (wordcount >= LOWER_WORD_LIMIT /* && wordcount < UPPER_WORD_LIMIT */ ) {

                                    html += '<' + tag + '>' + elem[tag] + '</' + tag + '>';

                                    book[`page-${ page_count }`] = html;

                                    console.log("Sentence: " + elem[tag]);
                                    
                                    console.log("Charcount: " + charcount);

                                    console.log("Wordcount: " + wordcount);

                                    page_count += 1;

                                    html = '';
                                    wordcount = 0;
                                    charcount = 0;
                                }

                                // if (wordcount >= UPPER_WORD_LIMIT) {
                                //     let words = elem[tag].trim().split(/\s+/); // Array of words. 

                                //     console.log("wordcount=", wordcount);

                                //     console.log('SOURCE:', wc(elem[tag]), elem[tag]);

                                // }


                            }
                        }

                    }
                }
            }


        }).then(() => {
            fsp.writeFile(path.join('.', 'interim', 'tmp', '.book'), JSON.stringify(book, null, 2))
                .then(() => {
                    console.log(chalk.green('.book is ready'));
                }).catch((err) => {
                    if (err)
                        return console.log(chalk.bold.red('Failed to write .book json', err));
                });
        }).then(() => {
            fsp.readJson(path.join('.', 'interim', 'tmp', '.book'))
                .then((book) => {
                    let bookArr = Object.keys(book).map(key => book[key]); // Obj => Array conversion. Magic is here. 

                    let pageDirs = [];

                    for (var page in book) {
                        if (book.hasOwnProperty(page)) {

                            let thisDir = fsp.mkdirs(path.join('manuscript', page));

                            pageDirs.push(thisDir);

                        }
                    }
                    return Promise.all(pageDirs);

                }).then(() => {
                    let pagePromises = [];

                    for (var page in book) {
                        if (book.hasOwnProperty(page)) {
                            const TEMPLATE_START = '<div class="leaf flex"><div class="inner justify">';
                            const TEMPLATE_END = '</div> </div>';

                            let page_html = TEMPLATE_START + book[page] + TEMPLATE_END;

                            let htmlFile = path.join('.', 'manuscript', page, 'body.html');

                            let thisPage = fsp.writeFile(htmlFile, page_html);

                            pagePromises.push(thisPage);

                        }
                    }

                    return Promise.all(pagePromises);

                }).then(() => {
                    return console.log(chalk.yellow(`Pagination… ${chalk.blue('Complete.')}`));

                }).catch((err) => {
                    if (err)
                        return console.log(chalk.red('Failed to read .book json'));
                });



        }).catch((err) => {
            if (err)
                console.log(chalk.red('Could not read .book json', err));
        });






    // function createPagePromise(page, content) {
    //     console.log(page, content);




    //     let page_html = TEMPLATE_START + contents + TEMPLATE_END;

    //     const dir = path.join('manuscript', page);

    //     return fsp.mkdirs(dir)
    //         .then(() => {
    //             fsp.writeFile(path.join(dir, 'body.html'), page_html).catch((err) => {
    //                 if (err) return err;
    //             });

    //         })
    //         .catch((err) => {
    //             if (err)
    //                 console.log(chalk.bold.red('Failed to fetch book…', err));
    //         });

    // }

}

module.exports.paginate = paginate;
