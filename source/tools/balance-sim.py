"""
Declaration Game — feasibility analysis for the four difficulty settings.

Models the REAL mechanics from GameStore.ts:
  - start: June 7 1776, Pennsylvania, $100 personal funds, 25 postal riders, per-colony subsidies
  - travel times: directed matrix from src/data/delegates.json
  - mail: no date advance, no player move; costs ride-days x $1 from the TARGET colony's
    subsidies; consumes a rider in the player's colony and delivers it to the target;
    support delta per delegate = randint(-1, +5); one-day rides roll no event
  - meeting: advances the date by ride days (+/-1 event), moves the player to the delegate's
    colony, costs $3/day personal, support delta randint(-5, +20)
  - debate: advances the date by ride days + 2 (+/-1 event), moves the player, costs
    $1 per delegate in the state personal (+/$1 each on bad luck), rolls support for every
    NON-PROTECTED delegate in the state with randint(-5, +20)
  - deadline gate: mail/meeting need ride <= daysRemaining; debate needs ride+2 <= daysRemaining
  - green colony: round(100 * (delegates at support>=100) / total) >= 51
  - victory the moment greenColonies >= required (checked after every action)
  - protected delegates (Committee of Five + Continental Congress President) cannot be
    mailed, met, or moved by debates; they sit at 100

Usage: python3 tools/balance-sim.py [runs]

A Monte-Carlo feasibility model of the four difficulty settings, built from the
real GameStore mechanics (travel matrix, support rolls, event odds, deadline
gates, postal riders/subsidies). Prints the per-colony requirement table, the
optimistic day lower bound per difficulty, and simulated win rates under
ordinary luck, under perfect luck, and with the proposed "mail costs ride days"
balance fix.

Usage: python3 tools/balance-sim.py [runs]
"""
import json, random, sys, collections
from pathlib import Path

SRC = Path(__file__).resolve().parent.parent / "sources" / "src"

# ---------------------------------------------------------------- static data
data = json.loads((SRC / "data/delegates.json").read_text())
delegates = data["delegates"]
travel = data["travelTimes"]

INITIAL_RIDERS = {"Virginia":5,"Pennsylvania":3,"Massachusetts":3,"Maryland":3,"North Carolina":3,
 "Connecticut":2,"New York":2,"South Carolina":1,"New Jersey":1,"New Hampshire":1,"Georgia":1,
 "Rhode Island":0,"Delaware":0}
INITIAL_SUBSIDIES = {"Virginia":20,"Maryland":20,"North Carolina":20,"South Carolina":20,"Georgia":20,
 "Pennsylvania":15,"New York":15,"New Jersey":15,"Delaware":15,"Massachusetts":10,"Connecticut":10,
 "Rhode Island":10,"New Hampshire":10}
DIFFICULTY = {"easy":7, "medium":9, "hard":12, "extreme":13}
START_DATE = (1776, 6, 7)      # June 7
DEADLINE = (1776, 7, 2)       # July 2 (the gate uses this date)

def days_between(a, b):
    from datetime import date
    da = date(*a) if isinstance(a, tuple) else a
    db = date(*b) if isinstance(b, tuple) else b
    return (db - da).days

def protected(d):
    return d.get("committeeOfFive") or d.get("continentalCongressPresident")

# green test: round(supporters/total*100) >= 51
def needed_supporters(total):
    if not total:
        return 0
    k = 1
    while round(k / total * 100) < 51:
        k += 1
    return k

COLONIES = sorted(travel.keys())
NEED = {c: needed_supporters(sum(1 for d in delegates if d["colony"] == c)) for c in COLONIES}

def green_map(support):
    """colony -> (supporters at 100, needed, is_green)"""
    out = {}
    for c in COLONIES:
        ds = [d for d in delegates if d["colony"] == c]
        sup = sum(1 for d in ds if support[d["id"]] >= 100)
        need = NEED[c]
        out[c] = (sup, need, round(sup / len(ds) * 100) >= 51)
    return out

def green_count(support):
    return sum(1 for c, (_, _, g) in green_map(support).items() if g)

# --------------------------------------------------------------- event rolls
def mail_event(ride_days):
    if LUCKY:
        return 0, 0
    if ride_days <= 1:
        return 0, 0                       # (days delta, cost delta)
    r = random.random()
    if r < 0.25:                         # bad luck
        return 1, 1
    if r < 0.5:                          # good luck
        return -1, 0
    return 0, 0

def meeting_event():
    if LUCKY:
        return 0, 0
    r = random.random()
    if r < 0.25:
        return 1, 3
    if r < 0.5:
        return -1, -3
    return 0, 0

def debate_event(base_days, count):
    if LUCKY:
        return 0, 0
    r = random.random()
    if r < 0.25:
        return 1, count                  # bad luck: +1 day, +$1 per delegate
    if r < 0.5:
        return -1, 0                    # good luck: 1 day back
    return 0, 0

# ------------------------------------------------------------------- the game
class Game:
    def __init__(self, difficulty):
        self.diff = difficulty
        self.required = DIFFICULTY[difficulty]
        self.date = START_DATE
        self.colony = "Pennsylvania"
        self.funds = 100.0
        self.support = {d["id"]: d["supportLevel"] for d in delegates}
        self.riders = dict(INITIAL_RIDERS)
        self.subsidies = dict(INITIAL_SUBSIDIES)

    # --- helpers
    def days_left(self):
        return days_between(self.date, DEADLINE)

    def gm(self):
        return green_map(self.support)

    def green(self):
        return green_count(self.support)

    def legal(self):
        dl = self.days_left()
        g = self.gm()
        acts = []
        for d in delegates:
            if protected(d):
                continue
            T = d["colony"]
            ride = travel[self.colony][T]
            if ride <= dl:
                # mail
                if self.riders[self.colony] > 0 and self.subsidies[T] >= ride:
                    if not MAIL_COSTS_DAYS or ride <= dl:
                        acts.append(("mail", d["id"], T))
                # meeting
                if self.funds >= 3 * ride:
                    acts.append(("meet", d["id"], T))
        for T in COLONIES:
            ride = travel[self.colony][T]
            n = sum(1 for d in delegates if d["colony"] == T and not protected(d))
            if n == 0:
                continue
            if ride + 2 <= dl and self.funds >= n:
                acts.append(("debate", None, T))
        return acts

    def slots(self, T):
        """(slots still needed, cheapest delegates to close them, their deficits)"""
        g = self.gm()
        sup, need, is_green = g[T]
        if is_green:
            return 0, [], []
        slots = max(0, need - sup)
        cand = sorted([(100 - self.support[d["id"]]), d["id"]]
                       for d in delegates if d["colony"] == T and not protected(d)
                       and self.support[d["id"]] < 100)
        cand = cand[:slots]
        return slots, [c[1] for c in cand], [c[0] for c in cand]

    def value_of(self, kind, d, T):
        """expected number of green slots closed (no random draws here)"""
        slots, ids, deficits = self.slots(T)
        if slots == 0:
            return 0.0
        if kind == "mail":
            if d["id"] not in ids:
                return 0.0
            # mail can only close the slot if within +5
            return 1.0 if 100 - self.support[d["id"]] <= 5 else 0.0
        if kind == "meet":
            if d["id"] not in ids:
                return 0.0
            return 1.0 if 100 - self.support[d["id"]] <= 20 else 0.0
        # debate: rolls every non-protected delegate in T
        val = 0.0
        for did, deficit in zip(ids, deficits):
            if deficit <= 20:
                val += 1.0
            elif deficit <= 40:
                val += 0.5
            else:
                val += 0.25
        return val

    def apply(self, act):
        kind, did, T = act
        if kind == "mail":
            d = next(x for x in delegates if x["id"] == did)
            ride = travel[self.colony][T]
            self.support[did] = max(1, min(100, self.support[did] + (5 if LUCKY else random.randint(-1, 5))))
            self.riders[self.colony] -= 1
            self.riders[T] += 1
            self.subsidies[T] -= ride
            if MAIL_COSTS_DAYS:
                self.date = add_days(self.date, ride)
            return
        if kind == "meet":
            d = next(x for x in delegates if x["id"] == did)
            ride = travel[self.colony][T]
            dd, dc = meeting_event()
            final_days = max(1, ride + dd)
            self.funds -= max(0, final_days * 3)
            self.support[did] = max(1, min(100, self.support[did] + (20 if LUCKY else random.randint(-5, 20))))
            self.colony = T
            self.date = add_days(self.date, final_days)
            return
        # debate
        ride = travel[self.colony][T]
        ds = [x for x in delegates if x["colony"] == T and not protected(x)]
        dd, dc = debate_event(ride + 2, len(ds))
        final_days = ride + 2 + dd
        self.funds -= max(0, len(ds) + dc)
        for x in ds:
            self.support[x["id"]] = max(1, min(100, self.support[x["id"]] + (20 if LUCKY else random.randint(-5, 20))))
        self.colony = T
        self.date = add_days(self.date, final_days)

def add_days(d, n):
    from datetime import date, timedelta
    base = date(*d) if isinstance(d, tuple) else d
    return base + timedelta(days=n)

# ------------------------------------------------------------------- policy
LUCKY = False
MAIL_COSTS_DAYS = False

def play(difficulty, seed, trace=False, lucky=False):
    global LUCKY
    LUCKY = lucky
    random.seed(seed)
    g = Game(difficulty)
    if g.green() >= g.required:
        return True, g, 0
    steps = 0
    while steps < 400:
        steps += 1
        acts = g.legal()
        if not acts:
            break
        best, best_score = None, -1
        focus = getattr(g, "focus", None)
        if focus:
            g.focus = None
            if g.slots(focus)[0] > 0:
                for a in acts:
                    if a[2] == focus:
                        g.focus = focus
        for a in acts:
            kind = a[0]
            if kind in ("mail", "meet"):
                T = a[2]
                dd = next(x for x in delegates if x["id"] == a[1])
                ride = travel[g.colony][T]
                days = 0 if kind == "mail" else ride
                val = g.value_of(kind, dd, T)
                if kind == "mail":
                    if MAIL_COSTS_DAYS:
                        score = val / max(ride, 1)
                    else:
                        score = val * 1.2 if (T == g.colony or g.riders[g.colony] > 2) else val * 0.3
                else:
                    score = val / max(days, 1)
            else:
                T = a[2]
                ride = travel[g.colony][T]
                days = ride + 2
                val = g.value_of("debate", None, T)
                score = val / max(days, 1)
            score += 0.0001
            if focus and a[2] == focus and g.slots(focus)[0] > 0:
                score += 0.35          # stay on the colony already in progress
            if score > best_score:
                best, best_score = a, score
                g.focus = a[2]
        if best is None:
            break
        if trace:
            print(f"   {g.date} {g.colony:15} {best[0]:6} -> {best[2]:15} days_left={g.days_left()} green={g.green()}")
        g.apply(best)
        if g.green() >= g.required:
            return True, g, steps
    return False, g, steps

# ------------------------------------------------------------------- report
def theoretical():
    print("=== per-colony requirement (51% rule, protected delegates already at 100) ===")
    total_needed = 0
    total_deficit = 0
    for c in COLONIES:
        ds = [d for d in delegates if d["colony"] == c]
        prot = [d for d in ds if protected(d)]
        free = len(prot)
        need = NEED[c]
        extra = max(0, need - free)
        # cheapest delegates to max out (smallest deficit first), non-protected only
        cand = sorted([100 - d["supportLevel"] for d in ds if not protected(d)])
        deficit = sum(cand[:extra])
        total_needed += extra
        total_deficit += deficit
        print(f"  {c:16} delegates={len(ds):2} protected={free} need_at_100={need} "
              f"extra_to_max={extra} cheapest_deficit={deficit:3}")
    print(f"  TOTAL: {total_needed} delegates must reach 100, cheapest total deficit = {total_deficit} support points")
    print(f"  riders available = {sum(INITIAL_RIDERS.values())} (mail moves riders, never creates them)")
    print(f"  days available: {days_between(START_DATE, DEADLINE)} (June 7 -> July 2), last usable day = July 1 (1-day rides only)")
    print(f"  mail support per letter: -1..+5 (mean +2), 0 days, limited by riders + target subsidies")
    print(f"  meeting support: -5..+20 (mean +7.5), one delegate, costs ride days")
    print(f"  debate support: -5..+20 (mean +7.5) for EVERY delegate in the state, costs ride+2 days")
    print()

if __name__ == "__main__":
    runs = int(sys.argv[1]) if len(sys.argv) > 1 else 300
    theoretical()
    print("=== simulated play (greedy strategy, ordinary luck) ===")
    for diff in ("easy", "medium", "hard", "extreme"):
        wins = 0
        greens = []
        for i in range(runs):
            won, g, steps = play(diff, 1000 + i)
            wins += won
            greens.append(g.green())
        print(f"  {diff:8} need {DIFFICULTY[diff]:2} green -> win rate {wins/runs*100:5.1f}% "
              f"| average final green {sum(greens)/len(greens):4.1f}")
    print("=== variant: mail costs the ride days (proposed balance fix) ===")
    globals()['MAIL_COSTS_DAYS'] = True
    for diff in ("easy", "medium", "hard", "extreme"):
        wins = 0; greens = []
        for i in range(runs):
            won, g, steps = play(diff, 3000 + i)
            wins += won; greens.append(g.green())
        print(f"  {diff:8} need {DIFFICULTY[diff]:2} green -> win rate {wins/runs*100:5.1f}% "
              f"| average final green {sum(greens)/len(greens):4.1f}")
    globals()['MAIL_COSTS_DAYS'] = False
    print("=== best case (every roll favourable: mail +5, meeting/debate +20, no bad-luck events) ===")
    for diff in ("easy", "medium", "hard", "extreme"):
        wins = 0
        greens = []
        for i in range(runs):
            won, g, steps = play(diff, 2000 + i, lucky=True)
            wins += won
            greens.append(g.green())
        print(f"  {diff:8} need {DIFFICULTY[diff]:2} green -> win rate {wins/runs*100:5.1f}% "
              f"| average final green {sum(greens)/len(greens):4.1f}")
