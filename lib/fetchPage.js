function fetchPage(url) {
    var request = require("request");
    var fs = require("fs");

    if (!fs.existsSync('original.html')) {
        request(url, function(error, response, book) {
            if (!error) {

                saveOriginalBook(book);
                return true;


            } else {
                console.log("We’ve encountered an error: " + error);
                return false;
            }

        });
    } else {
        console.log('Was saved earlier!');
        return true;
    }

}


module.exports.fetch = fetchPage; // Should return boolean true/false
