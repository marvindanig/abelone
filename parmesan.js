var request = require("request"),
    cheerio = require("cheerio"),
    fs = require('fs'),
    cleaner = require('clean-html'),
    sanitizeHtml = require('sanitize-html'),
    path = require('path');


const WORD_LIMIT = 120;
const LINE_LIMIT = 16;
const START_PAGE = '<div class="leaf flex"><div class="inner justify">',
    END_PAGE = '</div> </div>';


// fs.readFile('sanitized.html', 'utf8', function(err, data) {
//     if (err) {
//         console.log(err);
//     }
//     paginateHTML(data);
// });


url = "http://www.gutenberg.org/files/16865/16865-h/16865-h.htm"; // The book

if (!fs.existsSync('original.html')) {
    request(url, function(error, response, book) {
        if (!error) {
            var $ = cheerio.load(book);
            saveOriginalBook($.html());
            sanitizeOriginalBook($);

        } else {
            console.log("We’ve encountered an error: " + error);
        }

    });
} else {
    var originalBook = fs.readFileSync("original.html");



    var $ = cheerio.load(originalBook);
    sanitizeOriginalBook($);
}

function saveOriginalBook(html) {
    var originalBook = fs.openSync("original.html", 'w');
    fs.writeSync(originalBook, html, 0, html.length);
    fs.close(originalBook);
}

function sanitizeOriginalBook($) {

    var cleanHTML = sanitizeHtml($.html(), {
        allowedTags: ['p', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'em', 'strong', 'i', 'b', 'pre', 'title'],
        allowedAttributes: {
            img: ['src'],
            '*': ['class']
        },
        nonTextTags: ['style', 'script', 'textarea', 'noscript', 'a'],
        exclusiveFilter: function(tag) {
            return !tag.text.trim();
        },
        // transformTags: {
        //     'pre': sanitizeHtml.simpleTransform('p', { class: 'bottom' })
        // }
        transformTags: {
            'pre': function(tagName, attribs) {
                // My own custom magic goes here 

                return {
                    tagName: 'p',
                    attribs: {
                        class: 'bottom'
                    }
                };
            }
        }
    });

    cleaner.clean(cleanHTML, { wrap: 0 }, function(cleanedHTML) {
        var sanitizedBook = fs.openSync("sanitized.html", 'w');
        cleanedHTML = '<html>' + cleanedHTML + '</html>';
        fs.writeSync(sanitizedBook, cleanedHTML, 0, cleanedHTML.length);
        fs.close(sanitizedBook);
        paginateHTML(cleanedHTML);
    });


}

function paginateHTML(fullBook) {
    var wordcount = require('wordcount');

    var $ = cheerio.load(fullBook);

    var title = $('title').text(); // TODO: Insert title into HEAD template.
    $('title').remove();

    var pre = $('pre').first().text(); // TODO: Move these credits to the end of manuscript
    $('pre').first().remove();

    // console.log($('html').children().length);
    var page_count = 1;
    var word_count = 0;
    var page_html = "";

    $('html').children().each(function(i, elem) {

        var elem_word_count = wordcount($(this).text());

        if (word_count + elem_word_count > WORD_LIMIT) {
            var dir = path.join(path.join("manuscript", "page-" + page_count));

            if (!fs.existsSync(dir)) {
                fs.mkdirSync(dir);
            }

            var page = fs.openSync(path.join("manuscript", "page-" + page_count, "body.html"), 'w+');
            page_html = START_PAGE + page_html + END_PAGE;

            fs.writeSync(page, page_html, 0, page_html.length);

            page_html = $(this);
            word_count = elem_word_count;
            page_count += 1;
        } else {
            page_html = page_html + $(this);
            word_count = word_count + elem_word_count + 10;
        }


    });



}
