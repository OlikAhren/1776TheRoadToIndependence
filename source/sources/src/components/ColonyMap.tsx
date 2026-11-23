import React, { useState } from 'react'
import { useGameStore } from '../store/GameStore'
import type { Colony } from '../types/game'

// Single source of truth for the map panel height (the delegate panel matches it).
export const COLONY_MAP_HEIGHT = 1000

const ColonyMap: React.FC = () => {
  const { colonies, selectedColonyId, selectColony, delegates } = useGameStore()
  const [hoveredColony, setHoveredColony] = useState<string | null>(null)
  
  // Calculate colony voting status (fraction of delegates at 100% support)
  const getColonyVotingStatus = (colonyName: string): { percentage: number; status: 'red' | 'orange' | 'green'; hundredPercentDelegates: number; totalDelegates: number } => {
    if (!delegates || delegates.length === 0) return { percentage: 0, status: 'red', hundredPercentDelegates: 0, totalDelegates: 0 }
    const colonyDelegates = delegates.filter(d => d.colony === colonyName)
    if (colonyDelegates.length === 0) return { percentage: 0, status: 'red', hundredPercentDelegates: 0, totalDelegates: 0 }
    
    // Count delegates with 100% support
    const hundredPercentDelegates = colonyDelegates.filter(d => d.supportLevel >= 100).length
    const totalDelegates = colonyDelegates.length
    const percentage = Math.round((hundredPercentDelegates / totalDelegates) * 100)
    
    // Determine status based on percentage
    let status: 'red' | 'orange' | 'green' = 'red'
    if (percentage >= 51) {
      status = 'green'
    } else if (percentage >= 25) {
      status = 'orange'
    }
    
    return { percentage, status, hundredPercentDelegates, totalDelegates }
  }
  
  // Get colony voting color based on voting status
  const getColonyVotingColor = (colonyName: string): string => {
    const { status } = getColonyVotingStatus(colonyName)
    switch(status) {
      case 'green': return '#2E7D32'
      case 'orange': return '#FA8010'
      case 'red': return '#EF5350'
      default: return '#EF5350'
    }
  }

  // Sort colonies alphabetically
  const sortedColonies = [...colonies].sort((a, b) => a.name.localeCompare(b.name))

  return (
    <div className="colony-map" style={{ 
      position: 'relative', 
      width: '100%', 
      height: `${COLONY_MAP_HEIGHT}px`,
      background: '#FFF8DC',
      borderRadius: '16px',
      overflow: 'hidden',
      border: '3px solid #1A237E',
      boxShadow: '0 8px 32px rgba(0,0,0,0.15)',
      fontFamily: '"Georgia", serif',
      padding: '30px 20px 80px 20px'
    }}>
      
      {/* Map Title - centered at top */}
      <div style={{
        textAlign: 'center',
        marginBottom: '12px'
      }}>
        <h2 style={{ margin: 0, fontSize: '26px', fontWeight: 'bold', color: '#2C1B18' }}>
          🗺️ The Thirteen Colonies - 1776
        </h2>
      </div>

      {/* Grid of colony info boxes - takes up remaining space */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(4, 1fr)',
        gridTemplateRows: 'repeat(5, 1fr)', // Increased from 4 to 5 to fit all fields
        gap: '14px',
        height: 'calc(100% - 60px)'
      }}>
        {sortedColonies.map((colony: Colony) => {
          const isSelected = selectedColonyId === colony.id
          const isHovered = hoveredColony === colony.id
          const { hundredPercentDelegates, totalDelegates } = getColonyVotingStatus(colony.name)
          const bgColor = getColonyVotingColor(colony.name)
          
          const mouseEnter = () => setHoveredColony(colony.id)
          const mouseLeave = () => setHoveredColony(null)
          const handleClick = () => selectColony(colony.id)
          
          return (
            <div
              key={colony.id}
              onClick={handleClick}
              onMouseEnter={mouseEnter}
              onMouseLeave={mouseLeave}
              style={{
                cursor: 'pointer',
                background: bgColor,
                borderRadius: '12px',
                padding: '9px',
                boxShadow: isSelected 
                  ? `0 0 16px ${bgColor}, 0 6px 18px rgba(0,0,0,0.3)`
                  : `0 4px 10px rgba(0,0,0,0.2)`,
                border: `2px solid ${isSelected ? '#FFD700' : '#2C1B18'}`,
                display: 'flex',
                flexDirection: 'column',
                gap: '8px',
                transition: 'all 0.3s ease',
                transform: (isHovered || isSelected) ? 'translateY(-3px)' : 'translateY(0)',
                zIndex: (isHovered || isSelected) ? 5 : 1
              }}
            >
              {/* Colony name header */}
              <div style={{ borderBottom: '2px solid rgba(0,0,0,0.15)', paddingBottom: '5px', flexShrink: 0 }}>
                <h3 style={{ margin: 0, fontSize: '15px', fontWeight: 'bold', color: '#2C1B18' }}>
                  {colony.name}
                </h3>
              </div>
              
              {/* Delegate count */}
              <div style={{ flexShrink: 0 }}>
                <span style={{ fontSize: '12px', fontWeight: 'bold', color: '#2C1B18' }}>
                  👥 {colony.delegateIds.length} Delegates
                </span>
              </div>
              
              {/* Support level - shows fraction of delegates at 100% */}
              <div style={{ flexShrink: 0 }}>
                <span style={{ fontSize: '12px', fontWeight: 'bold', color: '#2C1B18' }}>
                  📊 Support: {hundredPercentDelegates}/{totalDelegates}
                </span>
              </div>
              
              {/* Postal Subsidies */}
              <div style={{ flexShrink: 0 }}>
                <span style={{ fontSize: '12px', fontWeight: 'bold', color: '#2C1B18' }}>
                  💰 Subsidy: ${colony.postalSubsidies}
                </span>
              </div>
              
              {/* Postal Riders */}
              <div style={{ flexShrink: 0 }}>
                <span style={{ fontSize: '12px', fontWeight: 'bold', color: '#2C1B18' }}>
                  🐎 Riders: {colony.postalRiders}
                </span>
              </div>
              
              {/* Spacer to push click hint to bottom */}
              <div style={{ flex: 1 }} />
              
              {/* Click hint */}
              <div style={{
                fontSize: '9px',
                color: '#444',
                fontStyle: 'italic',
                marginTop: 'auto',
                borderTop: '1px dashed rgba(0,0,0,0.15)',
                paddingTop: '5px',
                textAlign: 'center',
                flexShrink: 0
              }}>
                Click to view details
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default ColonyMap