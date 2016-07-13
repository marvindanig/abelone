function saveFile(html, filename) {
    const fs = require('fs');
    const path = require('path');

    filename = `${filename}.html`;

    const newFile = fs.openSync(path.join('interim', filename), 'w');
    fs.writeSync(newFile, html, 0, html.length);
    
    fs.close(newFile);

    console.log(`${filename} page saved!`);

    return true;
}


module.exports.save = saveFile;