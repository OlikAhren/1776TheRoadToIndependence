import React from 'react'
import { useGameStore, FAILURE_DEADLINE_LABEL } from '../store/GameStore'
import ResourceHUD from './ResourceHUD'

const Timeline: React.FC = () => {
  const { currentDate } = useGameStore()
  
  // Calculate date range
  const startDate = new Date(1776, 5, 7) // June 7th (month is 0-indexed, so 5 = June)
  
  // Parse current date
  const parseCurrentDate = (dateStr: string): Date => {
    // Handle format like "June 7, 1776"
    const parts = dateStr.split(',')
    if (parts.length < 2) return startDate
    
    const monthDay = parts[0].trim()
    const [month, day] = monthDay.split(' ')
    const year = parseInt(parts[1].trim()) || 1776
    
    // Convert month name to number
    const months: { [key: string]: number } = {
      'January': 1, 'February': 2, 'March': 3, 'April': 4,
      'May': 5, 'June': 6, 'July': 7, 'August': 8,
      'September': 9, 'October': 10, 'November': 11, 'December': 12
    }
    
    const monthNum = months[month.charAt(0).toUpperCase() + month.slice(1).toLowerCase()] || 6
    
    return new Date(year, monthNum - 1, parseInt(day))
  }
  
  // The game must be finished by the July 2, 1776 deadline — the same one the store uses
  // for the failure check, so the bar and the rules can never disagree.
  const endDate = parseCurrentDate(FAILURE_DEADLINE_LABEL)
  
  const currentParsedDate = parseCurrentDate(currentDate)
  
  // Calculate progress percentage (0 to 100)
  const progressMs = currentParsedDate.getTime() - startDate.getTime()
  const totalMs = endDate.getTime() - startDate.getTime()
  const progressPercent = Math.max(0, Math.min(100, (progressMs / totalMs) * 100))
  
  // Total days, counted inclusively (June 7 is day 1, July 2 is the last day)
  const totalDays = Math.round(totalMs / (1000 * 60 * 60 * 24)) + 1
  
  // Get current day number
  const getCurrentDay = (): number => {
    const diffMs = currentParsedDate.getTime() - startDate.getTime()
    return Math.round(diffMs / (1000 * 60 * 60 * 24)) + 1 // +1 because we start at day 1
  }
  
  const currentDay = getCurrentDay()

  // Nudge the rider and badge inward near the ends of the bar so neither is clipped.
  const badgeShift = progressPercent > 8
    ? -Math.max(0, progressPercent - 92) * 6
    : Math.max(0, 8 - progressPercent) * 6
  
  return (
    <div style={{
      width: '100%',
      marginBottom: '12px',
      padding: '10px 12px',
      background: '#FFF8DC',
      borderRadius: '8px',
      boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
      border: '3px solid #1A237E'
    }}>
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        marginBottom: '6px'
      }}>
        <span style={{ fontSize: '12px', fontWeight: 'bold', color: '#2C1B18' }}>Timeline Progress</span>
        <span style={{ fontSize: '14px', fontWeight: 'bold', color: '#2C1B18' }}>
          Current: {currentDate}
        </span>
      </div>
      
      {/* Timeline bar, flanked by the two milestones it runs between */}
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
        <span
          title="Lee Resolution — June 7, 1776"
          aria-label="Lee Resolution, June 7 1776"
          style={{ fontSize: '26px', lineHeight: '40px' }}
        >
          🏛️
        </span>

        <div style={{ flex: 1, minWidth: 0, position: 'relative', marginBottom: '30px' }}>
          <div style={{ position: 'relative', height: '28px', background: '#ddd', borderRadius: '4px', overflow: 'hidden' }}>
            {/* Background track */}
            <div style={{ 
              position: 'absolute',
              left: 0,
              right: 0,
              top: 0,
              bottom: 0,
              background: 'linear-gradient(to right, #2E7D32 0%, #F07500 50%, #EF5350 100%)',
              opacity: 0.3
            }} />
            
            {/* Progress fill */}
            <div style={{ 
              position: 'absolute',
              left: 0,
              top: 0,
              bottom: 0,
              width: `${progressPercent}%`,
              background: 'linear-gradient(to right, #2E7D32, #FA8010)',
              transition: 'width 0.3s ease'
            }} />

            {/* Rider and day counter, moving together along the bar */}
            <div style={{
              position: 'absolute',
              left: `${progressPercent}%`,
              top: '50%',
              // keep the rider and badge inside the bar at both ends
              transform: `translate(calc(-50% + ${badgeShift}px), -50%)`,
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
              whiteSpace: 'nowrap'
            }}>
              <span style={{ fontSize: '16px', lineHeight: 1 }} title="Your ride across the timeline">🏇</span>
              <div style={{
                background: '#2C1B18',
                color: 'white',
                padding: '4px 8px',
                borderRadius: '12px',
                fontSize: '11px',
                fontWeight: 'bold',
                boxShadow: '0 2px 4px rgba(0,0,0,0.3)'
              }}>
                Day {currentDay}/{totalDays}
              </div>
            </div>
          </div>

          {/* Markers for the two ends of the timeline */}
          {[0, 100].map((markerPercent, index) => {
            const markerDate = new Date(startDate.getTime() + (totalMs * markerPercent / 100))
            const monthName = markerDate.getMonth() === 5 ? 'June' : 'July'
            const day = markerDate.getDate()
            const suffix = day % 10 === 1 && day % 100 !== 11 ? 'st'
              : day % 10 === 2 && day % 100 !== 12 ? 'nd'
              : day % 10 === 3 && day % 100 !== 13 ? 'rd'
              : 'th'
            
            return (
              <div
                key={index}
                style={{
                  position: 'absolute',
                  left: `${markerPercent}%`,
                  top: 'calc(100% + 6px)',
                  // keep each label inside the bar: start-aligned at the left end,
                  // end-aligned at the right end, so neither wraps or overlaps the emoji
                  transform: markerPercent === 0 ? 'translateX(0)' : 'translateX(-100%)',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: markerPercent === 0 ? 'flex-start' : 'flex-end'
                }}
              >
                <span style={{
                  fontSize: '11px',
                  fontWeight: 'bold',
                  color: '#2C1B18',
                  background: 'white',
                  padding: '2px 6px',
                  borderRadius: '4px',
                  boxShadow: '0 1px 3px rgba(0,0,0,0.2)',
                  whiteSpace: 'nowrap'
                }}>
                  {monthName} {day}{suffix}
                </span>
              </div>
            )
          })}
        </div>

        <span
          title="Declaration of Independence — July 2, 1776"
          aria-label="Declaration of Independence, July 2 1776"
          style={{ fontSize: '26px', lineHeight: '40px' }}
        >
          📜
        </span>
      </div>

      {/* Current location, funds and colonial support, inside the same panel */}
      <ResourceHUD />
    </div>
  )
}

export default Timeline