# Vite drops stylesheet links when HTML entries share a cyclic chunk

Two HTML entries, two chunks that import each other, one stylesheet in each chunk:

```
index.html     -> main.js      -> shared.js (shared.css) <-> feature.js (feature.css)
dashboard.html -> dashboard.js -> feature.js (feature.css) <-> shared.js (shared.css)
```

Both pages reach both chunks, so both should link `shared.css` and `feature.css`.

```bash
npm install
npm run check
```

`check` builds 10 times and reports the stylesheets each page is missing:

```
6/10  index.html: ok | dashboard.html: missing shared.css
4/10  index.html: missing feature.css | dashboard.html: ok
```

To see it in the browser:

```bash
npm start
```

Each page has a row per stylesheet. A row is red ("missing") by default, and the stylesheet itself turns it green ("loaded"). Open `/index.html` and `/dashboard.html`; one of them shows a red row. `shots/` has a capture of each from a build where `dashboard.html` lost `shared.css`. Under `vite` (dev) both pages show both rows green. On StackBlitz both pages showed both rows green too, so run it locally.

Which page loses a stylesheet depends on which HTML entry vite handles first, so the split varies between runs (16/4 in one series of 20, 10/0 in another). Every build so far has been wrong.

The `codeSplitting` groups in `vite.config.js` only put each module in its own chunk. A real app can end up with the same cycle without any chunk configuration; ours came from rolldown's `strictExecutionOrder`.
