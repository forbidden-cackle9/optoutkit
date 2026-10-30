"""Run after editing public/index.html:
  python3 tools/sync.py
- regenerates public/brokers.json from the BROKERS list in index.html
- regenerates the script hash in public/_headers (the CSP blocks the script otherwise)
- rebuilds public/opt-out-kit-skill.zip from skill/opt-out-kit
"""
import base64, hashlib, json, re, pathlib
from datetime import date
from urllib.parse import urlparse

root = pathlib.Path(__file__).resolve().parent.parent
html = (root / "public/index.html").read_text(encoding="utf-8")

# brokers.json
block = re.search(r"var BROKERS=\[(.*?)\n\];", html, re.S).group(1)
brokers = []
for line in block.strip().splitlines():
    pairs = re.findall(r'(\w+):(?:"((?:[^"\\]|\\.)*)"|(\d))', line)
    d = {k: (num if num else s) for k, s, num in pairs}
    hosts = sorted({urlparse(u).hostname.removeprefix("www.") for u in (d.get("opt"), d.get("search")) if u})
    brokers.append({
        "id": d["id"],
        "name": d["name"],
        "priority": d.get("p") == "1",
        "optOutUrl": d["opt"],
        "needsProfileLink": bool(d.get("search")),
        "findProfileUrl": d.get("search") or None,
        "officialDomains": hosts,
        "tip": d.get("tip") or None,
    })
out = {
    "name": "Opt Out Kit broker list",
    "source": "https://optoutkit.org",
    "updated": date.today().isoformat(),
    "recheckAfterDays": 60,
    "notes": "Opting out is always free. Only follow opt-out links whose domain is in officialDomains. Pages that build a paid report are sales pages, not opt-outs.",
    "brokers": brokers,
}
(root / "public/brokers.json").write_text(json.dumps(out, indent=2, ensure_ascii=False) + "\n", encoding="utf-8")

# CSP hash for the one executable inline script
body = re.search(r"<script>(.*?)</script>", html, re.S).group(1)
h = base64.b64encode(hashlib.sha256(body.encode("utf-8")).digest()).decode()
hp = root / "public/_headers"
hp.write_text(re.sub(r"'sha256-[^']+'", f"'sha256-{h}'", hp.read_text()))
print(f"{len(brokers)} brokers written; script hash sha256-{h}")

# Claude skill download (folder name must match the skill name)
import zipfile
skill = root / "skill/opt-out-kit"
with zipfile.ZipFile(root / "public/opt-out-kit-skill.zip", "w", zipfile.ZIP_DEFLATED) as z:
    for f in sorted(skill.rglob("*")):
        if f.is_file():
            info = zipfile.ZipInfo(str(f.relative_to(skill.parent)), date_time=(2026, 1, 1, 0, 0, 0))
            info.compress_type = zipfile.ZIP_DEFLATED
            z.writestr(info, f.read_bytes())
print("skill zip written")
