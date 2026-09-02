# leCedar Global — website

Marketing site for [lecedarglobal.com](https://lecedarglobal.com). Single-file static HTML pages (no build step), deployed via Netlify.

- `index.html` — the main site
- `industries/` — industry-vertical landing pages (fitness center is live; others are in progress)
- `apps/` — supplementary app/tool pages
- `email-signature.html` — HTML email signature (not deployed as part of the site)
- `assets/` — images, favicon, shared CSS

This is the canonical development environment — edit here, commit, push. Deploy is via Netlify's Git integration (or manual drop as a fallback). Source of truth for project context, decisions, and history lives in the leCedar Global Brain vault project, not here.

Draft/version-history HTML files (`leCedar Global v*.html`) are kept in the Brain vault only, not in this repo.

## `ayadati/` — Ayadati product pages

Static mirror of the Ayadati landing app (`ayadati-platform/apps/landing`), covering
Lebanon and Cote d'Ivoire in English and French, plus their About / Contact / Clinics /
News / Policies sub-pages (52 pages).

- Entry point: `/ayadati/` (market + language chooser, hand-written)
- Markets: `/ayadati/lb/{en,fr}/`, `/ayadati/ci/{en,fr}/`
- `_next/` and `markets/` hold the app's compiled assets and market artwork.

Regenerating: build the landing app with `basePath`/`assetPrefix` set to `/ayadati`,
then copy the prerendered HTML from `.next/server/app/<market>/<locale>*`, plus
`.next/static` and `public/markets`. Hand-written `/markets/...` asset paths and raw
anchor hrefs are not covered by `basePath` and still need prefixing with `/ayadati`.

This is a point-in-time snapshot: it does not update when the app changes.
