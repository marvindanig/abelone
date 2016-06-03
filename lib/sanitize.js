try {
    // Pick up the original html
    var fs = require('fs');
    var path = require('path');

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

    var cleaner = require('clean-html');
    var sanitizeHtml = require('sanitize-html');


    var strippedHTML = sanitizeHtml(original, {
        // TODO: move these into a config
        allowedTags: ['p', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'em', 'strong', 'i', 'b', 'pre'],
        allowedAttributes: {
            img: ['src'],
            '*': ['class']
        },
        nonTextTags: ['style', 'script', 'textarea', 'noscript', 'a', 'title'],
        exclusiveFilter: function(tag) {
            return !tag.text.trim();
        },
        transformTags: {
            'pre': function(tagName, attribs) {
                return {
                    tagName: 'p',
                    attribs: {
                        class: 'bottom'
                    }
                };
            }
        }
    });

    cleaner.clean(strippedHTML, { wrap: 0 }, function(book) {
        var path = require('path');

        book = book.replace(new RegExp("&quot;", 'g'), '"');
        book = '<body>' + book + '</body>';

        var saver = require(path.join('..', 'lib', 'saver.js'));

        var filename = "sanitized";
        saver.save(book, filename);
        
        process.exit();

    });
}

module.exports.sanitize = sanitize;
