# Add ES2015 support through Babel

Although support for ES2015 (formerly ES6) is improving in modern browsers, the majority do not yet support the full set of features. To benefit from the awesomeness of the new ES2015 syntax while keeping backwards compatibility with Polymer's supported browsers, you'll need to transpile your JS code from ES2015 to ES5

This recipe focuses on adding an ES2015 to ES5 transpile step to Polymer Starter Kit's build pipeline using [BabelJS](https://babeljs.io/).


## Create a transpile gulp task

- Install the gulp Babel, Sourcemap, Crisper plugins and Babel ES2015 preset: `npm install --save-dev gulp-babel gulp-sourcemaps gulp-crisper babel-preset-es2015`
- Add the following gulp task in the `gulpfile.js` file:

```patch
+ // Transpile all JS to ES5.
+ gulp.task('js', function () {
+  return gulp.src(['app/**/*.{js,html}', '!app/bower_components/**/*'])
+    .pipe($.sourcemaps.init())
+    .pipe($.if('*.html', $.crisper({scriptInHead:false}))) // Extract JS from .html files
+    .pipe($.if('*.js', $.babel({
+      presets: ['es2015']
+    })))
+    .pipe($.sourcemaps.write('.'))
+    .pipe(gulp.dest('.tmp/'))
+    .pipe(gulp.dest(dist()));
+ });
```

This task will transpile all JS files and inline JS inside HTML files and also generate sourcemaps. The resulting files are generated in the `.tmp` and the `dist` folders

[Crisper](https://github.com/PolymerLabs/crisper) extracts JavaScript that's inline to HTML files (such as imports). We need this as Babel does not support transpiling HTML files such as `<script>` tags directly

Note: At the time of writing Crisper does not generate the sourcemaps. Your app will work but you won't get sourcemaps for files transformed by Crisper. Relevant issues:

 - [ragingwind/gulp-crisper#4](https://github.com/ragingwind/gulp-crisper/issues/4)
 - [PolymerLabs/crisper#14](https://github.com/PolymerLabs/crisper/issues/14)


## Integrating the transpile task

Make sure the `js` gulp task is triggered by the common build tasks:

 - In the gulp `serve` task, make sure `js` is triggered initially and on HTML and JS files changes:

```patch
-gulp.task('serve', ['lint', 'styles', 'elements', 'images'], function () {
+gulp.task('serve', ['lint', 'styles', 'elements', 'images', 'js'], function () {

  ...

- gulp.watch(['app/**/*.html'], reload);
+ gulp.watch(['app/**/*.html'], ['js', reload]);
  gulp.watch(['app/styles/**/*.css'], ['styles', reload]);
  gulp.watch(['app/elements/**/*.css'], ['elements', reload]);
- gulp.watch(['app/{scripts,elements}/**/{*.js,*.html}'], ['lint']);
+ gulp.watch(['app/{scripts,elements}/**/{*.js,*.html}'], ['lint', 'js']);
  gulp.watch(['app/images/**/*'], reload);
});
```

 - In the `default` task make sure `js` is run in parallel to `elements`:

```patch
gulp.task('default', ['clean'], function (cb) {

  ...

  runSequence(
    ['copy', 'styles'],
-   'elements',
+   ['elements', 'js'],
    ['lint', 'images', 'fonts', 'html'],
    'vulcanize', // 'cache-config',
    cb);
});
```

 - In the `html` task replace `app` in the paths by `dist` since dist should already contain all JS and HTML files now transpiled.

 ```patch
 // Scan your HTML for assets & optimize them
 gulp.task('html', function () {
   return optimizeHtmlTask(
-    ['app/**/*.html', '!app/{elements,test}/**/*.html'],
+    [dist('/**/*.html'), '!' + dist('/{elements,test}/**/*.html')],
     dist());
 });
 ```


 - In the `optimizeHtmlTask` function remove the `searchPath` attribute since all assets should be found under the `dist` folder and we want to make sure we are not picking up duplicates and un-transpiled JS files:

```patch
var optimizeHtmlTask = function (src, dest) {
- var assets = $.useref.assets({searchPath: ['.tmp', 'app', 'dist']});
+ var assets = $.useref.assets();
```


## Configure linters for ES2015

- Enable ES2015 support in JSCS. Add `"esnext": true` to the `.jscsrc` file:

```patch
{
+ "esnext": true,
  "preset": "google",
  "disallowSpacesInAnonymousFunctionExpression": null,
  "excludeFiles": ["node_modules/**"]
}
```

- Enable ES2015 support in JSHint. Add `"esnext": true` to the `.jshintrc` file:

```patch
{
+ "esnext": true,
  "node": true,
  "browser": true,
```

## Optional - When using shadow-dom instead shady-dom
Place this configuration ([Read more](https://www.polymer-project.org/1.0/docs/devguide/settings.html)) in a separate file like `scripts/polymer-settings`

```html
<script>
    window.Polymer = window.Polymer || {};
    window.Polymer.dom = 'shadow';
</script>
```
