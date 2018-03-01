# Safe browsing on the modern web

---

This project will produce an interactive visualisation aimed at exploring and uncovering the invasiveness of bulk tracking practices currently deployed on the most popular websites of the Internet.

---

The initial proof of concept is based on [Glow Rope](https://palebluepixel.org/2016/07/13/visualizing-network-traffic-with-webgl/) and the initial adoption of this code is based on [this](https://github.com/mwcz/pipeline-demo/blob/webgl-overlay/src/main.js).

---

### Iteration #1

 - Open the `index.html` file in a modern browser which supports WebGL
 - Click anywhere on the screen to see particles moving from one point to the another
 - The particles follow the sine wave path from source to destination
 - The color of the particles changes from `red`, `green` to `blue` based on this simple logic:
 
 ```
 if (value >= 0 && value <= 300) {
    return 'rgb(0, 255, 0)';
  }
  if (value > 300 && value <= 500) {
    return 'rgb(0, 0, 255)';
  }
  if (value > 500) {
    return 'rgb(255, 0, 0)';
  }
 ```

 ![screenshot](http://g.recordit.co/ulbiqOSypt.gif)
