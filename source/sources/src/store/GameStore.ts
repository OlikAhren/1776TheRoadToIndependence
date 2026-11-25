import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { GameState, Delegate, Colony, Difficulty, VictoryEntry } from '../types/game'
import { containsBlockedWord } from '../data/wordFilter'
import delegatesData from '../data/delegates.json'
import debateAnglesData from '../data/debateAngles.json'
import delegateBespokeApproaches from '../data/delegateBespokeApproaches.json'

// ---- Approach bands (TUNE HERE) -------------------------------------------------------
// Support-roll range [min, max] (inclusive) per action. Four bands, all sharing the neutral shape:
//   neutral = original behaviour (no approach chosen, or an unexpected value).
//   good    = neutral with the positive end extended by +5.
//   bad     = mirror of good (negate and swap the ends).
//   legend  = the bespoke, legend-drawn approach of a story-critical delegate; extends the positive
//             end further than good (mail up to +15, meeting up to +30).
// The player-facing choice ids are 'good' | 'bad' | 'bespoke'; 'bespoke' resolves to the legend band
// only for delegates that have an entry in delegateBespokeApproaches.json (see resolveApproachBand).
export type ApproachChoice = 'good' | 'bad' | 'bespoke'
export type ApproachBand = 'neutral' | 'good' | 'bad' | 'legend'
export const APPROACH_BANDS = {
  mail:    { neutral: [-1, 5],  good: [-1, 10], bad: [-10, 1], legend: [-1, 15] },
  meeting: { neutral: [-5, 20], good: [-5, 25], bad: [-25, 5], legend: [-5, 30] },
} as const
const bespokeTable = delegateBespokeApproaches as unknown as Record<string, { band?: string }>
// Single place that maps a chosen option id to a band for a given delegate.
export const resolveApproachBand = (delegateId: string, approach?: unknown): ApproachBand => {
  if (approach === 'good') return 'good'
  if (approach === 'bad') return 'bad'
  if (approach === 'bespoke' && bespokeTable[delegateId]?.band === 'legend') return 'legend'
  return 'neutral'
}
export const rollSupportChange = (kind: 'mail' | 'meeting', band: ApproachBand = 'neutral'): number => {
  const bands = APPROACH_BANDS[kind]
  const [min, max] = bands[band] ?? bands.neutral
  return min + Math.floor(Math.random() * (max - min + 1))
}
// ----------------------------------------------------------------------------------------

// Convert JSON data to game format
const initialDelegates: Delegate[] = delegatesData.delegates.map(d => ({
  id: d.id,
  name: d.name,
  colony: d.colony,
  supportLevel: d.supportLevel,
  profile: d.profile,
  overview: d.overview,
  committeeOfFive: d.committeeOfFive || false,
  continentalCongressPresident: d.continentalCongressPresident || false
}))

// Shared predicate: Committee of Five members and the Continental Congress President
export const isProtectedDelegate = (d: { committeeOfFive?: boolean; continentalCongressPresident?: boolean }) =>
  !!(d.committeeOfFive || d.continentalCongressPresident)

// Create colonies with proper coordinates for map shape
const createColoniesMap = (): Colony[] => {
  // Create a rough map shape of the 13 colonies (normalized coordinates)
  const colonyLayout: { [key: string]: { x: number; y: number; size: number } } = {
    // Southern states (bottom right)
    "Georgia": { x: 0.85, y: 0.90, size: 0.8 },
    "South Carolina": { x: 0.82, y: 0.75, size: 0.85 },
    "North Carolina": { x: 0.80, y: 0.62, size: 0.9 },
    // Middle-southern
    "Virginia": { x: 0.78, y: 0.52, size: 1.0 },
    "Maryland": { x: 0.75, y: 0.45, size: 0.85 },
    "Delaware": { x: 0.74, y: 0.42, size: 0.7 },
    // Northern states (top left)
    "Pennsylvania": { x: 0.68, y: 0.45, size: 0.95 },
    "New Jersey": { x: 0.70, y: 0.38, size: 0.8 },
    "New York": { x: 0.65, y: 0.32, size: 0.9 },
    "Connecticut": { x: 0.60, y: 0.28, size: 0.8 },
    "Rhode Island": { x: 0.63, y: 0.26, size: 0.65 },
    "Massachusetts": { x: 0.62, y: 0.22, size: 0.85 },
    "New Hampshire": { x: 0.58, y: 0.15, size: 0.8 }
  }

  // Initial postal riders per colony
  const initialRiders: { [key: string]: number } = {
    "Virginia": 6,
    "Pennsylvania": 4,
    "Massachusetts": 4,
    "Maryland": 4,
    "North Carolina": 4,
    "Connecticut": 3,
    "New York": 3,
    "South Carolina": 2,
    "New Jersey": 2,
    "New Hampshire": 2,
    "Rhode Island": 0,
    "Georgia": 2,
    "Delaware": 0
  }

  // Initial postal subsidies per colony ($)
  const initialSubsidies: { [key: string]: number } = {
    "Virginia": 25,
    "Maryland": 25,
    "North Carolina": 25,
    "South Carolina": 25,
    "Georgia": 25,
    "Pennsylvania": 20,
    "New York": 20,
    "New Jersey": 20,
    "Delaware": 20,
    "Massachusetts": 15,
    "Connecticut": 15,
    "Rhode Island": 15,
    "New Hampshire": 15
  }

  return Object.entries(colonyLayout).map(([name, coords], index) => {
    // Get delegates for this colony
    const colonyDelegates = initialDelegates.filter(d => d.colony === name)
    
    return {
      id: `colony_${index}`,
      name: name,
      supportLevel: colonyDelegates.length > 0 
        ? Math.round(colonyDelegates.reduce((sum, d) => sum + d.supportLevel, 0) / colonyDelegates.length)
        : 70,
      delegateIds: colonyDelegates.map(d => d.id),
      x: coords.x,
      y: coords.y,
      size: coords.size,
      postalRiders: initialRiders[name] || 0,
      postalSubsidies: initialSubsidies[name] || 10
    }
  })
}

const initialColonies = createColoniesMap()

// The colony shown in the delegate panel before the player picks one from the map.
export const DEFAULT_COLONY_NAME = 'Pennsylvania'
export const DEFAULT_COLONY_ID = initialColonies.find(c => c.name === DEFAULT_COLONY_NAME)?.id ?? null

export const DIFFICULTY_ORDER: Difficulty[] = ['easy', 'medium', 'hard', 'extreme']

export const DIFFICULTY_SETTINGS: Record<Difficulty, { label: string; tier: string; requiredGreenColonies: number }> = {
  easy: { label: 'Common Sense', tier: 'Easy', requiredGreenColonies: 7 },
  medium: { label: "Don't Tread on Me", tier: 'Medium', requiredGreenColonies: 9 },
  hard: { label: 'The British are Coming!', tier: 'Hard', requiredGreenColonies: 12 },
  extreme: { label: 'Join or Die!', tier: 'Extreme!', requiredGreenColonies: 13 }
}

export const LEDGER_KEY = 'declaration1776-ledger'
export const LEDGER_CAP = 100
export const NAME_LENGTH_ERROR = 'Please enter a name of 2-24 characters.'
export const NAME_BLOCKED_ERROR = "That name isn't allowed. Please choose another."

const readLedger = (): VictoryEntry[] => {
  try {
    if (typeof window === 'undefined') return []
    const raw = window.localStorage.getItem(LEDGER_KEY)
    if (!raw) return []
    const parsed = JSON.parse(raw)
    return Array.isArray(parsed) ? parsed.filter(e => e && typeof e === 'object' && typeof e.name === 'string') : []
  } catch {
    return []
  }
}

const writeLedger = (entries: VictoryEntry[]): boolean => {
  try {
    if (typeof window === 'undefined') return false
    window.localStorage.setItem(LEDGER_KEY, JSON.stringify(entries.slice(-LEDGER_CAP)))
    return true
  } catch {
    return false
  }
}

export const DEBATE_EXTRA_DAYS = 2
export const DEBATE_COST_PER_DELEGATE = 1
export const DEBATE_GOOD_LUCK_TAVERN = 'Local Tavern provides Free Food for the Delegates'
export const DEBATE_GOOD_LUCK_FASTER = 'Event prepared faster than expected'
export const DEBATE_BAD_LUCK_LONGER = 'Political Debate longer than expected.'
export const DEBATE_BAD_LUCK_WEATHER = 'Bad weather delays the debate'

export const FAILURE_DEADLINE_LABEL = 'July 2, 1776'

const parseGameDate = (dateStr: string): Date | null => {
  const d = new Date(dateStr)
  return isNaN(d.getTime()) ? null : d
}

const defaultResources = {
  personalFunds: 100, // Committee of Five personal funds (separate from colony postal subsidies)
  maxPersonalFunds: 100
}

const defaultGameState: GameState = {
  currentDate: 'June 7, 1776',
  currentColony: 'Pennsylvania', // Starting location
  resources: defaultResources,
  delegates: initialDelegates,
  colonies: initialColonies,
  travelEvents: [],
  gameMode: 'historical',
  selectedColonyId: DEFAULT_COLONY_ID,
  selectedDelegateId: null,
  difficulty: 'easy',
  gameStatus: 'playing',
  victoryRecord: null,
  victoryName: null,
  victoryRecorded: false,
  colonySelectionCount: 0,
  debateResult: null,
  actionPopup: null
}

const MAIL_BAD_LUCK_EVENTS = [
  "Postal Rider's horse throws a shoe. Found a blacksmith.",
  "Heavy rain slows the Postal Rider's travel.",
  "Postal Rider spotted a British Patrol. Required detour.",
  "Postal Rider's horse becomes ill and needs rest.",
  "Food Spoilage. Postal Rider must restock supplies.",
  "Local gives Postal Rider incorrect directions.",
  "Postal Rider's saddle breaks and you must repair.",
  "The Postal Rider's river ferry is out of service.",
  "A thief steals some of the Postal Rider's supplies.",
  "Printing Press Delayed. Documents aren't prepared for Postal Rider.",
  "Postal Rider exhausted from Traveling."
]

const MAIL_GOOD_LUCK_EVENTS = [
  "A Patriot offers the Postal Rider a fresh horse.",
  "Beautiful weather makes traveling easy for the Postal Rider.",
  "A local shows the Postal Rider a shortcut.",
  "A Patriot offers the Postal Rider Free Lodging.",
  "A friendly ferry captain gives the Postal Rider a free ride across the river.",
  "A group of Patriot militia members escorts the Postal Rider safely along the road."
]

const MEETING_BAD_LUCK_EVENTS = [
  "Misplaced Documents. Return to find them.",
  "Delegate Is Unavailable. Return the next day.",
  "Political debate takes longer than expected",
  "You feel ill. Return the following day."
]

const MEETING_GOOD_LUCK_EVENTS = [
  "A Patriot offers you Free Lodging.",
  "A merchant donates money to support the Patriot cause.",
  "The local inn provides you and the delegate with free meals."
]

interface GameActions {
  selectColony: (colonyId: string) => void
  setSelectedDelegateId: (delegateId: string | null) => void
  sendCorrespondence: (delegateId: string, targetColony: string, approach?: ApproachChoice) => { success: boolean; cost: number; daysTravel: number; message?: string; eventMessage?: string | null; supportChange?: number }
  meetPrivately: (delegateId: string, approach?: ApproachChoice) => { success: boolean; cost: number; daysTravel: number; message?: string; eventMessage?: string | null; supportChange?: number }
  organizePublicDebate: (targetColonyName: string, angleIndex: number) => { success: boolean; cost: number; daysTravel: number; message?: string; eventMessage?: string | null }
  dismissDebateResult: () => void
  showActionPopup: (title: string, message: string, tone?: 'success' | 'error') => void
  dismissActionPopup: () => void
  setGameMode: (mode: 'historical'|'sandbox'|'educational') => void
  loadDelegateData: () => void
  resetGame: () => void
  recordVictory: (name: string) => { ok: boolean; error?: string }
  getLedger: () => VictoryEntry[]
  setDifficulty: (difficulty: Difficulty) => void
  getGreenColonyCount: () => number
  checkEndConditions: () => void
  advanceDateByDays: (days: number) => void
  getDelegateForColony: (colonyName: string) => Delegate[]
  getTravelTime: (fromColony: string, toColony: string) => number
  getDaysUntilDeadline: () => number
  triggerRandomTravelEvent: () => void
}

export const useGameStore = create<GameState & GameActions>()(
  persist(
    (set, get) => ({
      ...defaultGameState,
      
      selectColony: (colonyId) => set(state => ({
        selectedColonyId: colonyId,
        // Incremented on every map click (even when the same colony is clicked again) so the
        // delegate panel can drop an open delegate detail and show the clicked colony's list.
        colonySelectionCount: state.colonySelectionCount + 1
      })),
      
      setSelectedDelegateId: (delegateId) => set({ selectedDelegateId: delegateId }),

      resetGame: () => {
        set({
          currentDate: defaultGameState.currentDate,
          currentColony: defaultGameState.currentColony,
          resources: { ...defaultResources },
          delegates: initialDelegates.map(d => ({ ...d })),
          colonies: createColoniesMap(),
          travelEvents: [],
          gameMode: defaultGameState.gameMode,
          selectedColonyId: DEFAULT_COLONY_ID,
          selectedDelegateId: null,
          gameStatus: 'playing',
          victoryRecord: null,
          victoryName: null,
          victoryRecorded: false,
          colonySelectionCount: 0,
          debateResult: null,
          actionPopup: null
          // difficulty intentionally kept so the player can retry the same setting
        })
        // Clear the persisted save (after set, which re-writes it) so no stale save is rehydrated
        try {
          useGameStore.persist.clearStorage()
        } catch {
          if (typeof window !== 'undefined') {
            window.localStorage.removeItem('declaration1776-save')
          }
        }
      },
      
      recordVictory: (name) => {
        const trimmed = String(name ?? '').replace(/\s+/g, ' ').trim()
        if (trimmed.length < 2 || trimmed.length > 24) return { ok: false, error: NAME_LENGTH_ERROR }
        if (containsBlockedWord(trimmed)) return { ok: false, error: NAME_BLOCKED_ERROR }
        const { victoryRecord, victoryRecorded, gameStatus } = get()
        if (gameStatus !== 'victory' || !victoryRecord || victoryRecorded) return { ok: false, error: 'This victory is already recorded.' }
        writeLedger([...readLedger(), { name: trimmed, ...victoryRecord, recordedAt: new Date().toISOString() }])
        set({ victoryName: trimmed, victoryRecorded: true })
        return { ok: true }
      },

      getLedger: () => readLedger(),

      setDifficulty: (difficulty) => {
        set({ difficulty })
        get().checkEndConditions()
      },

      getGreenColonyCount: () => {
        const { delegates, colonies } = get()
        return colonies.filter(colony => {
          const cd = delegates.filter(d => d.colony === colony.name)
          if (cd.length === 0) return false
          const supporters = cd.filter(d => d.supportLevel >= 100).length
          return Math.round((supporters / cd.length) * 100) >= 51
        }).length
      },

      checkEndConditions: () => {
        const { currentDate, difficulty, gameStatus, resources } = get()
        const required = DIFFICULTY_SETTINGS[difficulty].requiredGreenColonies
        const now = parseGameDate(currentDate)
        const deadline = new Date('July 2, 1776')
        let next: 'playing' | 'failed' | 'victory'
        if (get().getGreenColonyCount() >= required) next = 'victory'
        else if (!!now && now.getTime() >= deadline.getTime()) next = 'failed'
        else next = 'playing'
        if (next === gameStatus) return
        if (next === 'victory') {
          // Snapshot of the winning run for the plaque. No funds are awarded.
          const { colonies } = get()
          set({
            gameStatus: 'victory',
            victoryName: null,
            victoryRecorded: false,
            victoryRecord: {
              date: currentDate,
              greenColonies: get().getGreenColonyCount(),
              difficultyKey: difficulty,
              difficultyLabel: DIFFICULTY_SETTINGS[difficulty].label,
              remainingSubsidies: colonies.reduce((sum, c) => sum + (c.postalSubsidies || 0), 0),
              personalFunds: resources.personalFunds
            }
          })
        } else {
          set({ gameStatus: next })
        }
      },

      loadDelegateData: () => {
        // Already loaded at startup via delegatesData import
        console.log('Delegate data loaded successfully')
      },
      
      sendCorrespondence: (delegateId, targetColony, approach) => {
        if (get().gameStatus !== 'playing') {
          return { success: false, cost: 0, daysTravel: 0, message: get().gameStatus === 'victory'
            ? 'Victory! The colonies have declared independence — restart the game to play again.'
            : 'The colonies failed to unite by July 2 — restart the game to play again.' }
        }
        const { delegates, colonies, currentColony } = get()
        const delegate = delegates.find(d => d.id === delegateId)
        
        if (!delegate) {
          return { success: false, cost: 0, daysTravel: 0 }
        }
        if (isProtectedDelegate(delegate)) {
          return { success: false, cost: 0, daysTravel: 0, message: delegate.continentalCongressPresident ? 'The Continental Congress President cannot be contacted by correspondence.' : 'Committee of Five members cannot be contacted by correspondence.' }
        }
        if (delegate.supportLevel >= 100) {
          return { success: false, cost: 0, daysTravel: 0, message: `${delegate.name} already fully supports independence — no further contact is needed.` }
        }
        
        // Check if there's a rider available in current colony
        const currentColonyData = colonies.find(c => c.name === currentColony)
        if (!currentColonyData || currentColonyData.postalRiders <= 0) {
          return { success: false, cost: 0, daysTravel: 0, message: "No postal riders available in your current location!" }
        }
        
        const travelDays = get().getTravelTime(currentColony, targetColony)
        // Mail rule: the letter must be able to arrive (minimum ride time) by the July 2 deadline.
        const daysRemaining = get().getDaysUntilDeadline()
        if (travelDays > daysRemaining) {
          return { success: false, cost: 0, daysTravel: 0, message: `The letter cannot arrive before ${FAILURE_DEADLINE_LABEL} — the ride takes ${travelDays} day(s) but only ${daysRemaining} day(s) remain.` }
        }
        let finalTravelDays = travelDays
        let eventMessage: string | null = null
        const originalDays = travelDays
        let costChange = 0
        
        // 25% bad luck, 25% good luck, 50% neither
        // One-day mail rides (e.g. same-state correspondence) get no event roll:
        // travel cannot drop below 1 day, so a good-luck event could never save anything
        // and a bad-luck event would be the only meaningful outcome.
        if (travelDays > 1) {
          const eventRoll = Math.random()
          if (eventRoll < 0.25) {
            const selectedEvent = MAIL_BAD_LUCK_EVENTS[Math.floor(Math.random() * MAIL_BAD_LUCK_EVENTS.length)]
            finalTravelDays += 1
            costChange = 1 // +$1 for mail ($1/day)
            eventMessage = `\u26A0\uFE0F Bad Luck: ${selectedEvent}\n⚠️ +1 day travel time (+$${costChange} in costs)`
          } else if (eventRoll < 0.5) {
            const selectedEvent = MAIL_GOOD_LUCK_EVENTS[Math.floor(Math.random() * MAIL_GOOD_LUCK_EVENTS.length)]
            const savedDays = Math.min(1, originalDays - 1) // Don't go below 1 day
            finalTravelDays = Math.max(1, travelDays - 1) // Don't go below 1 day
            costChange = -(savedDays * 1) // -$1/day savings for mail
            eventMessage = `\u2705 Good Luck: ${selectedEvent}\n✅ ${savedDays} day travel time saved (-$${Math.abs(costChange)} in costs)`
          }
        }
        
        const finalCost = finalTravelDays * 1 // $1 per day of travel
        
        // Calculate random support change for letter recipient (-1 to +5)
        const supportChange = rollSupportChange('mail', resolveApproachBand(delegateId, approach))
        const updatedDelegates = delegates.map(d => 
          d.id === delegateId ? { ...d, supportLevel: Math.min(100, Math.max(1, d.supportLevel + supportChange)) } : d
        )
        
        // Check if target colony has enough postal subsidies
        const targetColonyData = colonies.find(c => c.name === targetColony)
        if (!targetColonyData || targetColonyData.postalSubsidies < finalCost) {
          return { success: false, cost: 0, daysTravel: 0, message: `Insufficient postal subsidies in ${targetColony}!` }
        }
        
        // Transfer rider and deduct from colony's postal subsidies
        const currentColonyIndex = colonies.findIndex(c => c.name === currentColony)
        const targetColonyIndex = colonies.findIndex(c => c.name === targetColony)
        
        if (currentColonyIndex === -1 || targetColonyIndex === -1) {
          return { success: false, cost: 0, daysTravel: 0, message: "Invalid colony selection!" }
        }
        
        const newColonies = [...colonies]
        
        // Decrease riders from current colony (they send the mail)
        newColonies[currentColonyIndex] = {
          ...newColonies[currentColonyIndex],
          postalRiders: newColonies[currentColonyIndex].postalRiders - 1
        }
        
        // Increase riders at target colony AND deduct their subsidy costs (they pay for the service!)
        newColonies[targetColonyIndex] = {
          ...newColonies[targetColonyIndex],
          postalRiders: newColonies[targetColonyIndex].postalRiders + 1,
          postalSubsidies: Math.max(0, newColonies[targetColonyIndex].postalSubsidies - finalCost)
        }
        
        set({
          colonies: newColonies,
          delegates: updatedDelegates,
          selectedDelegateId: null
        })
        get().checkEndConditions()
        
        return {
          success: true,
          cost: finalCost,
          daysTravel: finalTravelDays,
          eventMessage,
          supportChange: supportChange
        }
      },
      
      meetPrivately: (delegateId, approach) => {
        if (get().gameStatus !== 'playing') {
          return { success: false, cost: 0, daysTravel: 0, message: get().gameStatus === 'victory'
            ? 'Victory! The colonies have declared independence — restart the game to play again.'
            : 'The colonies failed to unite by July 2 — restart the game to play again.' }
        }
        const { delegates, resources, currentDate, colonies, currentColony } = get()
        const delegate = delegates.find(d => d.id === delegateId)
        
        if (!delegate) {
          return { success: false, cost: 0, daysTravel: 0 }
        }
        if (isProtectedDelegate(delegate)) {
          return { success: false, cost: 0, daysTravel: 0, message: delegate.continentalCongressPresident ? 'The Continental Congress President cannot be met in private.' : 'Committee of Five members cannot be met in private.' }
        }
        if (delegate.supportLevel >= 100) {
          return { success: false, cost: 0, daysTravel: 0, message: `${delegate.name} already fully supports independence — no further contact is needed.` }
        }
        
        // Meeting requires traveling to delegate's colony
        const travelDays = get().getTravelTime(currentColony, delegate.colony)
        // Same deadline rule as mail: the meeting must be able to happen by July 2, 1776.
        const daysRemaining = get().getDaysUntilDeadline()
        if (travelDays > daysRemaining) {
          return { success: false, cost: 0, daysTravel: 0, message: `The meeting cannot take place before ${FAILURE_DEADLINE_LABEL} — the ride takes ${travelDays} day(s) but only ${daysRemaining} day(s) remain.` }
        }
        let finalTravelDays = travelDays
        let eventMessage: string | null = null
        
        // Track changes from original values
        const originalDays = travelDays
        let costChange = 0
        
        // 25% bad luck, 25% good luck, 50% neither
        const eventRoll = Math.random()
        if (eventRoll < 0.25) {
          // BAD LUCK EVENT (25% chance)
                    const selectedEvent = MEETING_BAD_LUCK_EVENTS[Math.floor(Math.random() * MEETING_BAD_LUCK_EVENTS.length)]
          finalTravelDays += 1
          costChange = 3 // +$3 for meetPrivately ($3/day)
          eventMessage = `\u26A0\uFE0F Bad Luck: ${selectedEvent}\n⚠️ +1 day travel time (+$${costChange} in costs)`
          console.log(eventMessage)
        } else if (eventRoll < 0.5) {
          // GOOD LUCK EVENT (25% chance)
                    const selectedEvent = MEETING_GOOD_LUCK_EVENTS[Math.floor(Math.random() * MEETING_GOOD_LUCK_EVENTS.length)]
          const savedDays = Math.min(1, originalDays - 1) // Don't go below 1 day
          finalTravelDays = Math.max(1, travelDays - 1) // Don't go below 1 day
          costChange = -(savedDays * 3) // -$3/day savings for meetPrivately
          eventMessage = `\u2705 Good Luck: ${selectedEvent}\n✅ ${savedDays} day travel time saved (-$${Math.abs(costChange)} in costs)`
          console.log(eventMessage)
        } else {
          // UNEVENTFUL TRIP (50% chance)
          eventMessage = null
        }
        
        // Calculate final cost based on actual travel days
        const finalCost = finalTravelDays * 3 // $3 per day for private meetings
        
        // Check if personal funds are sufficient
        if (resources.personalFunds < finalCost) {
          return { success: false, cost: 0, daysTravel: 0, message: "Insufficient personal funds!" }
        }
        
        // Calculate random support change (-5 to +20)
        const supportChange = rollSupportChange('meeting', resolveApproachBand(delegateId, approach))
        const newSupportLevel = Math.min(100, Math.max(1, delegate.supportLevel + supportChange))
        
        // Deduct costs from PERSONAL FUNDS (not from any colony's postal subsidies)
        const newPersonalFunds = resources.personalFunds - finalCost
        
        // Update delegate's support level
        const updatedDelegates = delegates.map(d => 
          d.id === delegateId ? { ...d, supportLevel: newSupportLevel } : d
        )
        
        set({
          resources: {
            ...resources,
            personalFunds: newPersonalFunds
          },
          delegates: updatedDelegates,
          selectedDelegateId: null,
          currentColony: delegate.colony, // UPDATE CURRENT LOCATION
          currentDate: (() => {
            const today = new Date(currentDate)
            const arrivalDate = new Date(today)
            arrivalDate.setDate(arrivalDate.getDate() + finalTravelDays)
            return arrivalDate.toLocaleDateString('en-US', { 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric' 
            })
          })(),
          colonies: colonies // Colonies remain UNCHANGED (no subsidy or rider changes)
        })
        get().checkEndConditions()
        
        return {
          success: true,
          cost: finalCost,
          daysTravel: finalTravelDays,
          eventMessage: eventMessage,
          supportChange: supportChange
        }
      },
      
      organizePublicDebate: (targetColonyName, angleIndex) => {
        if (get().gameStatus !== 'playing') {
          return { success: false, cost: 0, daysTravel: 0, message: get().gameStatus === 'victory'
            ? 'Victory! The colonies have declared independence — restart the game to play again.'
            : 'The colonies failed to unite by July 2 — restart the game to play again.' }
        }
        const { delegates, resources, currentDate, currentColony } = get()
        const targetDelegates = delegates.filter(d => d.colony === targetColonyName)
        if (targetDelegates.length === 0) {
          return { success: false, cost: 0, daysTravel: 0, message: 'There are no delegates in that state to debate.' }
        }
        const count = targetDelegates.length
        const rideDays = get().getTravelTime(currentColony, targetColonyName)
        const baseDays = rideDays + DEBATE_EXTRA_DAYS
        const daysRemaining = get().getDaysUntilDeadline()
        if (baseDays > daysRemaining) {
          return { success: false, cost: 0, daysTravel: 0, message: `The debate cannot be completed before ${FAILURE_DEADLINE_LABEL} — it takes ${baseDays} day(s) but only ${daysRemaining} day(s) remain.` }
        }
        const baseCost = count * DEBATE_COST_PER_DELEGATE
        let finalDays = baseDays
        let finalCost = baseCost
        let eventMessage: string | null = null
        const roll = Math.random()
        if (roll < 0.25) {
          // GOOD LUCK
          if (Math.random() < 0.5) {
            finalCost = 0
            eventMessage = `\u2705 Good Luck: ${DEBATE_GOOD_LUCK_TAVERN}\n\u2705 The $${baseCost} cost is refunded`
          } else {
            finalDays = baseDays - 1
            eventMessage = `\u2705 Good Luck: ${DEBATE_GOOD_LUCK_FASTER}\n\u2705 1 day saved`
          }
        } else if (roll < 0.5) {
          // BAD LUCK
          const text = Math.random() < 0.5 ? DEBATE_BAD_LUCK_LONGER : DEBATE_BAD_LUCK_WEATHER
          finalDays = baseDays + 1
          finalCost = baseCost + count * DEBATE_COST_PER_DELEGATE
          eventMessage = `\u26A0\uFE0F Bad Luck: ${text}\n\u26A0\uFE0F +1 day and +$${count * DEBATE_COST_PER_DELEGATE} in costs`
        }
        if (resources.personalFunds < finalCost) {
          return { success: false, cost: 0, daysTravel: 0, message: 'Insufficient personal funds!' }
        }
        const angleList = (debateAnglesData as Record<string, { text: string; min: number; max: number; explanation: string }[]>)[targetColonyName]
        const angle = angleList && Number.isInteger(angleIndex) && angleIndex >= 0 && angleIndex < angleList.length ? angleList[angleIndex] : null
        const rollMin = angle ? angle.min : -5
        const rollMax = angle ? angle.max : 20
        const fmt = (n: number) => (n > 0 ? `+${n}` : `${n}`)
        const changes = new Map<string, { change: number; newSupport: number }>()
        const rollDelegates = targetDelegates.filter(d => !isProtectedDelegate(d))
        const excludedProtectedMembers = targetDelegates.filter(d => isProtectedDelegate(d)).map(d => d.name)
        rollDelegates.forEach(d => {
          const roll2 = rollMin + Math.floor(Math.random() * (rollMax - rollMin + 1)) // chosen angle range (default -5..+20)
          const newSupport = Math.min(100, Math.max(1, d.supportLevel + roll2))
          changes.set(d.id, { change: newSupport - d.supportLevel, newSupport })
        })
        const arrival = new Date(currentDate)
        arrival.setDate(arrival.getDate() + finalDays)
        set({
          resources: { ...resources, personalFunds: resources.personalFunds - finalCost },
          delegates: delegates.map(d => {
            const c = changes.get(d.id)
            return c ? { ...d, supportLevel: c.newSupport } : d
          }),
          selectedDelegateId: null,
          currentColony: targetColonyName,
          currentDate: arrival.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }),
          debateResult: {
            colonyName: targetColonyName,
            eventMessage,
            angleText: angle ? angle.text : '',
            angleExplanation: angle ? angle.explanation : '',
            angleOdds: `${fmt(rollMin)} to ${fmt(rollMax)}`,
            cost: finalCost,
            daysTravel: finalDays,
            delegateResults: rollDelegates.map(d => ({ name: d.name, change: changes.get(d.id)!.change, newSupport: changes.get(d.id)!.newSupport })),
            excludedProtectedMembers
          }
        })
        get().checkEndConditions()
        return { success: true, cost: finalCost, daysTravel: finalDays, eventMessage }
      },

      dismissDebateResult: () => set({ debateResult: null }),

      showActionPopup: (title, message, tone = 'success') => set({ actionPopup: { title, message, tone } }),

      dismissActionPopup: () => set({ actionPopup: null }),

      setGameMode: (mode) => set({ gameMode: mode }),
      
      getDelegateForColony: (colonyName) => {
        const { delegates } = get()
        return delegates.filter(d => d.colony === colonyName)
      },
      
      getTravelTime: (fromColony: string, toColony: string): number => {
        const travelTimesMap: { [key: string]: { [key: string]: number } } = delegatesData.travelTimes
        const travelTimes = travelTimesMap[fromColony]
        return travelTimes?.[toColony] || 7 // Default 7 days if colony not found
      },
      
      getDaysUntilDeadline: (): number => {
        const now = parseGameDate(get().currentDate)
        const deadline = parseGameDate(FAILURE_DEADLINE_LABEL)
        if (!now || !deadline) return 0
        return Math.floor((deadline.getTime() - now.getTime()) / 86400000)
      },

      advanceDateByDays: (days) => {
        set((state) => {
          const today = new Date(state.currentDate)
          const newDate = new Date(today)
          newDate.setDate(newDate.getDate() + days)
          
          return {
            currentDate: newDate.toLocaleDateString('en-US', { 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric' 
            })
          }
        })
        get().checkEndConditions()
      },
      
      triggerRandomTravelEvent: () => {
        set((state) => {
          const randomEvent = state.travelEvents[Math.floor(Math.random() * state.travelEvents.length)]
          
          if (randomEvent && randomEvent.impactOnTravel) {
            // Apply event impact
            const { currentDate } = state
            const today = new Date(currentDate)
            const delayDays = randomEvent.impactOnTravel
            
            const newDate = new Date(today)
            newDate.setDate(newDate.getDate() + delayDays)
            
            return {
              currentDate: newDate.toLocaleDateString('en-US', { 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })
            }
          }
          
          return state
        })
      }
    }),
    {
      name: 'declaration1776-save',
      version: 6,
      migrate: (persisted: unknown) => {
        const p = (persisted ?? {}) as Record<string, any>
        if (Array.isArray(p.delegates)) {
          p.delegates = p.delegates.map((d: any) => {
            if (!d) return d
            let n = d
            if (n.id === 'ma_john_hancock') n = { ...n, committeeOfFive: false, continentalCongressPresident: true }
            return isProtectedDelegate(n) ? { ...n, supportLevel: 100 } : n
          })
        }
        delete p.victoryReward
        return p as any
      },
      partialize: (state) => ({
        currentDate: state.currentDate,
        currentColony: state.currentColony,
        resources: state.resources,
        delegates: state.delegates,
        colonies: state.colonies,
        gameMode: state.gameMode,
        selectedColonyId: state.selectedColonyId,
        selectedDelegateId: state.selectedDelegateId,
        difficulty: state.difficulty,
        gameStatus: state.gameStatus,
        victoryRecord: state.victoryRecord,
        victoryName: state.victoryName,
        victoryRecorded: state.victoryRecorded
      })
    }
  )
)
