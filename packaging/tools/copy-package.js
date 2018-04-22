const { PATH_LIB, PATH_DIST } = require('../config-library.js');

const fs = require('fs');
let resizable = fs.readFileSync(PATH_LIB + 'package.json').toString();
fs.writeFileSync(PATH_DIST + 'package.json', resizable);
