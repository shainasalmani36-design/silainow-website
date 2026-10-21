# Haven real estate marketplace prototype

A responsive, static front-end prototype for an Indian property marketplace. The experience is based on the supplied buyer/seller flow: search homes, save and compare listings, contact the seller, or submit a property draft for verification.

## Included

- Buy, rent and new project search modes
- Location, property type, budget, bedroom, availability and verified-listing filters
- Property cards with seller details and responsive mobile layout
- Shortlist saved in local browser storage
- Compare up to three selected homes
- List and map preview modes
- Inquiry, sign-in and post-property demo flows
- City discovery and newsletter interaction
- Admin portal with overview metrics, listing review, lead pipeline, user directory, verification queue, insights and workspace settings

## Run locally

Open `index.html` in a browser, or start a simple local server from this folder:

```sh
python3 -m http.server 8000
```

Then visit <http://localhost:8000>.

Open the admin prototype at <http://localhost:8000/admin.html> (or select **Admin portal** in the public site's footer).

## Prototype scope

This is a front-end prototype. Listings, users, leads and metrics in the admin portal are sample content; admin review decisions are stored in the current browser only. Public sign-in, inquiry, newsletter and seller listing forms display demo confirmations. A production marketplace still needs a backend, role-based admin authentication, real OTP delivery, listing photo uploads, document verification, moderation, lead routing, and a connected map/search service. Replace sample property photos and data with approved content before launch.
