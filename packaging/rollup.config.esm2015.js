import config from './rollup.config.js';
import typescript from 'rollup-plugin-typescript';
const { nameLibrary, PATH_DIST } = require('./config-library.js');

config.output.format = "es";
config.output.file = PATH_DIST + 'esm2015/' + nameLibrary + ".esm2015.js";
config.plugins.push(typescript({
    typescript: require('typescript'),
    target: "es2015",
    module: "es2015",
}));
export default config;