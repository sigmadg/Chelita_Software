import './Message.css'

export function Message({ type = 'info', children }) {
  if (!children) return null
  const role = type === 'error' ? 'alert' : 'status'
  return (
    <div className={`message message--${type}`} role={role} aria-live="polite">
      {children}
    </div>
  )
}
