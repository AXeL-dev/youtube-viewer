const gulp = require('gulp');
const file = require('gulp-file');
const replace = require('gulp-replace');
const shell = require('gulp-shell');
const argv = require('yargs').option('new-version', { alias: 'nv' })
                             .option('build-directory', { alias: 'build-dir' })
                             .option('destination-directory', { alias: 'dest-dir' })
                             .option('commit', { boolean: true, default: true }) // use --no-commit to bypass git commit
                             .argv;
const fs = require('fs');
const del = require('del');

/**
 * Global constants
 */
const buildDir = argv.buildDirectory === undefined ? 'build' : argv.buildDirectory;
const destDir = argv.destinationDirectory === undefined ? 'dist' : argv.destinationDirectory;

/**
 * Functions
 */
function getFileContent(file, encoding = 'utf8') {
  return fs.readFileSync(file, encoding);
}

function getYoutubeAPIKey() {
  const env = getFileContent('.env');
  const youtubeApiKey = env.split('=')[1].replace(/(\r\n|\n|\r)/gm, '');
  console.log('Youtube API key:', youtubeApiKey);
  return youtubeApiKey;
}

function runIf(condition, ...tasks) {
  const task = gulp.series(...tasks);
  return function(cb) {
    if (condition) {
      task(cb);
    } else {
      cb();
    }
  }
}

/**
 * Tasks
 */
gulp.task('update-manifest-version', function() {
  return file('manifest.json', getFileContent('public/manifest.json'), { src: true })
    .pipe(replace(/^(\s*"version": ").+(",$\s*)/gm, `$1${argv.newVersion}$2`))
    .pipe(gulp.dest('public'));
});

gulp.task('update-firefox-manifest-version', function() {
  return file('manifest.firefox.json', getFileContent('public/manifest.firefox.json'), { src: true })
    .pipe(replace(/^(\s*"version": ").+(",$\s*)/gm, `$1${argv.newVersion}$2`))
    .pipe(gulp.dest('public'));
});

gulp.task('run-npm-version',
  shell.task(`npm version ${argv.newVersion} --no-git-tag-version --allow-same-version${argv.commit ? ` && git add -A && git commit -a -m "Release v${argv.newVersion}"` : ''}`)
);

gulp.task('remove-browser-polyfill',
  shell.task(`sed -i 's/<script type="application\\/javascript" src="js\\/browser-polyfill.min.js"><\\/script>//' ${buildDir}/index.html && rm ${buildDir}/js/browser-polyfill.min.js`)
);

gulp.task('move-build-dir',
  shell.task(`rm -rf ${destDir} && mkdir -p ${destDir} && cp -r ${buildDir}/. ${destDir} && rm -rf ${buildDir}`)
);

gulp.task('delete-nojekyll', function() {
  return del(`${buildDir}/.nojekyll`, { force: true });
});

// Main tasks
gulp.task('bump:version', runIf(argv.newVersion !== undefined,
  'update-manifest-version',
  'update-firefox-manifest-version',
  'run-npm-version'
));

gulp.task('postbuild:web-ext', gulp.series(
  'delete-nojekyll',
  'move-build-dir'
));

gulp.task('postbuild:github', gulp.series(
  'remove-browser-polyfill',
  'move-build-dir'
));
