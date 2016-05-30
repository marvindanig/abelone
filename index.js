var fs = require('fs');
var request = require('request');

var src = "http://www.gutenberg.org/files/500/500-h/500-h.htm";

guten(src);

function guten(src) {
    request(src, function(error, response, body) {
        //console.log (error);
        if (!error && response.statusCode == 200) {
            var text = body;
            var textSelect = text.substring(1000, 3000); // *** this is where you definite your search params! *** 
            console.log(textSelect);
            var data = fs.readFileSync("collector.txt"); //read existing contents into data (make this txt file if it doesn't exist)
            var fd = fs.openSync("collector.txt", 'w+');
            var buffer = new Buffer(textSelect);
            fs.writeSync(fd, buffer, 0, buffer.length); //write new data
            fs.writeSync(fd, data, 0, data.length); //append old data
            fs.close(fd);
        }
    });
}