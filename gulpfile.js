// npm install gulp-安装名 --save-dev
const gulp = require('gulp')
const path = require('path')
const changed = require('gulp-changed')    // 只编译改动过的文件
const fileinclude = require('gulp-file-include') //外部引入html文件
const htmlmin = require('gulp-htmlmin');    // html 压缩
//创建任务编译sass
const concat = require('gulp-concat')
const sass = require('gulp-sass')

// const nunjucks = require('./lib/gulp-nunjucks')
const autoprefixer = require('gulp-autoprefixer')
const cleanCss = require('gulp-clean-css')    //压缩css
const rename = require('gulp-rename')  // 重命名

const plumber = require('gulp-plumber') // 压缩js
const minify = require('gulp-minify')
// const eslint = require('gulp-eslint');  // js 代码检查
// const babel = require('gulp-babel');    // 编译 es6 代码

const imagemin = require('gulp-imagemin')
const cache = require('gulp-cache')     // 图片缓存，图片替换了才压缩

// const concat = require('gulp-concat');          // 合并文件
const del = require('del')                   // 删除文件

const browserSync = require('browser-sync').create() // 浏览器自动刷新0.
const clean = require('gulp-clean')  //清除文件插件，参考：https://github.com/teambition/gulp-clean
const buildBasePath = 'build/';       //构建输出的目录

// 构建html  build
gulp.task('html', () => {
    return gulp.src('./app/static/*.html')     // 编译这个路径下的html文件
               .pipe(fileinclude())            // 执行gulp-file-include编译路径的html文件
               .pipe(changed('./app/static/**/*.html'))
            //    .pipe(htmlmin(config.htmlmin))    //html压缩
               .pipe(gulp.dest('./app/build')) // 编译好的html文件保存路径
})

// 构建sass
gulp.task('sass', () => {
    return gulp.src('./app/static/sass/*.scss')     //编译这个路径下的scss文件
               .pipe(sass())                        // 执行gulp-sass编译路径的scss文件
               .pipe(autoprefixer())                //执行gulp-autoprefixer给css添加浏览器前缀
               .pipe(gulp.dest('./app/static/css')) // 编译好的css文件保存路径
            //    .pipe(gulp.dest('./app/build/css'))  // 编译好的css文件保存路径
})
gulp.task('m-sass', () => {
    return gulp.src('./app/static/sass/*.scss')     //编译这个路径下的scss文件
               .pipe(sass())                        // 执行gulp-sass编译路径的scss文件
               .pipe(autoprefixer())                //执行gulp-autoprefixer给css添加浏览器前缀
            //    .pipe(gulp.dest('./app/static/css')) // 编译好的css文件保存路径
               .pipe(gulp.dest('./app/build/css'))  // 编译好的css文件保存路径
})

// 压塑css
gulp.task('cleanCss', () => {
    return gulp.src('./app/static/css/*.css')       // 编译这个路径下的css文件
               .pipe(cleanCss())                    // 执行gulp-clean-css压缩路径的css文件
               .pipe(rename('index.min.css'))       // 重命名文件夹名为index.min.css
               .pipe(gulp.dest('./app/static/css')) // 压缩完成的css文件的保存路径
            //    .pipe(gulp.dest('./app/build/css'))  // 压缩完成的css文件的保存路径
})
// 压缩css到build
gulp.task('m-css', () =>{
    return gulp.src('./app/static/css/*.css')
               .pipe(cleanCss())                    // 执行gulp-clean-css压缩路径的css文件
               .pipe(rename('index.min.css'))       // 重命名文件夹名为index.min.css
               .pipe(gulp.dest('./app/static/css'))
               .pipe(gulp.dest('./app/build/css'))  // 压缩完成的css文件的保存路径
})

// 压缩js文件
gulp.task('js', () => {
    return gulp.src('./app/static/js/*.js')  // 编译这个路径下的js文件
               .pipe(eslint())
               .pipe(eslint.format())  // 错误格式化输出
            //    .pipe(plumber())   
               .pipe(minify())
            //    .pipe(babel({
            //         presets: ['es2015', 'stage-1']
            //     }))
               .pipe(gulp.dest('./app/static/js')) 
            //    .pipe(gulp.dest('./app/build/js'))      
})
//压缩js到build
gulp.task('m-js', () => {
    return gulp.src('./app/static/js/*.js')  // 编译这个路径下的js文件
            //    .pipe(plumber())   
               .pipe(minify())
               .pipe(gulp.dest('./app/build/js'))      
})

// 构建img
gulp.task('img', () => {
    return gulp.src('./app/static/**/*.{png,jpg,gif,ico}')
               .pipe(changed('./app/static/img'))
               .pipe(cache(imagemin({
                    progressive: true, 
                    optimizationLevel: 5
                })))
            //    .pipe(cache(imagemin())
               .pipe(gulp.dest('./app/build'))
})

// 启动静态服务器，检测代码变化
gulp.task('run', () => {
    browserSync.init({
        server: {
            baseDir: ['./app/static'], // 启动服务器所要打开的文件位置 默认端口号http://localhost:3000/
            index: 'index.html'
        }
    });

    gulp.watch('./app/static/**/*.html', ['html']);
    gulp.watch('./app/static/**/*.scss', ['sass']);
    gulp.watch('./app/static/**/*.js', ['js']);
    gulp.watch('./app/static/**/*.js', ['m-js']);
    
    gulp.watch('./app/static/**/*.*', ['img']);

    gulp.watch('./app/static/css/*.css', ['cleanCss']);
    gulp.watch('./app/static/css/*.css', ['m-css']);

    gulp.watch('./app/static/**/*.html').on('change', browserSync.reload);

})
  // 清空文件夹
// gulp.task('clean-dev', (cb) => {
//     return del(['./app/build/**/*'], cb);
// })

// gulp.task('clean-build', (cb) => {
//     return del(['./app/build/**/*'], cb);
// })

// 运行gulp时，默认执行
gulp.task('default',['img', 'cleanCss'], () => {
    gulp.start('html', 'sass', 'js')
})
// 把项目编译到生成环境中
gulp.task('build', () => {
    gulp.start('html', ['m-sass','m-css', 'm-js',], 'img')
})