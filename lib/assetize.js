function fetchAssets() {
    const fsp = require('fs-promise');
    const path = require('path');
    const chalk = require('chalk');

    fsp.readFile(path.join('interim', 'normalized.html'), { encoding: 'utf8' })
        .then((contents) => {

            const cheerio = require('cheerio');
            const $ = cheerio.load(contents);

            let imagesNodeList = $('img');

            console.log(chalk.blue(imagesNodeList.length));

            for (let i = 0; i < imagesNodeList.length; ++i) {
                
                let item = imagesNodeList[i];

                downloadImage(item.attribs.src, i);
            }

        }).catch((err) => {
            if (err)
                console.log(chalk.bold.red('Failed to fetch images…', err));
        });


}

function isPathAbsolute(imgSrc) {
    return /^(?:\/|[a-z]+:\/\/)/.test(imgSrc);
}

function downloadImage(imgSrc, i) {
    const request = require('request');
    const fs = require('fs');
    const path = require('path');
    const chalk = require('chalk');

    fileExt = path.extname(imgSrc);

    if (isPathAbsolute(imgSrc)) {
        download(imgSrc, path.join('assets', 'images', `image-${i + fileExt}`), function() {
            console.log('done');
            // prepare assetized.html with relative paths to assets/images/filename
        });
    } else {

      const fsp = require('fs-promise');

      let abeloneUrl = '';

      fsp.readJson(path.join('.', '.abelonerc'))
          .then((json) => {
              return json.url;
          }).then((abeloneUrl) => {

              let newSrc = path.join(abeloneUrl + imgSrc);

              console.log(newSrc);

              download(newSrc, path.join('assets', 'images', `image-${i + fileExt}`), function() {
                  console.log('done');
                  // prepare assetized.html with relative paths to assets/images/filename
              });

          }).catch((err) => {
              console.log(err);
          });

        
    }



    var download = function(uri, filename, callback) {
        request.head(uri, function(err, res, body) {
            console.log('content-type:', res.headers['content-type']);
            console.log('content-length:', res.headers['content-length']);

            request(uri).pipe(fs.createWriteStream(filename)).on('close', callback);
        });
    };
}


module.exports.assetize = fetchAssets;
