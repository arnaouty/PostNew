# TQM – Tri-QM for Export website

Corporate website for **TQM (Tri-QM for Export)**, a Quality Masters Group company
trading paper, packaging paper, tissue, wood pulp and EN 643 waste paper, with offices
in Egypt and China. All content comes from the TQM company profile.

## Structure

```
index.html            single-page site (About, Products, Sectors, Sourcing, Group, Clients, Contact)
assets/css/style.css  styles; light/dark theme follows the visitor's system setting
assets/js/main.js     mobile menu, sector tabs, active nav link, enquiry form
assets/img/           brand mark, product, grade, reference and client images (cropped from the profile)
```

It is a static site with no build step: open `index.html` in a browser, or upload the
folder to any web host (cPanel, Netlify, GitHub Pages, etc.).

## Enquiry form

There is no server yet, so the "Request a Quote" form shows the enquiry ready to copy,
with an "Open in email app" button addressed to `m.ali@qm-eg.com` (cc `m.ismail@qm-eg.com`).
Change `ENQUIRY_EMAIL` / `ENQUIRY_CC` in `assets/js/main.js`, or connect a form service
(e.g. Formspree) once hosting is chosen.
