try {
    // Pick up the sanitized html
    const fs = require('fs');
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

    const PARA_WORD_LIMIT = 50; // Fine tune according to style or literature.
    const wordcount = require('wordcount');
    const cheerio = require("cheerio");
    const $ = cheerio.load(scroll);

    let normalizedHTML = "";
    let newElem = "";

    $('body').children().each(function(i, elem) {

        if (elem.name === 'p') {

            const para = $(this).text();
            const paraLength = wordcount(para);

            const ratio = Math.round(paraLength / PARA_WORD_LIMIT);

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
        const text = mutateHonorifics(para).trim();

        const sentencesArray = text.split(". ");

        const newHTML = [];
        let newParagraph = " ";

        for (i = 0; i < sentencesArray.length; i++) {
            let punctuation = ". ";

            const lastCharacter = sentencesArray[i].slice(-1);

            if (lastCharacter === ":" || lastCharacter === '"' || lastCharacter === ";" || lastCharacter === "-" || lastCharacter === "—" || lastCharacter === "." || lastCharacter === ",") {
                punctuation = " ";
            }

            newParagraph = newParagraph + sentencesArray[i] + punctuation;
            if (wordcount(newParagraph) > PARA_WORD_LIMIT) {
                newHTML.push(`<p>${newParagraph}</p>`);
                newParagraph = " ";
            }

        }
        const paragraphs = reverseHonorifics(newHTML.join(' '));

        return paragraphs;
    }

    function mutateHonorifics(para) {
        let paraString = para;

        const initials = ["Mr.", "Mrs.", "Ms.", "Jr.", "Sr.", "St.", "Dr.", "Fr.", "Br.", "Mx."];

        const fooInitials = ['Mr~', 'Mrs~', 'Ms~', 'Jr~', 'Sr~', 'St~', 'Dr~', 'Fr~', 'Br~', 'Mx~'];

        let length = initials.length;

        while (length--) {
            const regExp = escapeRegExp(initials[length]);

            if (paraString.indexOf(initials[length]) != -1) {
                paraString = paraString.replace(new RegExp(regExp, 'g'), fooInitials[length]);
            }
        }
        return paraString;
    }

    function reverseHonorifics(paras) {

        let paraString = paras;

        const initials = ["Mr.", "Mrs.", "Ms.", "Jr.", "Sr.", "St.", "Dr.", "Fr.", "Br.", "Mx."];

        const fooInitials = ['Mr~', 'Mrs~', 'Ms~', 'Jr~', 'Sr~', 'St~', 'Dr~', 'Fr~', 'Br~', 'Mx~'];

        let length = initials.length;

        while (length--) {
            const regExp = escapeRegExp(fooInitials[length]);

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
        book = `<body>${book}</body>`;

        const saver = require(path.join('..', 'lib', 'saver.js'));

        const filename = "normalized";
        saver.save(book, filename);

    }

}

module.exports.normalize = normalize;
