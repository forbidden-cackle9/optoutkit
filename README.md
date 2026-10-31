# Opt Out Kit

Source for [optoutkit.org](https://optoutkit.org): a free page for checking leaked passwords privately and removing yourself from people-search sites.

- No accounts, cookies, analytics or trackers.
- The page's security policy (`public/_headers`) lets the browser contact only `api.pwnedpasswords.com`, and only the first 5 characters of a password's SHA-1 hash are sent there.
- Checklist progress is saved only in the visitor's browser.

## Layout
- `public/es/` — Spanish versions of every page. Scripts and data are shared: text comes from `OOK.t("English","Español")` in scripts and `*_es` fields in the data files. When you change a page, change its Spanish copy too.
- `drafts/safety/` — a parked safety page (hotlines, address confidentiality programs). Not served; see its README to restore.
- `public/brokers.json`, `llms.txt`, `robots.txt`, `sitemap.xml` — machine-readable info for search engines and AI assistants
- `public/opt-out-kit-skill.zip` — downloadable Claude skill, built from `skill/opt-out-kit/`
- `tools/sync.py` — run after editing `brokers-data.js`: regenerates `brokers.json` and the skill zip
- `public/funding.js` — running costs, support received (after fees) and support links. Support stays hidden until a link is set, and the links disappear once costs are covered.
- `tools/scores.py` — the state privacy ranking: run it to regenerate `public/scores.js` (rights page heat map) and `public/us-privacy-ranking.xlsx` (download). Review each January.
- `tools/check_links.py` + `.github/workflows/check-links.yml` — weekly link check that opens an issue if a link breaks
- `public/` — everything that is served. Pages: `index.html` (home + overall tracker, `home.js`), `remove.html` (`remove.js`, data in `brokers-data.js`), `lockdown.html` and `bigtech.html` and `devices.html` (shared `steps.js`, data in `lockdown-data.js` / `bigtech-data.js` / `devices-data.js`), `tools.html` (`tools.js`), `common.js` shared helpers; also `faq.html`, `rights.html` + `rights.js`,  `states.js` (state privacy laws, review each legislative session), `styles.css`, `favicon.svg`, `_headers`
- `wrangler.jsonc` — tells Cloudflare to serve `public/` as a static site

## License
Copyright (C) 2026 forbidden-cackle9

This program is free software: you can redistribute it and/or modify it under the terms of the GNU Affero General Public License as published by the Free Software Foundation, either version 3 of the License, or (at your option) any later version. It is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See [LICENSE](LICENSE) for details.

If you run a modified version of this site for others, the AGPL requires you to offer them its source code.
