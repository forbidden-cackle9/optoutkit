"""Check every opt-out and find-profile link in public/brokers.json, plus every outside link on the pages.

Writes a Markdown report to link-report.md and exits 1 only if a link is clearly broken
(404/410, a redirect to a different site, or the site can't be reached).
Many broker sites block automated checks (401/403/429/5xx); those are reported as
"couldn't check", not as broken.
"""
import json, pathlib, sys, urllib.request, urllib.error
from urllib.parse import urlparse

root = pathlib.Path(__file__).resolve().parent.parent
data = json.loads((root / "public/brokers.json").read_text(encoding="utf-8"))
UA = "Mozilla/5.0 (compatible; OptOutKitLinkCheck/1.0; +https://optoutkit.org)"

def host(u):
    h = urlparse(u).hostname or ""
    return h[4:] if h.startswith("www.") else h

def check(url, domains):
    req = urllib.request.Request(url, headers={"User-Agent": UA, "Accept": "text/html"})
    try:
        with urllib.request.urlopen(req, timeout=20) as r:
            final = r.geturl()
            fh = host(final)
            if not any(fh == d or fh.endswith("." + d) for d in domains):
                return "broken", f"redirects off-site to {fh}"
            return "ok", f"HTTP {r.status}"
    except urllib.error.HTTPError as e:
        if e.code in (404, 410):
            return "broken", f"HTTP {e.code}"
        return "unknown", f"HTTP {e.code} (site blocks automated checks)"
    except Exception as e:  # DNS failure, timeout, TLS error
        return "broken", f"unreachable: {type(e).__name__}"

import re as _re
pages = []
seen = set()
for page in sorted((root / "public").glob("*.html")) + [root / "public/rights.js", root / "public/states.js"]:
    for u in _re.findall(r'https://[^"\'\s<>]+', page.read_text(encoding="utf-8")):
        u = u.rstrip(").,")
        h = host(u)
        if u in seen or h in ("optoutkit.org", "api.pwnedpasswords.com", "schema.org") or "{" in u:
            continue
        seen.add(u)
        pages.append((page.name, u, h))

rows, broken = [], 0
for name, url, h in pages:
    status, note = check(url, [".".join(h.split(".")[-2:])])  # allow redirects within the same site
    broken += status == "broken"
    icon = {"ok": "✅", "unknown": "⚪", "broken": "❌"}[status]
    rows.append(f"| {icon} | {name} | Page link | {url} | {note} |")
for b in data["brokers"]:
    for kind, url in (("Opt out", b["optOutUrl"]), ("Find profile", b.get("findProfileUrl"))):
        if not url:
            continue
        status, note = check(url, b["officialDomains"])
        broken += status == "broken"
        icon = {"ok": "✅", "unknown": "⚪", "broken": "❌"}[status]
        rows.append(f"| {icon} | {b['name']} | {kind} | {url} | {note} |")

report = "\n".join([
    "| | Site | Link | URL | Result |", "|---|---|---|---|---|", *rows, "",
    "✅ working · ⚪ couldn't check (site blocks automated checks; test by hand) · ❌ broken",
])
(root / "link-report.md").write_text(report + "\n", encoding="utf-8")
print(report)
sys.exit(1 if broken else 0)
