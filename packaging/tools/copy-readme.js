const { PATH_LIB, PATH_DIST } = require('../config-library.js');

const fs = require('fs');

let resizable = fs.readFileSync(PATH_LIB + 'README.md').toString();
fs.writeFileSync(PATH_DIST + 'README.md', resizable);
