import React from 'react'
import { useGameStore } from '../store/GameStore'

const ResourceHUD: React.FC = () => {
  const { resources, currentColony, delegates } = useGameStore()
  
  // Calculate colonies with simple majority (50%+ delegates at 100% support)
  const getColoniesWithSimpleMajority = (): number => {
    if (!delegates || delegates.length === 0) return 0
    
    let coloniesWithMajority = 0
    const colonyNames = Array.from(new Set(delegates.map(d => d.colony)))
    
    for (const colonyName of colonyNames) {
      const colonyDelegates = delegates.filter(d => d.colony === colonyName)
      if (colonyDelegates.length === 0) continue
      
      const hundredPercentDelegates = colonyDelegates.filter(d => d.supportLevel >= 100).length
      
      if (hundredPercentDelegates > colonyDelegates.length / 2) {
        coloniesWithMajority++
      }
    }
    
    return coloniesWithMajority
  }
  
  const coloniesWithMajority = getColoniesWithSimpleMajority()
  const overallSupportStatus = coloniesWithMajority >= 9 ? 'green' : coloniesWithMajority >= 5 ? 'orange' : 'red'
  
  

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: '15px 0 0 0',
      borderTop: '1px solid rgba(44,27,24,0.2)',
      gap: '20px',
      flexWrap: 'wrap'
    }}>
      {/* Current Location */}
      <div style={{ 
        textAlign: 'center',
        flex: '1',
        minWidth: '150px'
      }}>
        <div style={{ fontSize: '11px', opacity: 0.7, marginBottom: '5px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Current Location</div>
        <div style={{ fontSize: '20px', fontWeight: 'bold', color: '#DC143C' }}>
          {currentColony || 'Philadelphia'}
        </div>
      </div>
      
      {/* Committee of Five Funds */}
      <div style={{ textAlign: 'center' }}>
        <div style={{ fontSize: '11px', opacity: 0.7, marginBottom: '5px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Committee of Five Funds</div>
        <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#D4AF37' }}>
          ${resources.personalFunds}
        </div>
        <div style={{ fontSize: '9px', opacity: 0.6, marginTop: '3px' }}>
          (${resources.maxPersonalFunds} max)
        </div>
      </div>
      
      {/* Overall Support Meter */}
      <div style={{ 
        textAlign: 'center',
        flex: '1',
        minWidth: '180px'
      }}>
        <div style={{ fontSize: '11px', opacity: 0.7, marginBottom: '5px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Overall Support</div>
        <div style={{ fontSize: '20px', fontWeight: 'bold', color: '#2C1B18', marginBottom: '5px' }}>
          {coloniesWithMajority}/13 colonies
        </div>
        <div style={{ 
          width: '38%',
          margin: '0 auto',
          height: '8px', 
          background: '#ddd', 
          borderRadius: '4px', 
          overflow: 'hidden'
        }}>
          <div style={{ 
            width: `${(coloniesWithMajority / 13) * 100}%`, 
            height: '100%', 
            background: overallSupportStatus === 'green' ? '#2E7D32' : overallSupportStatus === 'orange' ? '#FA8010' : '#EF5350',
            transition: 'width 0.3s ease'
          }} />
        </div>
        <div style={{ fontSize: '10px', opacity: 0.6, marginTop: '3px' }}>
          {coloniesWithMajority} colonies with simple majority
        </div>
      </div>
    </div>
  )
}

export default ResourceHUD