function fetch(url, options) {
    const fsp = require('fs-promise');
    const path = require('path');
    const request = require('request');
    const fs = require('fs');  // TODO: Promisify and remove. 
    const chalk = require('chalk');
    const unzip = require('unzip');

    let abelonerc = {};

    // http://www.gutenberg.org/files/25552/25552-h.zip  // <<< INPUT url.

    abelonerc.url = url; // url to zipped folder.

    abelonerc.basename = path.basename(url, '.zip');
    abelonerc.dir = path.dirname(url);
    abelonerc.compressor = path.extname(url) || '.zip';
    abelonerc.START_PAGE = '9';
    abelonerc.repo_url = '';

    fsp.writeFile('.abelonerc', JSON.stringify(abelonerc, null, 2))
        .catch((err) => {
            if (err)
                console.log(chalk.bold.red('Failed to write abelone URL', err));
        });

    if (!fs.existsSync(path.join('interim', 'original.html')) || options.force) {

        fsp.mkdirs('interim')
            .then(() => {
                request(url)
                    .pipe(fs.createWriteStream(path.join('.', 'interim', 'book.zip')))
                    .on('close', function() {
                        console.log(chalk.blue('Prebook zip downloaded.'));
                        fs.createReadStream(path.join('.', 'interim', 'book.zip')).pipe(unzip.Extract({ path: path.join('.', 'interim') }));
                    });
            })
            .catch((err) => {
                if (err)
                    console.log(chalk.bold.red('Failed to fetch book…', err));
            });

    } else {
        console.log('Page exists!');
        return true;
    }

}


module.exports.fetch = fetch;
