function fetch(url, options) {
    'use strict';

    var fs = require('fs');
    var path = require('path');
    var request = require('request');
    
    if (!fs.existsSync(path.join('interim', 'original.html')) || options.force) {
        request(url, function(error, response, book) {
            if (!error) {
                
                var saver = require(path.join('..', 'lib', 'saver.js'));
                
                var filename = "original";

                saver.save(book, filename);
                
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




module.exports.fetch = fetch; // Should return boolean true/false
