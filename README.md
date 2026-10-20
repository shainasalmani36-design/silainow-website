# SilaiNow

A warm, mobile-first static website for a home-tailor stitching and alteration service in India. It is built with plain HTML, CSS and JavaScript; booking details are prepared in WhatsApp after you configure the business number.

## Sections

- Hero and pickup call to action
- How it works
- Services, starting prices and turnaround times
- Why choose SilaiNow
- Sample garment gallery
- Customer testimonials
- Frequently asked questions
- Contact and WhatsApp booking form
- Footer with quick links and social placeholders

## Project files

```text
silainow-website/
├── index.html
├── style.css
├── script.js
├── images/
└── README.md
```

The gallery currently uses sample photos hosted by Unsplash. Put your approved, optimized photos in `images/` and update the image URLs in `index.html` to use them. Before publishing, review all placeholder prices, service area, email, working hours, social links and photos.

### Configure WhatsApp

No business phone number is included in this repository. Before publishing, set `WHATSAPP_NUMBER` near the top of `script.js` to the approved public business number using country code and digits only (for example, use the format `91` followed by the number). The WhatsApp links and booking form stay inactive until you set it. The phone field in the booking form is the customer's number and is only added to the message they choose to send.

## Open locally

No package installation or build step is required. Open `index.html` in a browser, or run a simple local web server from this folder:

```sh
python3 -m http.server 8000
```

Then visit <http://localhost:8000>.

## Deploy free with Netlify

1. Sign in to Netlify and choose **Add new site** → **Import an existing project**.
2. Connect the GitHub repository, `silainow-website`.
3. Leave the build command blank and set the publish directory to `.` (the repository root).
4. Choose **Deploy site**. The site is served from `index.html`.

Alternatively, drag the project folder into Netlify's manual deploy area. For ongoing updates, connect the GitHub repository.

## Deploy free with GitHub Pages

1. Push this project to a GitHub repository named `silainow-website`.
2. Open the repository's **Settings** → **Pages**.
3. Under **Build and deployment**, choose **Deploy from a branch**.
4. Select branch `main` and folder `/ (root)`, then click **Save**.
5. Wait for the Pages deployment to finish. The site URL will be shown on the Pages settings screen, typically `https://YOUR_GITHUB_USERNAME.github.io/silainow-website/`.

## Create the GitHub repository and push

These commands assume Git and the GitHub CLI (`gh`) are installed, and that you have authenticated with `gh auth login`. From this project folder:

```sh
git init -b main
git add index.html style.css script.js images README.md .gitignore
git commit -m "Initial commit: SilaiNow website"
gh repo create silainow-website --public --source=. --remote=origin --push
```

The `--public` option makes the repository public, which is required for free GitHub Pages on a personal GitHub account. Check the project for any private contact details before pushing.
