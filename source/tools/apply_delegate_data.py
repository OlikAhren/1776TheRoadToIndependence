"""Apply an edited delegate-data export back into the game's data files.

Usage:  python3 tools/apply_delegate_data.py <edited-export.txt>

Only the fields present in the export are touched. The export may contain a subset of
delegates; anything not mentioned is left exactly as it is.
"""
import json, pathlib, re, sys, shutil, datetime

proj = pathlib.Path(__file__).resolve().parent.parent
DATA = proj / 'sources/src/data'

def parse(path: pathlib.Path):
    blocks = {}
    cur = None
    for raw in path.read_text().splitlines():
        line = raw.rstrip('\n')
        m = re.match(r'^--- DELEGATE: (.+?) ---$', line)
        if m:
            cur = {'__name__': m.group(1), 'fields': {}}
            blocks[cur['__name__']] = cur
            continue
        if cur is None:
            continue
        if ': ' not in line:
            continue
        key, _, val = line.partition(': ')
        cur['fields'][key] = val
    return blocks


def edit_delegate_field(text: str, delegate_id: str, key: str, value) -> str:
    """Replace one field inside one delegate block, leaving every other byte untouched."""
    lines = text.splitlines(keepends=True)
    start = None
    for i, line in enumerate(lines):
        if f'"id": "{delegate_id}"' in line:
            start = i
            break
    assert start is not None, f'delegate block not found: {delegate_id}'
    pattern = re.compile(r'^(\s*)"' + re.escape(key) + r'":\s*')
    for i in range(start + 1, len(lines)):
        if re.match(r'^\s*\},?\s*$', lines[i]):
            break
        m = pattern.match(lines[i])
        if not m:
            continue
        nl = '\n' if lines[i].endswith('\n') else ''
        rest = lines[i][m.end():]
        trailing_comma = ',' if rest.rstrip().endswith(',') else ''
        if isinstance(value, bool):
            rendered = 'true' if value else 'false'
        elif isinstance(value, int):
            rendered = str(value)
        else:
            rendered = json.dumps(value, ensure_ascii=False)
        lines[i] = f'{m.group(1)}"{key}": {rendered}{trailing_comma}{nl}'
        return ''.join(lines)
    # Field absent: insert it right after the id line.
    nl = '\n' if lines[start].endswith('\n') else ''
    indent = re.match(r'^(\s*)', lines[start + 1]).group(1)
    if isinstance(value, bool):
        rendered = 'true' if value else 'false'
    elif isinstance(value, int):
        rendered = str(value)
    else:
        rendered = json.dumps(value, ensure_ascii=False)
    lines.insert(start + 1, f'{indent}"{key}": {rendered},{nl}')
    return ''.join(lines)

def main() -> None:
    if len(sys.argv) < 2:
        raise SystemExit('usage: apply_delegate_data.py <edited-export.txt>')
    src = pathlib.Path(sys.argv[1])
    blocks = parse(src)

    del_path = DATA / 'delegates.json'
    opt_path = DATA / 'delegateApproachOptions.json'
    bes_path = DATA / 'delegateBespokeApproaches.json'

    stamp = datetime.datetime.now().strftime('%Y%m%d%H%M%S')
    for f in (del_path, opt_path, bes_path, DATA / 'delegateApproaches.json'):
        shutil.copy2(f, f.with_name(f.name + f'.bak-{stamp}'))

    delegates_doc = json.loads(del_path.read_text())
    options = json.loads(opt_path.read_text())
    bespoke = json.loads(bes_path.read_text())
    delegates_text = del_path.read_text()
    appr_path = DATA / 'delegateApproaches.json'
    approaches = json.loads(appr_path.read_text())

    by_name = {d['name']: d for d in delegates_doc['delegates']}
    changed_delegates = 0
    changed_options = 0
    changed_bespoke = 0
    changed_tells = 0
    missing = []

    for name, block in blocks.items():
        f = block['fields']
        d = by_name.get(name)
        if d is None:
            missing.append(name)
            continue
        did = f.get('id', d['id'])
        assert did == d['id'], f"id mismatch for {name}: export {did} vs data {d['id']}"

        for field, key in (('profile', 'profile'), ('historical_note', 'overview'),
                           ('starting_support', 'supportLevel')):
            if field in f:
                new = f[field]
                if field == 'starting_support':
                    new = int(new)
                if key == 'overview':
                    new = new.replace('\\n', '\n')
                if d.get(key) != new:
                    d[key] = new
                    changed_delegates += 1
                    # Edit the file as text so untouched lines keep their exact formatting.
                    delegates_text = edit_delegate_field(delegates_text, d['id'], key, new)
        if 'committee_of_five' in f:
            value = f['committee_of_five'].strip().lower() == 'yes'
            if d.get('committeeOfFive') != value:
                d['committeeOfFive'] = value
                changed_delegates += 1
                delegates_text = edit_delegate_field(delegates_text, d['id'], 'committeeOfFive', value)
        if 'continental_congress_president' in f:
            value = f['continental_congress_president'].strip().lower() == 'yes'
            # Only touch the key when the delegate already had it, or when it is being set to
            # yes - an absent key stays absent so untouched delegates keep their exact shape.
            if 'continentalCongressPresident' in d or value:
                if d.get('continentalCongressPresident') != value:
                    d['continentalCongressPresident'] = value
                    changed_delegates += 1
                    delegates_text = edit_delegate_field(delegates_text, d['id'], 'continentalCongressPresident', value)

        entry = options.setdefault(did, {})
        for kind in ('mail', 'meet'):
            idxs = sorted({int(m.group(1)) for k in f
                           for m in [re.match(rf'^{kind}_option_(\d+)_text$', k)] if m})
            if not idxs:
                continue
            opts = entry.get(kind, [])
            rebuilt = []
            for i in idxs:
                text = f.get(f'{kind}_option_{i}_text', '')
                lo = f.get(f'{kind}_option_{i}_min')
                hi = f.get(f'{kind}_option_{i}_max')
                band = f.get(f'{kind}_option_{i}_band', 'neutral')
                assert lo is not None and hi is not None, f"{name} {kind} option {i} missing min/max"
                lo, hi = int(lo), int(hi)
                assert lo <= hi, f"{name} {kind} option {i}: min {lo} > max {hi}"
                rebuilt.append({'text': text, 'band': band, 'min': lo, 'max': hi})
            if rebuilt != opts:
                entry[kind] = rebuilt
                changed_options += 1

        if 'profile_tell' in f and d['profile'] in approaches:
            tell = f['profile_tell']
            if approaches[d['profile']].get('tell') != tell:
                approaches[d['profile']]['tell'] = tell
                changed_tells += 1

        if 'bespoke_explanation' in f and did in bespoke:
            text = f['bespoke_explanation'].replace('\\n', '\n')
            if bespoke[did].get('explanation') != text:
                bespoke[did]['explanation'] = text
                changed_bespoke += 1

    assert not missing, f"delegates in the export are not in the game: {missing}"
    del_path.write_text(delegates_text)
    opt_path.write_text(json.dumps(options, indent=2, ensure_ascii=False) + '\n')
    bes_path.write_text(json.dumps(bespoke, indent=2, ensure_ascii=False) + '\n')
    appr_path.write_text(json.dumps(approaches, indent=2, ensure_ascii=False) + '\n')
    print(f'delegates parsed: {len(blocks)}')
    print(f'delegate fields changed: {changed_delegates}')
    print(f'option lists changed: {changed_options}')
    print(f'bespoke explanations changed: {changed_bespoke}')
    print(f'profile tells changed: {changed_tells}')
    print(f'backups written with suffix .bak-{stamp}')

if __name__ == '__main__':
    main()
