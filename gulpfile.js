var gulp = require('gulp');
var sourcemaps = require('gulp-sourcemaps');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var cleanCSS = require('gulp-clean-css');
var rename = require('gulp-rename');

// JS Files
var jsFiles = [
    'src/js/Sweeper.js',
    'src/js/Game.js'
];

gulp.task('default', ['minify-css'], function ()
{
    return gulp.src(jsFiles)
        .pipe(sourcemaps.init())
        .pipe(uglify())
        .pipe(concat('sweeper.min.js'))
        .pipe(sourcemaps.write('.'))
        .pipe(gulp.dest('dist'));
});


// CSS Files
var cssFiles = [
    'src/css/sweeper.css'
];

gulp.task('minify-css', function()
{
    return gulp.src(cssFiles)
        .pipe(sourcemaps.init())
        .pipe(cleanCSS())
        .pipe(sourcemaps.write())
        .pipe(rename('sweeper.min.css'))
        .pipe(gulp.dest('dist'));
});