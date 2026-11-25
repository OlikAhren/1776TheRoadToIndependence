"""
Fetch a portrait for every Declaration Game delegate from Wikipedia / Wikimedia Commons.

For each delegate:
  1. try the exact-name article summary (Wikipedia REST API)
  2. if that is missing or is clearly NOT a portrait of that person, search for
     the right article and re-check
  3. if no article image fits, search Commons for a portrait file
  4. accept a candidate when the image file name carries the delegate's surname,
     or when the article is clearly about that person and the image is not a
     map/flag/seal
  5. download the thumbnail into sources/public/delegate-images/<id>.<ext>
  6. record title, article URL, file page and description in
     sources/src/data/delegateImages.json

Run:  python3 tools/fetch_delegate_images.py
"""
import json, re, time, urllib.parse, urllib.request, pathlib

ROOT = pathlib.Path(__file__).resolve().parent.parent / "sources"
SRC = ROOT / "src"
OUT_IMG = ROOT / "public" / "delegate-images"
OUT_JSON = SRC / "data" / "delegateImages.json"
UA = "DeclarationGamePortraitFetch/1.0 (asset fetch; contact: olik.parents@gmail.com)"
API = "https://en.wikipedia.org/w/api.php"
REST = "https://en.wikipedia.org/api/rest_v1/page/summary/"

REJECT = re.compile(r"\b(map|flag|seal|coat[ _]of[ _]arms|banknote|stamp|diagram|chart|"
                    r"plaque|monument|statue|university|meeting|route|boundary|county|"
                    r"township|river|battle|surrender|tomb|grave|coin|medal|engraving|"
                    r"drawing of the|view of)\b", re.I)
PERSONISH = re.compile(r"\b(american|colonial|founding father|delegate|politician|statesman|"
                       r"lawyer|merchant|physician|farmer|soldier|signer|revolutionary)\b", re.I)


def get_json(url):
    for attempt in range(5):
        req = urllib.request.Request(url, headers={"User-Agent": UA, "Accept": "application/json"})
        try:
            with urllib.request.urlopen(req, timeout=30) as r:
                return json.loads(r.read().decode("utf-8"))
        except urllib.error.HTTPError as e:
            if e.code in (429, 503) and attempt < 4:
                time.sleep(3 * (attempt + 1))
                continue
            raise
    raise RuntimeError("rate limited")


def get_bytes(url):
    req = urllib.request.Request(url, headers={"User-Agent": UA})
    with urllib.request.urlopen(req, timeout=45) as r:
        return r.read()


def norm(s):
    return re.sub(r"[^a-z]", "", s.lower())


def surname(full_name):
    parts = full_name.replace("R. ", "").replace("Jr.", "").split()
    return parts[-1] if parts else full_name


def summary_for_title(title):
    try:
        return get_json(REST + urllib.parse.quote(title.replace(" ", "_")))
    except Exception:
        return None


def filename_of(url):
    return url.split("?")[0].rsplit("/", 1)[-1].replace("_", " ")


def looks_like_person_image(url, person, title=None, description=None):
    fname = filename_of(url)
    if REJECT.search(fname):
        return False
    if norm(surname(person)) in norm(fname):
        return True
    # fall back to the article itself: right name, person-like description, image not rejected
    if title and norm(person) in norm(title) and description and PERSONISH.search(description):
        return True
    return False


def search_articles(name):
    q = urllib.parse.urlencode({
        "action": "query", "format": "json", "list": "search",
        "srsearch": f'"{name}" American', "srlimit": 8, "srnamespace": 0,
    })
    try:
        data = get_json(API + "?" + q)
    except Exception:
        return []
    out = []
    for hit in data.get("query", {}).get("search", []):
        s = summary_for_title(hit["title"])
        if s:
            out.append(s)
    return out


def commons_portrait(name):
    """search Commons for a portrait file of this person"""
    q = urllib.parse.urlencode({
        "action": "query", "format": "json", "list": "search",
        "srsearch": f'{name} portrait', "srnamespace": 6, "srlimit": 10,
    })
    try:
        data = get_json(API + "?" + q)
    except Exception:
        return None
    hits = data.get("query", {}).get("search", [])
    for hit in hits:
        title = hit["title"]
        if REJECT.search(title.replace("_", " ")):
            continue
        if norm(surname(name)) not in norm(title):
            continue
        t = urllib.parse.urlencode({
            "action": "query", "format": "json", "titles": title,
            "prop": "imageinfo", "iiprop": "url|extmetadata", "iiurlwidth": 400,
        })
        try:
            info = get_json(API + "?" + t)
        except Exception:
            continue
        pages = info.get("query", {}).get("pages", {})
        for _, page in pages.items():
            ii = (page.get("imageinfo") or [{}])[0]
            url = ii.get("thumburl") or ii.get("url")
            if not url:
                continue
            meta = ii.get("extmetadata", {})
            return {
                "title": title, "thumb": url, "page": ii.get("descriptionurl"),
                "description": None, "license": (meta.get("LicenseShortName", {}) or {}).get("value"),
                "artist": re.sub(r"<[^>]+>", "", (meta.get("Artist", {}) or {}).get("value", "") or "")[:120],
            }
    return None


def main():
    delegates = json.loads((SRC / "data" / "delegates.json").read_text())["delegates"]
    OUT_IMG.mkdir(parents=True, exist_ok=True)
    for old in OUT_IMG.glob("*"):
        old.unlink()
    results, misses = {}, []

    for i, d in enumerate(delegates, 1):
        did, name = d["id"], d["name"]
        time.sleep(0.4)
        pick = None

        # 1) exact article, then searched articles
        candidates = []
        s = summary_for_title(name)
        if s:
            candidates.append(s)
        candidates.extend(search_articles(name))
        seen = set()
        for c in candidates:
            if c.get("title") in seen:
                continue
            seen.add(c.get("title"))
            thumb = (c.get("thumbnail") or {}).get("source")
            if not thumb:
                continue
            if looks_like_person_image(thumb, name, c.get("title"), c.get("description")):
                pick = {
                    "title": c.get("title"), "thumb": thumb.split("?")[0],
                    "page": (c.get("content_urls", {}).get("desktop", {}) or {}).get("page"),
                    "description": c.get("description"),
                }
                break

        # 2) Commons fallback
        if not pick:
            pick = commons_portrait(name)

        if not pick:
            misses.append(name)
            print(f"[{i:2}/{len(delegates)}] MISS {name}")
            continue

        url = pick["thumb"]
        try:
            data = get_bytes(url)
        except Exception as e:
            misses.append(name)
            print(f"[{i:2}/{len(delegates)}] DL FAIL {name}: {e}")
            continue
        ext = ".png" if url.lower().split("?")[0].endswith(".png") else ".jpg"
        fname = did + ext
        (OUT_IMG / fname).write_bytes(data)
        results[did] = {
            "file": f"delegate-images/{fname}",
            "name": name,
            "title": pick.get("title"),
            "page": pick.get("page"),
            "description": pick.get("description"),
            "license": pick.get("license"),
            "artist": pick.get("artist"),
        }
        print(f"[{i:2}/{len(delegates)}] ok   {name:26} -> {fname} ({len(data)//1024} KB)")

    OUT_JSON.write_text(json.dumps(results, indent=2, ensure_ascii=False) + "\n")
    print(f"\nimages: {len(results)}/{len(delegates)}  misses: {misses}")
    return results


if __name__ == "__main__":
    main()
