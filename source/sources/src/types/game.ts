export interface Delegate {
  id: string
  name: string
  colony: string
  supportLevel: number
  profile: string
  overview: string
  committeeOfFive?: boolean
  continentalCongressPresident?: boolean
}

export interface Colony {
  id: string
  name: string
  supportLevel: number
  delegateIds: string[]
  // Geographic coordinates for map visualization (normalized 0-1)
  x: number
  y: number
  size: number // Relative size for button display
  // Postal system variables
  postalRiders: number // Number of postal riders currently stationed here
  postalSubsidies: number // Available funds ($) for this colony's postal operations
}

export interface ResourceLevels {
  personalFunds: number // Committee of Five personal funds (separate from colony postal subsidies)
  maxPersonalFunds: number
}

export interface TravelInfo {
  daysTravel: number
  baseDays: number
  modifiers?: {
    badWeather?: boolean
    spiesDetected?: boolean
    britishAdvancements?: boolean
  }
  totalCost?: number
}

export interface TravelEvent {
  id: string
  type: 'badWeather' | 'spies' | 'britishAdvance' | 'optimalRoute'
  title: string
  description: string
  impactOnTravel?: number // Days added/delayed
  costImpact?: number // Additional cost in dollars
}

export type Difficulty = 'easy' | 'medium' | 'hard' | 'extreme'
export type GameStatus = 'playing' | 'failed' | 'victory'

export interface GameState {
  currentDate: string
  currentColony: string
  resources: ResourceLevels
  delegates: Delegate[]
  colonies: Colony[]
  travelEvents: TravelEvent[]
  lastTravelDate?: string
  travelInProgress?: {
    destination: string
    departureDate: string
    estimatedArrival: string
    travelDays: number
  }
  gameMode: 'historical' | 'sandbox' | 'educational'
  selectedColonyId: string | null
  selectedDelegateId?: string | null
  difficulty: Difficulty
  gameStatus: GameStatus
  victoryRecord: VictoryRecord | null
  victoryName: string | null
  victoryRecorded: boolean
  // Increments on every colony click so UI can react to repeat clicks of the same colony.
  colonySelectionCount: number
  debateResult: DebateResult | null  // transient popup data, never persisted
  actionPopup: { title: string; message: string; tone: 'success' | 'error' } | null  // transient popup data, never persisted
}

export interface DebateResult {
  colonyName: string
  eventMessage: string | null
  cost: number
  daysTravel: number
  delegateResults: { name: string; change: number; newSupport: number }[]
  excludedProtectedMembers?: string[]
}

export interface VictoryRecord {
  date: string
  greenColonies: number
  difficultyKey: Difficulty
  difficultyLabel: string
  remainingSubsidies: number
  personalFunds: number
}

export interface VictoryEntry extends VictoryRecord {
  name: string
  recordedAt: string
}
