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

        }).catch((err) => {
            if (err)
                return console.log(chalk.red('Failed to read .book json'));
        });



}

module.exports.paginate = paginate;