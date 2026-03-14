import React, { useEffect, useState } from 'react'

const UpdateNotification: React.FC = () => {
  const [message, setMessage] = useState<string>('')
  const [progress, setProgress] = useState<number | null>(null)

  useEffect(() => {
    if (!window.electronAPI) return

    // Listen for update messages
    window.electronAPI.onUpdateMessage((msg: string) => {
      setMessage(msg)
      if (msg === 'You have the latest version') {
        setTimeout(() => setMessage(''), 5000)
      }
    })

    window.electronAPI.onUpdateProgress((p: number) => {
      setProgress(p)
      if (p >= 100) {
        setTimeout(() => setProgress(null), 2000)
      }
    })

  }, [])

  if (!message && progress === null) return null

  return (
    <div style={{
      position: 'fixed',
      top: '20px',
      right: '20px',
      background: '#2c3e50',
      color: 'white',
      padding: '15px',
      borderRadius: '8px',
      boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
      zIndex: 1000,
      minWidth: '250px'
    }}>
      {message && <p style={{ margin: '0 0 10px 0' }}>{message}</p>}
      
      {progress !== null && (
        <div style={{
          width: '100%',
          height: '20px',
          background: '#34495e',
          borderRadius: '10px',
          position: 'relative',
          overflow: 'hidden'
        }}>
          <div style={{
            height: '100%',
            width: `${progress}%`,
            background: '#27ae60',
            transition: 'width 0.3s'
          }} />
          <span style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            color: 'white',
            fontSize: '12px',
            fontWeight: 'bold'
          }}>
            {Math.round(progress)}%
          </span>
        </div>
      )}
    </div>
  )
}

export default UpdateNotification