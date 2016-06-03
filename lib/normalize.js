try {
    // Pick up the sanitized html
    var fs = require('fs');
    var path = require('path');
    var scroll = fs.readFileSync(path.join('interim', 'sanitized.html'));

} catch (e) {
    if (e.code === 'ENOENT') {
        console.log('File not found!');

    } else {
        throw e;
    }
    process.exit(1);
}


function normalize() {

    // const CHARACTER_LIMIT = 850; // Based on visual readability tests
    // const PAGE_WORD_LIMIT = 120; // Full page
    // const LINE_LIMIT = 16;


    const PARA_WORD_LIMIT = 50; // Fine tune according to style or literature.


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


    outPutNormalizedBook(normalizedHTML);

    function splitPara(para) {
        var text = mutateHonorifics(para).trim();

        var sentencesArray = text.split(". ");

        var newHTML = [];
        var newParagraph = " ";

        for (i = 0; i < sentencesArray.length; i++) {
            var punctuation = ". ";

            var lastCharacter = sentencesArray[i].slice(-1);

            if (lastCharacter === ":" || lastCharacter === '"' || lastCharacter === ";" || lastCharacter === "-" || lastCharacter === "—" || lastCharacter === "." || lastCharacter === ",") {
                punctuation = " ";
            }

            newParagraph = newParagraph + sentencesArray[i] + punctuation;
            if (wordcount(newParagraph) > PARA_WORD_LIMIT) {
                newHTML.push('<p>' + newParagraph + '</p>');
                newParagraph = " ";
            }

        }
        var paragraphs = reverseHonorifics(newHTML.join(' '));

        return paragraphs;
    }

    function mutateHonorifics(para) {
        var paraString = para;

        var initials = ["Mr.", "Mrs.", "Ms.", "Jr.", "Sr.", "St.", "Dr.", "Fr.", "Br.", "Mx."];

        var fooInitials = ['Mr~', 'Mrs~', 'Ms~', 'Jr~', 'Sr~', 'St~', 'Dr~', 'Fr~', 'Br~', 'Mx~'];

        var length = initials.length;

        while (length--) {
            var regExp = escapeRegExp(initials[length]);

            if (paraString.indexOf(initials[length]) != -1) {
                paraString = paraString.replace(new RegExp(regExp, 'g'), fooInitials[length]);
            }
        }
        return paraString;
    }

    function reverseHonorifics(paras) {

        var paraString = paras;

        var initials = ["Mr.", "Mrs.", "Ms.", "Jr.", "Sr.", "St.", "Dr.", "Fr.", "Br.", "Mx."];

        var fooInitials = ['Mr~', 'Mrs~', 'Ms~', 'Jr~', 'Sr~', 'St~', 'Dr~', 'Fr~', 'Br~', 'Mx~'];

        var length = initials.length;

        while (length--) {
            var regExp = escapeRegExp(fooInitials[length]);

            if (paraString.indexOf(fooInitials[length]) != -1) {
                paraString = paraString.replace(new RegExp(regExp, 'g'), initials[length]);
            }
        }
        return paraString;

    }

    function escapeRegExp(str) {
        return str.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, "\\$&");
    }


    function outPutNormalizedBook(book) {

        book = book.replace(new RegExp("&quot;", 'g'), '"');
        book = '<body>' + book + '</body>';

        var saver = require(path.join('..', 'lib', 'saver.js'));

        var filename = "normalized";
        saver.save(book, filename);

        process.exit();

    }

}

module.exports.normalize = normalize;
