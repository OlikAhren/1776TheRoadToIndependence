"""
Rebuild sources/src/data/debateAngles.json from the owner's written brief.

The brief (pasted text) lists, for each of the thirteen colonies, four debate
angles with:
  - the angle text
  - "Odds: <min> to <max>"  -> the uniform support roll range for that angle
  - "Post-Event Prompt Explanation: ..." -> the explanation shown after the debate

This script parses that brief programmatically (no hand transcription) and
writes the JSON data file. Two options in the original brief have no
explanation text (North Carolina B and South Carolina B) and are stored with an
empty explanation.

Usage: python3 tools/parse_debate_angles.py <brief.txt>
"""
import re, json, pathlib, sys

COL_RE = re.compile(r'(?m)^\s*(\d{1,2})\.\s+([A-Z][A-Za-z ]+?):\s*$')
OPT_RE = re.compile(r'(?m)^\s*([A-D])\.\s+(.*)$')
ODDS_RE = re.compile(r'-\s*Odds:\s*(-?\d+)\s*to\s*\+?\s*(\d+)')
EXPL_RE = re.compile(r'-\s*Post-Event Prompt Explanation:\s*(.*)')

OUT = pathlib.Path(__file__).resolve().parent.parent / "sources" / "src" / "data" / "debateAngles.json"


def parse(raw: str) -> dict:
    positions = [(m.start(), m.group(2).strip()) for m in COL_RE.finditer(raw)]
    data = {}
    for i, (start, name) in enumerate(positions):
        end = positions[i + 1][0] if i + 1 < len(positions) else len(raw)
        section = raw[start:end]
        opts = []
        om = list(OPT_RE.finditer(section))
        for j, m in enumerate(om):
            oend = om[j + 1].start() if j + 1 < len(om) else len(section)
            body = section[m.end():oend]
            odds = ODDS_RE.search(body)
            expl = EXPL_RE.search(body)
            text = re.sub(r'\s+', ' ', (m.group(2).strip() + ' ' + body.split('- Odds:')[0].strip()).strip())
            opts.append({
                "text": text,
                "min": int(odds.group(1)) if odds else None,
                "max": int(odds.group(2)) if odds else None,
                "explanation": expl.group(1).strip() if expl else "",
            })
        data[name] = opts
    return data


if __name__ == "__main__":
    src = pathlib.Path(sys.argv[1]).read_text()
    parsed = parse(src)
    OUT.write_text(json.dumps(parsed, indent=2, ensure_ascii=False) + "\n")
    print(f"wrote {len(parsed)} colonies / {sum(len(v) for v in parsed.values())} options -> {OUT}")
