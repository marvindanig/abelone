function sanitize(){

    var fs = require("fs");
    var cleaner = require('clean-html');
    var sanitizeHtml = require('sanitize-html');

    // Pick up the original html
    var original = fs.readFileSync("original.html");

    var strippedHTML = sanitizeHtml(original, {
        // move these into a config
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

    cleaner.clean(strippedHTML, { wrap: 0 }, function(cleanHTML) {
        var sanitizedBook = fs.openSync("sanitized.html", 'w');
        cleanHTML = '<body>' + cleanHTML + '</body>';
        fs.writeSync(sanitizedBook, cleanHTML, 0, cleanHTML.length);
        fs.close(sanitizedBook);

        console.log('Sanitized html created!');
        process.exit();

    });
}

module.exports.sanitize = sanitize; 