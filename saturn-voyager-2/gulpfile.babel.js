import gulp from 'gulp';
import browserify from 'browserify';
import babelify from 'babelify';
import source from 'vinyl-source-stream';
import uglify from 'gulp-uglify';
import buffer from 'vinyl-buffer';
import { Server } from 'karma';

gulp.task('babelify', () => {
    browserify({
        entries: "./src/main.js"
    })
    .transform(babelify)
    .bundle()
    .on("error", (err) => {
            console.log("Error : " + err.message);
            this.emit("end");
    })
    .pipe(source("script.js"))
    .pipe(buffer())
    .pipe(uglify())
    .pipe(gulp.dest("./"));
});

gulp.task('spec', (done) => {
  new Server({
    configFile: `${__dirname}/karma.conf.js`,
    singleRun: true
  }, done).start();
});

gulp.task('watch', () => {
        gulp.watch(["./src/*.js", "./spec/*.js"], ["spec"]);
        gulp.watch("./src/*.js", ["babelify"]);
});
