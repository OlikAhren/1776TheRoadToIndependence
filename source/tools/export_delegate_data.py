"""Export every delegate's data in an editable, round-trippable text format.

Usage:  python3 tools/export_delegate_data.py [output.txt]
Edit the output and feed it back to tools/apply_delegate_data.py to apply the changes.
"""
import json, pathlib, collections, sys

proj = pathlib.Path(__file__).resolve().parent.parent
delegates = json.loads((proj / 'sources/src/data/delegates.json').read_text())
approaches = json.loads((proj / 'sources/src/data/delegateApproaches.json').read_text())
bespoke = json.loads((proj / 'sources/src/data/delegateBespokeApproaches.json').read_text())
options = json.loads((proj / 'sources/src/data/delegateApproachOptions.json').read_text())

ORDER = ['New Hampshire', 'Massachusetts', 'New York', 'Rhode Island', 'Connecticut',
         'Pennsylvania', 'New Jersey', 'Maryland', 'Delaware', 'Virginia',
         'North Carolina', 'South Carolina', 'Georgia']

MAIL_MATH = [
    "- Cost: $1 per ride-day, paid by the TARGET colony's postal subsidies (not Committee of Five funds).",
    "- Ride time: whole days from your current colony to the delegate's colony. Does NOT advance the date.",
    "- Support roll: one random integer inside the option's own min..max range, added to the delegate's current support (clamped 1..100).",
    "- Travel event (only when the ride is more than 1 day): 25% bad luck (+1 ride-day, +$1 cost), 25% good luck (-1 ride-day, -$1 cost), 50% no event. A 1-day ride gets no event roll.",
    "- Blocked if the ride takes more days than remain before July 2, if no postal rider is at your location, or if the target colony's subsidies are below the cost.",
]
MEET_MATH = [
    "- Cost: $3 per ride-day, deducted from the Committee of Five personal funds.",
    "- Ride time: whole days from your current colony to the delegate's colony. DOES advance the date and moves you there.",
    "- Support roll: one random integer inside the option's own min..max range, added to the delegate's current support (clamped 1..100).",
    "- Travel event: 25% bad luck (+1 ride-day, +$3 cost), 25% good luck (-1 ride-day, -$3 cost), 50% no event.",
    "- Blocked if the ride takes more days than remain before July 2, or if the Committee of Five funds are below the cost.",
]

def main() -> None:
    out_path = pathlib.Path(sys.argv[1]) if len(sys.argv) > 1 else pathlib.Path(
        '/home/brandon/.openclaw/workspace/declaration-game-delegate-data.txt')
    L: list[str] = []
    L.append('DECLARATION GAME - DELEGATE DATA EXPORT')
    L.append('======================================')
    L.append('Edit any line in place and paste the file back. Leave lines you do not change exactly as they are.')
    L.append('Keep each field on ONE line. Do not renumber the options.')
    L.append('A literal \\n inside a field means a line break in the game text - leave it as it is.')
    L.append('')
    L.append('FIELDS')
    L.append('------')
    L.append('name / profile / starting_support   -> the delegate card and the map')
    L.append('historical_note                     -> the biography in the delegate card')
    L.append('mail_option_N_text                  -> radio button N when MAILING CORRESPONDENCE')
    L.append('mail_option_N_min / _max             -> the support-roll range for that option when mailing')
    L.append('meet_option_N_text                  -> radio button N when MEETING IN PERSON')
    L.append('meet_option_N_min / _max             -> the support-roll range for that option when meeting')
    L.append('  The min..max range IS the math. Change the numbers to change the outcome.')
    L.append('  min and max are inclusive. A band label is included for reference only:')
    L.append('  neutral = default angle, good = the recommended angle, bad = the wrong angle, legend = the bespoke story angle.')
    L.append('  Options numbered 1, 2, 3 ... are shown in that order. Option 1 is pre-selected.')
    L.append('  Changing a delegate profile changes the label on the card only - the option wording')
    L.append('  stays as written here until you edit the option text itself.')
    L.append('')
    L.append('=' * 40)
    L.append('MAIL MATH (Correspondence)')
    L.append('=' * 40)
    L.extend(MAIL_MATH)
    L.append('')
    L.append('=' * 40)
    L.append('MEETING MATH (In Person)')
    L.append('=' * 40)
    L.extend(MEET_MATH)
    L.append('')
    L.append('=' * 40)
    L.append('TRAVEL TIMES (whole days, origin -> destination)')
    L.append('=' * 40)
    travel = delegates['travelTimes']
    for origin in ORDER:
        row = travel.get(origin, {})
        L.append(f"{origin}: " + ', '.join(f"{d} {row.get(d, '?')}" for d in ORDER if d in row))
    L.append('')

    by = collections.defaultdict(list)
    for d in delegates['delegates']:
        by[d['colony']].append(d)

    for colony in ORDER:
        ds = by.get(colony, [])
        if not ds:
            continue
        L.append('=' * 40)
        L.append(f'COLONY: {colony.upper()}')
        L.append('=' * 40)
        for d in sorted(ds, key=lambda r: r['name']):
            a = approaches.get(d['profile'], {})
            b = bespoke.get(d['id'])
            opts = options.get(d['id'], {})
            L.append('')
            L.append(f"--- DELEGATE: {d['name']} ---")
            L.append(f"id: {d['id']}")
            L.append(f"colony: {d['colony']}")
            L.append(f"name: {d['name']}")
            L.append(f"profile: {d['profile']}")
            L.append(f"starting_support: {d['supportLevel']}")
            L.append(f"committee_of_five: {'yes' if d.get('committeeOfFive') else 'no'}")
            L.append(f"continental_congress_president: {'yes' if d.get('continentalCongressPresident') else 'no'}")
            # Embedded newlines are escaped so every field stays on ONE line.
            L.append(f"historical_note: {d['overview'].replace(chr(10), '\\n')}")
            if a.get('tell'):
                L.append(f"profile_tell: {a['tell']}")
            for kind in ('mail', 'meet'):
                for i, o in enumerate(opts.get(kind, []), 1):
                    L.append(f"{kind}_option_{i}_text: {o['text']}")
                    L.append(f"{kind}_option_{i}_min: {o['min']}")
                    L.append(f"{kind}_option_{i}_max: {o['max']}")
                    L.append(f"{kind}_option_{i}_band: {o['band']}")
            if b:
                L.append(f"bespoke_explanation: {b['explanation'].replace(chr(10), '\\n')}")
            L.append('')
    out_path.write_text('\n'.join(L) + '\n')
    print(f'wrote {out_path} ({len(L)} lines)')

if __name__ == '__main__':
    main()
