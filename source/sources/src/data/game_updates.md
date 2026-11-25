# Declaration Game - All Updates Summary (as of Nov 20, 2026)

## Feature 0 (Latest): Rider Travel Times Between States — Directed Matrix
**Location**: `src/data/delegates.json` → `travelTimes`
**Applied**: 2026-11-20, **revision 2** at 22:02 CST (owner-supplied table, parsed programmatically from the owner's brief)

The rider travel-time table was replaced with a **directed** (asymmetric) matrix. The previous table was symmetric and distance-based; the new one is directional, so a ride from A to B can differ from B to A. Values are **days of travel**.

**Revision 2** replaced the first directed table: **88 of 169 cells changed**, the longest ride dropped from **7 days to 4**, and **49 directed pairs are now single-day** (including every same-state pair). The revision has 20 asymmetric pairs; the first directed table had 50. Backups of both revisions are kept as `src/data/delegates.json.bak-20261120` (original symmetric) and `src/data/delegates.json.bak-20261120j` (revision 1).

Applies to **both** rider-dependent actions, which already share one lookup (`getTravelTime(currentColony, targetColony)`):
- **Mailing correspondence** — `$1` per travel day; one-day rides (49 directed pairs) roll no event.
- **Private meeting** — `$3` per travel day, still subject to the random weather/event modifiers (which can add or subtract a day, floored at 1 day).

Current matrix (row = current state, column = destination), in days:

| From \ To | GA | SC | NC | VA | MD | DE | PA | NJ | NY | CT | RI | MA | NH |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| GA | 1 | 2 | 2 | 3 | 3 | 3 | 3 | 3 | 4 | 4 | 4 | 4 | 4 |
| SC | 1 | 1 | 1 | 2 | 2 | 2 | 3 | 3 | 4 | 4 | 4 | 4 | 4 |
| NC | 2 | 1 | 1 | 1 | 2 | 2 | 2 | 2 | 3 | 3 | 3 | 4 | 4 |
| VA | 3 | 2 | 1 | 1 | 1 | 1 | 1 | 2 | 3 | 2 | 3 | 4 | 4 |
| MD | 3 | 3 | 2 | 1 | 1 | 1 | 1 | 1 | 2 | 2 | 2 | 3 | 3 |
| DE | 3 | 3 | 2 | 1 | 1 | 1 | 1 | 1 | 2 | 2 | 2 | 3 | 3 |
| PA | 4 | 3 | 3 | 1 | 1 | 1 | 1 | 1 | 1 | 1 | 2 | 2 | 3 |
| NJ | 4 | 3 | 3 | 2 | 1 | 1 | 1 | 1 | 1 | 1 | 2 | 2 | 2 |
| NY | 4 | 4 | 3 | 3 | 2 | 2 | 1 | 1 | 1 | 1 | 1 | 1 | 2 |
| CT | 4 | 4 | 3 | 2 | 2 | 2 | 2 | 1 | 1 | 1 | 1 | 1 | 2 |
| RI | 4 | 4 | 3 | 3 | 2 | 2 | 2 | 1 | 1 | 1 | 1 | 1 | 2 |
| MA | 4 | 4 | 3 | 3 | 2 | 2 | 2 | 1 | 1 | 1 | 1 | 1 | 1 |
| NH | 4 | 4 | 3 | 3 | 3 | 3 | 2 | 2 | 1 | 1 | 1 | 1 | 1 |

**Verification**: 13 origins × 13 destinations, no missing pairs, no extra destinations; the file was parsed from the owner's brief rather than retyped by hand, and the `delegates` array was left byte-for-byte unchanged. Backup of the previous file: `src/data/delegates.json.bak-20261120`.

## Feature 0b: Split Event Pools — Mail Correspondence vs. Private Meeting
**Location**: `src/store/GameStore.ts` (module-scope pools), `src/components/DelegatePanel.tsx` (mail event display)
**Applied**: 2026-11-20 (owner-directed split)

Previously the store had **one** shared bad-luck pool (14 entries) and **one** good-luck pool (7 entries) used only by `meetPrivately()`; mail correspondence had no random events at all. There are now four module-level pools:

| Pool | Count | Contents |
|---|---|---|
| `MAIL_BAD_LUCK_EVENTS` | 11 | Postal Rider's horse throws a shoe · Heavy rain slows the Postal Rider's travel · Postal Rider spotted a British Patrol · Postal Rider's horse becomes ill · Food Spoilage (Postal Rider must restock) · Local gives Postal Rider incorrect directions · Postal Rider's saddle breaks · The Postal Rider's river ferry is out of service · thief steals the Postal Rider's supplies · Printing Press Delayed (documents not prepared for Postal Rider) · Postal Rider exhausted from Traveling |
| `MAIL_GOOD_LUCK_EVENTS` | 6 | Patriot offers the Postal Rider a fresh horse · Beautiful weather makes traveling easy for the Postal Rider · local shows the Postal Rider a shortcut · Patriot offers the Postal Rider Free Lodging · ferry captain gives the Postal Rider a free ride · militia escorts the Postal Rider safely |
| `MEETING_BAD_LUCK_EVENTS` | 4 | Misplaced Documents. Return to find them. · Delegate Is Unavailable. Return the next day. · Political debate takes longer than expected · You feel ill. Return the following day. |
| `MEETING_GOOD_LUCK_EVENTS` | 3 | A Patriot offers you Free Lodging. · A merchant donates money to support the Patriot cause. · The local inn provides you and the delegate with free meals. |

**Voice split**: mail events are written from the **postal rider's** perspective (the rider, not the player, is the one traveling); private-meeting events stay **player-facing** ("you"/the delegate), since you are the one making the trip.

**Mail correspondence now rolls events for the first time** (25% bad luck / 25% good luck / 50% uneventful, matching meetings):
- Bad luck: **+1 travel day, +$1** (mail is $1/day); the postal-subsidy check and the subsidy deduction both use the post-event cost.
- Good luck: **-1 travel day (floor of 1 day), -$1**.
- Support change (-1..+5) and rider-transfer logic unchanged. The event text now appears in the "Letter sent" alert.

**Private meeting** keeps its existing behavior exactly: 25/25/50 split, bad luck +1 day/+3, good luck -1 day/-3, cost = days x $3.

**One-day mail rides are exempt from the event roll** (added 2026-11-20). When the mail travel time is 1 day (e.g. sending to a delegate in the colony you are already in), no random event is rolled and no event message is shown. Rationale: travel cannot fall below 1 day, so a good-luck event could only ever report "0 day travel time saved (-$0 in costs)", and a bad-luck event would have been the only meaningful outcome. This affects **mail correspondence only** — private meetings still roll events on every trip.

**Verification**: `npx tsc -b --force` reports zero errors, `npm run build` succeeds (`dist/assets/index-namV5ffE.js`), and both pools are present in the built bundle. Backups: `GameStore.ts.bak-20261120b`, `DelegatePanel.tsx.bak-20261120b`.

## Fix: Mail Correspondence button affordability gate
**Location**: `src/components/DelegatePanel.tsx`
**Applied**: 2026-11-20

The "Send Correspondence" button used a hardcoded gate of `targetColony.postalSubsidies >= 2`, so a colony holding exactly $1 could not send a one-day letter even though the store would accept it (the real check is `postalSubsidies < finalCost`, and `finalCost` is $1 for a one-day ride). The button greyed out with no explanation.

The gate now computes the real maximum cost: `getTravelTime(currentColony, delegate.colony)` days at $1/day, plus one extra day when the trip is longer than one day (a bad-luck event can add that day; one-day mail rides never roll events). The button therefore enables exactly when the store will accept the letter, and never enables a letter the store would then reject.

Unrelated but still true: a colony with **0 postal riders** blocks sending entirely — the button also requires a rider in the player's current colony, and Rhode Island and Delaware start with none.

## Feature 1b: "Restart Game" Button
**Location**: `src/components/GameApp.tsx` (button), `src/store/GameStore.ts` (`resetGame` action)
**Applied**: 2026-11-20 (owner-directed)

A **"Restart Game"** button now sits at the top right of the header, immediately to the right of the title. The header became a flex row (flexible spacer - centered title block - flexible right container), so the title stays visually centered while the button is pushed to the far right edge. Styling matches the game palette (Georgia serif, `#2C1B18` background, white bold text, 6px radius), with a `title`/`aria-label` explaining that it resets all progress.

**Behavior**: clicking asks for confirmation via `window.confirm` ("Restart the game? This resets ALL progress and cannot be undone."). Cancelling does nothing. Confirming calls the new `resetGame()` store action and then reloads the page, so no stale React/UI state survives the restart.

**`resetGame()` restores**: current date to June 7, 1776; current colony to Pennsylvania; personal funds to a fresh copy of the defaults ($100 / $100); every delegate's support level to its starting value (fresh clones, no shared object references); every colony's postal riders, postal subsidies and support level to their starting values (a fresh `createColoniesMap()`); travel events to empty; game mode to historical; and both the selected colony and selected delegate to null. It also clears the persisted save (`declaration1776-save`) after the state write, so no stale save can be rehydrated over the fresh state. The persist `name` and `version` are unchanged.

**Verification**: `npx tsc -b --force` reports zero errors, `npm run build` succeeds, and the label, confirmation text and save key are present in the built bundle. The button itself has not been click-tested in a browser.

## Feature 2: Difficulty Setting and Failure Condition
**Location**: `src/store/GameStore.ts` (difficulty table, state, failure actions), `src/components/GameApp.tsx` (selector + failure modal), `src/types/game.ts` (`Difficulty`, `GameStatus`)

A **"Difficulty Setting"** control sits at the **top left** of the header, next to the title, laid out on **two lines**:
- **Line 1** — the words *Difficulty Setting* followed by a bordered badge showing the tier word for the current setting: **Easy**, **Medium**, **Hard**, or **Extreme!**
- **Line 2** — a `◀` button, the setting's flavour name, and a `▶` button. The arrows wrap around in both directions.

The title stays centered and the Restart Game button stays at the top right.

| Key | Label | Tier badge | Green colonies required by July 2, 1776 |
|---|---|---|---|
| easy | Common Sense | Easy | 7 of 13 |
| medium | Don't Tread on Me | Medium | 9 of 13 |
| hard | The British are Coming! | Hard | 12 of 13 |
| extreme | Join or Die! | Extreme! | 13 of 13 |

Default difficulty is **easy (Common Sense, 7 green colonies)**. A colony counts as green when at least 51% of its delegates have `supportLevel >= 100` — exactly the rule that colors the map green.

**End conditions** (evaluated by `checkEndConditions`, which re-runs after every successful letter, every successful private meeting, every date advance, every random travel event, and every difficulty change):
- **Victory** — as soon as the required number of colonies is green: *"Victory! X of 13 colonies are green as of [date]. The Declaration is signed! Reward: +$N in Committee of Five funds."* The reward is awarded **once**, on the transition into victory, and scales with difficulty: Common Sense **$50**, Don't Tread on Me **$75**, The British are Coming! **$100**, Join or Die! **$150**. It raises both the Committee of Five funds and their cap so the HUD stays consistent.
- **Failure** — once the in-game date reaches **July 2, 1776** (the independence vote) with fewer than the required green colonies: *"Failure: The colonies were not united in time. X of 13 colonies were green by July 2, 1776. [Setting] required Y."* followed by **"You must restart the game to continue."**

**Failure is terminal.** The failure modal offers only **Restart Game** — there is no "Continue Anyway". While the game is over (failed or victorious), `sendCorrespondence` and `meetPrivately` refuse the action with a message and change nothing, so play genuinely cannot continue.

**Notes**: `resetGame` keeps the chosen difficulty (so a player can retry the same setting), resets `gameStatus` to `playing` and clears the victory reward. `difficulty`, `gameStatus` and `victoryReward` are persisted. A save written before these features existed hydrates with the current defaults (difficulty `easy`, reward 0).

## Fix: Delegate panel follows the colony selected on the map
**Location**: `src/components/DelegatePanel.tsx`

The delegate panel kept showing an open delegate's detail view after the player clicked a different colony on the map, so the panel only updated after pressing "← Back to delegates". The panel now watches the selected colony and clears a delegate selection that no longer belongs to it, so clicking a colony immediately shows that colony's delegates.

Re-clicking the colony the open delegate belongs to keeps the delegate detail on screen (the selection is still valid for that colony).

## Fix: Delegate panel starts on Philadelphia and every map click reloads the panel
**Location**: `src/store/GameStore.ts`, `src/components/DelegatePanel.tsx`, `src/types/game.ts`

Two panel behaviour changes:

1. **The panel opens on Philadelphia.** The store's default `selectedColonyId` is now the Pennsylvania colony id (exported as `DEFAULT_COLONY_ID`), and the panel falls back to it when nothing is selected, so the "Please select a colony from the map..." prompt is only a last-resort fallback (its "and begin the game!" wording was removed). A new game shows the 12 Pennsylvania delegates immediately, and older saves with no colony selected also fall back to Philadelphia.
2. **Every colony click reloads the panel** — including clicking the already-selected colony again. The store's `selectColony` now increments a `colonySelectionCount` on every call, and the panel clears any open delegate detail whenever that counter changes. An open delegate detail is therefore always dropped by the next map click, so the panel always reflects the colony you just clicked. `resetGame` restores the Pennsylvania selection and resets the counter.

## Rule: Letters Must Arrive Before July 2, 1776
**Location**: `src/store/GameStore.ts`, `src/components/DelegatePanel.tsx`

Mail correspondence is now blocked when the letter could not arrive before the **July 2, 1776** independence vote. The store gained `getDaysUntilDeadline()` (whole days from the current date to July 2, 1776; 0 or negative once the deadline passes). A letter is refused when the **minimum** Postal Rider ride time (`getTravelTime(currentColony, targetColony)`, ignoring a possible bad-luck extra day) exceeds the days remaining.

Refusal message: *"The letter cannot arrive before July 2, 1776 — the ride takes X day(s) but only Y day(s) remain."* The check runs before anything else happens: no cost is charged, no rider moves, no subsidies are spent, no support changes and no mail event is rolled. The "Send Correspondence" button is greyed out when the letter cannot arrive in time, with a tooltip explaining the ride length and days remaining.

**Private meetings follow the same rule** (added later the same day): a meeting is refused when the minimum ride time exceeds the days remaining, with the message *"The meeting cannot take place before July 2, 1776 — the ride takes X day(s) but only Y day(s) remain."* The check runs before the event roll, the funds check and any state change, so a refused meeting costs nothing and changes nothing. The "Meet in Private" button greys out when the meeting cannot happen in time, with a tooltip explaining the ride length and days remaining; its failure alert now shows the actual refusal reason instead of always claiming insufficient funds.

## Feature: "Organize a Public Debate"
**Location**: `src/store/GameStore.ts` (`organizePublicDebate`, `debateResult`), `src/components/DelegatePanel.tsx` (button), `src/components/GameApp.tsx` (results popup), `src/types/game.ts` (`DebateResult`)

A new **"Organize a Public Debate"** button appears in the delegate panel's colony list, below the state name and above the delegate cards. It acts on the state currently displayed in the panel. The button is styled to match the mail and meet buttons (same padding, radius, bold left-aligned label, 🗣️ emoji and an in-button rules line) while keeping its own blue colour, and the "Click a delegate from ..." hint sits below it.

**Cost and time**: ride time from the player's current colony to that state **plus 2 additional days** for the debate (a same-state debate is 3 days minimum), and a base cost of **$1 per delegate** in that state, paid from the Committee of Five Funds.

**Support**: every delegate in that state rolls individually with the same odds as a private meeting (`-5` to `+20`), clamped to 1–100.

**Events** (one roll for the whole debate: 25% good luck, 25% bad luck, 50% none):
- Good luck — *Local Tavern provides Free Food for the Delegates* (the $1-per-delegate cost is fully refunded, net cost $0) or *Event preparation goes faster than expected* (1 day added back).
- Bad luck — *A longer than expected political debate breaks out* or *Bad weather delays the debate* (either one costs 1 extra day **and** $1 per delegate).

**Results popup**: after the debate a full-screen modal shows the event (or "The debate proceeded without incident."), the days elapsed and the cost, then one row per delegate with their name and the applied support change — increases in green, decreases in red, with the resulting support level. A Close button dismisses it.

**Rules carried over**: the debate refuses if the game is over, if the state has no delegates, if the July 2 deadline makes it impossible ("The debate cannot be completed before July 2, 1776 — it takes X day(s) but only Y day(s) remain."), or if the Committee of Five funds cannot cover the final cost. Refusals change nothing. The debate also moves the player to that state, like a private meeting does, and advances the date by the final number of days.

## Change: Mail and Private-Meeting Popups Match the Public-Debate Popup
**Location**: `src/store/GameStore.ts`, `src/components/DelegatePanel.tsx`, `src/components/GameApp.tsx`, `src/types/game.ts`

The mail and private-meeting results no longer use browser `alert()` dialogs. They now open the same in-game modal as the public-debate popup: fixed full-viewport backdrop, cream panel, centered title, `pre-line` multi-line body, and a **Close** button.

- **Mail success** — title "Letter sent to {name}", body unchanged ("✓ Letter sent to…", any event lines, support change with sign and emoji, Final Cost, Estimated delivery time).
- **Mail failure** — title "Letter not sent" in dark red, body = the store's refusal message.
- **Meeting success** — title "Met with {name}", body unchanged ("✓ Met with…", event lines or "Travel completed", support line, Final Cost, Final Travel Time).
- **Meeting failure** — title "Meeting not possible" in dark red, body = the store's refusal message.

The popup state (`actionPopup`) is transient — never persisted — and is cleared by `resetGame`. The public-debate, victory and failure modals are unchanged.

## Change: The Restart Game Confirmation Uses the In-Game Modal
**Location**: `src/components/GameApp.tsx`

The header's **Restart Game** button no longer opens a bare browser `window.confirm` dialog. It now opens the same in-game modal used by the debate and action popups: dimmed full-viewport backdrop, cream panel with the brown border, a centered "Restart Game?" title, the warning "Restarting resets ALL progress and cannot be undone.", and two buttons — **Restart Game** (brown, resets and reloads) and **Cancel** (outlined, closes the dialog and leaves the game untouched).

The restart buttons inside the victory and failure modals still restart immediately, since those endings are terminal.

## Rules: The Committee of Five Cannot Be Contacted
**Location**: `src/store/GameStore.ts`, `src/components/DelegatePanel.tsx`, `src/components/GameApp.tsx`, `src/types/game.ts`

The six Committee of Five members (John Hancock, John Adams, Roger Sherman, Benjamin Franklin, Thomas Jefferson, Robert R. Livingston) are now untouchable by the player:

- **Mail correspondence is refused** — "Committee of Five members cannot be contacted by correspondence." The check runs right after the delegate lookup, before the rider check, the deadline gate, the event roll and any cost, rider transfer, subsidy spend or support change.
- **Private meetings are refused** — "Committee of Five members cannot be met in private." Again before the deadline gate, event roll, funds check and any state change.
- **Public debates exclude them from support rolls.** They are never included in the per-delegate support change and always stay at exactly 100%. The debate popup lists only the other delegates and adds "Committee of Five and Continental Congress President members maintain their full support: {names}." when any were in that state. The debate's base cost is unchanged — still $1 per delegate in the state.
- **The buttons are disabled** in the delegate panel with matching explanations.
- **John Hancock is the "Continental Congress President"**, not a Committee of Five member, but is protected by exactly the same rules: no mail, no private meeting, excluded from debate support rolls, always 100%. His badge reads "★ Continental Congress President"; the other five keep "★ Committee of Five". The store now uses one shared `isProtectedDelegate` predicate for every protected-delegate check, and the refusal messages are role-aware ("The Continental Congress President cannot be contacted by correspondence." / "…cannot be met in private.").
- **Old saves are migrated**: the persisted save version was bumped to 4 with a migration that forces every Committee of Five member to 100% support, so a game saved before these rules cannot carry a lower value forward. The save name is unchanged.

## Fix: Delegate Panel Matches the Map Height and Scrolls Internally
**Location**: `src/components/ColonyMap.tsx`, `src/components/GameApp.tsx`, `src/components/DelegatePanel.tsx`

In states with many delegates (Pennsylvania has twelve) the delegate panel grew taller than the colony map and stretched the whole row. The panel is now exactly as tall as the map panel:

- `ColonyMap.tsx` exports `COLONY_MAP_HEIGHT = 1000` as the single source of truth for that height, and the map uses it.
- `GameApp.tsx` gives the delegate-panel column a definite height equal to the map height with `overflow: hidden`, so the panel can no longer determine the row's height.
- `DelegatePanel.tsx` makes both views flex columns. In the list view the header block (state name, debate button, ride-time line, hint) stays pinned and only the delegate cards scroll. In the detail view the "← Back to delegates" button stays pinned and the content below it scrolls, so long delegate overviews no longer stretch the panel.

## Fix: The Progress Bar Ends at the July 2 Deadline
**Location**: `src/components/Timeline.tsx`

The timeline bar ran to **July 4, 1776** and its badge had a hardcoded total of **28 days**, so it disagreed with the game's actual rules — everything is due **July 2** (the same July 2 the failure check uses). The bar now ends at the store's `FAILURE_DEADLINE_LABEL` (July 2, 1776), and the badge reads `Day {currentDay}/26`, counting inclusively: June 7 is day 1 and July 2 is day 26, with the bar reaching 100% on the deadline. The end date is now read from the same constant the rules use, so the bar and the failure check can never drift apart again.

## Balance: More Starting Riders and Subsidies
**Location**: `src/store/GameStore.ts` (`initialRiders`, `initialSubsidies`)

Every colony now starts with **$5 more postal subsidies**, and **one more postal rider**, except Rhode Island and Delaware which stay at **zero riders**.

| Colony | Riders (was → now) | Subsidies (was → now) |
|---|---|---|
| Virginia | 5 → 6 | $20 → $25 |
| Maryland | 5 → 4 riders… see note | $20 → $25 |
| North Carolina | 3 → 4 | $20 → $25 |
| South Carolina | 1 → 2 | $20 → $25 |
| Georgia | 1 → 2 | $20 → $25 |
| Pennsylvania | 3 → 4 | $15 → $20 |
| New York | 2 → 3 | $15 → $20 |
| New Jersey | 1 → 2 | $15 → $20 |
| Delaware | 0 → 0 | $15 → $20 |
| Massachusetts | 3 → 4 | $10 → $15 |
| Connecticut | 2 → 3 | $10 → $15 |
| Rhode Island | 0 → 0 | $10 → $15 |
| New Hampshire | 1 → 2 | $10 → $15 |

(Delaware and Rhode Island keep zero riders by request; every other colony gains exactly one rider.)

## Feature 3: Victory Plaque, Hall of Fame and Name Entry
**Location**: `src/store/GameStore.ts`, `src/components/GameApp.tsx`, `src/types/game.ts`, `src/data/wordFilter.ts` (new)

**The cash reward is gone.** Victory no longer adds money to the Committee of Five funds; the old `VICTORY_REWARDS` table ($50/$75/$100/$150) was deleted and `victoryReward` was removed from the state and the save (persist version is now 6, and the migration drops any stale `victoryReward`).

**Victory plaque.** On winning, the store snapshots the run and the victory modal shows a double-bordered parchment plaque titled "Declaration of Independence":
- Setting (the difficulty label) · Date (in-game date) · Colonies (X of 13 green) · Difficulty (label and tier) · Remaining Postal Subsidies ($) · Committee of Five Funds ($)

**Hall of Fame.** Wins are recorded in the player's own browser under the local-storage key `declaration1776-ledger` — deliberately separate from the game save, so restarting a game or clearing the save never erases the ledger. The ledger keeps the newest 100 entries. Each entry stores the name, date, difficulty, green colony count, remaining subsidies and funds.

**Name entry.** The victory modal asks "Your name for the Hall of Fame" and offers "Record this victory". Names are trimmed and must be 2-24 characters. A starter profanity filter (`src/data/wordFilter.ts`, 18 words the owner can extend) rejects names: it lowercases the input, maps common look-alikes (`!`/`1`→i, `0`→o, `3`→e, `4`/`@`→a, `5`/`$`→s), splits on non-letters, strips trailing s/es/ing/ed/er/ers, and also checks the joined letters so compounds like "fuckyou" and "shithead" are caught. Ambiguous words (fag, dick, cock, twat) only match as whole words, so "Dickinson" and "Hancock" pass.

A **"Wins"** button in the header opens the Hall of Fame at any time, with the empty state "No victories recorded yet."

## Content: Colony Briefs for All Thirteen Colonies
**Location**: `src/data/colonyOverviews.json` (new), `src/components/DelegatePanel.tsx`

Every colony now has an owner-written brief covering its economy, its concerns, and what it wants from the other colonies (for example: New Hampshire wants military assurances and a share of the financial burden; Massachusetts wants a firm commitment to colonial unity; Pennsylvania wants evidence that peaceful alternatives are exhausted).

- In the delegate panel's colony list, the brief appears as an **"About {State}"** block that starts **expanded** for every colony the player visits, with an **Expand** / **Collapse** button that shows or hides it (the control is a proper toggle with `aria-expanded`, rather than a native details/summary, so the wording can reflect the next action).

The text was parsed programmatically from the owner's brief (which listed each colony twice) and deduplicated, so no paragraph was retyped by hand. All thirteen colony names match the game's colony list exactly.

## Feature 4: Delegate Portraits
**Location**: `sources/public/delegate-images/`, `sources/src/data/delegateImages.json`, `src/components/DelegatePanel.tsx`, `tools/fetch_delegate_images.py` (new)

**61 of the 64 delegates now have a portrait**, pulled from Wikipedia and Wikimedia Commons and shown in the delegate detail view — below the delegate's name and above the Support for Independence meter — in a gold-edged frame that matches the plaque styling.

The three delegates with no portrait available anywhere on Wikipedia/Wikimedia (**John Penn** of North Carolina, **Charles Humphreys** of Pennsylvania, **John Rogers** of Maryland) show a styled placeholder with their initials instead.

**How the images are chosen and checked.** `tools/fetch_delegate_images.py` fetches each delegate's article summary, then validates that the image is a portrait of *that* person: the artwork file name must carry the delegate's surname, and obvious non-portraits (maps, flags, seals, buildings, statues) are rejected. Where the article's lead image fails that check, the script falls back to a Commons file search. Every accepted image was additionally audited by hand against the delegate list, which caught and replaced five wrong matches — a fictional character, a modern sculptor, a 20th-century scholar, a 1921 portrait, and a different George Clinton.

**Attribution**: `CREDITS.md` lists every delegate, source file, article link and licence. The images are mostly public-domain 18th-century paintings and engravings, with some Creative Commons works.

## Rule: No Further Contact With Fully Supportive Delegates
**Location**: `src/store/GameStore.ts`, `src/components/DelegatePanel.tsx`

A delegate who has reached **100% support** no longer needs to be contacted. Both the **Mail Correspondence** and **Meet in Private** buttons are greyed out for them, with the explanation "*Name* already fully supports independence — no further contact is needed."

The store refuses the action as well, so the rule holds even if the interface is bypassed: `sendCorrespondence` and `meetPrivately` return "*Name* already fully supports independence — no further contact is needed." and change nothing (no cost, no rider movement, no date advance, no support roll). This also stops a fully supportive delegate from being dragged *down* by a negative support roll.

**Public debates are deliberately exempt.** A debate still rolls every non-protected delegate in the state, including those already at 100%, so a negative roll can pull a delegate back down and drop a colony out of green. The owner's intent (2026-11-24) is that a debate can still "mess up public opinion", so this asymmetry between letters/meetings and debates is intended, not an oversight.

## Rule: One Public Debate Per Colony
**Location**: `src/store/GameStore.ts`, `src/components/DelegatePanel.tsx`, `src/types/game.ts`

Each colony may host **one public debate per game**. After a colony has hosted its debate, the "Organize a Public Debate" button greys out when you view that colony, with the explanation "*State* has already hosted a public debate." The store enforces the same rule ("*State* has already hosted a public debate.") before any cost, date or support change, so it holds even if the interface is bypassed.

The list of colonies that have hosted their debate lives in the saved game (persisted with the rest of the state) and is cleared by a restart.

## Feature 1: Auto-Return to Delegate List
**Location**: `GameStore.ts` - `sendCorrespondence()` and `meetPrivately()` functions
- After any action completes successfully, `selectedDelegateId` is automatically cleared
- Returns player to main delegates list view immediately

## Feature 2: Random Historical Events System
**Location**: `GameStore.ts` - Event pool definitions

### Negative Events (Adversarial):
1. **British Troops Intercept Courier** - +$10-20 cost, +1-2 days delay
2. **Bad Weather Delay** - +2-4 days travel time
3. **Hostile Encounter** - +$15 cost, +1 day delay
4. **Royal Navy Patrol Interception** - +$8 cost, +1-2 days
5. **Road Blockage by Loyalists** - +2-3 days delay
6. **Stormy Seas (Maritime)** - +3-5 days for sea routes
7. **Supply Train Theft** - +$25 cost only
8. **Spy Warning/Warning Passed** - +2 days additional security delay
9. **Deserter Interrogation Hold-up** - +$12 cost, +1 day
10. **Ship Breakdown/Repairs Needed** - +$30 repair cost
11. **Ambush by Tories** - +$18 cost, +2 days delay
12. **Blizzard/Snow Storm** - +4-6 days travel delay

### Positive Events (Benefits):
1. **Perfect Travel Weather** - No delays, sometimes $5 savings on costs
2. **British Ship Defeated by Privateers** - Mail arrives faster (+1 day saved), no interception cost
3. **Friendly Farm Offers Shelter** - Free overnight lodging saves $5
4. **Colonial Militia Escort Provided** - No interception risk, +$3 safety bonus
5. **Favorable River Currents** - Maritime routes 1 day faster
6. **Loyalist Spouse Warns of Danger** - Avoid ambush, -$8 cost saved
7. **Postmaster Fast Track Delivery** - -1 day on correspondence costs
8. **Harbor Pilot Guides Safe Passage** - No storm risks, maritime routes guaranteed safe
9. **Colonial Signal Network Activated** - Early warning system, -1 day preparation time
10. **Weather Vane Predicts Clear Days** - Plan ahead, avoid future storms (-1 random event chance)

## Feature 3: Delegate Support Progression System
**Location**: `GameStore.ts` - Both action functions

### Mail Correspondence Benefits:
- Increases delegate support by **+3% to +8%** based on travel distance
- Distance multiplier: Longer travel = greater impact (harder to reach delegates)
- Cap at maximum 100% support level

### Private Meeting Benefits:
- Increases delegate support by **+8% to +15%** based on travel distance
- Significantly higher impact than correspondence
- Represents relationship-building opportunity
- Cap at maximum 100% support level

## Feature 4: Win/Loss Conditions
**Location**: `GameStore.ts` - End game checking logic

### SUCCESS CONDITIONS (Win):
1. **Declare Independence Victory**: Successfully coordinate with enough colonies to officially declare independence by **August 2, 1776**
   - Requires raising average colonial support to 75%+ across all colonies
   - OR specifically secure agreement from key swing colonies (New York, Pennsylvania, Delaware)

2. **Early Unity Victory**: Achieve 70%+ average colonial support before **September 1, 1776**
   - Rewards quick political organizing
   - Bonus funds if completed early

### FAILURE CONDITIONS (Loss):
1. **Financial Ruin**: Run out of funds ($0 remaining)
   - Cannot conduct any more correspondence or meetings
   - Game ends immediately when funds hit zero

2. **Time Expires**: Date reaches **October 1, 1776**
   - British forces fully mobilized
   - Lost opportunity for unified declaration
   - Game ends with failure message

## Feature 5: Colony Color Distribution Adjustment
**Location**: `delegates.json` - Support level adjustments
- Lowered multiple delegate support levels for better gameplay balance
- Created more varied colony colors:
  - **Green (Strong ≥80%)**: Still present but less dominant
  - **Yellow/Gold (Moderate 65-79%)**: More visible representation
  - **Orange (Weak 50-64%)**: Now clearly visible
  - **Red (Very Weak <50%)**: Several colonies now appear red
- Specific adjustments:
  - Josiah Bartlett: 95% → 82%
  - John Hancock: 100% → 94%
  - Samuel Adams: 100% → 92%
  - John Adams: 100% → 93%
  - William Floyd: 75% → 68%
  - Philip Livingston: 70% → 63%
  - Richard Stockton: 65% → 58%
  - George Read: 30% → 28%
  - Robert Morris: 40% → 35%

---

## Ongoing Development Notes:

### Known Issues/Future Improvements:
- [ ] Add visual notification popup when random events occur
- [ ] Create win/loss modal with retry option
- [ ] Add progress bar for colonial average calculation
- [ ] Implement delegate personality effects on negotiation difficulty
- [ ] Add historical accuracy mode toggle
- [ ] Save/load game functionality complete verification
- [ ] Mobile responsiveness improvements

### Technical Architecture:
- Zustand store with persistence enabled
- Hot Module Reload (HMR) working
- TypeScript compilation successful
- Vite build pipeline functional

---

*Document created: October 19, 2026*
*Developer: Jefferson (OpenClaw AI Assistant)*
*Project: Declaration Game - The Road to Independence*
