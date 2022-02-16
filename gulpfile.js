const {src,dest,watch,series} = require("gulp");
const sass = require("gulp-sass")(require("sass"));
const terser =  require("gulp-terser");
const postcss = require("gulp-postcss");
const cssnano = require("cssnano");
const mode = require("gulp-mode")();
const babel = require("gulp-babel");
const autoprefixer = require("autoprefixer");
const clean = require("gulp-clean");
const imagemin = require("gulp-imagemin");
const webpack = require("webpack-stream");
const ts = require("gulp-typescript");
const tsProject =  ts.createProject("tsconfig.json");
const browsersync = require("browser-sync").create();

//browser sync functions
function browsersyncServer(cb){
    browsersync.init({
        server:{
            baseDir:"./dev"
        }
    });
    cb();
}

function browsersyncReload(cb){
    browsersync.reload();
    cb();
}

//copy task
function copyHTML(){
    return src("./src/*.html")
    .pipe(mode.development(dest("./dev")))
    .pipe(mode.production(dest("./dist")))
}

function copyImage(){
    return src("./src/img/**/*.{png,svg,jpg,jpeg,gif,webp}")
    .pipe(imagemin())
    .pipe(mode.development(dest("./dev/img")))
    .pipe(mode.production(dest("./dist/img")))
}

//css task
function cssGenerator(){
    return src("./src/scss/style.scss",{sourcemaps:true})
    .pipe(sass().on("error",sass.logError))
    .pipe(mode.production(postcss([cssnano(),autoprefixer()])))
    .pipe(mode.production(dest("./dist/css",{sourcemaps:"."})))
    .pipe(mode.development(dest("./dev/css",{sourcemaps:"."})))
}
//typscript compiler
function tsCompiler(){
    return src("./src/script/**/*.ts",{sourcemaps:true})
    .pipe(tsProject())
    .pipe(dest("./src/js"))
}
//js task
function jsGenerator(){
    return src("./src/js/**/*.js",{sourcemaps:true})
    .pipe(babel({
        presets:["@babel/env"]
    }))
    .pipe(webpack({
        mode:"development",
        devtool:"inline-source-map"
    }))
    .pipe(mode.production(terser({output:{comments:false}})))
    .pipe(mode.production(dest("./dist/js",{sourcemaps:"."})))
    .pipe(mode.development(dest("./dev/js")))
}

function cleanImages(){
    let isProduction = mode.production();
    let readableStream = src("./dev/img/*.{png,svg,jpg,jpeg,gif,webp}");
    if(isProduction) {
        readableStream =  src("./dist/img/*.{png,svg,jpg,jpeg,gif,webp}");
    }
    readableStream.pipe(clean());
}

function watchTask(){
    watch("./src/*.html",series(copyHTML, browsersyncReload));
    watch("./src/img/**/*.{png,svg,jpg,jpeg,gif,webp}",series(cleanImages,copyImage,browsersyncReload));
    watch("./src/scss/**/*.scss",series(cssGenerator,browsersyncReload))
    watch("./src/script/**/*.ts",series(tsCompiler,jsGenerator,browsersyncReload))
}

//build tasks
exports.default = series(
    copyHTML,
    copyImage,
    cssGenerator,
    tsCompiler,
    jsGenerator,
    browsersyncServer,
    watchTask
);

exports.build = series(
    copyHTML,
    copyImage,
    cssGenerator,
    tsCompiler,
    jsGenerator
);
