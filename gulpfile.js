const gulp = require('gulp');
const file = require('gulp-file');
const replace = require('gulp-replace');
const shell = require('gulp-shell');
const fs = require('fs');
const del = require('del');

/**
 * Global constants
 */
const outDir = 'public/js/compiled';
const env = getFileContent('.env');
const ytApiKey = env.split('=')[1].replace(/(\r\n|\n|\r)/gm, '');
//console.log(ytApiKey);

/**
 * Functions
 */
function getFileContent(file, encoding = 'utf8') {
  return fs.readFileSync(file, encoding);
}

/**
 * Tasks
 */
gulp.task('transpile-background-script',
  shell.task(`tsc src/scripts/background.ts --target es2017 --moduleResolution node --removeComments --outDir ${outDir}`)
);

gulp.task('cleanup-background-script', function() {
  return file('background.js', getFileContent(`${outDir}/scripts/background.js`), { src: true })
    .pipe(replace(/^\s*import .+;$\s*/gm, ''))
    .pipe(replace(/^\s*export .+;$\s*/gm, ''))
    .pipe(replace(/^\s*export /gm, ''))
    .pipe(gulp.dest(`${outDir}/scripts`));
});

gulp.task('cleanup-browser-helper', function() {
  return file('browser.js', getFileContent(`${outDir}/helpers/browser.js`), { src: true })
    .pipe(replace(/^\s*import .+;$\s*/gm, ''))
    .pipe(replace(/^\s*export .+;$\s*/gm, ''))
    .pipe(replace(/^\s*export /gm, ''))
    .pipe(gulp.dest(`${outDir}/helpers`));
});

gulp.task('cleanup-storage-helper', function() {
  return file('storage.js', getFileContent(`${outDir}/helpers/storage.js`), { src: true })
    .pipe(replace(/^\s*import .+;$\s*/gm, ''))
    .pipe(replace(/^\s*export .+;$\s*/gm, ''))
    .pipe(replace(/^\s*export /gm, ''))
    .pipe(gulp.dest(`${outDir}/helpers`));
});

gulp.task('cleanup-utils-helper', function() {
  return file('utils.js', getFileContent(`${outDir}/helpers/utils.js`), { src: true })
    .pipe(replace(/^\s*import .+;$\s*/gm, ''))
    .pipe(replace(/^\s*export .+;$\s*/gm, ''))
    .pipe(replace(/^\s*export /gm, ''))
    .pipe(gulp.dest(`${outDir}/helpers`));
});

gulp.task('cleanup-youtube-helper', function() {
  return file('youtube.js', getFileContent(`${outDir}/helpers/youtube.js`), { src: true })
    .pipe(replace(/^\s*import .+;$\s*/gm, ''))
    .pipe(replace(/^\s*export .+;$\s*/gm, ''))
    .pipe(replace(/^\s*export /gm, ''))
    .pipe(replace('process.env.REACT_APP_YOUTUBE_API_KEY', `'${ytApiKey}'`))
    .pipe(gulp.dest(`${outDir}/helpers`));
});

gulp.task('delete-models', function() {
  return del(`${outDir}/models/**`, { force: true });
});

// Main task
gulp.task('compile:background-scripts', gulp.series(
  'transpile-background-script',
  'cleanup-background-script',
  'cleanup-browser-helper',
  'cleanup-storage-helper',
  'cleanup-utils-helper',
  'cleanup-youtube-helper',
  'delete-models'
));
