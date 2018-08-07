const gulp = require('gulp'),
    loadPlugins = require('gulp-load-plugins'),
    $ = loadPlugins();

loadPlugins.cleanCss = require("gulp-clean-css");
loadPlugins.buffer = require("vinyl-buffer");
loadPlugins.uglify = require("gulp-uglify");
loadPlugins.gulpif = require("gulp-if");
loadPlugins.browserify = require('gulp-browserify');

const app = {
    htmlPath: 'views/',
    srcPath: 'static/',
    devPath: 'build-repo/build-test/static'
};

gulp.task('js', function () {
    return gulp.src([app.srcPath + '**/*.js'], {base: app.srcPath})
        .pipe($.sourcemaps.init())
        .pipe($.plumber())
        .pipe($.babel({
            presets: ['es2015']
        }))
        .pipe(loadPlugins.browserify({
            transform: ['babelify']
        }))
        .pipe(loadPlugins.buffer())
        // .pipe(loadPlugins.uglify())
        .pipe($.sourcemaps.write("/"))
        .pipe(gulp.dest(app.devPath));
});

gulp.task('css', function () {
    return gulp.src([app.srcPath + '**/*.sass', app.srcPath + '**/*.scss', app.srcPath + '**/*.css'], {base: app.srcPath})
        .pipe($.sourcemaps.init())
        .pipe($.sass().on('error', $.sass.logError))
        .pipe($.autoprefixer({
            browsers: ['last 3 version', '> 0.5%', 'Android >= 4.0', 'ie >= 6', 'Firefox > 0', 'Opera > 0'], // 主流浏览器的最新三个版本、全球0.5%以上的使用、安卓4.0及以上、ie>=6、所有firefox、所有欧朋（firefox、欧朋根据实际需要）
            remove: true, // 是否去掉不必要（过时）的前缀
            flexbox: true, // flexbox属性是否为IE添加前缀
        }))
        .pipe(loadPlugins.cleanCss({
            advanced: false,//类型：Boolean 默认：true [是否开启高级优化（合并选择器等）]
            compatibility: 'ie7',//类型：String 默认：''or'*' [启用兼容模式； 'ie7'：IE7兼容模式，'ie8'：IE8兼容模式，'*'：IE9+兼容模式]
            keepSpecialComments: "*,_",
            format: {
                breaks: {
                    // controls where to insert breaks
                    afterBlockEnds: false,
                    afterRuleEnds: false
                }
            }
        }))
        .pipe($.sourcemaps.write("/"))
        .pipe(gulp.dest(app.devPath));
});

gulp.task('image', function (cb) {
    return gulp.src(app.srcPath + '**/*.{png,jpg,gif,ico,jpeg,svg}', {base: app.srcPath})
        .pipe(gulp.dest(app.devPath));
});


gulp.task('html', function () {
    return gulp.src(app.srcPath + '**/*.html', {base: app.srcPath})
        .pipe(gulp.dest(app.devPath));
});

gulp.task('clean', function () {
    return gulp.src(app.devPath)
        .pipe($.clean());
});

//浏览器同步
gulp.task('webserve', function () {
    return gulp.src(app.devPath)
        .pipe($.webserver({
            livereload: true, //开启gulp-livereload
            open: true,
            port: 3018 //浏览器端口
        }));
});

// build
gulp.task('watch', function () {
    gulp.watch(app.srcPath + '**/*.js', ['js']);
    gulp.watch(app.srcPath + '**/*.{png,jpg,gif,ico,jpeg,svg}', ['image']);
    gulp.watch([app.srcPath + '**/*.scss', app.srcPath + '**/*.sass', app.srcPath + '**/*.css'], ['css']);
    gulp.watch(app.srcPath + '**/*.html', ['html']);
});

gulp.task("build", ['js', 'css', 'image']);

//定义gulp默认任务
gulp.task('default', ['webserve', 'watch']);