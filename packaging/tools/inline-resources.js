const { PATH_LIB, PATH_TMP } = require('../config-library.js');
var inlineResources = require('./inline-html-css');
const fs = require('fs-extra');

// Copy folder 'src' to 'tmp' then inline resources
Promise.resolve()
    .then(() =>
        fs.copy(PATH_LIB, PATH_TMP)
    )
    .then(() => {
        console.info("[PACKAGING]::: Copying sources to tmp folder");
        console.info("[PACKAGING]::: Inlining html templates and css styles");
        Promise.resolve()
            .then(() => inlineResources(PATH_TMP))
    });