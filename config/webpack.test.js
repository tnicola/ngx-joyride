const path = require('path');
const helpers = require('./helpers');

module.exports = {
    devtool: 'inline-source-map',

    resolve: {
        extensions: ['.js', '.ts', '.html'],
        alias: {
            'ngx-joyride': path.resolve(__dirname, '../src/lib')
        }
    },
    module: {
        rules: [
            {
                enforce: 'post',
                test: /\.ts$/,
                loader: 'istanbul-instrumenter-loader',
                query: {
                    esModules: true
                },
                include: helpers.root('src', 'lib', 'src'),
                exclude: /(node_modules|spec\.ts$|fake|class)/,
            },
            {
                test: /\.ts$/,
                loaders: [
                    {
                        loader: 'awesome-typescript-loader',
                        options: { configFileName: helpers.root('tsconfig-spec.json') }
                    }, 'angular2-template-loader'
                ]
            },
            {
                test: /\.html$/,
                loader: 'html-loader'

            },
            {
                test: /\.(sass|scss)$/,
                use: [
                    {
                        loader: 'to-string-loader'
                    }, {
                        loader: "css-loader", options: {
                            sourceMap: true
                        }
                    }, {
                        loader: "sass-loader", options: {
                            sourceMap: true
                        }
                    }]
            },
            {
                test: /\.(png|jpe?g|gif|svg|woff|woff2|ttf|eot|ico)$/,
                loader: 'file-loader?name=assets/[name].[hash].[ext]'
            },
        ]
    }
};