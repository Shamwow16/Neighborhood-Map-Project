var gulp = require('gulp');
var uglify = require('gulp-uglify');
var cleanCss = require('gulp-clean-css');


gulp.task('hello', function() {
    console.log('Hello Shamyle');
});

gulp.task('compress', function() {
    return gulp.src('app/js/*.js')
        .pipe(uglify())
        .pipe(gulp.dest('dist/js'));
})

gulp.task('clean', function() {
    return gulp.src('app/css/*.css')
        .pipe(cleanCss())
        .pipe(gulp.dest('dist/css'));
})

gulp.task('default', ['compress', 'clean']);
