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
            './config/karma-test-shim.js': ['webpack', 'sourcemap'],
            './src/lib/src/**/*.ts': 'coverage'
        },
        webpack: webpackTest,
        webpackMiddleware: {
            stats: 'errors-only'
        },
        webpackServer: {
            noInfo: true
        },
        reporters: ['progress', 'kjhtml', 'coverage'],
        coverageReporter: {
            type: 'lcov',
            dir: 'coverage/'
        },
        client: { clearContext: false },
        port: 9876,
        colors: true,
        logLevel: config.LOG_INFO,
        autoWatch: true,
        browsers: ['Chrome', 'ChromeHeadless'],
        customLaunchers: {
            ChromeHeadlessNoSandbox: {
                base: 'ChromeHeadless',
                flags: ['--no-sandbox']
            }
        },
        singleRun: false
    }
    if (process.env.TRAVIS) {
        conf.browsers = ['ChromeHeadlessNoSandbox'];
        conf.singleRun = true
    }
    config.set(conf);
}