const { PATH_DIST, PATH_TMP } = require('../config-library.js');
const fs = require('fs');
const del = require('del');

/*Copying package.json*/
const packageJson = JSON.parse(fs.readFileSync(PATH_DIST + 'package.json').toString());
delete packageJson.devDependencies;
delete packageJson.scripts;
fs.writeFileSync(PATH_DIST + 'package.json', JSON.stringify(packageJson, null, 2));

/* Cleaning tmp folder */
del([PATH_TMP]).then(paths => {
    console.info("[PACKAGING]::: Cleaning tmp folder.");
});