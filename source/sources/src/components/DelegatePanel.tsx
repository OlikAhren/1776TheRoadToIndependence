import React from 'react'
import { useGameStore, DEFAULT_COLONY_ID, DEBATE_EXTRA_DAYS, DEBATE_COST_PER_DELEGATE, FAILURE_DEADLINE_LABEL } from '../store/GameStore'
import colonyOverviews from '../data/colonyOverviews.json'
import debateAngles from '../data/debateAngles.json'
import delegateImages from '../data/delegateImages.json'
import type { Delegate } from '../types/game'

const DelegatePanel: React.FC = () => {
  const { delegates, resources, getDelegateForColony, sendCorrespondence, meetPrivately, selectedColonyId, currentColony, colonies, getTravelTime, getDaysUntilDeadline, colonySelectionCount, organizePublicDebate, gameStatus, showActionPopup } = useGameStore()
  const [debateMessage, setDebateMessage] = React.useState<string | null>(null)
  const [selectedDelegate, setSelectedDelegate] = React.useState<string | null>(null)
  // The colony brief starts expanded for every colony the player visits.
  const [overviewOpen, setOverviewOpen] = React.useState(true)

  // Any click on the map (including clicking the already-selected colony again) loads that
  // colony's delegate list, so an open delegate detail is dropped on every colony click.
  React.useEffect(() => {
    setSelectedDelegate(null)
    setDebateMessage(null)
  }, [colonySelectionCount])

  // Fall back to the default colony when nothing is selected (also covers older saves).
  const effectiveColonyId = selectedColonyId ?? DEFAULT_COLONY_ID

  // Get profile style based on delegate profile
  const getProfileStyle = (profile: string): string => {
    switch(profile.toLowerCase()) {
      case 'principle driven': return '#2E5A27' // Dark Green
      case 'pragmatic': return '#1C2E4A' // Navy Blue
      case 'conservative': return '#8B4513' // Brown
      case 'moderate': return '#558B2F' // Medium Green
      case 'social influencer': return '#DC143C' // Crimson
      case 'constituency first': return '#FF8C00' // Dark Orange
      default: return '#888'
    }
  }

  // Get delegates for currently selected colony (or all if none selected)
  const colonyDelegates = effectiveColonyId
    ? getDelegateForColony(colonies.find(c => c.id === effectiveColonyId)?.name || '')
    : []

  // Get current colony name for header
  const [debatePromptOpen, setDebatePromptOpen] = React.useState(false)
  const [selectedAngle, setSelectedAngle] = React.useState(0)
  const currentColonyName = colonies.find(c => c.id === effectiveColonyId)?.name || ''

  // Colony-level brief (economy, concerns, and what the colony wants from the others)
  const colonyOverview = (colonyOverviews as Record<string, string>)[currentColonyName] || ''

  // A new colony always starts with its brief expanded.
  React.useEffect(() => {
    setOverviewOpen(true)
  }, [currentColonyName])
  React.useEffect(() => { setDebatePromptOpen(false) }, [currentColonyName])

  // Organize a Public Debate availability (acts on the state shown in this panel)
  const debateBaseCost = colonyDelegates.length * DEBATE_COST_PER_DELEGATE
  const currentRideTime = currentColonyName ? getTravelTime(currentColony, currentColonyName) : 0
  const debateBaseDays = currentColonyName ? currentRideTime + DEBATE_EXTRA_DAYS : 0
  const debateDaysRemaining = getDaysUntilDeadline()
  let debateDisabledReason: string | null = null
  if (gameStatus !== 'playing') {
    debateDisabledReason = 'The game is over — restart to play again.'
  } else if (colonyDelegates.length === 0) {
    debateDisabledReason = 'There are no delegates in this state.'
  } else if (debateBaseDays > debateDaysRemaining) {
    debateDisabledReason = `The debate cannot be completed before ${FAILURE_DEADLINE_LABEL} — it takes ${debateBaseDays} day(s) but only ${debateDaysRemaining} day(s) remain.`
  } else if (resources.personalFunds < debateBaseCost) {
    debateDisabledReason = `Not enough funds: the debate costs at least $${debateBaseCost} ($${DEBATE_COST_PER_DELEGATE} per delegate).`
  }
  const angleOptions = (debateAngles as Record<string, { text: string; min: number; max: number; explanation: string }[]>)[currentColonyName] ?? []
  const handleOrganizeDebate = () => {
    setSelectedAngle(0)
    setDebatePromptOpen(true)
  }
  const confirmDebate = () => {
    setDebatePromptOpen(false)
    const result = organizePublicDebate(currentColonyName, selectedAngle)
    setDebateMessage(result.success ? null : (result.message ?? 'The debate could not be organized.'))
  }

  if (!selectedDelegate) {
    return (
      <div style={{ 
        background: '#FFF8DC',
        borderRadius: '16px',
        overflow: 'hidden',
        border: '3px solid #1A237E',
        boxShadow: '0 8px 32px rgba(0,0,0,0.15)',
        fontFamily: '"Georgia", serif',
        padding: '20px',
        height: '100%',
        boxSizing: 'border-box',
        display: 'flex',
        flexDirection: 'column'
      }}>
        <div style={{ flexShrink: 0 }}>
        {effectiveColonyId ? (
          <>
            <h2 style={{ fontSize: '20px', fontWeight: 'bold', marginBottom: '15px', textAlign: 'center', color: '#2C1B18' }}>
              {currentColonyName} Delegates
            </h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '15px' }}>
              <button
                onClick={handleOrganizeDebate}
                disabled={debateDisabledReason !== null}
                title={debateDisabledReason ?? `Organize a Public Debate in ${currentColonyName}: ride + ${DEBATE_EXTRA_DAYS} days, $${DEBATE_COST_PER_DELEGATE} per delegate`}
                aria-label={debateDisabledReason ? `Organize a Public Debate (unavailable: ${debateDisabledReason})` : 'Organize a Public Debate'}
                style={{
                  padding: '15px',
                  background: debateDisabledReason ? '#ccc' : '#1A237E',
                  color: debateDisabledReason ? '#666' : 'white',
                  border: 'none',
                  borderRadius: '8px',
                  cursor: debateDisabledReason ? 'not-allowed' : 'pointer',
                  fontWeight: 'bold',
                  fontSize: '14px',
                  textAlign: 'left',
                  position: 'relative'
                }}
              >
                🗣️ Organize a Public Debate
                <div style={{ fontSize: '10px', fontWeight: 'normal', opacity: 0.9, marginTop: '5px' }}>
                  • Requires a minimum of {debateBaseDays} day{debateBaseDays === 1 ? '' : 's'} + ${DEBATE_COST_PER_DELEGATE} per Delegate from Committee of Five Funds
                </div>
              </button>
              {debateMessage && (
                <p role="alert" style={{ fontSize: '12px', color: '#C62828', margin: '0' }}>{debateMessage}</p>
              )}
              {debatePromptOpen && (
                <div
                  role="dialog"
                  aria-modal="true"
                  aria-label="Choose a debate angle"
                  style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', backgroundColor: 'rgba(0,0,0,0.65)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}
                >
                  <div style={{ fontFamily: 'Georgia, serif', backgroundColor: '#FFF8E7', color: '#2C1B18', border: '3px solid #2C1B18', borderRadius: '10px', padding: '28px', maxWidth: '520px', width: '90%', maxHeight: '85vh', overflowY: 'auto' }}>
                    <h2 style={{ margin: '0 0 14px 0', textAlign: 'center', fontSize: '20px' }}>{currentColonyName}'s Debate:</h2>
                    <div role="radiogroup" style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                      {angleOptions.map((a, i) => (
                        <label key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '8px', cursor: 'pointer', fontSize: '14px', lineHeight: 1.4 }}>
                          <input type="radio" name="debate-angle" checked={selectedAngle === i} onChange={() => setSelectedAngle(i)} style={{ marginTop: '3px' }} />
                          <span>
                            {a.text}
                          </span>
                        </label>
                      ))}
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'center', gap: '12px', marginTop: '20px' }}>
                      <button onClick={confirmDebate} style={{ fontFamily: 'Georgia, serif', fontSize: '14px', fontWeight: 'bold', color: '#FFFFFF', backgroundColor: '#2C1B18', border: 'none', borderRadius: '6px', padding: '8px 16px', cursor: 'pointer' }}>Organize the Debate</button>
                      <button onClick={() => setDebatePromptOpen(false)} style={{ fontFamily: 'Georgia, serif', fontSize: '14px', color: '#2C1B18', backgroundColor: 'transparent', border: '2px solid #2C1B18', borderRadius: '6px', padding: '8px 16px', cursor: 'pointer' }}>Cancel</button>
                    </div>
                  </div>
                </div>
              )}
            </div>
            <p style={{ fontSize: '16px', marginBottom: '10px', textAlign: 'center', color: '#2C1B18' }}>
              <span style={{ fontWeight: 'bold' }}>Current Ride Time:</span> {currentRideTime} Day{currentRideTime === 1 ? '' : 's'}
            </p>
            <p style={{ fontSize: '12px', opacity: 0.7, marginBottom: '15px', textAlign: 'center', color: '#666' }}>
              Click a delegate from {currentColonyName}
            </p>
            {colonyOverview && (
              <div style={{ marginBottom: '15px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                  <span style={{ fontSize: '13px', fontWeight: 'bold', color: '#2C1B18' }}>About {currentColonyName}</span>
                  <button
                    onClick={() => setOverviewOpen(open => !open)}
                    aria-expanded={overviewOpen}
                    aria-label={overviewOpen ? `Collapse the brief for ${currentColonyName}` : `Expand the brief for ${currentColonyName}`}
                    style={{
                      fontFamily: 'Georgia, serif',
                      fontSize: '11px',
                      fontWeight: 'bold',
                      color: '#2C1B18',
                      backgroundColor: 'transparent',
                      border: '1px solid #2C1B18',
                      borderRadius: '4px',
                      padding: '2px 10px',
                      cursor: 'pointer'
                    }}
                  >
                    {overviewOpen ? 'Collapse' : 'Expand'}
                  </button>
                </div>
                {overviewOpen && (
                  <p style={{ fontSize: '12px', lineHeight: 1.6, opacity: 0.9, margin: '0', textAlign: 'left' }}>
                    {colonyOverview}
                  </p>
                )}
              </div>
            )}
          </>
        ) : (
          <>
            <h2 style={{ fontSize: '20px', fontWeight: 'bold', marginBottom: '6px', textAlign: 'center', color: '#2C1B18' }}>
              Please select a colony from the map to view its delegates.
            </h2>
          </>
        )}
        </div>

        <div style={{ 
          flex: 1,
          minHeight: 0,
          overflowY: 'auto',
          display: 'flex',
          flexDirection: 'column'
        }}>
          {colonyDelegates.map((delegate: Delegate) => (
            <div
              key={delegate.id}
              onClick={() => setSelectedDelegate(delegate.id)}
              style={{
                padding: '15px',
                background: selectedDelegate === delegate.id ? '#D4AF37' : '#fff',
                borderLeft: `4px solid ${getProfileStyle(delegate.profile)}`,
                marginBottom: '10px',
                borderRadius: '5px',
                cursor: 'pointer',
                transition: 'all 0.2s ease'
              }}
              onMouseEnter={(e) => e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.1)'}
              onMouseLeave={(e) => e.currentTarget.style.boxShadow = 'none'}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div style={{ fontWeight: 'bold', fontSize: '14px' }}>{delegate.name}</div>
                {(delegate.committeeOfFive || delegate.continentalCongressPresident) && (
                  <div style={{
                    background: '#D4AF37',
                    color: '#2C1B18',
                    padding: '2px 8px',
                    borderRadius: '12px',
                    fontSize: '9px',
                    fontWeight: 'bold',
                    boxShadow: '0 1px 3px rgba(0,0,0,0.2)'
                  }}>
                    {delegate.continentalCongressPresident ? '★ Continental Congress President' : '★ Committee of Five'}
                  </div>
                )}
              </div>
              <div style={{ fontSize: '12px', opacity: 0.7 }}>{delegate.colony}</div>
              <div style={{ display: 'flex', gap: '15px', marginTop: '8px', fontSize: '11px' }}>
                <span style={{ color: getProfileStyle(delegate.profile), fontWeight: 'bold' }}>
                  {delegate.profile.replace(' ', '-')}
                </span>
                <span>Support: {delegate.supportLevel}%</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  // Show individual delegate detail view
  const delegate = delegates.find(d => d.id === selectedDelegate)
  if (!delegate) return null

  const isPresident = delegate.continentalCongressPresident || false
  const isCommitteeOfFive = !!(delegate.committeeOfFive || isPresident)

  // Portrait from Wikipedia / Wikimedia Commons (absent for a few delegates)
  const portrait = (delegateImages as Record<string, { file: string; page?: string; title?: string }>)[delegate.id]

  // A delegate who already fully supports independence needs no further contact.
  const fullySupportive = delegate.supportLevel >= 100

  // Deadline rule: a private meeting must be able to happen before July 2, 1776.
  const meetingTravelDays = getTravelTime(currentColony, delegate.colony)
  const meetingDaysRemaining = getDaysUntilDeadline()
  const canMeetByDeadline = meetingTravelDays <= meetingDaysRemaining
  const meetBlocked = isCommitteeOfFive || fullySupportive
  const meetEnabled = !meetBlocked && resources.personalFunds >= 3 && canMeetByDeadline
  const meetTitle = isCommitteeOfFive
    ? (isPresident ? 'The Continental Congress President cannot be met in private.' : 'Committee of Five members cannot be met in private.')
    : fullySupportive
    ? `${delegate.name} already fully supports independence — no further contact is needed.`
    : !canMeetByDeadline
    ? `Cannot meet: the meeting would happen after July 2, 1776 (${meetingTravelDays} day ride, ${meetingDaysRemaining} days left)`
    : 'Meet this delegate in private'

  return (
      <div className="delegate-detail" style={{ 
        background: '#FFF8DC',
        borderRadius: '16px',
        overflow: 'hidden',
        border: '3px solid #1A237E',
        boxShadow: '0 8px 32px rgba(0,0,0,0.15)',
        fontFamily: '"Georgia", serif',
        padding: '20px',
        height: '100%',
        boxSizing: 'border-box',
        display: 'flex',
        flexDirection: 'column'
      }}>
      <button
        onClick={() => setSelectedDelegate(null)}
        style={{
          background: 'none',
          border: 'none',
          color: '#2C1B18',
          cursor: 'pointer',
          fontSize: '13px',
          marginBottom: '15px',
          textAlign: 'left',
          padding: 0,
          fontWeight: 'bold',
          flexShrink: 0,
          alignSelf: 'flex-start'
        }}
      >
        ← Back to delegates
      </button>

      <div style={{ flex: 1, minHeight: 0, overflowY: 'auto' }}>

      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>
        <h2 style={{ margin: 0 }}>{delegate.name}</h2>
        {isCommitteeOfFive && (
          <div style={{
            background: '#D4AF37',
            color: '#2C1B18',
            padding: '3px 10px',
            borderRadius: '12px',
            fontSize: '11px',
            fontWeight: 'bold',
            boxShadow: '0 1px 3px rgba(0,0,0,0.2)'
          }}>
            {isPresident ? '★ Continental Congress President' : '★ Committee of Five Member'}
          </div>
        )}
      </div>

      <p style={{ opacity: 0.7, marginBottom: '20px', fontSize: '13px' }}>{delegate.colony} Delegate</p>

      {/* Portrait */}
      <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '20px' }}>
        {portrait ? (
          <img
            src={`${import.meta.env.BASE_URL}${portrait.file}`}
            alt={`Portrait of ${delegate.name}`}
            title={portrait.title ? `Portrait from Wikipedia: ${portrait.title}` : `Portrait of ${delegate.name}`}
            style={{
              maxHeight: '200px',
              maxWidth: '100%',
              objectFit: 'contain',
              border: '3px solid #8B6914',
              borderRadius: '6px',
              backgroundColor: '#F5E6B8',
              boxShadow: '0 3px 10px rgba(0,0,0,0.25)'
            }}
          />
        ) : (
          <div
            aria-label={`No portrait available for ${delegate.name}`}
            style={{
              width: '130px', height: '170px', display: 'flex', alignItems: 'center', justifyContent: 'center',
              border: '3px solid #8B6914', borderRadius: '6px', backgroundColor: '#F5E6B8',
              fontSize: '38px', fontWeight: 'bold', color: '#8B6914'
            }}
          >
            {delegate.name.split(' ').map(p => p[0]).slice(0, 2).join('')}
          </div>
        )}
      </div>

      {/* Support Level Meter */}
      <div style={{ marginBottom: '20px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px', fontSize: '12px' }}>
          <span>Support for Independence</span>
          <span style={{ fontWeight: 'bold', color: getProfileStyle(delegate.profile) }}>{delegate.supportLevel}%</span>
        </div>
        <div style={{
          height: '12px',
          background: '#ddd',
          borderRadius: '6px',
          overflow: 'hidden'
        }}>
          <div style={{
            width: `${delegate.supportLevel}%`,
            height: '100%',
            background: delegate.supportLevel >= 80 ? '#2E5A27' : delegate.supportLevel >= 60 ? '#558B2F' : delegate.supportLevel >= 40 ? '#D4AF37' : '#8B2C2C',
            transition: 'width 0.3s ease',
            borderRadius: '6px'
          }} />
        </div>
      </div>

      {/* Profile */}
      <div style={{ marginBottom: '20px' }}>
        <div style={{ fontSize: '13px', fontWeight: 'bold', marginBottom: '5px' }}>Profile: {delegate.profile}</div>
        <div style={{ fontSize: '12px', opacity: 0.9, lineHeight: '1.5' }}>
          {delegate.overview}
        </div>
      </div>

      {/* Action Buttons - Mail Correspondence & Meet Privately */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        {/* Mail Correspondence Button */}
        {(() => {
          // Check if current location has a postal rider available
          const currentLocationHasRider = colonies.some(c => c.name === currentColony && c.postalRiders > 0)

          // Get the delegate's colony data
          const targetColony = colonies.find(c => c.name === delegate.colony)
          // Mail costs $1 per travel day. A bad-luck event can add one extra day, but only for
          // trips longer than a single day (one-day mail rides never roll an event).
          const mailTravelDays = getTravelTime(currentColony, delegate.colony)
          const maxMailCost = mailTravelDays + (mailTravelDays > 1 ? 1 : 0)
          const hasSufficientSubsidy = targetColony && targetColony.postalSubsidies >= maxMailCost

          const daysRemaining = getDaysUntilDeadline()
          const canArriveByDeadline = mailTravelDays <= daysRemaining

          const isButtonEnabled = !isCommitteeOfFive && !fullySupportive && currentLocationHasRider && hasSufficientSubsidy && canArriveByDeadline
          const mailTitle = isCommitteeOfFive
            ? (isPresident ? 'The Continental Congress President cannot be contacted by correspondence.' : 'Committee of Five members cannot be contacted by correspondence.')
            : fullySupportive
            ? `${delegate.name} already fully supports independence — no further contact is needed.`
            : !canArriveByDeadline
            ? `Cannot mail: the letter would arrive after July 2, 1776 (${mailTravelDays} day ride, ${daysRemaining} days left)`
            : 'Send a letter by Postal Rider'

          return (
            <button
              onClick={async () => {
                const result = sendCorrespondence(delegate.id, delegate.colony)
                if (!result.success) {
                  showActionPopup("Letter not sent", result.message || "Cannot send correspondence.", 'error')
                } else {
                  const sign = (result.supportChange ?? 0) >= 0 ? '+' : ''
                  const supportIcon = (result.supportChange ?? 0) > 0 ? ' ✅' : ((result.supportChange ?? 0) < 0 ? ' ⚠️' : '')
                  const mailEvent = result.eventMessage?.trim()
                    ? result.eventMessage.split('\n').filter(l => l.trim()).join('\n') + '\n\n'
                    : ''
                  showActionPopup(`Letter sent to ${delegate.name}`, `✓ Letter sent to ${delegate.name}!\n` + mailEvent + (mailEvent ? '' : '\n') +
                        `Support for Independence: ${sign}${result.supportChange ?? 0}%${supportIcon}\n\n` + 
                        `Final Cost: $${result.cost}\n` + 
                        `Estimated delivery time: ${result.daysTravel} day(s)`, 'success')
                }
              }}
              disabled={isCommitteeOfFive}
              title={mailTitle}
              aria-label={mailTitle}
              style={{
                padding: '15px',
                background: isButtonEnabled ? '#2E5A27' : '#ccc',
                color: isButtonEnabled ? 'white' : '#666',
                border: 'none',
                borderRadius: '8px',
                cursor: isButtonEnabled ? 'pointer' : 'not-allowed',
                fontWeight: 'bold',
                fontSize: '14px',
                textAlign: 'left',
                position: 'relative'
              }}
            >
              📧 Mail Correspondence
              <div style={{ fontSize: '10px', fontWeight: 'normal', opacity: 0.9, marginTop: '5px' }}>
                • Target colony pays postage ({delegate.colony}'s subsidies) • Requires rider at current location • Required Ride Time: {mailTravelDays} Day{mailTravelDays === 1 ? '' : 's'}
              </div>
            </button>
          )
        })()}

        {/* Meet Privately Button */}
        <button
          disabled={meetBlocked}
          title={meetTitle}
          aria-label={meetTitle}
          onClick={async () => {
            const result = meetPrivately(delegate.id)
            if (!result.success) {
              showActionPopup('Meeting not possible', result.message || `Insufficient personal funds! You need $${result.cost || 3} to meet privately.`, 'error')
            } else {
              let message = `✓ Met with ${delegate.name} successfully!\n`
              if (result.eventMessage && result.eventMessage.trim() !== "") {
                // Split the message into lines for proper display
                const lines = result.eventMessage.split('\n')
                lines.forEach((line) => {
                  if (line.trim()) {
                    message += `${line}\n`
                  }
                })
                message += `\n`
              } else {
                message += `Travel completed\n\n`
              }
              const sign = (result.supportChange ?? 0) >= 0 ? '+' : ''
              const supportIcon = (result.supportChange ?? 0) > 0 ? ' ✅' : ((result.supportChange ?? 0) < 0 ? ' ⚠️' : '')
              message += `Support for Independence: ${sign}${result.supportChange ?? 0}%${supportIcon}\n\n`
              message += `Final Cost: $${result.cost}\n`
              message += `Final Travel Time: ${result.daysTravel} day(s)`
              showActionPopup(`Met with ${delegate.name}`, message, 'success')
            }
          }}
          style={{
            padding: '15px',
            background: meetEnabled ? '#D4AF37' : '#ccc',
            color: meetEnabled ? '#2C1B18' : '#666',
            border: 'none',
            borderRadius: '8px',
            cursor: meetEnabled ? 'pointer' : 'not-allowed',
            fontWeight: 'bold',
            fontSize: '14px',
            textAlign: 'left',
            position: 'relative'
          }}
        >
          👔 Meet in Private
          <div style={{ fontSize: '10px', fontWeight: 'normal', opacity: 0.9, marginTop: '5px' }}>
            • Deducts from Committee of Five Funds ($3/day) • Required Ride Time: {meetingTravelDays} Day{meetingTravelDays === 1 ? '' : 's'} • Updates current location
          </div>
        </button>
      </div>
      </div>
    </div>
  )
}

export default DelegatePanel
