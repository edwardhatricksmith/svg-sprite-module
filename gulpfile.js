var gulp        = require('gulp'),
    browserSync = require('browser-sync').create(),
    sass        = require('gulp-sass'),
    svgSprite = require('gulp-svg-sprite'),
    inject = require('gulp-inject');

// Compile sass into CSS & auto-inject into browsers
gulp.task('sass', function() {
    return gulp.src('src/scss/**/*.scss')
        .pipe(sass())
        .pipe(gulp.dest('app/css'))
        .pipe(browserSync.stream());
});

// Set sprite config using symbole mode
spriteConfig = {
    mode: {
        symbol: {
            // inline: false,
            dest: 'app/sprite',
            prefix: '#Icon-',
            sprite: 'icon-sprite',
            example: false
        }
    }
};

// Compile the SVG sprite
gulp.task('sprite', function() {
    return gulp.src('src/icons/**/*.svg')
        .pipe(svgSprite(spriteConfig))
        .pipe(gulp.dest('.'));
});

// Inject the sprite in the DOM
gulp.task('inject', ['sprite'], function() {
    gulp
        .src('./app/index.html')
        .pipe(
            inject(
                gulp.src([
                    'app/sprite/icon-sprite.svg',
                ]),
                {
                    starttag: '<!-- inject:sprite:{{ext}} -->',
                    transform: function(filePath, file) {
                        return file.contents.toString('utf8');
                    },
                },
            ),
        )
        .pipe(gulp.dest('./app'));
});

// Static Server + watching file changes
gulp.task('serve', ['sass', 'inject'], function() {

    browserSync.init({
        server: './app'
    });

    gulp.watch('src/scss/**/*.scss', ['sass']);
    gulp.watch('src/icons/*.svg', ['inject']);
    gulp.watch('app/*.html').on('change', browserSync.reload);
});

gulp.task('default', ['serve']);