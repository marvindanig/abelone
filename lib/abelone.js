function transform(url) {
    'use strict';

    var fetch = require(path.join('..', 'lib', 'fetchPage.js'));

    if (fetchPage(url)) {
        sanitize();
        normalize();
        paginate();
    } else {
        console.log('Could not fetch the url supplied!');
    }
}

module.exports.transform = transform;
