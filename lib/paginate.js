try {
    // Pick up the original html
    var fs = require("fs");
    const path = require('path');
    var scroll = fs.readFileSync(path.join('interim', 'normalized.html'));
} catch (e) {
    if (e.code === 'ENOENT') {
        console.log('File not found!');

    } else {
        throw e;
    }
    process.exit(1);
}


function paginate() {

    const WORD_LIMIT = 160;

    const wordcount = require('wordcount');      
    
    const headerTags = ['h1', 'h2', 'h3'];

    const cheerio = require("cheerio");
    const $ = cheerio.load(scroll);

    let page_count = 1;
    let word_count = 0;
    let page_html = "";

    $('body').children().each(function(i, elem) {

        const elem_word_count = wordcount($(this).text());

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

        const path = require('path');
        
        const dir = path.join(path.join("manuscript", `page-${page_count}`));

        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir);
        }

        const page = fs.openSync(path.join("manuscript", `page-${page_count}`, "body.html"), 'w+');
        page_html = START_PAGE + page_html + END_PAGE;

        fs.writeSync(page, page_html, 0, page_html.length);

    }

}

module.exports.paginate = paginate;
