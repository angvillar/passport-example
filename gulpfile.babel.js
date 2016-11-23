/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable no-console */

import gulp from 'gulp';
import babel from 'gulp-babel';
import eslint from 'gulp-eslint';
import nodemon from 'gulp-nodemon';
import mocha from 'gulp-mocha';
import del from 'del';
import webpack from 'webpack-stream';
import webpackConfig from './webpack.config.babel';

const paths = {
  allSrcJs: 'src/**/*.js?(x)',
  allLibTests: 'lib/test/**/*.js',
  gulpFile: 'gulpfile.babel.js',
  webpackFile: 'webpack.config.babel.js',
  clientBundle: 'dist/client-bundle.js?(.map)',

  libDir: 'lib',
  distDir: 'dist',
  // serverSrcJs: 'src/server/**/*.js',
  clientEntryPoint: 'src/client/app.jsx',
  serverEntryPoint: 'lib/server/app.js',
};

gulp.task('lint', () =>
  gulp.src([
    paths.allSrcJs,
    paths.gulpFile,
    paths.webpackFile,
  ])
    .pipe(eslint())
    .pipe(eslint.format())
    .pipe(eslint.failAfterError()),
);

gulp.task('clean', () => del([paths.libDir, paths.clientBundle]));

gulp.task('build:client', ['lint'], () =>
  gulp.src(paths.clientEntryPoint)
    .pipe(webpack(webpackConfig))
    .pipe(gulp.dest(paths.distDir)),
);

gulp.task('build:server', ['lint'], () =>
  gulp.src(paths.allSrcJs)
    .pipe(babel())
    .pipe(gulp.dest(paths.libDir)),
);

gulp.task('build', ['build:server', 'build:client', 'clean']);

gulp.task('nodemon', ['build'], (cb) => {
  let started = false;

  return nodemon({
    script: paths.serverEntryPoint,
    ext: 'js',
    watch: 'src',
    tasks: ['build'],
  }).on('start', () => {
  // to avoid nodemon being started multiple times
  // thanks @matthisk
    if (!started) {
      cb();
      started = true;
    }
  });
});

gulp.task('test', ['build:server'], () =>
  gulp.src(paths.allLibTests)
    .pipe(mocha()),
);

gulp.task('default', ['nodemon']);
