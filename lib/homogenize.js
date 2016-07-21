try {
    // Pick up the original html
    var fs = require("fs");
    const path = require('path');
    var scroll = fs.readFileSync(path.join('interim', 'normalized.html'));
} catch (e) {
    if (e.code === 'ENOENT') {
        console.log('File not found!');

    } else {
        throw e;
    }
    process.exit(1);
}


function homogenize() {
  console.log('hi world');
}

module.exports.homogenize = homogenize; // Should return boolean true/false
