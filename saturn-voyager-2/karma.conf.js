module.exports = (config) => {
  config.set({
    frameworks: ['browserify', 'jasmine-jquery', 'jasmine'],
    browsers: ['PhantomJS'],
    files: [
      'libs/jquery.min.js',
      'spec/*.js'
    ],
    preprocessors: {
      'spec/*.js': ['browserify']
    },
    browserify: {
      debug: true,
      transform: ['babelify']
    },
    reporters: ['spec']
  });
};
