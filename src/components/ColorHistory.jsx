export function ColorHistory({ history, onSelect, onClear }) {
  return (
    <div className="card">
      <div className="history-header">
        <span className="history-title">History</span>
        {history.length > 0 && (
          <button className="clear-btn" onClick={onClear} aria-label="Clear history">
            Clear
          </button>
        )}
      </div>

      <div className="history-grid">
        {history.length === 0 && (
          <p className="history-empty">No colours picked yet</p>
        )}
        {history.map((color, i) => (
          <button
            key={i}
            className="history-swatch"
            style={{ background: color.hex }}
            onClick={() => onSelect(color)}
            title={color.hex}
            aria-label={`Select ${color.hex}`}
          />
        ))}
      </div>
    </div>
  );
}
