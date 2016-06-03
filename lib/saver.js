function saveFile(html, filename) {
    var fs = require('fs');
    var path = require('path');

    filename = filename + ".html";

    var newFile = fs.openSync(path.join('interim', filename), 'w');
    fs.writeSync(newFile, html, 0, html.length);
    
    fs.close(newFile);

    console.log(filename + ' page saved!');

    return true;
}

module.exports.save = saveFile;