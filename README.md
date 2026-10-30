# Opt Out Kit

Source for [optoutkit.org](https://optoutkit.org): a free page for checking leaked passwords privately and removing yourself from people-search sites.

- No accounts, cookies, analytics or trackers.
- The page's security policy (`public/_headers`) lets the browser contact only `api.pwnedpasswords.com`, and only the first 5 characters of a password's SHA-1 hash are sent there.
- Checklist progress is saved only in the visitor's browser.

## Layout
- `public/` — everything that is served: `index.html`, `faq.html`, `styles.css` (shared by both pages), `favicon.svg`, `_headers`
- `wrangler.jsonc` — tells Cloudflare to serve `public/` as a static site

## Editing the page script
`_headers` allows the inline script by its SHA-256 hash. After any change to the `<script>` in `index.html`, regenerate the hash or browsers will block the script.
