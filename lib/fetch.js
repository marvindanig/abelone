function fetch(url, options) {
    const fs = require('fs');
    const path = require('path');
    const request = require('request');

    // One time 
    if (!fs.existsSync('interim')){
        fs.mkdirSync('interim');
    }

    if (!fs.existsSync(path.join('interim', 'original.html')) || options.force) {
        request(url, (error, response, book) => {
            if (!error) {                
                const saver = require(path.join('..', 'lib', 'saver.js'));
                const filename = "original";
                saver.save(book, filename);
                process.exit();

            } else {
                console.log(`We’ve encountered an error: ${error}`);
                process.exit(1);
            }

        });
    } else {
        console.log('Page exists!');
        return true;
    }
}


module.exports.fetch = fetch; // Should return boolean true/false
