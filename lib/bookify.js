function bookify() {
    const fsp = require('fs-promise');
    const path = require('path');
    const chalk = require('chalk');
    const wc = require('wordcount');

    const headerTags = ['h1', 'h2', 'h3', 'h4', 'h5', 'h6'];

    let book = {};
    let page_count = 1;


    fsp.readJson(path.join('.', 'interim', 'tmp', '.prebook'))
        .then((prebook) => {

            page_count = parseInt(prebook.START_PAGE);

            var html = ''; // Assign p tags to it.
            var wordcount = 0;
            var linecount = 0;


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
                                
                                if (html !== '') {
                                    book[`page-${ page_count }`] = html;
                                    page_count += 1;
                                    html = '';
                                    wordcount = 0;
                                    linecount = 0;
                                }                                


                                let heading = '<' + tag + '>' + elem[tag] + '</' + tag + '>';
                                book[`page-${ page_count }`] = heading;
                                page_count += 1;


                            } else if (tag === 'p') {

                                const LOWER_WORD_LIMIT = 120; // Full page
                                const UPPER_WORD_LIMIT = 160; // Full page 16 lines = ideal.
                                const MIN_LINE_LIMIT = 12;
                                const MAX_LINE_LIMIT = 18; // 16 is ideal.
                                // const MAX_CHAR_LIMIT = 850; // Based on visual readability tests

                                let newcount = wc(elem[tag]);

                                if (wordcount + newcount <= LOWER_WORD_LIMIT) { 
                                    
                                    html += '<' + tag + '>' + elem[tag] + '</' + tag + '>';
                                    
                                    wordcount += newcount;

                                    linecount += Math.round(newcount / 7) + 1;

                                    console.log('LINECOUNT:', linecount);

                                } else if (wordcount + newcount > LOWER_WORD_LIMIT) {
                                    if (wordcount + newcount <= UPPER_WORD_LIMIT) {

                                        html += '<' + tag + '>' + elem[tag] + '</' + tag + '>';

                                        wordcount += newcount;

                                        linecount += Math.round(newcount / 7) + 1;

                                        console.log('PAGE ADDED! LINECOUNT:', linecount);

                                        book[`page-${ page_count }`] = html;

                                        page_count += 1;

                                        html = '';

                                        wordcount = 0;

                                        linecount = 0;


                                    } else if (wordcount + newcount > UPPER_WORD_LIMIT ){
                                        let availableRoom = 160 - wordcount;

                                        let nearestSpace = elem[tag].indexOf('.', availableRoom); 
                                        let leftPartSentence = elem[tag].substr(0, nearestSpace + 1);

                                        html += '<' + tag + '>' + leftPartSentence + '</' + tag + '>';


                                        book[`page-${ page_count }`] = html;

                                        page_count += 1;

                                        html = elem[tag].substr( nearestSpace + 1 );

                                        wordcount = wc(html);

                                        linecount = Math.round(wordcount / 7) + 1;

                                    }

                                }







                                // if (wc(elem[tag]) > UPPER_WORD_LIMIT) {
                                //     // split the para by yugely!

                                // } else {

                                //     if (wc(elem[tag]) < LOWER_WORD_LIMIT) {
                                //         if (wordcount <= LOWER_WORD_LIMIT) {

                                //         }

                                //     } else {

                                //     }



                                // }  


                                // if (wordcount <= LOWER_WORD_LIMIT && wc(elem[tag]) <= 60) {

                                //     html += '<' + tag + '>' + elem[tag] + '</' + tag + '>';

                                //     wordcount += wc(elem[tag]);

                                // } else if (wordcount <= LOWER_WORD_LIMIT && wc(elem[tag]) > 60) {
                                //     let allowedSpace = LOWER_WORD_LIMIT - wordcount + 60;

                                //     let wordArray = wc(elem[tag]).split(' ');
                                //     let newTruncatedPara = '';

                                //     for (let i=0; i < allowedSpace; i++) {
                                //         newTruncatedPara += wordArray[i];
                                //     }

                                //     html += '<' + tag + '>' + newTruncatedPara + '</' + tag + '>';
                                    
                                //     book[`page-${ page_count }`] = html;
                                //     page_count += 1;


                                //     for (let i=allowedSpace; i < wc(elem[tag]); i++) {
                                //         carryOverHtml += wordArray[i];
                                //     }

                                //     html = carryOverHtml;
                                //     wordcount = wc(carryOverHtml);

                                //     carryOverHtml='';

                                // } else if (wordcount > LOWER_WORD_LIMIT && wc(elem[tag]) <= 60) {

                                //     let allowedSpace = LOWER_WORD_LIMIT - wordcount + 60;

                                //     if (allowedSpace < 10) {

                                //     }

                                // }

                                // if (wordcount >= UPPER_WORD_LIMIT) {

                                //     let new_words = elem[tag].trim().split(/\s+/); // Array of words. 
                                //     let avail = 160 - wordcount + wc(elem[tag]);

                                //     console.log("available_space: " + avail);

                                //     let left_sentence = new_words.slice(0, avail).join(' '); 

                                //     html += '<' + tag + '>' + left_sentence + '</' + tag + '>';

                                //     book[`page-${ page_count }`] = html;

                                //     page_count += 1;

                                //     html = '<' + tag + '>' + new_words.slice(avail).join(' ') + '</' + tag + '>'; 

                                //     console.log(html);

                                //     wordcount = wc(html);
                                //     // charcount = html.length;
                                // }



                                // if (linecount >= MAX_LINE_NUMBERS) {
                                //     html += '<' + tag + '>' + elem[tag] + '</' + tag + '>';

                                //     book[`page-${ page_count }`] = html;

                                //     page_count += 1;

                                //     html = '';
                                //     wordcount = 0;
                                //     charcount = 0;
                                //     linecount = 0;

                                // }

                                // if (charcount >= MAX_CHAR_LIMIT) {
                                //     html += '<' + tag + '>' + elem[tag] + '</' + tag + '>';

                                //     book[`page-${ page_count }`] = html;

                                //     page_count += 1;

                                //     html = '';
                                //     wordcount = 0;
                                //     charcount = 0;
                                //     linecount = 0;

                                // }


                            }
                        }

                    }
                }
            }

            function createPage(html, page_count, carryOverHtml) {

                book[`page-${ page_count }`] = html;

                page_count += 1;

                html = carryOverHtml;
                wordcount = 0;
                charcount = 0;
                linecount = 0;

                
            }


        }).then(() => {
            fsp.writeFile(path.join('.', 'interim', 'tmp', '.book'), JSON.stringify(book, null, 2))
                .then(() => {
                    console.log(chalk.green('.book is ready'));
                }).catch((err) => {
                    if (err)
                        return console.log(chalk.bold.red('Failed to write .book json', err));
                });
        // }).then(() => {
        //     fsp.readJson(path.join('.', 'interim', 'tmp', '.book'))
        //         .then((book) => {
        //             let bookArr = Object.keys(book).map(key => book[key]); // Obj => Array conversion. Magic is here. 

        //             let pageDirs = [];

        //             for (var page in book) {
        //                 if (book.hasOwnProperty(page)) {

        //                     let thisDir = fsp.mkdirs(path.join('manuscript', page));

        //                     pageDirs.push(thisDir);

        //                 }
        //             }
        //             return Promise.all(pageDirs);

        //         }).then(() => {
        //             let pagePromises = [];

        //             for (var page in book) {
        //                 if (book.hasOwnProperty(page)) {
        //                     const TEMPLATE_START = '<div class="leaf flex"><div class="inner justify">';
        //                     const TEMPLATE_END = '</div> </div>';

        //                     let page_html = TEMPLATE_START + book[page] + TEMPLATE_END;

        //                     let htmlFile = path.join('.', 'manuscript', page, 'body.html');

        //                     let thisPage = fsp.writeFile(htmlFile, page_html);

        //                     pagePromises.push(thisPage);

        //                 }
        //             }

        //             return Promise.all(pagePromises);

        //         }).then(() => {
        //             return console.log(chalk.yellow(`Bookification… ${chalk.blue('Complete.')}`));

        //         }).catch((err) => {
        //             if (err)
        //                 return console.log(chalk.red('Failed to read .book json'));
        //         });



        }).catch((err) => {
            if (err)
                console.log(chalk.red('Could not read .book json', err));
        });

}

module.exports.bookify = bookify;
