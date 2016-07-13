try {
    // Pick up the original html
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
        allowedTags: ['p', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'em', 'strong', 'i', 'b', 'pre'],
        allowedAttributes: {
            img: ['src'],
            '*': ['class']
        },
        nonTextTags: ['style', 'script', 'textarea', 'noscript', 'a', 'title'],
        exclusiveFilter(tag) {
            return !tag.text.trim();
        },
        transformTags: {
            'pre'(tagName, attribs) {
                return {
                    tagName: 'p',
                    attribs: {
                        class: 'bottom'
                    }
                };
            }
        }
    });

    cleaner.clean(strippedHTML, { wrap: 0 }, book => {
        const path = require('path');

        book = book.replace(new RegExp("&quot;", 'g'), '"');
        book = `<body>${book}</body>`;

        const saver = require(path.join('..', 'lib', 'saver.js'));

        const filename = "sanitized";
        saver.save(book, filename);
        
        process.exit();

    });
}

module.exports.sanitize = sanitize;
