"""
Audit the delegate biographies for content that post-dates the game's deadline.

The game runs from June 7, 1776 to July 2, 1776, so a biography that mentions
the signing of the Declaration, a later office, a later presidency, the
delegate's death, or any event from the 1780s onward gives the player
knowledge the character cannot have.

Usage:
    python3 tools/audit_delegate_bios.py            # summary + every flagged delegate
    python3 tools/audit_delegate_bios.py --only     # just the summary counts
"""
import json, re, sys, pathlib
from collections import Counter

SRC = pathlib.Path(__file__).resolve().parent.parent / "sources" / "src" / "data" / "delegates.json"

# The Declaration was adopted July 4, 1776 — two days after the deadline.
PATTERNS = {
    "signing the Declaration": r"\bsign(ed|ing|ature|ed)\b|affix|present the Declaration",
    "mentions the Declaration": r"Declaration of Independence|the Declaration\b",
    "later office or presidency": r"\bPresident\b|\bgovernor\b|\bGovernor\b|\bSenator\b|Senate\b|Supreme Court|Continental Congress|Congress\b",
    "1780s or later": r"\b17(8[0-9]|9[0-9])\b",
    "death or later life": r"\bdied\b|\bdeath\b|passed away|buried",
    "after the war": r"after the war|after the Revolution|postwar|after independence|years later",
    "later century": r"\b1[89][0-9]{2}\b",
}


def audit():
    delegates = json.loads(SRC.read_text())["delegates"]
    flagged = []
    counts = Counter()
    for d in delegates:
        text = d["overview"]
        found = sorted(k for k, p in PATTERNS.items() if re.search(p, text, re.I))
        for k in found:
            counts[k] += 1
        if found:
            flagged.append((d["id"], d["name"], d["colony"], found))
    return delegates, flagged, counts


def main():
    delegates, flagged, counts = audit()
    only = "--only" in sys.argv
    print(f"delegates: {len(delegates)}")
    print(f"bios containing content after July 2, 1776: {len(flagged)} of {len(delegates)}")
    print()
    for k, v in counts.most_common():
        print(f"  {k:30} {v}")
    if not only:
        print()
        for did, name, colony, found in flagged:
            print(f"  {name:24} {colony:16} {', '.join(found)}")
    return flagged


if __name__ == "__main__":
    main()
