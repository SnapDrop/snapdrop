# Use Polymer Starter Kit for [Mobile Chrome Apps](https://github.com/MobileChromeApps/mobile-chrome-apps)

## Getting started

Polymer Starter Kit could be fully adapted to Mobile Chrome Apps through mobile-friendly features. Mobile Chrome Apps, is based on Apache Cordova, and requires mobile application SDKs such as Android and iOS. so please make sure that installation development tool by following [installation guide](https://github.com/MobileChromeApps/mobile-chrome-apps/blob/master/docs/Installation.md) of Mobile Chrome Apps. And then, You do some further steps to resolve some of restrictions and configurations to use Polymer Starter Kit on Cordova. Looking for a [guide video](https://www.youtube.com/watch?v=-ifgyobPLVg) below to better understand.

[![](https://camo.githubusercontent.com/7c498c4d60113dd1ea072576df897283100428b6/687474703a2f2f696d672e796f75747562652e636f6d2f76692f2d696667796f62504c56672f302e6a7067)](https://www.youtube.com/watch?v=-ifgyobPLVg)

## Download Polymer Starter Kit into your workspace

To download and preparation, follow this [guide of Polymer Starter Kit](https://github.com/PolymerElements/polymer-starter-kit#getting-started). Make sure that install all of dependencies of npm and Bower.

## Create a Cordova project

Create a Cordova project in path `polymer-starter-kit` by following command. `platform` is the path for Cordova project files, `com.your.app` is the project name/id and next following string is the description for your app.

```sh
cca create platform com.your.app "Your Polymer Starter Kit App"
```

If you have no problems while creating a project you will seeing the message of  installing successful coming from Cordova and have the tree of the project below.

```sh
└── polymer-starter-kit
  └── app
  │   ├── elements
  │   ├── images
  │   ├── index.html
  │   ├── manifest.json
  │   ├── scripts
  │   ├── styles
  │   └── test
  ├── bower.json
  ├── bower_components
  ├── docs
  ├── gulpfile.js
  ├── node_modules
  ├── package.json
  ├── platform
  │   ├── config.xml
  │   ├── hooks
  │   ├── platforms
  │   ├── plugins
  │   └── www
```

For further informations of Cordova, please visit [corodova document](https://github.com/MobileChromeApps/mobile-chrome-apps/tree/master/docs)

## Configuration

You need to have some changes of configuration to fit for Mobile Chrome Apps as it was mentioned above.

### Configure path for app built by gulp

- Change the path `dist` in `gulpfile.js` from `dist` to `platform/www/app`, then the app built with Polymer Starter Kit will be placed under `platform/www` will be used by Cordova.
  ```js
  var DIST = 'platform/www/app';
  ```

- Change the path in `platform/www/background.js` into new path
  ```js
  chrome.app.runtime.onLaunched.addListener(function() {
    chrome.app.window.create('app/index.html', {
      width: 244,
      height: 380,
    });
  });
  ```

- Add path `/app` to `app.baseURL` in `app/scripts/app.js'. `platform/www` is root path of app that will prevent errors coming from page routing.
  ```js
  app.baseUrl = '/app';
  ```

### Update gulp tasks

- Using `polybuild(vulcanize + crisper)` task is mandatory because of Chrome Apps doesn't allow inline script blocks according to [CSP](https://developer.chrome.com/apps/contentSecurityPolicy). You should replace current `vulcanize` task with new task below. To do this install `polybuild` first with `npm install --save-dev polybuild` command
  ```js
  // load polybuild
  var polybuild = require('polybuild');

  // Vulcanize granular configuration
  gulp.task('vulcanize', function() {
    return gulp.src('app/elements/elements.html')
      .pipe(polybuild({maximumCrush: true}))
      .pipe($.rename(function(file) {
        if (file.extname === '.html') {
          file.basename = file.basename.replace('.build', '');
        }
      }))
      .pipe(gulp.dest(dist('elements')))
      .pipe($.size({title: 'vulcanize'}));
  });
  ```

### More updates

- Remove useless files generated from Cordova.
  ```sh
  rm platform/www/index.*
  ```
- To complete first route for `home` you need to put try/catch block into the first route code on starting app, in `app/elements/routing.html`, because Chrome Apps doesn't allow using `history` APIs which related to error message `history.pushState/replaceState is not available in packaged apps`.
  ```js
  try {
    page({
      hashbang: true
    });
  } catch (e) {
    app.route = 'home';
  }
  ```

- Using `@import` instead of `link` to download external Google robot fonts which is related to `Refused to load the stylesheet` errors. Update code in `bower_components/font-roboto/roboto.html` to using `@import` code below
  ```
  @import url(https://fonts.googleapis.com/css?family=Roboto:400,300,300italic,400italic,500,500italic,700,700italic);
  @import url(https://fonts.googleapis.com/css?family=Roboto+Mono:400,700);
  ```

## Build and run app

After done of above steps. run this command on root path that let you see Chrome Apps built with Polymer Starter Kit.

```sh
gulp && cd platform && cca run chrome
```

or to run on Android emulator or devices

```sh
gulp && cd platform && cca run android
```
