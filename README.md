## Generate chards in the cloud

Or otherwise known as, how can you render charts outside a browser?

### Tech

- Node 14+
- d3 v6
- jsdom
- node-canvas
- express (unused)

### How it works

This roughly follows the work from the [gregjopa/d3-server-side-demo](https://github.com/gregjopa/d3-server-side-demo) repo.

In addition, it adds:
* svg image url painted onto a node canvas
* a node canvas exported into an png file

### TODO

Todos and other ommissions:

* the jsdom is never cleaned up, so it will eventually consume a ton of memory
* the svg image url is loaded async, but we have this running in an sync method..
* getting this to pass through code verification could be tricky, depending on what jsdom and node-canvas require on the system level to run (fwiw, it does run already on an m1 big sur mac / 2021)
* downgraded from d3 v7 to d3 v6 because of module issues; could be solved with a transpiler?

### URLS
URLs used while researching this topic:

- https://github.com/d3-node/d3-node
- https://www.gregjopa.com/2020/05/render-d3-charts-server-side
- https://github.com/gregjopa/d3-server-side-demo
- https://github.com/gregjopa/d3-server-side-demo
- https://www.google.com/search?q=jsdom&oq=jsdom&aqs=chrome..69i57j0i67j0i20i263l2j0i67j0l5.625j0j7&sourceid=chrome&ie=UTF-8
- https://stackoverflow.com/questions/15477008/how-to-create-charts-using-nodejs
- https://eng.wealthfront.com/2011/12/22/converting-dynamic-svg-to-png-with-node-js-d3-and-imagemagick/
- https://tweetdeck.twitter.com/
- https://www.npmjs.com/package/canvas
- https://www.google.com/search?q=nodemon&oq=nodemon&aqs=chrome.0.69i59j0i20i263j0i67j0i20i263j0l6.908j0j7&sourceid=chrome&ie=UTF-8
- https://observablehq.com/@d3/gallery
- https://observablehq.com/@d3/hexbin
- https://bl.ocks.org/d3noob/d805555ee892425cc582dcb245d4fc59
- https://vega.github.io/vega-lite/
- https://bl.ocks.org/d3noob/9acbd342a173e46e6b0a190a382308d7
- https://www.npmjs.com/package/canvas
- https://levelup.gitconnected.com/draw-an-svg-to-canvas-and-download-it-as-image-in-javascript-f7f7713cf81f
- https://www.google.com/search?q=draw+svg+onto+canvas&oq=draw+svg+onto+canvas&aqs=chrome..69i57j0i13l3j0i22i30l6.5679j0j7&sourceid=chrome&ie=UTF-8
- https://github.com/Automattic/node-canvas
- https://css-tricks.com/lodge/svg/09-svg-data-uris/
- https://www.google.com/search?q=d3+color&oq=d3+color&aqs=chrome..69i57j0l2j0i67j0l6.1264j0j7&sourceid=chrome&ie=UTF-8
- https://www.w3schools.com/graphics/svg_rect.asp
