export default function WindowFrame({ title, icon = '🎬', children, statusText }) {
  return (
    <div className="window">
      <div className="window-titlebar">
        <span className="window-title">{icon} {title}</span>
        <div className="window-controls">
          <button className="window-btn">_</button>
          <button className="window-btn">□</button>
          <button className="window-btn close">✕</button>
        </div>
      </div>
      <div className="window-content">
        {children}
      </div>
      {statusText && (
        <div className="statusbar">
          <span>{statusText}</span>
          <span>5kChocoPie v1.0</span>
        </div>
      )}
    </div>
  )
}
