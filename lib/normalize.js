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


function normalize() { 
    const CHARACTER_LIMIT = 850;
    const WORD_LIMIT = 120; // Full page
    const LINE_LIMIT = 16;
    const PARA_LIMIT = 60;

    var wordcount = require('wordcount');

    var cheerio = require("cheerio");
    var $ = cheerio.load(scroll);

    $('p').each(function(i, elem) { 
      var para = $(this).text();
      var para_word_count = wordcount(para);

      var ratio = Math.round(para_word_count / PARA_LIMIT);

      console.log(ratio);

      console.log(para_word_count);

      var sentences = [];
      var periods = 0;

      if (para_word_count > WORD_LIMIT) {
        sentences = para.split('.');
        periods = (para.match(new RegExp(". ", "g")) || []).length;
      }
    });
}



module.exports.normalize = normalize;
