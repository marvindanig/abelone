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
    const PAGE_WORD_LIMIT = 120; // Full page
    const LINE_LIMIT = 16;


    const PARA_WORD_LIMIT = 50;


    var wordcount = require('wordcount');

    var cheerio = require("cheerio");
    var $ = cheerio.load(scroll);

    var normalizedHTML = "";
    var newElem = "";

    $('body').children().each(function(i, elem) {

        if (elem.name === 'p') {

            var para = $(this).text();
            var paraLength = wordcount(para);

            var ratio = Math.round(paraLength / PARA_WORD_LIMIT);

            if (ratio > 1) {
                newElem = splitPara(para);
            } else {
                newElem = $(this);
            }

        } else {
            newElem = $(this);
        }
        normalizedHTML = normalizedHTML + newElem;
        newElem = "";
    });

    var normalizedBook = fs.openSync("normalized.html", 'w');
    
    normalizedHTML = normalizedHTML.replace(new RegExp("&quot;", 'g'), '"');
    normalizedHTML = '<body>' + normalizedHTML + '</body>';

    fs.writeSync(normalizedBook, normalizedHTML, 0, normalizedHTML.length);
    fs.close(normalizedBook);

    console.log('Normalized html created!');
    process.exit();



    function splitPara(para) {
        var text = replaceInitials(para).trim();

        var sentencesArray = text.split(".");
        
        sentencesArray = sentencesArray.slice(0, -1);

        var newHTML = [];
        var newParagraph = " ";

        for (i = 0; i < sentencesArray.length; i++) {

            if (wordcount(newParagraph) > PARA_WORD_LIMIT) {
                newHTML.push('<p>' + newParagraph + '.</p>');
                newParagraph = sentencesArray[i];
            } else {
                newParagraph = newParagraph + sentencesArray[i];
            }

        }
        return newHTML.join(' ');
    }

    function replaceInitials(para) {
        var paraString = para;

        var initials = ["Mr.", "Mrs.", "Ms.", "Jr.", "Sr.", "St.", "Dr.", "Fr.", "Br.", "Mx."];

        var fooInitials = ['Mr~', 'Mrs~', 'Ms~', 'Jr~', 'Sr~', 'St~', 'Dr~', 'Fr~', 'Br~', 'Mx~'];

        var length = initials.length;

        while (length--) {
            if (paraString.indexOf(initials[length]) != -1) {
              paraString = paraString.replace(new RegExp(/^initials[length]$/, 'g'), fooInitials[length]);
            }
        }
        return paraString;
    }


}



module.exports.normalize = normalize;
