const webpackTest = require('./config/webpack.test');

module.exports = function (config) {
    var conf = {
        basePath: '',
        frameworks: ['jasmine'],
        files: [
            { pattern: './config/karma-test-shim.js', watched: false }
        ],
        exclude: [
        ],
        preprocessors: {
            './config/karma-test-shim.js': ['webpack', 'sourcemap']
        },
        webpack: webpackTest,
        webpackMiddleware: {
            stats: 'errors-only'
        },
        webpackServer: {
            noInfo: true
        },
        reporters: ['progress', 'kjhtml'],
        client: { clearContext: false },
        port: 9876,
        colors: true,
        logLevel: config.LOG_INFO,
        autoWatch: true,
        browsers: ['Chrome'],
        customLaunchers: {
            Chrome_travis_ci: {
                base: 'Chrome',
                flags: ['--no-sandbox']
            }
        },

        singleRun: false
    }
    if (process.env.TRAVIS) {
        conf.browsers = ['Chrome_travis_ci'];
    }
    config.set(conf);
}