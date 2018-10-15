const webpackTest = require('./config/webpack.test');

module.exports = function (config) {
    var conf = {
        basePath: '',
        frameworks: ['jasmine'],
        files: [
            { pattern: './config/karma-test-shim.js', watched: false }
        ],
        preprocessors: {
            './config/karma-test-shim.js': ['webpack', 'sourcemap'],
            './src/lib/src/**/*.ts': 'coverage'
        },
        webpack: webpackTest,
        webpackMiddleware: {
            stats: 'errors-only'
        },
        reporters: ['progress', 'kjhtml', 'coverage-istanbul'],
        coverageIstanbulReporter: {
            dir: require('path').join(__dirname, '../../coverage'),
            reports: ['text-summary', 'html', 'lcovonly'],
            fixWebpackSourcePaths: true
        },
        logLevel: config.LOG_INFO,
        autoWatch: true,
        browsers: ['Chrome'],
        singleRun: false,
        mime: {
            'text/x-typescript': ['ts']
        },
        client: { clearContext: false },
        colors: true
    };
    if (process.env.TRAVIS) {
        conf.browsers = ['ChromeHeadlessNoSandbox'];
        conf.singleRun = true
    }
    config.set(conf);
};