function fetch(url, options) {
    const fsp = require('fs-promise');
    const path = require('path');
    const request = require('request');
    const fs = require('fs');

    let abelonerc = {};

    abelonerc.url = path.dirname(url);

    fsp.writeFile('.abelonerc', JSON.stringify(abelonerc, null, 2))
        .then(() => {
            return console.log(chalk.green('Abelone url saved.'));
        }).catch((err) => {
            if (err)
                console.log(chalk.bold.red('Failed to write abelone URL', err));
        });    

    if (!fs.existsSync(path.join('interim', 'original.html')) || options.force) {

        fsp.mkdirs('interim')
            .then(() => {
                request(url, (error, response, book) => {
                    const saver = require(path.join('..', 'lib', 'saver.js'));

                    const filename = 'original';

                    saver.save(book, filename);

                });
            }).catch((err) => {
                if (err)
                    console.log(chalk.bold.red('Failed to fetch page…', err));
            });

    } else {
        console.log('Page exists!');
        return true;
    }

}


module.exports.fetch = fetch; // Should return boolean true/false