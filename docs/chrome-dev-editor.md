# Use Polymer Starter Kit on Chrome Dev Editor

If you are using a Chromebook, one of the few IDE you can use is [Chrome Dev Editor](https://github.com/GoogleChrome/chromedeveditor).

To use the Polymer Starter Kit you have to download the [latest release](https://github.com/PolymerElements/polymer-starter-kit/releases) in the `light` flavor (the additional tools can't be used from CDE).

After downloading the `polymer-starter-kit-light-*.zip` file unpack it in a new folder (for Example `psk-light`) you should have a directory structure like 

![psk-light-folder-p1](https://cloud.githubusercontent.com/assets/1431346/9451900/a73ffcf2-4ab1-11e5-8742-e0b5523ba9d5.png)


Before opening the folder inside CDE, we need to move the file `bower.json` to `app/bower.json`, this way running `Bower Update` from CDE's menu, will place the updated packages in `app/bower_components`

![bower json-post](https://cloud.githubusercontent.com/assets/1431346/9452119/c5826a46-4ab2-11e5-96c5-00cf404d9c50.png)


We can now `Open Folder...` inside CDE and start renaming the file `app/manifest.json` to `app/web-app-manifest.json`, followed by updating the link to it in the file `app/index.html`

![manifest json](https://cloud.githubusercontent.com/assets/1431346/9452182/27e41478-4ab3-11e5-8e40-d7c0f1249feb.png)


*This change is needed because `manifest.json` is interpreted by CDE as a [Chrome Apps Manifest](https://developer.chrome.com/extensions/manifest) and the [web app manifest](https://w3c.github.io/manifest/) is slightly different*

Open `app/elements/routing.html` and add the following code after the last route:

```javascript
page('*', function () {
  app.route = 'home';
});
```

After the change, the code will look like the following:

```javascript
...
page('/contact', function () {
  app.route = 'contact';
});

page('*', function () {
  app.route = 'home';
});

// add #! before urls
page({
  hashbang: true
});
...
```


Select `app/index.html` and hit run (or press CTRL+R) to see the application running in the browser.
