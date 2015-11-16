var gulp = require('gulp'),
    gutil = require('gulp-util'),
    connect = require('gulp-connect'),
    //livereload = require('gulp-livereload'),
    concat = require('gulp-concat'),
    sequence = require('run-sequence'),
    sourcemaps = require('gulp-sourcemaps'),
    coffee = require('gulp-coffee'),
    uglify = require('gulp-uglify'),
    spritesmith  = require('gulp.spritesmith'),
    stylus = require('gulp-stylus'),
    nib = require('nib'),
    autoprefixer = require('autoprefixer-stylus'),
    bootstrap = require('bootstrap-styl');



gulp.task('html', function () {
    return gulp.src('./src/tpl/**/*.html')
        .pipe(gulp.dest('build'))
        .pipe(connect.reload());
});



gulp.task('js', function () {
    return gulp.src([
        './bower_components/jquery/dist/jquery.js',
        './bower_components/jqueryannex/jquery.annex.js',
        './bower_components/lodash/lodash.js',
        './src/js/**/*.js'
    ])
        .pipe(concat('all-js.js'))
        .pipe(gulp.dest('build/js'));
});



gulp.task('coffee', function() {
    return gulp.src([
        './src/cs/**/*.coffee'
    ])
        .pipe(concat('all-coffee.js'))
        .pipe(coffee({bare: true})
            .on('error', function(err){
                // log error but continue with the task flow anyway
                // keeps watchers alive!
                gutil.log(err);
                this.emit('end');
            }))
        .pipe(gulp.dest('build/js'));
});



gulp.task('combine-js', function() {
    return gulp.src([
        './build/js/all-js.js',
        './build/js/all-coffee.js'
    ])
        .pipe(sourcemaps.init())
            .pipe(concat('all.js'))
            .pipe(uglify())
        .pipe(sourcemaps.write('./'))
        .pipe(gulp.dest('build/js'))
        .pipe(connect.reload());
});



gulp.task('sprite', function() {
    var spriteData =
        gulp.src('./src/img/sprite/*.*')
            .pipe(spritesmith({
                imgName: 'sprite.png',
                imgPath: '../img/sprites/sprite.png',
                cssName: 'sprite.styl',
                cssFormat: 'stylus',
                algorithm: 'binary-tree',
                cssVarMap: function(sprite) {
                    sprite.name = 'sprite-' + sprite.name;
                }
            }));

    spriteData.img.pipe(gulp.dest('./build/img/sprites/')).pipe(connect.reload());
    return spriteData.css.pipe(gulp.dest('./src/styl/mixins/')).pipe(connect.reload());
});



gulp.task('stylus', function() {
    return gulp.src('./src/styl/main.styl')
        .pipe(stylus({
            use : [nib(), bootstrap(), autoprefixer({browsers : ['last 2 versions', 'IE >= 10']})],
            compress: true
        }))
        .pipe(gulp.dest('./build/css'))
        .pipe(connect.reload());
});



gulp.task('watch', function() {
    connect.server({
        host : '127.0.0.1',
        root : 'build',
        port : 8888,
        livereload : {
            port : 35732
        }
      });

    /*livereload.listen({
		host : '0.0.0.0',
		port : 35732
	});*/

    gulp.watch('./src/tpl/**/*.html', ['html']);
    gulp.watch('./src/js/**/*.js', function(){ sequence('js', 'combine-js'); });
    gulp.watch('./src/cs/**/*.coffee', function(){ sequence('coffee', 'combine-js'); });
    gulp.watch('./src/img/sprite/*.*', ['sprite']);
    gulp.watch('./src/styl/**/*.styl', ['stylus']);

    //gulp.watch(['build/**/*.html', 'build/**/*.css', 'build/**/*.js']).on('change', function(event){
		//livereload.changed(event.path);
	//});
});



gulp.task('default', function(){
    sequence(['html', 'js', 'coffee', 'sprite', 'stylus'], 'combine-js', 'watch');
});
