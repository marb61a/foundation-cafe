"use strict";

import plugins from 'gulp-load-plugins';
import yargs from 'yargs';
import browser from 'browser-sync';
import gulp from 'gulp';
import panini from 'panini';
import rimraf from 'rimraf';
import sherpa from 'style-sherpa';
import yaml from 'js-yaml';
import fs from 'fs';
import webpackStream from 'webpack-stream';
import webpack2 from 'webpack';
import named from 'vinyl-named';


// Load all of the Gulp plugins into a single variable
const $ = plugins();

// Check for the production flag
const PRODUCTION = !!(yargs.argv.production);

// Load settings from the settings.yml file
const { COMPATIBILITY, PORT, UNCSS_OPTIONS, PATHS } = loadConfig();

function loadConfig() {
  let ymlFile = fs.readFileSync('config.yml', 'utf8');
  return yaml.load(ymlFile);
}

// Build the dist folder by running the tasks listed below
gulp.task('build', gulp.series(
  clean, gulp.parallel(pages, sass, javascript, images, copy), styleGuide  
));

// Build the site then run the server and watch for changes
gulp.task('default', gulp.series(
  'build', server, watch
));

// Delete the dist folder, this happens everytime starting a build
function clean(done){
  rimraf(PATHS.dist, done);
}

// Start a server with BrowserSync to preview site in
function server(done){
  browser.init({
    server: PATHS.dist, port: PORT
  });
  done();
}

// Reload the browser with BrowserSync
function reload(done){
  browser.reload();
  done();
}

// Watch for changes to Static Assets, Page, Sass, JS
function watch(){
  gulp.watch(PATHS.assets, copy);
}