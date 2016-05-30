var request = require("request"),
    cheerio = require("cheerio"),
    fs = require('fs'),
    cleaner = require('clean-html'),
    sanitizeHtml = require('sanitize-html');

// url = "http://www.gutenberg.org/files/500/500-h/500-h.htm"; // The book

// request(url, function(error, response, book) {
//     if (!error) {
//         var $ = cheerio.load(book);
//         saveOriginalBook($.html());
//         sanitizeOriginalBook($);

//     } else {
//         console.log("We’ve encountered an error: " + error);
//     }

// });


function saveOriginalBook(html) {
    var originalBook = fs.openSync("original.html", 'w');
    fs.writeSync(originalBook, html, 0, html.length);
    fs.close(originalBook);
}

function sanitizeOriginalBook($) {

    var cleanHTML = sanitizeHtml($.html(), {
        allowedTags: ['p', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'em', 'strong', 'i', 'b', 'pre', 'title'],
        allowedAttributes: {
            img: ['src']
        },
        nonTextTags: ['style', 'script', 'textarea', 'noscript', 'a'],
        exclusiveFilter: function(tag) {
            return !tag.text.trim();
        }
    });

    cleaner.clean(cleanHTML, { wrap: 0 }, function(cleanedHTML) {
        var sanitizedBook = fs.openSync("santized.html", 'w');

        fs.writeSync(sanitizedBook, cleanedHTML, 0, cleanedHTML.length);
        fs.close(sanitizedBook);
        paginateHTML(cleanedHTML);
    });


}

function paginateHTML(fullBook) {
    var wordcount = require('wordcount');

    var $ = cheerio.load(fullBook);

    var title = $('title').text();
    $('title').remove();
    console.log(title);

    $('*').each(function(i, elem) {
        if (i < 10) {
            console.log(i + "    " + $(this).text());
        }
    });
}

fs.readFileSync('sanitized.html', 'UTF-8', function(err, data) {
    if (err) {
        return console.error(err);
    }
    paginateHTML(data.toString());
});
