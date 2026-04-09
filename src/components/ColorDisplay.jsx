import { useState } from 'react';

function CopyButton({ value }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      // Fallback for insecure contexts
      const el = document.createElement('textarea');
      el.value = value;
      document.body.appendChild(el);
      el.select();
      document.execCommand('copy');
      document.body.removeChild(el);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    }
  };

  return (
    <button className={`copy-btn${copied ? ' copied' : ''}`} onClick={handleCopy}>
      {copied ? '✓ Copied' : 'Copy'}
    </button>
  );
}

export function ColorDisplay({ color }) {
  if (!color) {
    return (
      <div className="card">
        <p className="no-color">Pick a colour from the image</p>
      </div>
    );
  }

  return (
    <div className="card">
      <div
        className="color-swatch-large"
        style={{ background: color.hex }}
        aria-label={`Selected colour ${color.hex}`}
      />

      <div className="color-value-row">
        <span className="color-label">HEX</span>
        <span className="color-value">{color.hex}</span>
        <CopyButton value={color.hex} />
      </div>

      <div className="color-value-row">
        <span className="color-label">RGB</span>
        <span className="color-value">{color.rgb}</span>
        <CopyButton value={color.rgb} />
      </div>
    </div>
  );
}
