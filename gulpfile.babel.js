// gulpfile.babel.js
// All this will error out if you don't use Babel
import htmlmin from "gulp-htmlmin";
import gulp from "gulp";
import sass from "gulp-sass";
import babel from "gulp-babel";
import imagemin from "gulp-imagemin";
import browserSync from "browser-sync";
import include from "gulp-include";

// Options
const htmlOptions = { collapseWhitespace: 'true' };
const sassOptions = { outputStyle: 'compressed', errLogToConsole: true };
const includeOptions = { extensions: ['js', 'html'], hardFail: true, separateInputs: true };
const jsOptions = { presets: ["@babel/preset-env"] };

exports.minify = () => (
    gulp.src(['./src/**/*.html',
        '!./src/partials/*.html'])
        .pipe(include(includeOptions))
        .pipe(htmlmin(htmlOptions))
        .pipe(gulp.dest('./dist/'))
);

exports.js = () => (
    gulp.src('./src/js/main.js')
        .pipe(include(includeOptions))
        .pipe(babel(jsOptions))
        .pipe(gulp.dest('./dist/js'))
);

exports.sass = () => (
    gulp.src('./src/scss/*.scss')
        .pipe(sass(sassOptions))
        .pipe(gulp.dest('./dist/css'))
        .pipe(browserSync.reload({ stream: true }))
);

exports.img = () => (
    gulp.src('./src/img/**/*')
        .pipe(imagemin())
        .pipe(gulp.dest('./dist/img'))
        .pipe(browserSync.reload({ stream: true }))
);

gulp.task('serve', () => {
    browserSync.init({
        server: {
            baseDir: './dist',
            index: 'index.html'
        },
        notify: false,
        injectChanges: true
    });
    gulp.watch('./src/**/*.html', gulp.series('minify'));
    gulp.watch('./src/js/**/*.js', gulp.series('js'));
    gulp.watch('./src/scss/**/*', gulp.series('sass'));
    gulp.watch('./src/img/**/*', gulp.series('img'));
    gulp.watch('./dist/*').on('change', browserSync.reload);
});

gulp.task('default', gulp.series('serve'));