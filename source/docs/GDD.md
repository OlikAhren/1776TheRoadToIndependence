# 1776: The Road To Independence - Game Design Document

## Executive Summary

**1776: The Road To Independence** is a browser-based, mobile-friendly, turn-based political strategy game where players manage the process of adopting the Declaration of Independence. Drawing inspiration from classic tycoon games like Drug Wars (mechanics-driven economic/operational gameplay) and Oregon Trail (historical narrative with meaningful choices), players navigate Congress, negotiate delegates, draft the document, and rally colonial support—all within a historically grounded framework.

The game features polished modern graphics reminiscent of Risk-style board game maps for colonies, an intuitive interface that works equally well on desktop and mobile, and multiple modes including historically accurate simulation, sandbox freedom mode ("The Altered States"), and educational classroom mode.

---

## Core Gameplay Loop

### Primary Loop Structure

```
Turn Start → Gather Intelligence → Make Decisions → Negotiate Delegates
→ Draft/Revise Document → Vote in Congress → Resolve Events → Turn End
```

Each turn represents approximately 2-4 weeks of real time in-game (roughly July-August 1776 timeframe). The full campaign spans roughly 3 turns for a quick playthrough or up to 8 turns for maximum deliberation.

### Key Decision Points Per Turn

1. **Political Position Assessment**: Review delegate support levels across colonies
2. **Resource Allocation**: Distribute limited resources (time, influence, information)
3. **Delegate Engagement**: Choose which delegates to persuade, when to apply pressure
4. **Document Development**: Decide whether to draft, revise, or postpone the Declaration
5. **Risk Management**: Handle random/historical events that shift the political landscape

### Player Agency Philosophy

The player controls **the Committee of Five** as an anonymous collective body—not any single historical figure, but the unified group tasked with shepherding the Declaration through Congress. This includes John Adams, Benjamin Franklin, Roger Sherman, Robert Livingston, and Thomas Jefferson working together.

Early game focuses on gathering intelligence and building support; middle game centers on drafting and negotiating; end game focuses on securing the vote and finalizing dissemination.

This framing emphasizes collective action over individual heroism—you're orchestrating from behind the scenes, coordinating efforts across multiple colonies and delegates while remaining somewhat invisible in the political process.

---

## Victory and Failure Conditions

### Victory Conditions (Historical Mode)

To win the game, achieve **ALL** of the following by turn 8:

| Objective | Threshold | Description |
|-----------|-----------|-------------|
| **Congressional Approval** | ≥9 affirmative votes | Get at least 9 of 12 colonies voting "yes" in final Congressional vote |
| **Unanimous Support** | All 13 colonies sign | Every colony must commit publicly by turn 10 (if reached) |
| **Document Finalized** | Declaration complete | Reach 100% completeness and acceptability in drafting |
| **Distribution** | Initial copies dispatched | Successfully send printed copies to key cities and commanders |

### Scenario-Based Victory

Different objectives unlock different endings based on player approach:

- **Diplomatic Victory**: Achieve unanimous vote with minimal coercion (highest prestige)
- **Political Victory**: Pass declaration even if some colonies abstain (standard victory)
- **Speed Run Victory**: Complete by turn 6 with ≥9 votes (speed bonus)
- **Educational Mode Victory**: Complete with all historical annotations unlocked

### Failure Conditions

Game ends immediately on any failure trigger:

| Trigger | Condition | Outcome |
|---------|-----------|---------|
| **Loyalist Coup** | Loyalist sentiment exceeds 70% | Government collapses, British forces advance |
| **British Invasion** | NY falls without declaration | Revolutionary cause loses momentum, game over |
| **Delegation Collapse** | Major supporters defect (>4 delegates switch) | Committee fragments, process stalls permanently |
| **Time Exhaustion** | Turn count reaches maximum without approval | Historical window closes, declaration fails to pass |
| **Public Backlash** | Colonial unrest reaches critical level | Civil conflict begins, focus shifts to survival |

### Soft Failures

These conditions don't end the game but affect scoring and future replayability:

- Delaying past historical timeline (post-August 20)
- Excessive coercion (lowers reputation with moderate delegates)
- Leaving colonial grievances unresolved (affects post-game summary)

---

## Turn Structure

### Standard Turn Flow (5 Phases)

```
┌─────────────────────────────────────────────────────────┐
│ PHASE 1: INTELLIGENCE GATHERING (Free Action) │
│ - Check delegate positions │
│ - Review colonial sentiments │
│ - Read recent correspondence (optional) │
└─────────────────────────────────────────────────────────┘
 ↓
┌─────────────────────────────────────────────────────────┐
│ PHASE 2: RESOURCE ALLOCATION (Costs Resources) │
│ - Assign delegates to persuasion missions │
│ - Purchase information │
│ - Allocate printing presses │
└─────────────────────────────────────────────────────────┘
 ↓
┌─────────────────────────────────────────────────────────┐
│ PHASE 3: NEGOTIATION WINDOW (Player Actions) │
│ - Meet individual delegates │
│ - Arrange colony meetings │
│ - Present arguments/evidence │
│ - Make promises/commitments │
└─────────────────────────────────────────────────────────┘
 ↓
┌─────────────────────────────────────────────────────────┐
│ PHASE 4: DRAFTING & CONGRESSIONAL VOTE (Key Events) │
│ - Revise Declaration text (if incomplete) │
│ - Hold formal vote │
│ - Resolve major events │
└─────────────────────────────────────────────────────────┘
 ↓
┌─────────────────────────────────────────────────────────┐
│ PHASE 5: EVENTS & RESOLUTION (Automated) │
│ - Process random events │
│ - Update delegate positions │
│ - Generate news/gossip │
│ - Advance calendar │
└─────────────────────────────────────────────────────────┘
```

### Turn Timing System

**Real-Time Progression:**
- Each turn = 2-4 weeks in-game time
- Suggested pace: Play through 1-2 turns per day, or speed-run with 30 seconds per turn for experienced players
- Total playtime: 30 minutes to 2 hours depending on approach

**Calendar Integration:**
```
Phase Dates | In-Game Time | Turns Remaining | Real Urgency
─────────────────────+──────────────+-----------------+-------------
June 7, 1776 | Turn 1 | Infinite | None
July 4, 1776 | Turn 3 | ~5 | High
July 8, 1776 | Turn 4 | ~4 | Critical
August 1, 1776 | Turn 6 | ~2 | Extreme
Post-August 20 | Turn 8 | 0 | Mission Overdue
```

### Phase Details

#### Phase 1: Intelligence Gathering
**Free action—no resource cost**

Actions available:
- View current delegate support matrix
- Check colonial sentiment gauge for each colony
- Read cached correspondence letters
- See active events/conditions affecting negotiations

UI presents this as interactive dashboard with clickable colony cards showing sentiment meters.

#### Phase 2: Resource Allocation
**Costs action points and influence tokens**

Actions available:
- Send delegate to recruit another delegate (costs 2 AP)
- Buy intelligence about specific delegate's position (costs 3 influence)
- Print additional propaganda posters (costs supplies)
- Organize public meeting in key city (costs 1 AP + 5 influence)

Resources are finite per turn, forcing prioritization decisions.

#### Phase 3: Negotiation Window
**Player has 3-5 negotiation actions per turn**

Available actions:
- Meet one-on-one with delegate (can change position slightly)
- Call emergency colonial assembly (can shift regional sentiment)
- Leak favorable article to newspaper (costs 5 influence, affects public opinion)
- Promise future political position to sway delegate (risky commitment)

Each action type has diminishing returns—repeated use of same tactic becomes less effective.

#### Phase 4: Drafting & Congressional Vote
**Central event—cannot skip unless strategically postponing**

Drafting phase:
- Modify specific paragraphs of Declaration if needed
- Adjust tone/strength of language (radical vs diplomatic)
- Address specific colonial concerns
- Cost: 1-3 AP depending on scope of changes

Voting phase:
- Conduct roll call vote by colony representation
- Results displayed with visual feedback
- If ≥9 colonies vote yes: success state achieved
- If 6-8 colonies vote yes: partial success, must continue
- If <6 colonies vote yes: failure condition triggered

#### Phase 5: Events & Resolution
**Automated processing with optional player intervention**

System automatically processes:
- Random historical events (e.g., British army movements)
- Delegate mood shifts based on player actions
- News propagation mechanics
- Calendar advancement

Player may intervene by:
- Making urgent last-second appeals (final chance to sway undecided)
- Activating emergency protocols (special actions costing premium resources)
- Triggering special events early (if conditions met)

---

## Player Actions

### Action Categories

All player actions fall into five mechanical categories, each with unique costs and effects:

#### 1. Information Operations (Free or Low Cost)
- **Review Correspondence**: Read letters between delegates, colonial assemblies
- **Check Polls**: Survey current delegate positions
- **Monitor Media**: Read newspapers, pamphlets to understand public sentiment
- **Intelligence Brief**: Pay 2 influence to learn specific delegate's vulnerabilities

**Strategic Use**: These help identify optimal negotiation targets before committing resources.

#### 2. Diplomatic Actions (Moderate Cost)
- **Private Meeting**: Meet delegate individually (cost: 1 AP, affects relationship score)
- **Colonial Assembly**: Host regional meeting (cost: 2 AP, affects 2-3 colonies simultaneously)
- **Committee Work**: Revise Declaration language (cost: 1-3 AP based on complexity)
- **Public Speech**: Deliver address to influential crowd (cost: 2 AP, affects public sentiment)

**Strategic Use**: Direct manipulation of support levels and relationships.

#### 3. Persuasion Actions (Variable Cost, Risk-Reward)
- **Appeal to Principles**: Use ideological argument (cost: 1 AP, works best with principle-minded delegates)
- **Offer Political Future**: Promise cabinet position/office (cost: 5 influence, lasting effect but risky)
- **Apply Social Pressure**: Leverage family/community connections (cost: 3 AP, affects reputation)
- **Threaten Exposure**: Hint at revealing embarrassing information (cost: variable, high risk/reward)

**Strategic Use**: High-leverage actions for stubborn opposition, but potential backfire.

#### 4. Resource Actions (Material Costs)
- **Print Propaganda**: Create flyers, broadsides (cost: supplies, affects local colonies)
- **Fund Campaign**: Distribute money to poor delegates' families (cost: 3 influence, strong effect)
- **Organize Militia**: Mobilize local defense (cost: 4 AP, triggers loyalty events)
- **Establish Press Network**: Set up printing operation in new city (cost: 10 influence, long-term benefit)

**Strategic Use**: Infrastructure investment for sustained operations.

#### 5. Emergency Actions (Premium Cost, Limited Use)
- **Call Emergency Session**: Force immediate vote (cost: 10 AP, cooldown 2 turns)
- **Leak Secret Letter**: Reveal private correspondence (cost: 5 influence, causes scandal)
- **Declare Martial Law**: Suspend normal proceedings (cost: 8 AP, drastic consequences)
- **Seek Foreign Intervention**: Contact French/British representatives (cost: 15 influence, huge ripple effects)

**Strategic Use**: Last-ditch efforts when behind schedule or facing imminent failure.

### Action Economy Framework

**Per-Turn Action Budget:**
- Base: 3 Action Points (AP)
- Bonus AP earned by: completing side objectives, maintaining delegate relationships
- Maximum AP carryover: 2 (prevents massive hoarding)

**Influence Point Budget:**
- Base: 5 Influence Points (IP) per turn
- Earned via: successful diplomacy, intel gathering, historical events
- Maximum IP storage: 20 (hard cap prevents unlimited spending)

**Supply Constraint:**
- Printing materials, paper, ink
- Consumed only during specific actions
- Must be purchased/pre-positioned earlier in game
- Shortage triggers quality penalties on drafted documents

### Action Cooldowns & Limits

- **Same-action repetition**: Using "private meeting" repeatedly reduces effectiveness (10% penalty per use)
- **Commitment tracking**: Promises made to delegates cannot exceed moral limits
- **Scandal mechanic**: Aggressive tactics increase scandal meter; beyond threshold triggers backlash events

---

## Delegate Mechanics

### Delegate Structure

The Continental Congress consists of delegates from 13 colonies, each with distinct personalities, motivations, and voting tendencies. Delegates are represented as interactive cards with detailed profiles.

#### Delegate Profile Fields

```
Delegate Card Data Structure:
{
 name: "Richard Henry Lee",
 colony: "Virginia",
 position: { value: 0.65, range: [0.3, 0.9] }, // Current support, min/max bounds
 traits: ["principle-driven", "influential", "volatile"],
 motivations: ["state sovereignty", "religious freedom", "family legacy"],
 relationships: {
 "John Adams": 0.8,
 "Benjamin Franklin": 0.3,
 "Thomas Jefferson": 0.7
 },
 vulnerabilities: ["family financial stability", "personal honor"],
 public_stance: "Pro-Independence",
 private_stance: "Hesitant",
 notes: "Concerned about Virginia's militia readiness"
}
```

### Delegate Types (Archetypes)

| Archetype | Description | Best Approach | Weakness |
|-----------|-------------|---------------|----------|
| **Principle-Driven** | Motivated by abstract ideals | Appeal to liberty, justice, natural rights | Stubborn on compromises |
| **Pragmatic** | Pragmatic calculator of consequences | Show practical benefits, minimize risks | Can flip under pressure |
| **Constituency-First** | Represents colony interests above all | Align with home colony demands | Rigid on core demands |
| **Social Influencer** | Careful about public perception | Public endorsements, peer pressure | Sensitive to scandals |
| **Personal Interest** | Driven by personal gain/opportunity | Political promises, favors | Unpredictable loyalty |

### Relationship System

**Trust Scale (0-100):**
- Each delegate track separate trust score with player
- Affects difficulty of persuasion attempts
- High trust unlocks additional dialogue options

**Relationship Dynamics:**
- Actions can increase/decrease trust by 5-25 points
- Trust decays slowly over time if neglected (2-5 points/turn)
- Special bonds form when fulfilling delegate-specific requests

**Visual Representation:**
```
Relationship Gauge:
🟢🟢🟢🟡🔴 Trust Level: 62
[Strong bond | Neutral | Tense relationship]
```

### Delegate Interaction Mechanics

#### Meeting Types

1. **Private Conference** (Cost: 1 AP)
 - One-on-one conversation
 - Can shift position by ±0.1-0.15
 - Chance to discover delegate's true motivations
 - Trust modified by ±5-15 based on interaction style

2. **Group Dining Event** (Cost: 2 AP, 5 IP)
 - Invite 3-5 delegates to informal gathering
 - Can affect multiple delegates simultaneously
 - Social pressure mechanics come into play
 - High probability of genuine position reveal

3. **Public Debate** (Cost: 2 AP, requires venue)
 - Stage-managed public forum
 - Affects public perception more than private positions
 - Delegate performances visible to media
 - Can boost/support delegates or embarrass opponents

4. **Correspondence Campaign** (Cost: 1 AP, ongoing)
 - Multiple rounds of letter writing
 - Slow but steady progress
 - Allows reflection time between messages
 - Lower resistance from cautious delegates

#### Position Shift Model

Delegate positions follow logistic curve mechanics:
- Early persuasion: Easy gains (±0.05-0.10 per interaction)
- Mid-range: Diminishing returns (±0.02-0.05)
- Late-stage: Hard to move extremes (±0.01-0.02)

Formula approximation:
```
position_change = base_effectiveness × delegate_resistance_factor × trust_bonus
```

Resistance varies by archetype:
- Principle-driven: High resistance to pragmatic arguments
- Pragmatic: Moderate resistance overall
- Constituency-first: Resistant unless constituency shifts
- Personal interest: Highly malleable but unpredictable
- Social influencer: Resistant to private pressure, responsive to public opinion

### Delegate Defection Mechanic

If delegate support drops below 0.3 AND scandal level is high:
- 20% chance delegate switches to Loyalist faction
- Triggers chain reaction among related delegates
- Causes temporary loss of that colony's voting power\n
Prevention strategies:
- Maintain minimum 40 trust with all delegates
- Avoid excessive scandal accumulation
- Provide constituency-aligned benefits proactively

---

## Colonial Mechanics

### Colony Structure

Each of the 13 colonies functions as both a political entity and geographic region with unique characteristics. Colonies control delegate allocation and provide regional support bonuses.

#### Colony Attributes

```
Colony Data Structure:
{
 name: "Massachusetts",
 population: 370000,
 military_strength: 8000,
 economic_output: 75000, // £ sterling
 lynch_sentiment: 0.72, // Pro-independence sentiment
 representative_count: 2,
 key_cities: ["Boston", "Cambridge", "Salem"],
 governor: "Thomas Gage (loyalist)",
 revolutionary_leaders: ["Samuel Adams", "John Hancock"],
 resources: {
 militia_quality: "High",
 supply_lines: "Vulnerable",
 port_access: "Excellent"
 }
}
```

### Colonial Sentiment System

Sentiment ranges from -1.0 (strongly loyalist) to +1.0 (strongly independence). Starting values vary by colony based on historical records.

**Sentiment Modifiers:**

| Modifier Type | Effect | Example |
|--------------|--------|---------|
| **News of Events** | ±0.05-0.15 | British invasion of Boston |
| **Public Declarations** | ±0.03-0.08 | Delegate speeches, published resolutions |
| **Military Action** | ±0.10-0.25 | Battles, skirmishes, victories/defeats |
| **Propaganda Distribution** | ±0.02-0.05 per distribution event | Pamphlets, broadsides |
| **Delegate Activity** | ±0.01-0.03 | Local delegates' public statements |

**Regional Spillover:**
- High sentiment in one colony influences neighboring colonies (radius of 1-2 colonies)
- Strong trade relationships amplify sentiment transmission
- Geographic barriers (Appalachians, distance) reduce spillover effect

### Colonial Voting Power

Each colony's voting weight is determined by:
1. Population size (larger colonies have more delegates)
2. Military contribution (colonies sending troops get bonus votes)
3. Economic contribution (wealthier colonies have disproportionate influence)

**Voting Weight Formula:**
```
colony_votes = floor(population_base × 0.5) + military_bonus + economic_bonus
Example: Massachusetts = 2 votes base + 1 military bonus = 3 total votes
```

Total available votes: ~15-18 (varies dynamically based on attendance and loyalty)

Target: Secure 9+ affirmative votes for passage

### Colonial Resource Contribution

Colonies contribute three types of resources:

1. **Militia Units**: Available for defense campaigns
 - Can be requested during emergencies
 - Usage triggers loyalty checks
 - Losses decrease colonial support

2. **Financial Contributions**: Funds for printing presses, bribes, operations
 - Automatic deduction from colonial treasuries
 - Higher contributions expected from wealthy colonies
 - Non-payment triggers resentment events

3. **Information Networks**: Spy/letter networks from each colony
 - Provide intelligence about British movements
 - Enable targeted propaganda campaigns
 - Can be compromised by British counterintelligence

### Colonial Events System

Each colony generates unique events based on:
- Current sentiment level
- Geographic location (coastal vs interior)
- Recent historical developments
- Player actions targeting that region

**Event Examples:**

| Colony | Possible Events |
|--------|-----------------|
| **Massachusetts** | "Battle of Lexington report", "Boston Tea Party anniversary", "Gage's siege tightens" |
| **Pennsylvania** | "Quaker pacifist objections", "Philadelphia press debate", "Native American relations crisis" |
| **Virginia** | "Lord Dunmore's proclamation", "Tobacco price collapse", "Richmond militia mobilization" |
| **New York** | "Hessaux recruitment attempt", "Loyalist stronghold concerns", "Harbor defense debates" |

Events can be positive (boost support), negative (crisis management required), or neutral (information gathering opportunities).

### Inter-Colonial Relations

Colonies maintain bilateral relationships that affect game mechanics:

```
Inter-colony relationship matrix:
Massachusetts ↔ Pennsylvania: 0.7 (trade partners)
Massachusetts ↔ Virginia: 0.4 (distant allies)
Pennsylvania ↔ New York: 0.6 (shared concerns)
```

**Effects:**
- High relationship → sentiment spillover increases
- Low relationship → cooperation penalties, conflicting demands
- Broken relationships (negative score) → colony may withhold support

Players must balance competing colonial interests and mediate disputes.

---

## Congressional Voting Mechanics

### Voting Structure

The Continental Congress uses a colony-based voting system where each colony casts a unified bloc vote determined by internal delegate consensus.

#### Voting Process Flow

```
1. Vote Motion Called →
2. Colony Deliberation Phase (hidden) →
3. Colony Vote Cast (bilateral: yes/no/abstain) →
4. Tally Displayed →
5. Outcome Processing
```

### Vote Outcomes by Result

| Votes For | Votes Against | Abstentions | Result | Consequences |
|-----------|---------------|-------------|--------|--------------|
| ≥10 | ≤2 | ≤3 | **Decisive Victory** | Immediate adoption, high morale boost |
| 9 | 3-4 | 1-2 | **Clear Passage** | Adoption proceeds, moderate celebration |
| 6-8 | 4-6 | 2-4 | **Narrow Success** | Adopted but controversial, lingering dissent |
| <6 | Any | Any | **Failure** | Declaration not adopted, must retry or game ends |

### Colony Internal Politics

Each colony internally votes based on its delegates' positions:

```
Colony Vote Calculation:
colony_vote = sum(delegate_positions) / delegate_count_threshold

Example: Virginia (4 delegates, threshold: 2.5 average)
Delegate 1: 0.75 ✅
Delegate 2: 0.82 ✅
Delegate 3: 0.68 ❌
Delegate 4: 0.71 ✅
Average: 0.74 → COLONY VOTES YES (exceeds 2.5 threshold)
```

Threshold varies by colony:
- Larger colonies require higher absolute numbers
- Conservative colonies have higher thresholds
- Revolutionary hotspots have lower thresholds

### Strategic Voting Considerations

#### The "Sixth Vote" Problem
Historically, Pennsylvania and South Carolina delegates were initially instructed to vote NO. Players must:
1. Lobby these specific colonies hard
2. Risk losing other colonies if they feel pressured too aggressively
3. Find creative solutions (promise constitutional convention, delay vote locally)

#### The Abstention Option
Some delegates prefer abstaining over voting yes on principle:
- Quakers and religious pacifists often abstain
- Economic conservatives avoid radical commitments
- Abstentions still count toward quorum but don't help victory

Counting mechanics:
- Abstentions don't count as votes against
- But they weaken the mandate strength
- Post-vote reconciliation needed to convert abstainers later

### Vote Security Mechanics

Once a colony votes YES:
- They become "committed voters" for subsequent turns
- Still vulnerable to reversal if sentiment crashes below 0.2
- Re-committing a reverted colony costs 50% more resources

Vote locking system:
- After vote passes threshold of 9, remaining colonies have 1-2 turns to flip
- Once all 13 commit publicly, votes become permanent
- This models historical timeline: preliminary vote July 2, final vote July 4

### Vote Manipulation Tactics

Players can employ various strategies to influence outcomes:

**Legitimate Methods:**
- Persuasion meetings (see Delegate Mechanics)
- Resource allocation to swaying colonies
- Public opinion campaigns
- Deadline pressure (threaten withdrawal if delayed)

**Risky Methods:**
- Threatening to expose delegate correspondence (scandal risk)
- Bribing with future political appointments (trust violation potential)
- Leaking false information (backfire if discovered)

---

## Declaration Drafting Mechanics

### Document Structure

The Declaration of Independence comprises six sections, each requiring player input and revision:

```
DECLARATION STRUCTURE:
├── Preamble (Philosophical foundation)
├── Indictment of George III (List of grievances)
├── Colonial Autonomy Claims (Sovereignty declarations)
├── Previous Petitions History (Royal responses rejected)
├── Current State of Union (Britain declared enemy)
└── Conclusion (Formal separation declaration)
```

### Drafting Progress System

Each section has independent progress bar from 0-100%:

```
Section Progress Matrix:
Preamble ████████████████░░░░ 80% complete
Indictment ████████████████████ 100% complete ✓
Autonomy Claims ████████████░░░░░░░░ 60% complete
Petitions History █████████████████░░░ 90% complete
Current State ████████████░░░░░░░░ 60% complete
Conclusion ██████░░░░░░░░░░░░░░ 40% complete

Overall Completeness: 72%
```

### Revision Process

Players can revise any section during designated drafting phases:

**Revision Actions:**

1. **Modify Language Tone** (Cost: 1 AP)
 - Slider from "diplomatic" to "radical"
 - Affects acceptance by moderate delegates
 - Extreme positions alienate pragmatists, attract radicals

2. **Add/Remove Grievances** (Cost: 1-2 AP per grievance)
 - Select from database of 30+ historical charges
 - Each grievance tested against delegate skepticism
 - Too many weak charges invite criticism

3. **Adjust Philosophical Foundation** (Cost: 2 AP)
 - Refine natural rights language
 - Change emphasis on religious vs secular reasoning
 - Impacts religious delegates strongly

4. **Consult Committee Members** (Cost: 1 AP, grants bonus)
 - John Adams: Strengthens legal arguments
 - Benjamin Franklin: Polishes rhetoric, catches errors
 - Roger Sherman: Ensures constitutional alignment
 - Robert Livingston: Checks feasibility

5. **Public Reading Test** (Cost: 2 AP)
 - Preview draft for selected audience
 - Reveals reactions from sample public segments
 - May uncover wording problems before official vote

### Quality Metrics

Each section evaluated on three dimensions:

| Metric | Description | Impact |
|--------|-------------|--------|
| **Coherence** | Logical flow and argument consistency | Low coherence → delegate rejection |
| **Persuasiveness** | Ability to convince undecided delegates | Direct voting impact |
| **Historical Accuracy** | Adherence to documented facts | Educational mode requirement |
| **Tone Appropriateness** | Balance of anger/dignity/pragmatism | Affects delegate reception |
| **Length** | Word count relative to expectations | Excessive length = readability issues |

### Committee Feedback Loops

As players draft, automated committee feedback emerges:

**Adams Feedback:**
- "This paragraph needs stronger legal grounding"
- "Consider citing English precedent here"
- "The structure follows proper parliamentary procedure"

**Franklin Feedback:**
- "This sentence could be more elegant"
- "Consider simplifying for broader understanding"
- "Good use of rhetorical device here"

**Jefferson's Own Voice** (meta-commentary):
- "I was thinking of emphasizing natural law here"
- "Perhaps we should cite Locke more explicitly"
- "This grievance feels repetitive"

These comments provide guidance without dictating decisions.

### Version Control System

Multiple drafts saved throughout gameplay:

```
Draft Versions:
v1.0 - Initial rough draft (June 12)
v1.1 - First committee revision (June 15)
v2.0 - Major restructuring after Philadelphia debate (June 20)
v2.1 - Final pre-vote polish (July 2)
Final - Official approved version (July 4)
```

Players can revert to previous versions but incur penalty:
- Time cost: -1 turn for each level of rollback
- Credibility loss: -5 trust with all delegates
- Momentum loss: Public sees hesitation as weakness

### Completion Requirements

For Declaration to be vote-ready:

| Requirement | Minimum Threshold | Optimal Target |
|------------|-------------------|----------------|
| **Overall Completeness** | 80% | 95%+ |
| **Coherence Score** | 70/100 | 85+/100 |
| **Persuasiveness Rating** | 65/100 | 80+/100 |
| **Committee Sign-off** | 3/5 members agree | All 5 members approve |
| **No Major Errors** | Zero spelling/grammar mistakes | Zero factual inaccuracies |

Only when all criteria met can formal vote proceed.

---

## Resource Systems

### Primary Resources

Three primary resources drive gameplay economy:

#### Action Points (AP)
**Purpose**: Execute most player actions
**Acquisition**: Base 3 per turn + bonuses from completed objectives
**Storage Cap**: 2 (max carryover)
**Regeneration**: Full reset each turn

**Spending Examples:**
- Private meetings: 1 AP each
- Public speeches: 2 AP each
- Committee work: 1-3 AP depending on scope
- Emergency actions: 4-8 AP

#### Influence Points (IP)
**Purpose**: Perform political maneuvering and bribery
**Acquisition**: Base 5 per turn + successes + events
**Storage Cap**: 20
**Regeneration**: Cumulative (does not reset)

**Spending Examples:**
- Buying intelligence: 2-5 IP
- Funding campaigns: 3-10 IP
- Political promises: 5-15 IP (binding commitments)
- Establishing networks: 10-20 IP (permanent investment)

#### Supplies (Paper, Ink, Printing Materials)
**Purpose**: Physical production of documents and propaganda
**Acquisition**: Purchased from suppliers, provided by colonies
**Storage Cap**: Unlimited (but takes inventory slots)
**Regeneration**: None (must purchase/requisition)

**Spending Examples:**
- Printing Declaration copies: 50 units per 100 copies
- Distributing pamphlets: 5 units per 100 pamphlets
- Building press network: 100 units upfront + maintenance
- Emergency printing: 2x rate (rush orders)

### Secondary Resources

#### Reputation Score (0-100)
**Purpose**: Tracks player's political capital and credibility
**Start Value**: 50 (neutral starting point)
**Gain Sources**: Successful negotiations, fulfilled promises, good outcomes
**Loss Sources**: Failed commitments, scandals, aggressive tactics

**Effects:**
- High reputation (+60): Easier negotiations, better delegate trust
- Medium reputation (40-60): Normal interactions
- Low reputation (<40): Harder persuasions, higher skepticism

#### Scandal Meter (0-100)
**Purpose**: Tracks dirty tactics usage and associated risks
**Start Value**: 0 (clean record)
**Gain Sources**: Threats, leaks, covert operations, broken agreements
**Loss Sources**: None (decays slowly: 5 points/turn when inactive)

**Effects:**
- Low scandal (<30): Minimal risk
- Medium scandal (30-60): Delegate defection risk increased
- High scandal (>60): Defection cascade possible, public backlash likely

### Resource Interactions

Resources interact complexly, creating strategic depth:

**AP ↔ IP Tradeoffs:**
- Can spend 2 IP to gain 1 AP (urgency surge)
- Can store extra AP only at cost of IP efficiency (-1 IP/extra AP stored)

**Supplies ↔ Reputation:**
- Running low on supplies decreases public trust
- Stockpiling excess suggests preparation/suspicion
- Balanced reserves signal competence

**Reputation ↔ Scandal:**
- High reputation provides buffer against scandal damage
- High scandal erodes reputation faster
- Clean reputation helps recover from scandals more quickly

### Resource Acquisition Strategies

**Efficient Farming Methods:**

1. **Delegate Favor Chains**
 - Fulfill small requests early (builds IP reservoir)
 - Convert accumulated favor into larger influence boosts
 - Risk: Creates obligations you must eventually repay

2. **Intelligence Arbitrage**
 - Buy cheap intelligence early, sell insights to delegates
 - Price variance based on delegate desperation
 - Requires knowing delegate priorities first

3. **Colonial Tax Appeals**
 - Request supplies from wealthy colonies
 - Exchange for political favors or voting support
 - Risk: Creates dependency that may backfire

4. **Event Optimization**
 - Some events grant large resource windfalls
 - Preparing for known events maximizes gains
 - Random events may require resources to handle

### Resource Depletion Penalties

Running out of resources triggers cascading failures:

| Resource depleted | Immediate effect | Long-term consequence |
|------------------|------------------|----------------------|
| **Action Points** | Cannot take any actions except free ones | Stalemate until recovery |
| **Influence Points** | No political maneuvering possible | Lost opportunities for key swings |
| **Supplies** | Cannot print materials | Declining public support, communication breakdown |
| **Reputation <20** | Negotiations fail 50% of time | Permanent distrust marker |
| **Scandal >80** | Immediate defection cascade risk | Game over if ≥4 delegates defect |

### Inventory Management Best Practices

**Optimal Ratios:**
- Always maintain ≥5 IP surplus before major negotiations
- Keep 3 AP reserve for unexpected opportunities
- Stocks of 50+ supplies for planned publishing events
- Never let reputation drop below 40 during critical phases

**Emergency Protocols:**
- If running low: Prioritize essential actions only
- Sacrifice long-term goals for immediate survival
- Accept resource burn if it enables critical progress

---

## Time System

### Temporal Framework

The game compresses historical timeline while maintaining realistic pacing:

**Timeline Compression:**
- Real time: June 7 – August 2, 1776 (57 days)
- Game time: 8 turns maximum
- Each turn ≈ 7 days (range 5-10 days dynamically)

**Hard Deadlines:**
- **Turn 1 Start**: June 7, 1776 (Lee Resolution introduced)
- **Turn 3**: July 4, 1776 (Historical declaration date)
- **Turn 6**: August 2, 1776 (Actual signing occurs)
- **Turn 8**: End of play window (mission must succeed or fail)

### Dynamic Timeline Mechanics

Time does not pass uniformly—player actions can accelerate or delay progression:

#### Acceleration Triggers
- Rushing through drafting phases (completes in 0.5 turns)
- Forcing emergency sessions (skips deliberation)
- Rapid-fire negotiations (multiple delegates convinced per turn)

#### Delay Triggers
- Prolonged revisions (adds +1 turn)
- Delegate walkouts (session adjourns)
- Public controversy requiring response time
- Military crises demanding attention

**Time Cost Formula:**
```
turn_extension = Σ(action_penalties) × urgency_modifier

Example:
Major revision: +0.5 turns
Defection crisis: +0.75 turns
Military emergency: +0.5 turns
Urgency multiplier (high deadline): 1.5×
Total extension: (0.5 + 0.75 + 0.5) × 1.5 = 2.6 turns added
```

### Turn Timer Display

Visual timer shows remaining time each turn:

```
⏰ Turn 3 Progress: 72% complete
━━━━━━━━━━━━━━━━━━━━━
Remaining: 3 days 14 hours

Next Milestone:
• Committee review due in 2 days
• Final vote scheduled in 4 days
• Historical deadline: July 4 (2 days remaining)
```

### Historical Anchors

Key dates lock certain events and cannot be moved:

| Date | Event | Flexibility |
|------|-------|-------------|
| June 7 | Lee Resolution introduced | Fixed—cannot occur earlier |
| June 11 | Committee of Five appointed | Fixed — automatic |
| June 28 | Jefferson's draft submitted | Can be delayed up to 2 turns |
| July 1 | First Congress debate | Can shift ±1 day based on player speed |
| July 2 | Independence vote | Can be moved forward by rushing |
| July 4 | Declaration adoption | Hard deadline for victory |
| August 2 | Formal signing | Optional post-game sequence |

### Seasonal Factors

Certain months affect gameplay differently:

**Summer 1776 (June-August):**
- Hot weather slows travel and communication
- Agricultural cycles mean fewer workers available
- Higher delegate fatigue (long sessions)
- British fleet positioning underway

**Modifiers Applied:**
- Communication delays: +1 day for inter-colony messages
- Delegate stamina: -10% effectiveness per consecutive turn beyond turn 3
- Travel time: All journeys take 1 additional day

### Turn Pace Options

Flexible pacing for different player preferences and historical accuracy levels:

| Mode | Turn Duration | Total Turns | Description |
|------|--------------|-------------|-------------|
| **Rapid** | ~7 days/turn | 8 turns | Faster gameplay, condensed timeline—recommended for first playthroughs |
| **Realistic** | 1 day/turn | ~57 turns | Historical accuracy, requires more event variety for extended engagement—recommended for maximum immersion |

Both modes available in all difficulty settings. The realistic mode significantly increases content requirements but provides deeper historical authenticity.

**Fast Forward Mode:**
- Quick decision prompts
- Summarized outcomes
- Reduced exposition
- Recommended: Speed runs, experienced players

**Auto-Pilot Assist (educational mode):**
- AI suggests optimal next action
- One-click execution of recommendations
- Explains reasoning after action completes
- Not available in competitive modes

---

## Random Events

### Event System Overview

Random events introduce unpredictability and force adaptive strategies. Each turn, 1-3 random events trigger based on:

- Current game state variables
- Active modifiers
- Geographic location
- Resource levels

**Event Classification:**
1. **Positive Events** (30% chance) - Help player progress
2. **Negative Events** (50% chance) - Create challenges
3. **Neutral Events** (20% chance) - Provide information or minor adjustments

### Event Generation Rules

**Probability Weighting:**
- Early game (Turns 1-2): More optimistic events
- Mid game (Turns 3-5): Balanced mix
- Late game (Turns 6-8): Increased crisis frequency

**Trigger Conditions:**
```
event_probability = base_rate × contextual_modifiers

Example:
Base British threat rate: 15%
Modifiers:
- NY garrison low: +10%
- British fleet near harbor: +20%
- Recent victory: -10%
Final probability: 35%
```

### Event Database Sample

| Event ID | Category | Effect | Probability | Turn Range |
|----------|----------|--------|-------------|------------|
| **EVT_BOS_SIEGE** | Military | British tighten Boston blockade | 25% | Turn 1-2 |
| **EVT_FRENCH_INTEL** | Intelligence | Learn of French covert aid talks | 15% | Turn 2-6 |
| **EVT_QUAKER_OUTCRY** | Political | PA Quakers oppose war | 20% | Turn 2-4 |
| **EVT_PRINT_SHIP** | Resource | New printing press arrives | 10% | Turn 1-8 |
| **EVT_LEE_DEFECT** | Delegate | Richard Henry Lee hesitates | 30% | Turn 3-5 |
| **EVT_PUBLISH_PAMPHLET** | Public Opinion | Common Sense sells 10k copies | 20% | Turn 1-4 |
| **EVT_BRITISH_DECEIT** | Conspiracy | Discover British spy network | 12% | Turn 3-7 |
| **EVT_VA_SUPPORT** | Colonial | VA sends emergency funds | 15% | Turn 2-5 |
| **EVT_WILDERNESS_UPRISING** | Crisis | Native American raids on frontier | 8% | Turn 4-8 |
| **EVT_FIGUREhead_APPEAL** | Diplomatic | Lord Dunmore offers freedom to slaves | 18% | Turn 3-6 |

### Event Resolution Mechanics

**Choice-Based Responses:**

Most events present player with 2-3 response options, each with different costs and consequences:

```
EVENT: "EVT_QUAKER_OUTCRY"
The Pennsylvania Quakers petition Congress to reject war on religious grounds.

Options:
[1] Respect their conscience - Lose 2 IP, gain peace movement goodwill
[2] Ignore their concerns - Gain 3 IP, risk PA support wavering
[3] Attempt to compromise - Spend 2 AP, attempt to find middle ground
[4] Suppress their protest - Risk major scandal (+15 scandal)

Recommended: Depends on current PA sentiment and QUAker delegate presence
```

**Automatic Resolutions:**

Some events resolve automatically based on game state:

```
EVENT: "EVT_FRENCH_INTEL"
Intelligence reveals France is considering covert assistance.

Effect:
- If French_sympathy ≥ 60: France commits covert aid (+2 military)
- If 30 ≤ French_sympathy < 60: France considers but delays
- If French_sympathy < 30: France remains neutral

Outcome applied automatically without player choice
```

**Counterplay Opportunities:**

Players can mitigate bad events through preparation:

- Stockpile supplies before known military threats
- Build relationships with volatile delegates beforehand
- Invest in early intelligence to prevent surprises
- Maintain high reputation to reduce event severity

### Event Frequency Balance

Designed to maintain engagement without overwhelming:

- **Early game**: 1 event every 2 turns (gentle introduction)
- **Mid game**: 2 events per turn (increasing complexity)
- **Late game**: 3 events per turn (peak tension)

**Soft Cap**: Maximum 5 events per turn regardless of modifiers

**Cooldown Mechanics**: Certain event types cannot repeat within 2 turns to prevent spam

### Event Display Format

Events appear as interactive cards:

```
╔══════════════════════════════════════════╗
║ 🚨 RANDOM EVENT: British Fleet Movement ║
╠══════════════════════════════════════════╣
║ British ships spotted near Chesapeake ║
║ Bay. Potential invasion threat looming. ║
║ ║
║ Your Actions: ║
║ ○ Dispatch militia to Virginia coast ║
║ ○ Request naval reinforcements from MA ║
║ ○ Prepare civilian evacuation plans ║
║ ○ Do nothing (risk assessment) ║
║ ║
║ Warning: This decision affects ║
║ Virginian colony sentiment significantly ║
╚══════════════════════════════════════════╝
```

---

## Historical Events

### Historical Fidelity Approach

The game incorporates actual historical events with high accuracy. When details are uncertain, the game flags them with footnotes and provides multiple interpretation paths.

**Flagged Uncertainties:**
- Exact dates of certain colonial votes
- Private conversations without written records
- Delegate motivation specifics
- Quantitative data (population figures, troop counts)

These uncertainties are modeled through:
- Confidence intervals in event timing
- Alternative outcome branches
- "Historical Note" tooltips explaining uncertainty

### Major Historical Events

These pivotal moments are scripted into the game:

#### **June 7: Lee Resolution Introduced**
**Fixed Event** — Cannot be avoided

```
Richard Henry of Virginia presents resolution:
"These United Colonies are, and of right ought to be,
free and independent States."

Impact:
- Forces Congress to officially consider independence
- Triggers 2-week debate period
- Mandatory event—cannot decline participation
```

#### **June 11: Committee of Five Appointed**
**Scripted Sequence**

Automatically forms committee:
- Thomas Jefferson (primary drafter)
- John Adams (legal argument expert)
- Benjamin Franklin (rhetoric advisor)
- Roger Sherman (constitutional validity)
- Robert Livingston (political strategy)

Player role: Facilitate committee workflow, assign tasks, manage conflicts

#### **June 28: Jefferson's Draft Submitted**
**Player Choice Point**

Options:
1. Accept draft as-is (proceed to next stage immediately)
2. Request revisions (delay 1 turn, improve quality)
3. Reject entirely (lose committee trust, restart drafting)

Historical note: Actual draft underwent significant edits before final approval

#### **July 1-2: Congressional Debate**
**Multi-Phase Event**

Phase 1: General discussion (3 days of debate)
Phase 2: Specific clause votes (line-by-line amendments)
Phase 3: Final vote scheduling

Player can intervene with persuasive speeches (costs AP/IP)

#### **July 4: Declaration Adopted**
**Victory Condition Event**

If requirements met:
- Celebration sequence plays
- Historical narration concludes successfully
- Unlocks end-game scoring

If failed:
- Continuation mode (must retry)
- Or game over if deadline expired

#### **August 2: Signature Ceremony**
**Optional Epilogue Event**

Not required for victory but unlocks additional content:
- Signing ceremony animation
- Historical commentary
- Post-game analysis screen

### Minor Historical Events

Smaller occurrences woven throughout gameplay:

| Date | Event | Effect |
|------|-------|--------|
| **May 1775** (flashback mention) | Battle of Lexington | Context for revolution origins |
| **June 14, 1776** | Continental Army organized | Military bonus available |
| **June 17, 1776** | Bunker Hill aftermath reported | Morale boost |
| **July 6, 1776** | Declaration read publicly | Colonial sentiment spikes |
| **July 9, 1776** | NYC bell rings for declaration | East Coast unity boost |
| **September 1776** | Fall of New York | Military setback event |

### Alternate History Possibilities

While historical mode preserves main timeline, minor variations occur based on player actions:

**Branch Scenarios:**
- If Pennsylvania stays loyal: Delay declaration by 3-5 days
- If Virginia defects: Additional military crisis event
- If French contact established early: Covert aid bonus
- If publication accelerated: Faster colonial adoption, higher morale

**Uncertain Detail Handling:**

Example: Exact number of delegates supporting each colony

> NOTE: Historical records vary on delegate attendance and positions on specific dates. The game uses probabilistic models based on scholarly estimates. [Source:不确定，flag for verification]

### Educational Mode Annotations

Classroom version includes:

- Hyperlinked footnotes to primary sources
- Scholarly commentary on disputed claims
- Cross-references to actual documents
- Interactive timeline with source citations

---

## Difficulty Levels

### Four-Tier System

| Difficulty | Name | Description | Target Audience |
|------------|------|-------------|-----------------|
| **Easy** | "Easy Mode - Common Sense" | Tutorial-friendly, forgiving penalties | Casual players, educators |
| **Medium** | "Medium Mode - Don't Tread on Me" | Balanced challenge, historical accuracy | Average players |
| **Hard** | "Hard Mode - The British are Coming" | Tight constraints, harsh punishments | Experienced strategy fans |
| **Extreme** | "Extreme Mode - Join or Die" | Minimal resources, maximum complexity | Hardcore veterans |

### Difficulty-Specific Modifications

#### Easy Mode ("Common Sense")

**Advantages:**
- Base AP: 4 per turn (vs 3 standard)
- Base IP: 8 per turn (vs 5 standard)
- Starting reputation: 70 (vs 50)
- Event frequency: 50% reduced
- Delegate defection risk: Halved
- Grace period: Can lose 2 colonies and still win
- Tutorial hints always visible
- Auto-save after each turn

**Disadvantages:**
- Victory score capped at 80% maximum
- Cannot unlock speed run achievements
- Educational annotations mandatory

#### Medium Mode ("Don't Tread on Me") **[Default]**

**Balanced configuration:**
- Base AP: 3 per turn
- Base IP: 5 per turn
- Starting reputation: 50
- Standard event frequency
- Normal defection probabilities
- Authentic historical pacing
- Achievement eligibility maintained

#### Hard Mode ("The British are Coming")

**Challenges:**
- Base AP: 2 per turn (limited actions)
- Base IP: 3 per turn (resource scarcity)
- Starting reputation: 40 (initial skepticism)
- Event frequency: +25% (more crises)
- Delegate defection risk: +50%
- No grace period (must secure exact victory conditions)
- Fewer tutorial hints
- Manual save only (no auto-save)

**Additional Constraints:**
- Supplies degrade 2x faster
- Time deadlines 2 days shorter per turn
- Scandal accumulation doubled
- Intelligence costs 50% higher

#### Extreme Mode ("Join or Die")

**Maximum hardship:**
- Base AP: 1 per turn (extreme constraint)
- Base IP: 2 per turn (very tight budget)
- Starting reputation: 30 (widespread distrust)
- Event frequency: +75% (constant crises)
- Delegate defection risk: Tripled
- Supplies scarce (starting stock halved)
- No safety nets whatsoever

**Special Rules:**
- One mistake can cascade into failure
- No tutorial hints at all
- Time pressure extreme (turns worth 5 days, not 7)
- Maximum scandal tolerance: None (immediate game over)
- Victory requires perfect execution

### Custom Difficulty Creator

Advanced option lets players mix and match:

```
Custom Difficulty Settings:
├─ Resource Multiplier: 0.5x - 2.0x
├─ Event Frequency: 25% - 150%
├─ Delegate Stability: 0.5x - 3.0x
├─ Time Pressure: Low - Extreme
├─ Scalen Severity: 0% - 200%
└─ Assistance Level: Off - Minimal - Moderate - Maximal
```

**Design Goals:**
- Allow tailoring experience to skill level
- Prevent accidental impossibility
- Maintain historical flavor across all settings
- Ensure fun factor doesn't compromise challenge

---

## Replayability

### Primary Replay Drivers

**1. Branching Dialogue Trees**
- Multiple valid approaches to persuade each delegate
- Different combinations lead to same outcome but different story paths
- Hidden relationships discovered on subsequent playthroughs

**2. Variable Starting Conditions**
- Randomized delegate positions at game start
- Fluctuating initial colonial sentiments
- Varied resource distributions
- Different random events each session

**3. Multiple Victory Paths**

| Path Type | Strategy | Unlock Condition |
|-----------|----------|------------------|
| **Diplomatic Victory** | Pure persuasion, no coercion | Maintain scandal <20 throughout |
| **Force Victory** | Heavy use of threats/promises | Complete with scandal >60 |
| **Speed Run** | Finish by turn 5 | Achieve victory with ≥10 turns elapsed |
| **Underdog Victory** | Begin with <40 reputation | Recover from crisis state to win |
| **Perfect Record** | No delegate deflections, no scandals | Maintain 100% completion rate |

**4. Delegate Personality Variance**

Each delegate has hidden trait sets:
- **Playthrough 1**: Adams principled, Franklin cynical
- **Playthrough 2**: Adams pragmatic, Franklin idealistic
- Forces adaptation to unknown configurations

**5. Random Event Variety**

Event pool contains 50+ possibilities:
- Different subset triggers each game
- Combinations create unique scenarios
- Rare events (<5% base rate) make subsequent attempts worthwhile

### Multi-Mode System

**Historical Mode (Primary)**
- Fixed timeline, historically accurate events
- Serious educational tone prioritized
- Single-player focused
- One annotation per historical fact (Library of Congress / National Archives preferred)
- All content kept PG rated

**Sandbox Mode: "The Altered States" (Unlockable)**
- Removed timeline restrictions
- Custom scenario creation
- Alternate history branching: Anything goes within reason
- Dramatic variety prioritized over accuracy
- Entertainment-focused narrative
- What if Britain won Battle of Saratoga?
- What if France intervened earlier?
- What if declaration never passed?
- All content kept PG rated

**Educational Mode (Classroom)**
- Serious educational tone
- Annotation overlays on historical events
- One annotation per fact (Library of Congress / National Archives > Wikipedia)
- Quiz checkpoints every 2 turns
- Teacher dashboard integration
- Group play capability (students vote collectively)
- Learning analytics tracking student progress
- All content kept PG rated

### Achievement System

Unlockables encourage experimentation:

**Narrative Achievements:**
- "Founding Father": Win with 100% completion
- "Master Diplomat": Persuade 100% of delegates personally
- "Speed Demon": Complete in under 45 minutes real-time
- "Historian's Dream": Zero historical inaccuracies flagged

**Strategy Achievements:**
- "Scoundrel": Win with scandal >80
- "Minimalist": Complete using only 2 types of actions
- "Lucky": Survive 5 consecutive worst-case events
- "Builder": Establish 5 press networks before vote

**Secret Achievements:**
- Hidden triggers discoverable only through exploration
- Encourages experimentation with unusual strategies

### New Game+ Features

After first completion:
- Start with unlocked knowledge base
- Access cheat sheets for delegate histories
- Choose difficulty modifications mid-game
- Preserve reputation bonus (+10 starting rep)

### Community Sharing

Future expansion potential:
- Share custom scenarios online
- Compete for fastest completion times
- Leaderboards by difficulty tier
- Community-curated historical scenarios

---

## User Interface

### Visual Design Philosophy

**Style Guide:**
- Warm parchment colors (#F5EBE0 background, #2C1B18 text)
- Period-appropriate typography (serif fonts reminiscent of 18th century printing)
- Subtle textures (paper grain, faded edges, ink bleed effects)
- Modern clarity overlaid on historical aesthetic

**Color Palette:**
```
Primary: Deep Burgundy (#6B2C2C) — Authority and importance
Secondary: Gold Ochre (#D4AF37) — Prestige and achievement
Accent: Navy Blue (#1C2E4A) — Trust and stability
Background: Cream Parchment (#F5EBE0) — Historical authenticity
Text: Charcoal Brown (#2C1B18) — Readability
Success: Forest Green (#2E5A27) — Positive outcomes
Warning: Burnt Orange (#CC5500) — Caution signals
Error: Crimson Red (#DC143C) — Critical warnings
```

### Desktop Interface Layout

```
┌─────────────────────────────────────────────────────────────────┐
│ HEADER │
│ [Logo] 1776: The Road To Independence ⏰ Turn 3 | Jul 1 │
├─────────────────────────────────────────────────────────────────┤
│ │
│ LEFT PANEL CENTER PANEL RIGHT PANEL│
│ ┌─────────────┐ ┌─────────────────────────────┐ ┌────────┐│
│ │ MAP VIEW │ │ ACTIVE DIALOGUE/SYSTEM │ │ RESOURCES││
│ │ │ │ │ │────────││
│ │ [Interactive] │ Current Action Prompt │ │ AP: 3/3 ││
│ │ Boardgame │ │ │ │ IP: 12/20││
│ │ style map │ │ [Select Delegate] │ │ Supp: 75 ││
│ │ with colored │ │ │ │ Rep: 58 ││
│ │ colonies │ │ Thomas McKean: │ │ Scan: 23 ││
│ │ territories │ │ • Position: 0.72 ↑ │ │ ││
│ │ showing │ │ • Trust: 45/100 │ │ ││
│ │ sentiment │ │ • Traits: Pragmatic, │ │ ││
│ │ levels │ │ Constituency-focused │ │ ││
│ │ │ │ │ │ ││
│ │ Click colony → │ │ Action Options: │ │ ││
│ │ Shows delegate │ │ ○ Private Meeting (1 AP) │ │ ││
│ │ list │ │ ○ Public Speech (2 AP) │ │ ││
│ │ │ │ ○ Offer Commitment (5 IP) │ │ ││
│ │ │ │ ○ Ignore │ │ ││
│ └─────────────┘ └─────────────────────────────┘ └────────┘│
│ │
│ FOOTER: Notification Area │
│ "British fleet spotted off Sandy Hook" [Dismiss] [Details] │
└─────────────────────────────────────────────────────────────────┘
```

### Mobile Interface Adaptation

**Responsive Design Strategy:**

**Portrait Mode (Primary Mobile Layout):**
```
┌─────────────────────┐
│ HEADER │
│ ⏰ Turn 3 │ Jul 1 │
├─────────────────────┤
│ │
│ [MAP CARD] │
│ Interactive touch │
│ map with zoom │
│ gestures │
│ │
│ ▼ SELECTED: MASSACHUSETTS │
│ ├─ Sentiment: ███████░░ 72% │
│ ├─ Delegates: 4 (✓3, ?1) │
│ └─ [View Delegates] ▶ │
│ │
│ ACTIONS │
│ ○ Meeting (1 AP) │
│ ○ Speech (2 AP) │
│ ○ Intelligence (3 IP)│
│ │
│ FOOTER: Quick Stats │
│ AP:3 IP:12 Rep:58 │
└─────────────────────┘
```

**Landscape Mode:**
Similar to desktop but condensed—side-by-side panels instead of stacked

**Touch Controls:**
- Pinch-to-zoom on map
- Swipe left/right between colonies
- Tap delegate card → full profile modal
- Drag-and-drop between action slots
- Haptic feedback on significant actions

### Component Details

#### Map Visualization
- Boardgame-style hex or polygon grid
- Each colony = colored territory
- Color gradient: Green (pro-independence) → Red (loyalist) → Yellow (undecided)
- Hover/tap reveals colony stats
- Animated transitions when sentiment shifts

#### Delegate Cards
Clicking delegate opens expanded view:
```
┌──────────────────────────────┐
│ Richard Henry Lee │
│ Virginia Delegate │
│ ─────────────────────────── │
│ Position: ████████░░ 0.65 │
│ Trust: █████░░░░ 45/100 │
│ │
│ Motivations: │
│ • State Sovereignty (HIGH) │
│ • Family Legacy (MED) │
│ • Religious Freedom (LOW) │
│ │
│ Relationships: │
│ John Adams: ★★★★★ │
│ Benjamin Franklin: ★★☆☆☆☆ │
│ │
│ Vulnerabilities: │
│ ○ Financial stability │
│ ○ Personal honor │
│ │
│ [Close] [Take Action] │
└──────────────────────────────┘
```

#### Resource Gauges
Always visible, animated fills:
```
AP: [▓▓▓░░░░░░░] 3/3
IP: [▓▓▓▓▓▓▓▓░░] 12/20
Supplies: [▓▓▓▓▓▓▓▓▓▓] 75/∞
Rep: ████████░░ 58/100
Scan: █████░░░░░ 23/100
```

### Interactive Elements

**Modal Windows:**
- Event notifications (center-screen popups)
- Delegate profiles (slide-up from bottom on mobile)
- Confirmation dialogs (for irreversible actions)
- Help/tooltips (context-sensitive overlays)

**Progress Bars:**
- Declaration completion per section (animated fill)
- Sentiment gauges (color-coded gradients)
- Trust meters (dynamic color: green→yellow→red)
- Turn timers (countdown arc around edge)

**Notifications System:**
- Toast messages for minor updates (bottom-right)
- Alert banners for critical events (top-center, dismissible)
- Badge indicators on map tiles (unread event markers)

### Accessibility Features

**Visual:**
- High contrast mode toggle
- Adjustable text size (100%-200%)
- Colorblind-friendly palettes
- Reduced motion option

**Auditory:**
- All important info also shown visually
- Descriptive audio cues for blind users
- Subtitles for all narrated content

**Input:**
- Keyboard navigation support (Tab, Enter, Arrow keys)
- Mouse-free alternative controls
- Touch target sizes ≥44px for accessibility compliance

---

## Mobile Interaction Design

### Touch-Optimized Patterns

**Primary Gestures:**

| Gesture | Function | Context |
|---------|----------|---------|
| Tap | Select colony, open card | Universal selection |
| Double-tap | Zoom center on colony | Map view only |
| Pinch | Zoom map in/out | Map view only |
| Swipe left/right | Switch colonies | Map view carousel |
| Swipe up/down | Navigate delegate list | Scrollable lists |
| Long-press | Show quick actions | Any interactive element |
| Pull-down | Refresh/Update | Data loading states |

### Adaptive UI Principles

**Mobile-Specific Considerations:**

**Thumb Zone Design:**
- Primary actions positioned in bottom third
- Navigation bar anchored to screen bottom
- Quick actions accessible with one thumb

**Vertical Scrolling Priority:**
- Single-column layout for most screens
- Side-by-side panels only in landscape
- Card stacking pattern for information density

**Load Time Optimization:**
- Progressive asset loading (map first, details second)
- Lazy loading for delegate cards
- Cached images for offline access

### Screen-Specific Layouts

#### Home Dashboard (Main Hub)
```
┌─────────────────────┐
│ HEADER: Turn 3 ⏰ │
├─────────────────────┤
│ │
│ [FULL WIDTH MAP] │
│ Touch colonies to │
│ see details │
│ │
│ ▼ Selected: VIRGINIA│
│ Sentiment: ██░░░░ 55%│
│ Delegates: [4 icons]│
│ │
│ QUICK ACTIONS │
│ [Meeting] [Speech] │
│ [Intelligence] │
│ │
│ FOOTER BAR │
│ 🗺️Map 📋Delegates │
│ 📜Declaration 💾Save │
└─────────────────────┘
```

#### Delegate List Screen
```
┌─────────────────────┐
│ ← DELEGATES │
├─────────────────────┤
│ Search: [____] │
│ Filter: [All ▼] │
│ │
│ ┌─────────────────┐ │
│ │ John Adams │ │
│ │ PA | ●●●○○ Pos │ │
│ │ Trust: ███░ 55 │ │
│ │ [See Actions] │ │
│ ├─────────────────┤ │
│ │ Benjamin Frankl │ │
│ │ PA | ●●●●○ Pos │ │
│ │ Trust: ████░ 70 │ │
│ ├─────────────────┤ │
│ │ ...More... │ │
│ └─────────────────┘ │
└─────────────────────┘
```

#### Action Selection Modal
```
┌─────────────────────┐
│ ACT WITH ADAMS │
├─────────────────────┤
│ │
│ ● Private Meeting │
│ Cost: 1 AP │
│ Expected: +0.05 pos │
│ │
│ ● Public Speech │
│ Cost: 2 AP │
│ Expected: +0.03 pos │
│ │
│ ● Offer Promise │
│ Cost: 5 IP │
│ Risk: Scandal +5 │
│ │
│ ● Do Nothing │
│ │
│ [Cancel] [Confirm] │
└─────────────────────┘
```

### Performance Optimizations

**Asset Strategy:**
- SVG vector graphics for crisp scaling
- Sprite sheets for animations
- Compressed image formats (WebP, AVIF)
- Background caching for offline play

**Memory Management:**
- unload delegate cards after 3 turns of inactivity
- Compress save files to <2MB
- Stream map tiles as needed

**Battery Efficiency:**
- Reduce animation frame rate when app in background
- Batch network requests
- Intelligent prefetching based on user behavior patterns

### Offline Capability

**Core Gameplay Offline:**
- Full campaign playable without internet
- Save/load functionality preserved
- Local-only event generation

**Online Features Require Connection:**
- Achievement synchronization
- Cloud saves
- Multiplayer/co-op modes
- Educational reporting

---

## Game State/Data Model

### Core Data Structures

**Complete State Schema:**

```javascript
GameState {
 // Metadata
 id: string,
 startTime: timestamp,
 currentTurn: number,
 currentDate: date,
 difficulty: "easy" | "medium" | "hard" | "extreme",
 mode: "historical" | "sandbox" | "educational",

 // Player Stats
 player: {
 reputation: number (0-100),
 scandal: number (0-100),
 actionPoints: number,
 maxAP: number,
 influencePoints: number,
 maxIP: number,
 supplies: number,
 turnLimitReached: boolean,

 // Track achievements unlocked
 achievements: Array<string>,

 // Notes from player discoveries
 playerNotes: Map<string, string>
 },

 // Time System
 timeline: {
 currentTurn: number,
 daysElapsed: number,
 historicalDeadlines: {
 july4_adoption: timestamp,
 august2_signing: timestamp,
 final_deadline: timestamp
 },
 turnExtensionQueue: Array<event>
 },

 // Colonial Entities
 colonies: Map<string, Colony>,

 // Delegate System
 delegates: Map<string, Delegate>,

 // Declaration Document
 declaration: {
 status: "not_started" | "drafting" | "review" | "finalized" | "adopted",
 sections: {
 preamble: SectionData,
 indictment: SectionData,
 autonomy: SectionData,
 petitions: SectionData,
 current_state: SectionData,
 conclusion: SectionData
 },
 overallProgress: number (0-100),
 qualityMetrics: {
 coherence: number,
 persuasiveness: number,
 historicalAccuracy: number,
 toneBalance: number,
 wordCount: number
 },
 versionHistory: Array<DraftVersion>,

 // Committee member opinions
 committeeFeedback: {
 jefferson: string,
 adams: string,
 franklin: string,
 sherman: string,
 livingston: string
 }
 },

 // Event Tracking
 activeEvents: Map<string, EventInstance>,
 resolvedEvents: Array<ResolvedEvent>,
 upcomingEvents: Array<ScheduledEvent>,

 // Inter-Colony Relations
 relationships: Map<string, Map<string, number>>, // colony_pair -> score

 // Resource Ledger
 resourceTransactions: Array<Transaction>,

 // Dialogue Trees
 dialogues: Map<string, DialogueNode>,

 // Save/Load Metadata
 saveMetadata: {
 lastSaveTime: timestamp,
 autoSaveEnabled: boolean,
 manualSaveSlots: Array<{id, timestamp, description}>
 },

 // Educational Mode Data
 education: {
 annotationsUnlocked: boolean,
 quizScores: Map<string, number>,
 learningProgress: number,
 teacherDashboardLink: string|null
 }
}

// Supporting Structures

Colony {
 id: string,
 name: string,
 position: number (-1.0 to 1.0),
 delegateIds: Array<string>,
 sentiment: number (0-100),
 militaryStrength: number,
 economicOutput: number,
 governor: string,
 revolutionaryLeaders: Array<string>,
 resources: {
 militia: number,
 funds: number,
 informationNetworks: number
 },
 events: Array<string>,
 relationships: Map<string, number>
}

Delegate {
 id: string,
 name: string,
 colonyId: string,
 position: number (0-1, current stance),
 positionRange: {min: number, max: number},
 trust: number (0-100),
 archetype: "principle-driven" | "pragmatic" | "constituency-first" | "social" | "personal-interest",
 motivations: Array<string>,
 relationships: Map<string, number>, // delegate -> trust score
 vulnerabilities: Array<string>,
 publicStance: string,
 privateStance: string,
 notes: string[],
 actionsTaken: Array<ActionLog>,
 lastContactDate: date
}

EventInstance {
 id: string,
 templateId: string,
 triggerDate: date,
 resolved: boolean,
 choices: Array<{id, label, cost, effect, revealed?:boolean}>,
 selectedChoice?: string,
 outcome: object,
 effectScope: Array<string> // which entities affected
}

SectionData {
 progress: number (0-100),
 content: string,
 revisionHistory: Array<{version, author, changes, timestamp}>,
 feedback: Map<string, string>, // delegateId -> comment
 qualityScore: number (0-100),
 lastModified: date
}

DialogueNode {
 id: string,
 type: "greeting" | "persuasion" | "negotiation" | "conflict" | "resolution",
 text: string,
 speaker: string,
 options: Array<{label, nextNodeId, requiredSkill?, cost?, revealInfo?:string}>,
 conditions: Array<{field, operator, value}>,
 rewards: Array<{type, amount, target?>
}
```

### Persistence Layer

**Save File Structure:**

Single JSON file containing entire game state:

```json
{
 "version": "1.0.0",
 "saveId": "unique-guid-here",
 "timestamp": "2024-10-11T23:32:00Z",
 "gameState": {...full state object...},
 "checksum": "sha256-hash-for-integrity"
}
```

**Save Slot Management:**
- Up to 10 manual save slots
- Auto-saves create dated backups
- Cloud sync stores encrypted copy remotely
- Local-only mode stores in IndexedDB/browser storage

**Load Procedures:**
1. Validate file integrity (checksum verification)
2. Load state into memory
3. Restore game session context
4. Apply pending events
5. Resume gameplay

### Serialization Strategy

**Binary vs Text:**
- Human-readable JSON format for debugging
- Optional compressed/binary format for production
- Delta compression for cloud sync optimization

**Size Optimization:**
- Compress event history (keep only recent 50 events)
- Delegate relationships summarized after 3 turns
- Archive old dialogue trees after resolution

### Database Dependencies

No external database required—entire state fits in single file (~1-5MB depending on play length).

**Future Expansion Ready:**
- Multiplayer sync layer prepared
- Cloud save API endpoints mocked
- Analytics tracking hooks ready

---

## Save/Load System

### Save Locations

**Manual Saves:**
- Players can save anytime outside of critical event sequences
- Accessible via pause menu or dedicated save button
- Named slots with descriptive labels
- Maximum 10 user-created slots

**Auto-Save Triggers:**
- After each turn completes
- Before irreversible decisions (vote initiation)
- Upon achieving milestones (first delegate convinced, document section complete)
- On emergency exits (app closing unexpectedly)

**Checkpoint System:**
- Automatically saves before major events
- Restores to checkpoint if game forced closes
- Player notified of auto-saved progress

### Save File Format

**Save System Architecture:**

Built for extensibility from day one:
- **Primary storage:** Browser localStorage / IndexedDB
- **Format:** Portable JSON objects (easily exportable/importable)
- **No vendor lock-in:** Saves can theoretically be uploaded/downloaded anywhere
- **Migration-ready:** Future cloud sync or backend changes won't break existing saves
- Players can manually download their save files for backup or transfer between devices

**File Structure:**
```
saves/
├── slot_1_2024-10-11.json          # User-named slot
├── slot_2_2024-10-12.json
├── autosave_turn3_2024-10-11.json  # Turn-based auto-save
├── checkpoint_victory_2024-10-10.json # Milestone checkpoint
└── metadata.json                   # Slot index, timestamps, descriptions
```

**Metadata Entry:**
```json
{
 "slot_number": 1,
 "description": "Before final vote",
 "timestamp": "2024-10-11T20:15:00Z",
 "turn": 3,
 "date": "July 1, 1776",
 "completionPercentage": 45,
 "difficulty": "medium"
}
```

### Load Procedures

**Loading Steps:**
1. Display save selection UI
2. Read metadata for each slot
3. Show preview info (current date, progress percentage, notable achievements)
4. Player selects slot to load
5. Validate file integrity
6. Restore game state
7. Resume from appropriate point

**Conflict Resolution:**
If loading older save overwrites newer progress:
```
WARNING: Loading this save will overwrite your current game progress.

Current Game: Turn 5, July 5, 1776 (62% complete)
Load This Save: Turn 3, July 1, 1776 (45% complete)

Are you sure? [Cancel] [Overwrite]
```

### Undo Functionality

Limited undo capability for mistake correction:

**Undo Stack:**
- Maintains last 5 actions
- Reverses most recent action if player changes mind
- Cannot undo during critical sequence events
- Costs no resources

**Usage Pattern:**
```
Player performs "Private Meeting" with delegate
→ Effect applies immediately
→ Player realizes wrong choice
→ Uses undo (accessed via pause menu)
→ Returns to pre-meeting state
```

### Cross-Platform Sync

**Cloud Save Integration:**
- Optional linking to Google Drive/iCloud/OneDrive
- Automatic backup every turn
- Restore progress on new device
- Manual upload/download buttons

**Local Backup:**
- Export save as downloadable .json file
- Import saved file from elsewhere
- Manual transfer between devices via file sharing

### Error Recovery

**Corrupted Save Detection:**
- SHA-256 checksum validation on load
- Integrity check on file header
- Version compatibility verification

**Recovery Procedures:**
1. If checksum fails: offer latest auto-save
2. If version mismatch: suggest downgrade or ignore warning
3. If missing data: reconstruct from backup or notify player

**Debug Tools:**
- Developer mode toggles detailed error logging
- Save editor utility for testing (not exposed to players)
- Rollback script for catastrophic failures

---

## Tutorial System

### Onboarding Flow

**Three-Stage Introduction:**

#### Stage 1: Conceptual Orientation (5 minutes)

Interactive walkthrough introduces:
- Historical context (Brief overview of 1776 situation)
- Core loop explanation (diagram of turn structure)
- Goal visualization (victory/failure conditions)

Format: Cinematic intro with narrator voiceover, optional text transcript

**Sample Opening:**
```
VOICEOVER: "June 1776. The American colonies stand at a crossroads.
Will they remain loyal subjects of King George, or risk everything
for independence? You serve as Thomas Jefferson's confidant, tasked
with guiding the Continental Congress toward a historic decision."

[Show map of 13 colonies, highlight key figures]
"This is where history is made. Your choices will shape the nation."
```

#### Stage 2: Guided First Turn (10 minutes)

Hands-on practice with mentor guidance:

**Step-by-step Instructions:**
1. Tutorial marks first actionable item with glowing outline
2. Tooltips explain each UI element on hover/tap
3. Mentor character (fictionalized John Adams) narrates decisions
4. Safe space to experiment without consequences

**Tutorial Actions Covered:**
- Clicking colonies to view delegates
- Performing first private meeting
- Understanding resource gauges
- Reading event notifications
- Viewing delegate profiles
- Checking declaration progress

**Safe Practice Environment:**
- Unlimited AP/IP during tutorial
- No negative consequences for mistakes
- Gentle corrections if player goes off-track

#### Stage 3: First Real Turn (15 minutes)

Transition to authentic gameplay with reduced guidance:

**Gradual Fading:**
- Tutorial hints disappear after confirmation
- Resource budgets tighten to normal levels
- Event frequency increases
- Mentor intervenes only for major decisions

**Learning Objectives Met:**
By end of tutorial, player demonstrates ability to:
✅ Navigate map interface
✅ Manage action and influence points
✅ Conduct delegate negotiations
✅ Monitor declaration progress
✅ Respond to events appropriately
✅ Understand turn structure

### Contextual Help System

**Inline Tooltips:**
- Appear on first exposure to new mechanics
- Dismissible after reading
- Can re-trigger via "?" icon in any menu

**Smart Suggestions:**
- AI recommends optimal action based on game state
- Available in Easy mode only
- Explains reasoning after player decides

**Dynamic Hint System:**
Triggers when player struggles:
```
If delegate persuasion fails 3x:
Hint: "Some delegates respond better to public pressure than private appeals.
Try organizing a group speech to build momentum."

If running low on supplies:
Hint: "Colonies contribute printing materials. Visit Virginia's delegate
to request additional supplies."
```

### Tutorial Modes

**Full Tutorial Mode:**
- Complete guided experience
- Recommended for first-time players
- Includes all explanations

**Skip Tutorial Option:**
- Available from main menu
- Provides summarized reference card instead
- Players choose their own pace

**Refresher Mode:**
- Accessible anytime from settings
- Re-walks specific mechanics
- Useful for returning players trying new strategies

### Educational Annotations (Classroom Mode)

Extra layer of academic support:

**Hyperlinked Footnotes:**
Every historical fact linked to primary source document:
```
"When John Adams wrote to Abigail..."
[Footnote icon] → Opens actual letter excerpt with translation notes
```

**Scholarly Commentary:**
Academic annotations appear alongside events:
```
Historical Context:
"Modern historians debate how decisively Adams pushed for independence.
Some accounts emphasize his persistence, others suggest gradual consensus.
The game reflects this ambiguity through multiple dialogue branches."
```

**Quiz Checkpoints:**
Every 2 turns, brief assessment ensures comprehension:
```
Question: Why did Pennsylvania initially resist independence?

Options:
[a] Economic ties to Britain (Correct)
[b] Lack of military support
[c] Religious objections only
[d] All of the above

Feedback explains correct answer with historical references
```

### Tutorial Accessibility

**Language Support:**
- English default, expanding to Spanish/French/German
- All text translatable for localization
- Voiceovers available in primary languages

**Difficulty Scaling:**
- Tutorial difficulty matches selected game difficulty
- Hard/Extreme modes receive abbreviated orientation (assumes prior experience)
- Easy mode provides maximum hand-holding

---

## End-Game Sequence

### Victory Conditions Checklist

Before triggering victory sequence, verify ALL criteria met:

**Required Checks:**
```
☐ Declaration fully finalized (≥95% completion)
☐ ≥9 colonies voted affirmatively in Congressional vote
☐ Document officially adopted by Congress
☐ Printing presses operational in ≥5 key cities
☐ First distribution initiated (copies sent to commanders)
```

### Victory Flow

#### Step 1: Victory Announcement

Immediate visual and audio feedback upon reaching victory state:

```
┌─────────────────────────────────────────┐
│ VICTORY! DECLARATION ADOPTED │
├─────────────────────────────────────────┤
│ │
│ On this historic day, July 4, 1776, │
│ the Continental Congress formally │
│ adopted the Declaration of Independence.|
│ │
│ Your leadership secured approval from │
│ [X] of [Y] colonies, ensuring America's │
│ birth as a sovereign nation. │
│ │
│ [View Final Statistics] [Replay] [Exit] │
└─────────────────────────────────────────┘
```

**Visual Effects:**
- Confetti animation (period-appropriate cannon/fireworks)
- Declaration document unfurls on screen
- Historical photographs overlay actual signatures
- Narrated epilogue with voiceover

#### Step 2: Scoring Analysis

Detailed breakdown of performance across categories:

| Category | Criteria | Score | Max | Comments |
|----------|----------|-------|-----|----------|
| **Completion Time** | Completed by turn 5 | 95/100 | 100 | Excellent pacing |
| **Delegates Persuaded** | 11/13 personally convinced | 85/100 | 100 | Strong diplomacy |
| **Resource Efficiency** | Used 80% of available IP | 70/100 | 100 | Good economy |
| **Historical Accuracy** | Zero flagged errors | 100/100 | 100 | Perfect scholarship |
| **Event Response** | Handled all crises successfully | 90/100 | 100 | Minor delays noted |
| **Scandal Minimized** | Peak scandal 25% | 80/100 | 100 | Mostly clean conduct |
| **TOTAL SCORE** | | **85/100** | **100** | **Grade: A-** |

**Performance Tier:**
- 90-100: Founding Father Legendary (gold medal)
- 80-89: Master Diplomat (silver medal)
- 70-79: Competent Leader (bronze medal)
- 60-69: Adequate Effort (certificate)
- <60: Needs Improvement (retry encouraged)

#### Step 3: Narrative Epilogue

Contextual storytelling based on player approach:

**Example 1: Diplomatic Victory**
```
Your success came through patient diplomacy and genuine persuasion.
Delegates respected your integrity, and the Declaration emerged as
a consensus document reflecting broad colonial values. John Adams
later wrote: "You managed the impossible with grace and skill."

Achievement Unlocked: "Golden Pen" — Won with zero scandals
```

**Example 2: Forceful Victory**
```
You wielded influence ruthlessly, leveraging every advantage to
secure passage. While successful, some delegates whispered about
your methods behind closed doors. Nevertheless, history records
your decisive action.

Achievement Unlocked: "Iron Hand" — Won with scandal >60
```

**Example 3: Underdog Victory**
```
Starting with widespread distrust, you rebuilt relationships from
scratch and rallied reluctant colonies to the cause. Your resilience
became legend among the revolutionaries.

Achievement Unlocked: "Phoenix Rising" — Recovered from crisis state
```

#### Step 4: Historical Reflection

Side-by-side comparison of game outcomes vs. actual history:

```
GAME OUTCOME HISTORICAL RECORD
─────────────────────────────────────────────────────
Turns to victory: 6 Historical timeline: 8 weeks
Colonies unanimously supportive: Yes Actual vote: 12-0 (NY abstained initially)
Delegates convinced personally: 11 Records show mixed persuasion methods
Document edited 3x before final: Likely 5+ committee revisions

Note: Game compressed timeline for playability. Actual events spanned longer.
```

#### Step 5: Post-Game Content

**Unlockables:**
- Sandbox mode enabled
- Cheat sheets for delegate histories
- Historical document archive
- Behind-the-scenes design notes

**Leaderboard Submission:**
- Upload score to global rankings
- Compare completion times with others
- Share unique achievement combinations

**Continuation Option:**
- Continue playing in sandbox mode (remove constraints)
- Start New Game+ with bonus reputation
- Experiment with alternate history scenarios

### Loss Sequence

#### Step 1: Defeat Announcement

Humane acknowledgment of failure with constructive feedback:

```
┌─────────────────────────────────────────┐
│ MISSION FAILED │
├─────────────────────────────────────────┤
│ │
│ Despite your efforts, the Declaration │
│ failed to secure sufficient support. │
│ By turn [X], several colonies had │
│ withdrawn their backing, and Congress │
│ adjourned without resolution. │
│ │
│ Primary Reason: [Delegate defection cascade]│
│ Secondary Factor: [Insufficient resources]│
│ │
│ What went wrong: │
│ • Pennsylvania remained hesitant throughout│
│ • Richard Henry Lee defected to Loyalists│
│ • British infiltration disrupted printing│
│ │
│ Lessons learned: │
│ • Secure key swing colonies earlier │
│ • Maintain scandal below 40% │
│ • Stockpile supplies before August │
│ │
│ [Try Again] [View Replay] [Adjust Strategy]│
└─────────────────────────────────────────┘
```

#### Step 2: Diagnostic Breakdown

Analysis of what led to defeat:

**Failure Tree:**
```
ROOT CAUSE: Delegate defection cascade
├─ Immediate trigger: Scandal exceeded 80%
│ └─ Contributing factor: Aggressive threat tactics used
├─ Secondary: Virginia sentiment crashed to 15%
│ └─ Contributing factor: Militia deployment angered locals
└─ Root systemic issue: Insufficient early alliance-building

RECOMMENDATIONS:
• Invest in trust-building during turns 1-2
• Balance persuasion with ethical boundaries
• Monitor scandal meter proactively
```

#### Step 3: Retry Incentive

Encourage learning from mistakes:

**Retake Bonus:**
- +10 starting reputation for each previous failure
- Partial resource carryover (20% of unused supplies)
- Knowledge unlock (delegate preference hints)

**Scenario Variation:**
- Randomized starting conditions for fresh challenge
- New event pool composition
- Different delegate personality matrices

### Post-Credits Scene

Optional Easter egg after credits roll:

**Hidden Feature:**
```
[UNLOCKED]: Alternate Ending View
See how history might have unfolded if you'd taken a different path...

[Browse Alternate Timelines] [Return to Main Menu]
```

Shows divergent historical scenarios based on player choices:
- If declaration failed: British suppression intensified
- If France intervened early: War ends sooner
- If南方 colonies stayed loyal: Fragmented United States

---

## Technical Implementation Notes

### Feasibility for Solo Developer

**Recommended Tech Stack:**
- **Frontend**: React.js + TypeScript for web, React Native for mobile wrapper
- **State Management**: Zustand or Redux for manageable complexity
- **Graphics**: Fabric.js or Pixi.js for boardgame-style rendering
- **Audio**: Howler.js for music/SFX
- **Build**: Vite for fast development, Webpack for production optimization

**Estimated Development Timeline:**
- Core mechanics prototype: 4-6 weeks
- UI/UX implementation: 6-8 weeks
- Content creation (events, delegates, text): 8-10 weeks
- Testing and polishing: 4-6 weeks
- **Total: 4-6 months** for MVP with historical mode

**AI Coding Assistance Integration:**
- Code generation for repetitive components (delegate cards, resource bars)
- Unit test generation for game logic
- Documentation auto-completion
- Bug diagnosis and fix suggestions

### Asset Requirements

**Minimum Viable Assets:**
- 13 colony map polygons (SVG format)
- 25+ delegate portraits (illustrated style)
- Basic UI icons (action buttons, gauges, toggles)
- 2-3 ambient music tracks (period-inspired but copyright-safe)
- Sound effects (clicks, turns, event notifications)

**Optional Polish:**
- Full voice-over cast for narrative sequences
- Animated transition effects
- Enhanced delegate facial expressions
- Interactive signature ceremony sequence

### Performance Targets

**Desktop:**
- 60 FPS sustained
- Load time <3 seconds from cold start
- Save/load <1 second
- Memory footprint <200MB

**Mobile:**
- 30-60 FPS (adaptive based on device)
- Load time <5 seconds on mid-tier phones
- Battery drain <5%/hour
- Storage <50MB download size

### Platform Support

**Initial Launch:**
- Chrome, Firefox, Safari, Edge (desktop)
- iOS 14+, Android 10+ (mobile browsers)

**Progressive Enhancement:**
- Add native mobile apps later (React Native wrapper)
- Tablet optimization included from start
- Controller input support optional addition

---

## Next Steps for Development

### Phase 1: Prototype (Weeks 1-4)

**Goals:**
- Implement core turn structure
- Build basic delegate interaction system
- Create simplified map visualization
- Test gameplay loop viability

**Deliverables:**
- Vertical slice of one complete turn
- Working resource management
- Proof-of-concept delegation persuasion mechanic

### Phase 2: Content Creation (Weeks 5-12)

**Goals:**
- Flesh out all 13 colonies with unique attributes
- Write 50+ random/historical events
- Develop full delegate roster with personalities
- Draft complete Declaration editing interface

**Deliverables:**
- Complete event database
- All delegate profiles populated
- Full Declaration section structure implemented
- Tutorial content finalized

### Phase 3: UI/UX Polish (Weeks 13-20)

**Goals:**
- Implement responsive design for mobile/desktop
- Add animations and visual feedback
- Optimize performance for target platforms
- Conduct user testing sessions

**Deliverables:**
- Production-ready UI kit
- Mobile-optimized touch interactions
- Accessibility compliance verified
- Performance benchmarks met

### Phase 4: Testing & Iteration (Weeks 21-24)

**Goals:**
- Bug fixing and balance tuning
- Difficulty calibration across all tiers
- Tutorial effectiveness validation
- Final QA pass

**Deliverables:**
- Release candidate build
- Documentation complete
- Marketing assets prepared
- Launch plan finalized

---

## Appendix A: Historical References & Uncertainties

### Confirmed Historical Facts (Game Basis)

| Fact | Source | Confidence |
|------|--------|------------|
| Lee Resolution introduced June 7, 1776 | Journals of Continental Congress | 100% |
| Committee of Five appointed June 11 | Historical letters, biographies | 100% |
| Jefferson primary drafter | Self-account, Adams correspondence | 100% |
| Declaration adopted July 4, 1776 | Official congressional records | 100% |
| Formal signing August 2, 1776 | Signed engrossed copy evidence | 100% |
| Pennsylvania initially resistant | Quaker correspondence, delegate journals | 95% |

### Uncertain Details (Flagged for Game Design)

> **NOTE**: These areas require further scholarly research before final implementation. The game will use probabilistic modeling based on prevailing academic theories.

1. **Delegate Attendance Numbers by Date**
 - Historical records vary on exact daily attendance
 - Game uses average estimates with confidence intervals
 - Flagged footnote appears in Educational mode

2. **Private Delegate Motivations**
 - Most motivations inferred from correspondence
 - Some speculative based on social context
 - Game provides multiple interpretation branches

3. **Exact Population Figures**
 - 1776 census data incomplete
 - Estimates range widely among historians
 - Game uses median scholarly estimates

4. **Quantitative Sentiment Levels**
 - No direct polling exists
 - Reconstructed from voting records and letters
 - Game treats as approximate rather than precise

5. **Specific Conversations Without Written Record**
 - Many negotiations left undocumented
 - Game invents dialogue consistent with known positions
 - Clearly labeled as dramatized in Educational mode

### Scholarly Sources Consulted

- *Journals of the Continental Congress* (Library of Congress digital edition)
- *The Papers of Thomas Jefferson* (Princeton University Press)
- *John Adams: A Life* by Joseph Ellis
- *American Creation* by Joseph J. Ellis
- *1776* by David McCullough
- *The Friends of Liberty* by Michael A. Bellesiles

---

## Conclusion

**1776: The Road To Independence** delivers a historically-grounded, mechanically-rich strategy experience that respects both player intelligence and historical truth. By distilling complex political processes into engaging turn-based gameplay, the game achieves educational value without sacrificing entertainment.

The design emphasizes:
- **Strategic depth** through resource constraints and relationship management
- **Historical authenticity** with transparent handling of uncertain details
- **Accessibility** across platforms with thoughtful UI/UX design
- **Replayability** through branching narratives and variable conditions
- **Feasibility** for a solo developer using modern frameworks

This document serves as complete blueprint for implementation. Next step: begin prototype development focusing on core turn loop and delegate interaction mechanics.

---

**END ORIGINAL GAME DESIGN DOCUMENT**

## Document Version
- Created: October 13, 2026
- Updated: October 13, 2026 (Title changes applied)
- Version: 1.0-Beta
