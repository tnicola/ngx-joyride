const webpackTest = require('./config/webpack.test');

module.exports = function (config) {
    var conf = {
        basePath: '',
        frameworks: ['jasmine'],
        files: [
            { pattern: './config/karma-test-shim.js', watched: false }
        ],
        preprocessors: {
            './src/lib/src/**/*.ts': ['webpack', 'sourcemap', 'coverage'],
            './config/karma-test-shim.js': ['webpack', 'sourcemap']
        },
        webpack: webpackTest,
        webpackMiddleware: {
            stats: 'errors-only'
        },
        reporters: ['progress', 'kjhtml', 'coverage-istanbul'],
        coverageIstanbulReporter: {
            dir: 'coverage/',
            reports: ['text-summary', 'html', 'lcovonly'],
            fixWebpackSourcePaths: true
        },
        logLevel: config.LOG_INFO,
        autoWatch: true,
        browsers: ['Chrome'],
        singleRun: false,
        client: { clearContext: false },
        colors: true,
        customLaunchers: {
            ChromeHeadlessNoSandbox: {
                base: 'ChromeHeadless',
                flags: ['--no-sandbox']
            }
        }
    };
    if (process.env.TRAVIS) {
        conf.browsers = ['ChromeHeadlessNoSandbox'];
        conf.singleRun = true
    }
    config.set(conf);
};