# Deploy to Github Pages

You can deploy to github pages with a couple minor changes to Polymer Starter Kit:

1. Uncomment this line  `// app.baseUrl = '/polymer-starter-kit/';` in app.js near the top

  ```JavaScript
  // Sets app default base URL
  app.baseUrl = '/';
  if (window.location.port === '') {  // if production
    // Uncomment app.baseURL below and
    // set app.baseURL to '/your-pathname/' if running from folder in production
    // app.baseUrl = '/polymer-starter-kit/';
  }
  ```
2. Change `app.baseUrl = '/polymer-starter-kit/';`  to `app.baseUrl = '/your-pathname/';` (ex: if you repo is `github.com/username/bobs-awesome-site` you would change this to `bobs-awesome-site`)
3. Run `gulp build-deploy-gh-pages` from command line
4. To see changes wait 1-2 minutes then load Github pages for your app (ex: http://polymerelements.github.io/polymer-starter-kit)

### Notes

* When deploying to Github Pages we recommend using hashbangs which is Polymer Starter Kit default.
* This method should work for most hosting providers when using a subfolder.
