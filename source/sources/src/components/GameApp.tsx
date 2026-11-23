import React from 'react'
import ColonyMap, { COLONY_MAP_HEIGHT } from './ColonyMap'
import DelegatePanel from './DelegatePanel'
import ResourceHUD from './ResourceHUD'
import Timeline from './Timeline'
import { useGameStore, DIFFICULTY_ORDER, DIFFICULTY_SETTINGS, FAILURE_DEADLINE_LABEL } from '../store/GameStore'

const GameApp: React.FC = () => {
  const resetGame = useGameStore(state => state.resetGame)
  const [restartPending, setRestartPending] = React.useState(false)
  const difficulty = useGameStore(state => state.difficulty)
  const gameStatus = useGameStore(state => state.gameStatus)
  const setDifficulty = useGameStore(state => state.setDifficulty)
  const debateResult = useGameStore(state => state.debateResult)
  const dismissDebateResult = useGameStore(state => state.dismissDebateResult)
  const actionPopup = useGameStore(state => state.actionPopup)
  const dismissActionPopup = useGameStore(state => state.dismissActionPopup)
  const victoryReward = useGameStore(state => state.victoryReward)
  const delegates = useGameStore(state => state.delegates)
  const colonies = useGameStore(state => state.colonies)
  // Derived value: use stable selectors plus useMemo. A selector that returns a new array on
  // every call breaks React's useSyncExternalStore snapshot caching (zustand v5) and can spin.
  const greenCount = React.useMemo(() => colonies.filter(colony => {
    const cd = delegates.filter(d => d.colony === colony.name)
    if (cd.length === 0) return false
    return Math.round((cd.filter(d => d.supportLevel >= 100).length / cd.length) * 100) >= 51
  }).length, [colonies, delegates])

  const cycleDifficulty = (step: number) => {
    const i = DIFFICULTY_ORDER.indexOf(difficulty)
    const n = DIFFICULTY_ORDER.length
    setDifficulty(DIFFICULTY_ORDER[(i + step + n) % n])
  }

  const arrowStyle: React.CSSProperties = {
    fontFamily: 'Georgia, serif',
    fontSize: '12px',
    color: '#FFFFFF',
    backgroundColor: '#2C1B18',
    border: 'none',
    borderRadius: '4px',
    padding: '3px 8px',
    cursor: 'pointer'
  }

  const currentDate = useGameStore(state => state.currentDate)

  const handleFailureRestart = () => {
    resetGame()
    window.location.reload()
  }

  const handleRestart = () => {
    setRestartPending(true)
  }

  const confirmRestart = () => {
    resetGame()
    window.location.reload()
  }

  return (
    <div style={{ fontFamily: 'Georgia, serif', maxWidth: '1200px', margin: '0 auto', padding: '20px' }}>
      {/* Header */}
      <header style={{ display: 'flex', alignItems: 'flex-start', marginBottom: '30px' }}>
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: '6px', color: '#2C1B18', fontSize: '13px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontWeight: 'bold' }}>Difficulty Setting</span>
            <span
              title="Difficulty tier"
              aria-label={`Difficulty tier: ${DIFFICULTY_SETTINGS[difficulty].tier}`}
              style={{
                display: 'inline-block',
                minWidth: '76px',
                textAlign: 'center',
                fontWeight: 'bold',
                color: '#2C1B18',
                backgroundColor: '#FFF8DC',
                border: '2px solid #2C1B18',
                borderRadius: '4px',
                padding: '1px 8px'
              }}
            >
              {DIFFICULTY_SETTINGS[difficulty].tier}
            </span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <button onClick={() => cycleDifficulty(-1)} aria-label="Previous difficulty" title="Previous difficulty" style={arrowStyle}>◀</button>
            <span style={{ minWidth: '140px', textAlign: 'center' }}>{DIFFICULTY_SETTINGS[difficulty].label}</span>
            <button onClick={() => cycleDifficulty(1)} aria-label="Next difficulty" title="Next difficulty" style={arrowStyle}>▶</button>
          </div>
        </div>
        <div style={{ textAlign: 'center' }}>
          <h1 style={{ fontSize: '28px', fontWeight: 'bold', color: '#2C1B18', margin: '0' }}>1776: The Road To Independence</h1>
          <p style={{ fontSize: '14px', opacity: 0.7, marginTop: '5px' }}>Manage colonial support through strategic correspondence and private meetings</p>
        </div>
        <div style={{ flex: 1, display: 'flex', justifyContent: 'flex-end' }}>
          <button
            onClick={handleRestart}
            title="Restart Game: resets all progress"
            aria-label="Restart Game - resets all progress"
            style={{
              fontFamily: 'Georgia, serif',
              fontSize: '14px',
              fontWeight: 'bold',
              color: '#FFFFFF',
              backgroundColor: '#2C1B18',
              border: 'none',
              borderRadius: '6px',
              padding: '8px 16px',
              cursor: 'pointer'
            }}
          >
            Restart Game
          </button>
        </div>
      </header>

      {/* Timeline Bar */}
      <Timeline />

      {/* Resource HUD */}
      <ResourceHUD />

      {/* Main Game Area */}
      <main style={{ display: 'flex', gap: '20px', flexWrap: 'wrap' }}>
        <div style={{ flex: '2', minWidth: '500px' }}>
          <ColonyMap />
        </div>
        <div style={{ flex: '1', minWidth: '300px', height: `${COLONY_MAP_HEIGHT}px`, overflow: 'hidden' }}>
          <DelegatePanel />
        </div>
      </main>

      {gameStatus === 'failed' && (
        <div
          role="dialog"
          aria-modal="true"
          style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', backgroundColor: 'rgba(0,0,0,0.65)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}
        >
          <div style={{ fontFamily: 'Georgia, serif', backgroundColor: '#FFF8E7', color: '#2C1B18', border: '3px solid #2C1B18', borderRadius: '10px', padding: '28px', maxWidth: '480px', textAlign: 'center' }}>
            <h2 style={{ margin: '0 0 12px 0' }}>Failure</h2>
            <p style={{ fontSize: '16px', lineHeight: 1.5 }}>
              Failure: The colonies were not united in time. {greenCount} of 13 colonies were green by {FAILURE_DEADLINE_LABEL}. {DIFFICULTY_SETTINGS[difficulty].label} required {DIFFICULTY_SETTINGS[difficulty].requiredGreenColonies}.
            </p>
            <p style={{ fontSize: '16px', fontWeight: 'bold' }}>You must restart the game to continue.</p>
            <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', marginTop: '16px' }}>
              <button onClick={handleFailureRestart} style={{ fontFamily: 'Georgia, serif', fontSize: '14px', fontWeight: 'bold', color: '#FFFFFF', backgroundColor: '#2C1B18', border: 'none', borderRadius: '6px', padding: '8px 16px', cursor: 'pointer' }}>Restart Game</button>
            </div>
          </div>
        </div>
      )}

      {gameStatus === 'victory' && (
        <div
          role="dialog"
          aria-modal="true"
          style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', backgroundColor: 'rgba(0,0,0,0.65)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}
        >
          <div style={{ fontFamily: 'Georgia, serif', backgroundColor: '#FFF8E7', color: '#2C1B18', border: '3px solid #D4AF37', borderRadius: '10px', padding: '28px', maxWidth: '480px', textAlign: 'center' }}>
            <h2 style={{ margin: '0 0 12px 0', color: '#B8860B' }}>Victory!</h2>
            <p style={{ fontSize: '16px', lineHeight: 1.5 }}>
              Victory! {greenCount} of 13 colonies are green as of {currentDate}. The Declaration is signed! Reward: +${victoryReward} in Committee of Five funds.
            </p>
            <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', marginTop: '16px' }}>
              <button onClick={handleFailureRestart} style={{ fontFamily: 'Georgia, serif', fontSize: '14px', fontWeight: 'bold', color: '#FFFFFF', backgroundColor: '#2C1B18', border: 'none', borderRadius: '6px', padding: '8px 16px', cursor: 'pointer' }}>Restart Game</button>
            </div>
          </div>
        </div>
      )}

      {debateResult && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Public Debate Results"
          style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', backgroundColor: 'rgba(0,0,0,0.65)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}
        >
          <div style={{ fontFamily: 'Georgia, serif', backgroundColor: '#FFF8E7', color: '#2C1B18', border: '3px solid #2C1B18', borderRadius: '10px', padding: '28px', maxWidth: '480px', width: '90%', maxHeight: '85vh', overflowY: 'auto' }}>
            <h2 style={{ margin: '0 0 12px 0', textAlign: 'center' }}>Public Debate in {debateResult.colonyName}</h2>
            <p style={{ fontSize: '15px', lineHeight: 1.5, whiteSpace: 'pre-line', textAlign: 'center' }}>
              {debateResult.eventMessage ?? 'The debate proceeded without incident.'}
            </p>
            <p style={{ fontSize: '13px', textAlign: 'center', opacity: 0.8 }}>
              {debateResult.daysTravel} day(s) elapsed · ${debateResult.cost} spent
            </p>
            <div style={{ marginTop: '12px' }}>
              {debateResult.delegateResults.map((r, i) => (
                <div key={i} style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0', borderBottom: '1px solid rgba(44,27,24,0.15)', fontSize: '15px' }}>
                  <span>{r.name}</span>
                  <span style={{ fontWeight: 'bold', color: r.change > 0 ? '#2E7D32' : r.change < 0 ? '#EF5350' : '#2C1B18' }}>
                    {r.change > 0 ? `+${r.change}` : r.change} (now {r.newSupport})
                  </span>
                </div>
              ))}
            </div>
            {debateResult.excludedProtectedMembers && debateResult.excludedProtectedMembers.length > 0 && (
              <p style={{ fontSize: '13px', textAlign: 'center', fontStyle: 'italic', marginTop: '10px' }}>
                Committee of Five and Continental Congress President members maintain their full support: {debateResult.excludedProtectedMembers.join(', ')}.
              </p>
            )}
            <div style={{ display: 'flex', justifyContent: 'center', marginTop: '16px' }}>
              <button onClick={dismissDebateResult} style={{ fontFamily: 'Georgia, serif', fontSize: '14px', fontWeight: 'bold', color: '#FFFFFF', backgroundColor: '#2C1B18', border: 'none', borderRadius: '6px', padding: '8px 16px', cursor: 'pointer' }}>Close</button>
            </div>
          </div>
        </div>
      )}

      {restartPending && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Restart Game"
          style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', backgroundColor: 'rgba(0,0,0,0.65)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}
        >
          <div style={{ fontFamily: 'Georgia, serif', backgroundColor: '#FFF8E7', color: '#2C1B18', border: '3px solid #2C1B18', borderRadius: '10px', padding: '28px', maxWidth: '480px', width: '90%', maxHeight: '85vh', overflowY: 'auto' }}>
            <h2 style={{ margin: '0 0 12px 0', textAlign: 'center' }}>Restart Game?</h2>
            <p style={{ fontSize: '15px', lineHeight: 1.5, whiteSpace: 'pre-line', textAlign: 'center' }}>
              Restarting resets ALL progress and cannot be undone.
            </p>
            <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', marginTop: '16px' }}>
              <button onClick={confirmRestart} style={{ fontFamily: 'Georgia, serif', fontSize: '14px', fontWeight: 'bold', color: '#FFFFFF', backgroundColor: '#2C1B18', border: 'none', borderRadius: '6px', padding: '8px 16px', cursor: 'pointer' }}>Restart Game</button>
              <button onClick={() => setRestartPending(false)} style={{ fontFamily: 'Georgia, serif', fontSize: '14px', color: '#2C1B18', backgroundColor: 'transparent', border: '2px solid #2C1B18', borderRadius: '6px', padding: '8px 16px', cursor: 'pointer' }}>Cancel</button>
            </div>
          </div>
        </div>
      )}

      {actionPopup && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={actionPopup.title}
          style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', backgroundColor: 'rgba(0,0,0,0.65)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}
        >
          <div style={{ fontFamily: 'Georgia, serif', backgroundColor: '#FFF8E7', color: '#2C1B18', border: '3px solid #2C1B18', borderRadius: '10px', padding: '28px', maxWidth: '480px', width: '90%', maxHeight: '85vh', overflowY: 'auto' }}>
            <h2 style={{ margin: '0 0 12px 0', textAlign: 'center', color: actionPopup.tone === 'error' ? '#B71C1C' : '#2C1B18' }}>{actionPopup.title}</h2>
            <p style={{ fontSize: '15px', lineHeight: 1.5, whiteSpace: 'pre-line', textAlign: 'center' }}>
              {actionPopup.message}
            </p>
            <div style={{ display: 'flex', justifyContent: 'center', marginTop: '16px' }}>
              <button onClick={dismissActionPopup} style={{ fontFamily: 'Georgia, serif', fontSize: '14px', fontWeight: 'bold', color: '#FFFFFF', backgroundColor: '#2C1B18', border: 'none', borderRadius: '6px', padding: '8px 16px', cursor: 'pointer' }}>Close</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default GameApp
