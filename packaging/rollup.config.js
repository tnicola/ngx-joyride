import resolve from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';
import angular from 'rollup-plugin-angular';
import uglify from 'rollup-plugin-uglify';

var sass = require('node-sass');
const { nameLibrary, PATH_SRC } = require('./config-library.js');


export default {
    input: PATH_SRC + 'joyride.ts',
    output: {
        name: nameLibrary,
        exports: 'named',
        sourcemap: true
    },
    external: [
        "@angular/core",
        "@angular/common",
        "@angular/compiler",
        "@angular/compiler-cli",
        "@angular/router",
        "rxjs",
        "zone.js"
    ],
    plugins: [
        angular(
            {
                preprocessors: {
                    template: template => template,
                    style: scss => {
                        let css;
                        if (scss) {
                            css = sass.renderSync({ indentedSyntax: false, data: scss }).css.toString(); //indentedSyntax: false SCSS, indentedSyntax: true SASS
                        } else {
                            css = '';
                        }

                        return css;
                    },
                }
            }
        ),
        resolve({
            module: true,
            main: true
        }),
        /*Used for 3rd part library like rxjs built as commonjs module*/
        commonjs({
            include: 'node_modules/**'
        }),
        uglify()
    ],
    onwarn: warning => {
        const skip_codes = [
            'THIS_IS_UNDEFINED',
            'MISSING_GLOBAL_NAME',
            'CIRCULAR_DEPENDENCY'
        ];
        if (skip_codes.indexOf(warning.code) != -1) return;
        console.error(warning);
    }
};