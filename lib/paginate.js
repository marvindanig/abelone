function paginate() {
    const fsp = require('fs-promise');
    const path = require('path');
    const chalk = require('chalk');

    let book = {};

    fsp.readJson(path.join('.', 'interim', 'tmp', '.book'))
        .then((json) => {

            book = json;

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

        }).then(() => {
            fsp.readJson(path.join('.', 'interim', 'tmp', '.index'))
                .then((json) => {
                    let list_items = '';
                    for (var key in json) {
                        if (json.hasOwnProperty(key)) {
                            list_items += json[key];

                        }
                    }
                    return list_items;

                }).then((list_items) => {
                    let unordered_list = '<ul>' + list_items + '</ul>';
                    return unordered_list;
                }).then((unordered_list) => {
                    let promised = fsp.writeFile(path.join('.', 'interim', 'index.contents'), unordered_list)
                        .then(() => {
                            console.log(chalk.green(`Contents HTML is ${chalk.blue('ready')}`));
                        }).catch((err) => {
                            if (err)
                                return console.log(chalk.bold.red('Failed to write index HTML', err));
                        });

                    return Promise.all[ promised ];

                }).catch((err) => {
                    if (err)
                        return console.log(chalk.red('Failed to read .index json'));
                });


        }).catch((err) => {
            if (err)
                return console.log(chalk.red('Failed to read .book json'));
        });



}

module.exports.paginate = paginate;
