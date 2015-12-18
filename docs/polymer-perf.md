### Polymer Performance Recipe

In the following write up we are going to take a look at how to optimize the loading of Web Component enabled websites. The goal here is not to give you a copy and paste approach, but rather to give you the starting components and thought process with how to optimize your web app given your domain constraints.

Current native support for Web Components is limited but growing, with only Chrome and Opera having a “fully" implemented spec. Due to the limited support, using Polymer or any web components in production across more than just chrome requires you to load a polyfill. As with any polyfill there is a performance tradeoff, in the run time performance, spec compliance, as well as the network cost overhead. Lets dive into a few approaches that you can use to conditionally load the polyfill only when it is required.

The first step in conditionally loading the Web Component polyfill is detecting whether or not the environment that we are in supports the features that are required.

Over in GitHub land @geenlen has cooked up a nifty technique bit of code to do this work for us:

```js
var webComponentsSupported = ('registerElement' in document
  && 'import' in document.createElement('link')
  && 'content' in document.createElement('template'));
```

Once we know if things are supported or not we can then dynamically load our polyfill and then load up our custom elements so that our app will be able to properly upgrade our custom elements.

```js
if (webComponentsSupported) {
  loadElements();
} else {
  loadWebComponentPolyfill(loadElements)
}
```

This bit of code can be placed directly in [`app.js`](https://github.com/PolymerElements/polymer-starter-kit/blob/master/app/scripts/app.js), right under the beginning of the IIFE.

Now that we have our initial sniff and load call, let’s take a look at the code for `loadWebComponentPolyfill`, and how exactly it works.

```js
function loadWebComponentPolyfill(cb) {
  var polyfill = document.createElement('script');
  polyfill.onload = cb || null;
  polyfill.src = 'webcomponents-lite.min.js';
  document.head.appendChild(polyfill);
}
```

So what is going on here, how does it work? The first thing that this method does is dynamically create a script tag, then conditionally assign a callback when the resource loads, the code then sets the src of the script tag, and then injects the script tag into the head of our document. Once the tag is placed inside of our document, the network request will start and the resource is fully downloaded the callback will be invoked.

Awesome! So now let’s move onto the logic around `loadElements`.

You might be wondering why `loadElements` is even needed? Why can we not just `<link rel="import" href="path_to_elements.html">` directly in our html. The reason why `loadElements` is needed is because we are loading the webComponents polyfill async to the initial page load, therefore we can not assume that our import statements will always work across browsers and browser versions, rather we need to explicitly call into loadElements only after we are sure the current environment supports webComponents (even if we have to polyfill it first).

```js
function loadElements() {
  var bundle = document.createElement('link');
  bundle.rel = 'import';
  bundle.href = 'elements/path_to_bundle.html';

  document.head.appendChild(bundle);
}
```

`loadElements` follows a very similar pattern as `loadWebComponentPolyfill`, only this time we are dynamically injecting a link tag into our head that will load our element bundle. Now that we have both of these methods defined, we are left with a very basic example of loading our polyfill and element async to the `window.onload` event.

This approach opens up the possibility for you to only have users download the elements that they need for specific pages in your app. Consider for instance an application with an admin panel and a general app view. Given the fact that most users in our made up app do not go to the admin panel too often, there is no need for them to always incur the cost of downloading the admin suite of elements. Instead we will only have users download the “bundle" that they need depending on what page they enter on.

For example with page.js your router could be structured as follows to optimize page load time, given a few assumptions about how users will be interacting with your app.

```js
page.on('admin', ensureWebComponentSupport, function() {
  loadElementBundle('admin');
  renderAdminPane();
});
```

#### Further Thoughts

With Polymer, it is easy to fall into the trap of getting a flash of unstyled content, or a blank page while the polyfill and elements are downloading. The best way to avoid these pitfalls is to use a "loading" screen approach. The simplest of the loading approach to create a "splash" screen to display while your elements bundle is downloading.

You can easily modify `loadElements` to enable this type of behavior.

```js
function loadElements() {
  document.body.innerHTML = '<div><!-- loading screen markup → --></div>';
  bundle.rel = 'import';
  bundle.href = 'elements/path_to_bundle.html';
  bundle.onload = function() {
    document.body.innerHTML = '<real-markup></real-markup>';
  };

  document.head.appendChild(bundle);
}
```

You can take this concept of a loading screen one step further by instead of showing a loading screen show a screen that looks like a lite version of your app. By this I mean simple shapes and blocks that match the color and blocks of your app once your elements are fully upgraded, so that your user has a faster perceived loading time.

Hopefully these approaches give you some ideas on how to make your app lightning fast. 

We hope to explore further ideas including [application shells](https://github.com/ebidel/polymer-experiments/blob/master/polymersummit/fouc/appshell.html) and being smart about your first meaningful paint in the near future.

--------

Further reading

* [Fast Polymer app loading](https://gist.github.com/ebidel/1ba71473d687d0567bd3) from Eric Bidelman
* [Polymer Perf Patterns](https://www.youtube.com/watch?v=Yr84DpNaMfk) from Eric Bidelman
* [Polymer for the Performance-obsessed](https://aerotwist.com/blog/polymer-for-the-performance-obsessed/) from Paul Lewis
