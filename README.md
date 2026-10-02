# Workout Zone — JavaScript Practice Project

A landing page for **Workout Zone**, a gym in Dhekaha, Rewa (Madhya Pradesh).

> **This is a practice project for JavaScript.**
> The goal was to take a normal HTML/CSS/JS website and rebuild it so that
> **JavaScript generates the entire page UI**, while the HTML file keeps only
> what JavaScript cannot do on its own.

## What this project practices

- Generating a full page's HTML from JavaScript (DOM building with template strings)
- Keeping content in **data arrays** and rendering it with loops (`map` / `join`)
- Writing reusable helper functions (`ic()`, `ext()`, `strokePath()`, `map()`)
- Splitting code into small builder functions, one per section
- DOM events, `IntersectionObserver`, `requestAnimationFrame`, `localStorage`
- Accessibility basics (ARIA attributes, focus handling, reduced-motion support)

## Project structure

```
.
├── index.html   # only <head> (meta, SEO, fonts, CSS link) + <script> tag
├── script.js    # Part 1: builds the whole UI   |   Part 2: page logic
├── style.css    # all styling (light/dark theme, responsive layout)
└── images/      # gym photos and logos (img1–img6, logo files)
```

### Why is `index.html` so small?

Some things must stay in the HTML file because they are read **before** any
JavaScript runs:

| Stays in HTML | Reason |
| --- | --- |
| `<meta>` tags, `<title>`, Open Graph | Browsers, search engines and social previews read them first |
| JSON-LD (schema.org) | Search engines expect structured data in the page source |
| Fonts and `style.css` links | Styling should load without waiting for JS |
| `<noscript>` message | Only works when JavaScript is off |
| `<script src="script.js">` | The entry point that builds everything else |

Everything inside `<body>` (navbar, hero, sections, footer, lightbox, toast,
bottom nav) is created by `script.js`.

## How `script.js` works

**Part 1 — UI builder**

1. Content lives in plain data at the top (`PLANS`, `FAQS`, `TESTIMONIALS`,
   `GALLERY`, `NAV_LINKS`, `ICON`, …).
2. One function per section (`header()`, `hero()`, `membership()`, `faq()`, …)
   turns that data into an HTML string.
3. All sections are joined and inserted into the page with
   `document.body.insertAdjacentHTML('afterbegin', …)`.

**Part 2 — Page logic** (runs after the UI exists)

- Loader and page-reveal animations
- Light / dark theme toggle (saved in `localStorage`)
- Navbar scroll effect and bottom-nav active state
- Animated stat counters
- Testimonials slider with dots and auto-play
- FAQ accordion
- Gallery lightbox
- Lazy-loaded Google Map
- Contact form that opens a pre-filled **WhatsApp** message

## Editing content

Open `script.js` and change the data at the top. For example, to add an FAQ:

```js
var FAQS = [
  // ...
  ['Do you offer personal training?', 'Yes, ask a trainer at the gym.']
];
```

The page rebuilds itself from the data — no HTML needs to be touched.

## Running it

No build step or dependencies. Keep all files and the `images/` folder together,
then either:

- open `index.html` in a browser, or
- serve the folder locally, e.g. `python3 -m http.server` and visit
  `http://localhost:8000`

## Trade-offs I noticed

- Because the page is built by JavaScript, anything that does not run JS
  (some crawlers, link previews) only sees the `<head>`. That is why the SEO
  tags and JSON-LD stay in `index.html`.
- There is a brief moment before the UI appears; the loader screen covers it.
- For a real production site, plain HTML (or server-side rendering) is usually
  the better choice — this version is mainly for learning.

## Tech

HTML · CSS · Vanilla JavaScript (no frameworks, no libraries)

---

Made as a JavaScript practice exercise.
