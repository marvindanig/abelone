var fs = require("fs");

function fetch(url, options) {
    'use strict';

    var request = require("request");
    
    if (!fs.existsSync('original.html') || options.force) {
        request(url, function(error, response, book) {
            if (!error) {
                saveOriginalBook(book);
                console.log('Original page saved!');
                process.exit();

            } else {
                console.log("We’ve encountered an error: " + error);
                process.exit(1);
            }

        });
    } else {
        console.log('Page exists!');
        return true;
    }

}


function saveOriginalBook(html) {
    var originalBook = fs.openSync("original.html", 'w');
    fs.writeSync(originalBook, html, 0, html.length);
    fs.close(originalBook);
}


module.exports.fetch = fetch; // Should return boolean true/false
