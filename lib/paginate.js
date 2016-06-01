try {
    // Pick up the original html
    var fs = require("fs");
    var scroll = fs.readFileSync("sanitized.html");
} catch (e) {
    if (e.code === 'ENOENT') {
        console.log('File not found!');

    } else {
        throw e;
    }
    process.exit(1);
}


function paginate() {

    const WORD_LIMIT = 120;
    const LINE_LIMIT = 16;

    var wordcount = require('wordcount');        
    var headerTags = ['h1', 'h2', 'h3'];

    var cheerio = require("cheerio");
    var $ = cheerio.load(scroll);

    var page_count = 1;
    var word_count = 0;
    var page_html = "";

    $('body').children().each(function(i, elem) {

        var elem_word_count = wordcount($(this).text());



        if (word_count + elem_word_count > WORD_LIMIT || headerTags.indexOf($(this)[0].name) > -1) {

            createPage(page_count, page_html);

            page_count += 1;
            page_html = $(this);
            word_count = elem_word_count;

            if (headerTags.indexOf($(this)[0].name) > -1) {
                word_count += WORD_LIMIT;
            }
        } else {
            page_html = page_html + $(this);
            word_count = word_count + elem_word_count + 10;
        }
    });

    function createPage(page_count, page_html) {

        const START_PAGE = '<div class="leaf flex"><div class="inner justify">';
        const END_PAGE = '</div> </div>';

        var path = require('path');
        
        var dir = path.join(path.join("manuscript", "page-" + page_count));

        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir);
        }

        var page = fs.openSync(path.join("manuscript", "page-" + page_count, "body.html"), 'w+');
        page_html = START_PAGE + page_html + END_PAGE;

        fs.writeSync(page, page_html, 0, page_html.length);

    }

}



module.exports.paginate = paginate;
