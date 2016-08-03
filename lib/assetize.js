function fetchAssets() {
    const fsp = require('fs-promise');
    const path = require('path');
    const chalk = require('chalk');
    const glob = require('glob');

    let abelonerc = {};

    fsp.readJson(path.join('.', '.abelonerc'))
        .then((abelonerc) => {
            let promiseOne = fsp.copy(path.join('.', 'interim', abelonerc.basename, 'images'), path.join('.', 'assets', 'images'))
                .then(() => {
                    return console.log(chalk.blue(`Filling in images @bookiza: ${path.join('.', 'assets', 'images')}`));
                }).catch((err) => {
                    if (err)
                        console.log(chalk.bold.red('Failed to move images…', err));
                });

            let promiseTwo = '';

            glob(path.join('interim', abelonerc.basename, '*.htm*'), '', (er, files) => {

                promiseTwo = fsp.readFile(path.join('.', files[0]), { encoding: 'utf8' })
                    .then((contents) => {

                        fsp.writeFile(path.join('.', 'interim', 'original.html'), contents)
                            .then(() => {
                                return console.log(chalk.blue(`Original html @interim: ${path.join('.', 'interim')}`));
                            }).catch(() => {
                                if (err)
                                    console.log(chalk.bold.red('Failed to write HTML…', err));

                            });

                    }).catch((err) => {
                        if (err)
                            console.log(chalk.bold.red('Failed to pick up contents', err));
                    });

            });

            return Promise.all([promiseOne, promiseTwo]);

        }).catch((err) => {
            console.log(err);
        });


    // fsp.readFile(path.join('interim', 'normalized.html'), { encoding: 'utf8' })
    //     .then((contents) => {

    //         const cheerio = require('cheerio');
    //         const $ = cheerio.load(contents);


    //         let imagesNodeList = $('img');

    //         for (let i = 0; i < imagesNodeList.length; ++i) {

    //             let item = imagesNodeList[i];

    //             let handle = item.attribs.src;

    //             let newSrc = 'https://raw.githubusercontent.com/marvindanig/Milk-for-You-and-Me/master/assets/' + handle;

    //             imagesNodeList[i].src = newSrc;

    //             console.log(newSrc);
    //         }

    //     }).catch((err) => {
    //         if (err)
    //             console.log(chalk.bold.red('Failed to fetch images…', err));
    //     });


}

module.exports.assetize = fetchAssets;
