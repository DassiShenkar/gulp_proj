var gulp        = require('gulp'),
    imagemin    = require('gulp-imagemin'),
    newer       = require('gulp-newer'),
    pkg         = require('./package.json'),
    preprocess  = require('gulp-preprocess');
    htmlclean   = require('gulp-htmlclean');
    sass        = require('gulp-sass');


var devBuild    = ((process.env.NODE_ENV || 'development').trim().toLowerCase() !== 'production'),
    source      = 'source/',
    dest        = 'build/',

    html = {
        in: source + '*.html',
        watch: [source + '*.html', source + 'template/**/*'],
        out: dest,
        context: {
            devBuild: devBuild,
            author: pkg.author,
            version: pkg.version
        }
    },

    css = {
        in: source + 'scss/*.*',
        watch: [source + 'scss/**/*'],
        out: dest + 'css/'
    },

    images = {
        in: source + 'images/*.*',
        out: dest + 'images/'
    };

//print build type
console.log(pkg.name + ' ' + pkg.version + ', ' + (devBuild ? 'development' :
 'production') + ' build');


//build html files
gulp.task('html', function() {

    var page = gulp.src(html.in).pipe(preprocess({context: html.context}));

    if(!devBuild) {
        page = page.pipe(htmlclean());
    }
    return page.pipe(gulp.dest(html.out));
});

//build css files
gulp.task('sass', function() {

    return gulp.src(css.in)
        .pipe(sass(css.sassOpts))
        .pipe(gulp.dest(css.out));
});

//manage images
gulp.task('images', function() {
    return gulp.src(images.in)
        .pipe(newer(images.out))
        .pipe(imagemin())
        .pipe(gulp.dest(images.out));
});

gulp.task('default', ['html', 'sass', 'images'], function() {

    gulp.watch(html.watch, ['html']);

    gulp.watch(images.in, ['images']);

    gulp.watch(css.watch, ['sass']);
});