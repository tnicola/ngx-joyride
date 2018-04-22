import config from './rollup.config.js';
const { nameLibrary, PATH_DIST } = require('./config-library.js');
import typescript from 'rollup-plugin-typescript';

config.output.format = "es";
config.output.file = PATH_DIST + 'esm5/' + nameLibrary + ".esm.js";
config.plugins.push(typescript({
    typescript: require('typescript'),
}));

export default config;
