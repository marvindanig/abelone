try {
    // Pick the original html
    const fs = require('fs');
    const path = require('path');

    var original = fs.readFileSync(path.join('interim', 'original.html'));

} catch (e) {
    if (e.code === 'ENOENT') {
        console.log('File not found!');

    } else {
        throw e;
    }
    process.exit(1);
}

function sanitize() {

    const cleaner = require('clean-html');
    const sanitizeHtml = require('sanitize-html');

    const strippedHTML = sanitizeHtml(original, {
        // TODO: move these into a config
        allowedTags: ['p', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'em', 'strong', 'i', 'b', 'pre', 'img'],
        allowedAttributes: {
            img: ['src', 'href', 'name', 'alt'],
            '*': ['class']
        },
        nonTextTags: ['style', 'script', 'textarea', 'noscript', 'a', 'title'],
        selfClosing: ['img'],
        exclusiveFilter(elem) {
            return elem.tag !== 'img' && !elem.text.trim();
        },
        transformTags: {
            'pre' (tagName, attribs) {
                return {
                    tagName: 'p',
                    attribs: {
                        class: 'bottom'
                    }
                };
            }
        },
        allowedSchemes: ['http', 'https', 'mailto'],
        allowedSchemesByTag: {
            img: ['http', 'data', 'https']
        }
    });

    cleaner.clean(strippedHTML, { wrap: 0 }, book => {
        const path = require('path');
        const fsp = require('fs-promise');
        const chalk = require('chalk');


        fsp.readJson(path.join('.', '.abelonerc'))
            .then((abelonerc) => {
                let repo_url = abelonerc.repo_url;
                return book.replace(new RegExp("src=\"images/", 'g'), `src=\"${repo_url}/images/`);
            }).then((book) => {
                return book.replace(new RegExp("&quot;", 'g'), '"');
            }).then((book) => {
                let finalbook = `<body>${book}</body>`;

                const saver = require(path.join('..', 'lib', 'saver.js'));
                const filename = 'sanitized';

                saver.save(finalbook, filename);

            }).catch((err) => {
                if (err)
                    console.log(chalk.bold.red('Failed to pick up contents', err));

            });


    });
}

module.exports.sanitize = sanitize;
