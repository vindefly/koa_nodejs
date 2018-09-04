const getCdn = require('./controller/GetCdn');

const gulp = require('gulp');

const gulpClean = require("gulp-clean");
const sourcemaps = require("gulp-sourcemaps");
const sass = require("gulp-sass");
const autoprefixer = require("gulp-autoprefixer");
const cleanCss = require("gulp-clean-css");
const gulpif = require("gulp-if");

const glob = require('glob');
const buffer = require("vinyl-buffer");
const babel = require('rollup-plugin-babel');
const rollup = require('rollup');

const runSequence = require('run-sequence');
const rev = require('gulp-rev');

const getJsonData = require('./controller/GetJsonData');
const config_env = getJsonData("./config/env.json");

const app = {
    viewsPath: 'views/',
    srcPath: 'static/',
    resourcesPath: 'static/resources/',
    distPath: 'dist/',
    devPath: 'dist/static/'
};

const { env } = process;
if (config_env) {
    env.NODE_ENV = config_env.NODE_ENV
} else {
    env.NODE_ENV = "dev";
}

gulp.task('js', function () {
    let run_rollup = (url) => {
        rollup.rollup({
            input: url,
            plugins: [
                buffer(),
                babel({
                    exclude: 'node_modules/**',
                    presets: ['es2015-rollup'],
                })
            ]
        }).then(bundle => {
            let fileName = url.substring(url.lastIndexOf("/") + 1);
            let moduleName = fileName.replace('.js', "");

            return bundle.write({
                file: app.distPath + url,
                format: 'iife',
                name: moduleName,
                sourcemap: false
            });
        }).catch(err => {
            console.log(`es6 gulp =file = ${url}===`, err)
        })
    };

    return glob(app.resourcesPath + '**/*.js', function (err, files) {
        files.forEach((url) => {
            run_rollup(url);
        });
    });
});

gulp.task('css', function () {
    return gulp.src([app.resourcesPath + '**/*.sass', app.resourcesPath + '**/*.scss', app.resourcesPath + '**/*.css'], { base: app.srcPath })
        .pipe(sourcemaps.init())
        .pipe(sass().on('error', sass.logError))
        .pipe(autoprefixer({
            browsers: ['last 3 version', '> 0.5%', 'Android >= 4.0', 'ie >= 6', 'Firefox > 0', 'Opera > 0'], // 主流浏览器的最新三个版本、全球0.5%以上的使用、安卓4.0及以上、ie>=6、所有firefox、所有欧朋（firefox、欧朋根据实际需要）
            remove: true, // 是否去掉不必要（过时）的前缀
            flexbox: true, // flexbox属性是否为IE添加前缀
        })).on("error", (err) => {
            console.log('css=====', err)
        })
        .pipe(cleanCss({
            advanced: false,//类型：Boolean 默认：true [是否开启高级优化（合并选择器等）]
            compatibility: 'ie7',//类型：String 默认：''or'*' [启用兼容模式； 'ie7'：IE7兼容模式，'ie8'：IE8兼容模式，'*'：IE9+兼容模式]
            keepSpecialComments: "*,_",
            format: {
                breaks: {
                    // controls where to insert breaks
                    afterBlockEnds: process.env.NODE_ENV !== "production" ? true : false,
                    afterRuleEnds: process.env.NODE_ENV !== "production" ? true : false
                }
            }
        }))
        .pipe(gulpif(
            process.env.NODE_ENV !== "production" ? true : false,
            sourcemaps.write('/', {
                addComment : true,
                sourceRoot: '/'
            })
        ))
        .pipe(gulp.dest(app.devPath))
});

gulp.task("rev", () => {
    return gulp.src([app.devPath + '/**/*.js', app.devPath + '/**/*.css', '!' + app.devPath + '/**/*-*.js', '!' + app.devPath + '/**/*-*.css', '!' + app.devPath + '/**/*.min.js', '!' + app.devPath + '/**/*.min.css'])
        .pipe(rev())
        .pipe(gulp.dest(app.devPath))
        .pipe(rev.manifest('resources-manifest.json'))
        .pipe(gulp.dest(app.devPath));
});

gulp.task('views', function ($1) {
    return gulp.src([app.viewsPath + '**/*.html', '!' + app.viewsPath + 'template/**/*'])
        .pipe(rev())
        .pipe(rev.manifest('views-manifest.json'))
        .pipe(gulp.dest(app.distPath + 'views'));
});

gulp.task('copy:res', () => {
    return gulp.src([app.srcPath + 'plugins/**/*', app.srcPath + '**/*.{png,jpg,gif,swf,ico,jpeg,svg}'], { base: app.srcPath })
        .pipe(gulp.dest(app.devPath));
});

gulp.task('clean', function () {
    return gulp.src(app.distPath)
        .pipe(gulpClean());
});

//第三端单独项目
gulp.task('sapp:clean', () => {
    return gulp.src("views/sapp/")
        .pipe(gulpClean());
});

gulp.task('sapp:rev', () => {
    return gulp.src(['../xuestatic/**/*.html', '!../xuestatic/static/**/*'])
        .pipe(gulp.dest("views/sapp/"))
        .pipe(rev())
        .pipe(rev.manifest('sapp-manifest.json'))
        .pipe(gulp.dest("views/sapp/"));
});

gulp.task("sapp:build", () => {
    runSequence(['sapp:clean'], ['sapp:rev']);
});

// build
gulp.task('watch', function () {
    gulp.watch([app.srcPath + '**/*.js'], ['js']);
    gulp.watch([app.srcPath + '**/*'], ['copy:res']);
    gulp.watch([app.srcPath + '**/*.scss', app.srcPath + '**/*.sass', app.srcPath + '**/*.css'], ['css']);
    gulp.watch([app.viewsPath + '**/*', '!' + app.viewsPath + '**/*.html'], ['views']);
});

gulp.task("dev", () => {
    runSequence(['copy:res', 'js', 'css', 'views'], ['watch']);
});

gulp.task("build", () => {
    runSequence(['clean'], ['copy:res', 'js', 'css', 'views'], ['rev']);
});

//定义gulp默认任务
gulp.task('default', ['build']);