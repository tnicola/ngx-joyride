import config from './rollup.config.js';
import typescript from 'rollup-plugin-typescript';
const { nameLibrary, PATH_DIST } = require('./config-library.js');

config.output.format = 'umd';
config.output.file = PATH_DIST + 'bundles/' + nameLibrary + ".umd.js";
config.plugins.push(typescript({
    typescript: require('typescript'),
}));
export default config;
