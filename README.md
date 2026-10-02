# 🏋️ Workout Zone — Gym Website

![HTML5](https://img.shields.io/badge/HTML5-E34F26?logo=html5&logoColor=white)
![CSS3](https://img.shields.io/badge/CSS3-1572B6?logo=css3&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?logo=javascript&logoColor=black)
![No Dependencies](https://img.shields.io/badge/dependencies-none-brightgreen)

A fast, responsive, single-page website for **Workout Zone**, a gym in Dhekaha, Rewa (Madhya Pradesh). Visitors can check batch timings, compare membership plans, browse the gym gallery, find the location and send an enquiry straight to the gym on WhatsApp.

Built with plain HTML, CSS and vanilla JavaScript. No frameworks, no build step.

🔗 **Live Demo:**
- [theworkoutzone.pages.dev](https://theworkoutzone.pages.dev/)

---

## 📑 Table of Contents

- [Features](#-features)
- [Tech Stack](#️-tech-stack)
- [Project Structure](#-project-structure)
- [Getting Started](#-getting-started)
- [Customization](#️-customization)
- [Accessibility & SEO](#-accessibility--seo)
- [Roadmap](#-roadmap)
- [AI Assistance](#-ai-assistance)
- [Note on Testimonials](#-note-on-testimonials)

## ✨ Features

**Content sections**
- Hero with a "3 Days FREE Demo" call-to-action
- Animated stats (members, years, batches, trainers)
- About, training timetable (morning and evening batches) and membership plans
- Photo gallery, testimonials, FAQ and contact section

**Interactions (all in vanilla JS)**
- 🌗 **Light / Dark theme toggle**, remembered between visits
- 📱 **Mobile bottom navigation** that highlights the section you are currently viewing
- 🎞️ **Testimonials slider** with dot navigation and autoplay (pauses on hover/touch, when out of view or when the tab is hidden)
- ❓ **FAQ accordion** (one answer open at a time)
- 🖼️ **Gallery lightbox** with Escape-to-close and focus handling
- 🔢 **Animated counters** and **scroll-reveal** effects
- 🗺️ **Lazy-loaded Google Map**, loaded only when it comes into view
- 💬 **Enquiry form → WhatsApp**: validates the name and an Indian mobile number, then opens a pre-filled WhatsApp message to the gym
- 🔔 Toast notifications and a short page loader

## 🛠️ Tech Stack

| Technology | Usage |
|------------|-------|
| HTML5 | Semantic page structure |
| CSS3 | Styling, theming (light/dark), responsive layout |
| Vanilla JavaScript | All interactivity, no libraries |
| Google Fonts | Bebas Neue and DM Sans |
| Google Maps Embed | Location map |
| GitHub Pages / Cloudflare Pages | Hosting |

## 📁 Project Structure

```
gym/
├── .vscode/        # Editor settings
├── images/         # Logos and gallery images
├── favicon.svg     # Site icon
├── index.html      # Page markup, meta tags and structured data
├── style.css       # Styles and theme variables
├── script.js       # Interactivity and form logic
└── robots.txt      # Search engine crawler rules
```

## 🚀 Getting Started

No installation or build tools needed.

```bash
# 1. Clone the repository
git clone https://github.com/nitish-2030/gym.git

# 2. Move into the project folder
cd gym

# 3. Open index.html in your browser
```

Tip: use the **Live Server** extension in VS Code for auto-reload while editing.

## ⚙️ Customization

**Contact number and map location** are set at the top of `script.js`:

```js
var WA_NUMBER = '916232886847';           // WhatsApp number (country code + number, no +)
var MAP_COORDS = '24.543153,81.2720895';  // latitude,longitude for the map
```

Other things to update when details change:
- **Plans, timings, FAQ, testimonials:** edit the matching sections in `index.html`
- **Phone number and hours in search results:** update the JSON-LD block (`schema.org/Gym`) in the `<head>` of `index.html`
- **Gallery photos:** replace files in `images/`. The lightbox reads images directly from the gallery markup, so no extra code change is needed
- **Colors and fonts:** adjust the theme variables in `style.css`

## ♿ Accessibility & SEO

- Skip-to-content link, ARIA attributes on the navigation, accordion and theme toggle, and keyboard-friendly lightbox
- Respects the user's **reduced motion** setting (animations and autoplay are turned off)
- Content stays visible even if JavaScript is unavailable
- Meta description, Open Graph tags and **schema.org `Gym` structured data** for better search and sharing previews

## 🗺️ Roadmap

Ideas for future updates:
- [ ] Replace sample testimonials with genuine member feedback
- [ ] Add real trainer profiles and photos
- [ ] Add a custom domain
- [ ] Add before/after transformation gallery
- [ ] Further image optimization for faster loading

## 🤖 AI Assistance

The code for this website was generated with the help of AI (Claude by Anthropic). The repository owner did not write it manually, but reviewed it and verified that the business information (timings, pricing, contact details) is accurate. This README was also created with AI assistance.

## 📝 Note on Testimonials

The member testimonials shown on the site are sample content used as placeholders. They will be replaced with genuine member feedback.

---

⭐ If you found this project useful, consider giving it a star!
