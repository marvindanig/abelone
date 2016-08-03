function homogenize() {

    const fsp = require('fs-promise');
    const path = require('path');
    const chalk = require('chalk');
    const cheerio = require("cheerio");
    const wordcount = require('wordcount');

    const headerTags = ['h1', 'h2', 'h3'];


    fsp.readFile(path.join('interim', 'normalized.html'), { encoding: 'utf8' })
        .then((contents) => {

            const $ = cheerio.load(contents);

            $('body').children().each(function(i, elem) {

                if (headerTags.indexOf($(this)[0].name) > -1 || $(this)[0].name === 'img') {

                } else {
                    console.log(i);
                    console.log(wordcount($(elem).text()));
                    console.log(wordcount($(this).text()));
                    console.log('----------');

                }
            }); 


        }).catch((err) => {
            if (err)
                console.log(chalk.bold.red('Failed to pick up contents', err));

        });





    // const CHARACTER_LIMIT = 850; // Based on visual readability tests
    // const PAGE_WORD_LIMIT = 120; // Full page
    // const LINE_LIMIT = 16;


    // const PARA_WORD_LIMIT = 50; // Fine tune according to style or literature.

    // let normalizedHTML = "";
    // let newElem = "";

    // $('body').children().each(function(i, elem) {

    //     if (elem.name === 'p') {

    //         const para = $(this).text();
    //         const paraLength = wordcount(para);

    //         const ratio = Math.round(paraLength / PARA_WORD_LIMIT);

    //         if (ratio > 1) {
    //             newElem = splitPara(para);
    //         } else {
    //             newElem = $(this);
    //         }

    //     } else {
    //         newElem = $(this);
    //     }
    //     normalizedHTML = normalizedHTML + newElem;
    //     newElem = "";
    // });


    // outPutNormalizedBook(normalizedHTML);

    // function splitPara(para) {
    //     const text = mutateHonorifics(para).trim();

    //     const sentencesArray = text.split(". ");

    //     const newHTML = [];
    //     let newParagraph = " ";

    //     for (i = 0; i < sentencesArray.length; i++) {
    //         let punctuation = ". ";

    //         const lastCharacter = sentencesArray[i].slice(-1);

    //         if (lastCharacter === ":" || lastCharacter === '"' || lastCharacter === ";" || lastCharacter === "-" || lastCharacter === "—" || lastCharacter === "." || lastCharacter === ",") {
    //             punctuation = " ";
    //         }

    //         newParagraph = newParagraph + sentencesArray[i] + punctuation;
    //         if (wordcount(newParagraph) > PARA_WORD_LIMIT) {
    //             newHTML.push(`<p>${newParagraph}</p>`);
    //             newParagraph = " ";
    //         }

    //     }
    //     const paragraphs = reverseHonorifics(newHTML.join(' '));

    //     return paragraphs;
    // }

    // function mutateHonorifics(para) {
    //     let paraString = para;

    //     const initials = ["Mr.", "Mrs.", "Ms.", "Jr.", "Sr.", "St.", "Dr.", "Fr.", "Br.", "Mx."];

    //     const fooInitials = ['Mr~', 'Mrs~', 'Ms~', 'Jr~', 'Sr~', 'St~', 'Dr~', 'Fr~', 'Br~', 'Mx~'];

    //     let length = initials.length;

    //     while (length--) {
    //         const regExp = escapeRegExp(initials[length]);

    //         if (paraString.indexOf(initials[length]) != -1) {
    //             paraString = paraString.replace(new RegExp(regExp, 'g'), fooInitials[length]);
    //         }
    //     }
    //     return paraString;
    // }

    // function reverseHonorifics(paras) {

    //     let paraString = paras;

    //     const initials = ["Mr.", "Mrs.", "Ms.", "Jr.", "Sr.", "St.", "Dr.", "Fr.", "Br.", "Mx."];

    //     const fooInitials = ['Mr~', 'Mrs~', 'Ms~', 'Jr~', 'Sr~', 'St~', 'Dr~', 'Fr~', 'Br~', 'Mx~'];

    //     let length = initials.length;

    //     while (length--) {
    //         const regExp = escapeRegExp(fooInitials[length]);

    //         if (paraString.indexOf(fooInitials[length]) != -1) {
    //             paraString = paraString.replace(new RegExp(regExp, 'g'), initials[length]);
    //         }
    //     }
    //     return paraString;

    // }

    // function escapeRegExp(str) {
    //     return str.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, "\\$&");
    // }


    // function outPutNormalizedBook(book) {

    //     book = book.replace(new RegExp("&quot;", 'g'), '"');
    //     book = `<body>${book}</body>`;

    //     const saver = require(path.join('..', 'lib', 'saver.js'));

    //     const filename = "normalized";
    //     saver.save(book, filename);

    // }




}

module.exports.homogenize = homogenize; // Should return boolean true/false
