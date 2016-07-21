try {
    // Pick up the original html
    var fs = require("fs");
    const path = require('path');
    var scroll = fs.readFileSync(path.join('interim', 'homogenized.html'));
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

        const TEMPLATE_START = '<div class="leaf flex"><div class="inner justify">';
        const TEMPLATE_END = '</div> </div>';

        const START_PAGE = 9;

        let page_number = page_count + START_PAGE;

        const path = require('path');
        
        const dir = path.join(path.join("manuscript", `page-${page_number}`));

        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir);
        }

        const page = fs.openSync(path.join("manuscript", `page-${page_number}`, "body.html"), 'w+');
        page_html = TEMPLATE_START + page_html + TEMPLATE_END;

        fs.writeSync(page, page_html, 0, page_html.length);

    }

}

module.exports.paginate = paginate;