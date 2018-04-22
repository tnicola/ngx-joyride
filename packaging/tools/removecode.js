const { PATH_BUILD, PATH_DIST } = require('../config-library.js');

const del = require('del');
var fs = require("fs-extra");

del([PATH_BUILD + '**/*.js']).then(paths => {
    console.log('Files and folders that would be deleted:\n', paths.join('\n'));
    fs.copy(PATH_BUILD, PATH_DIST)
        .then(() =>
            del([PATH_BUILD]).then(paths => {
                console.log('Build folder deleted.\n');
            }))
        .catch(() => {
            if (err) return console.error(err)
        });
});
