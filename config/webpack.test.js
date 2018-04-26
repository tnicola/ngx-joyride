const path = require('path');
const helpers = require('./helpers');

module.exports = {
    devtool: 'inline-source-map',

    resolve: {
        extensions: ['.js', '.ts', '.html'],
        alias: {
            'angular2-joyride': path.resolve(__dirname, '../src/lib')
        }
    },
    module: {
        rules: [
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
                test: /\.(css|scss|sass)$/,
                loaders: ['to-string-loader', 'css-loader']
            },
        ]
    }
};