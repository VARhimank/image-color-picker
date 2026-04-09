import { useRef, useCallback, useState } from 'react';

function hexFromRgb(r, g, b) {
  return '#' + [r, g, b].map(v => v.toString(16).padStart(2, '0')).join('');
}

export function ImageCanvas({ onColorPick }) {
  const canvasRef = useRef(null);
  const [hasImage, setHasImage] = useState(false);
  const [isDragOver, setIsDragOver] = useState(false);

  const loadFile = useCallback((file) => {
    if (!file || !file.type.startsWith('image/')) return;
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        // Fit image to max 640px wide while preserving aspect ratio
        const maxW = 640;
        const scale = img.width > maxW ? maxW / img.width : 1;
        canvas.width = Math.round(img.width * scale);
        canvas.height = Math.round(img.height * scale);
        canvas.getContext('2d').drawImage(img, 0, 0, canvas.width, canvas.height);
        setHasImage(true);
      };
      img.src = e.target.result;
    };
    reader.readAsDataURL(file);
  }, []);

  const handleFileInput = (e) => loadFile(e.target.files[0]);

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragOver(false);
    loadFile(e.dataTransfer.files[0]);
  };

  const handleCanvasClick = useCallback((e) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    // Scale click coords to actual canvas resolution
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    const x = Math.round((e.clientX - rect.left) * scaleX);
    const y = Math.round((e.clientY - rect.top) * scaleY);
    const [r, g, b] = canvas.getContext('2d').getImageData(x, y, 1, 1).data;
    onColorPick({
      hex: hexFromRgb(r, g, b),
      rgb: `rgb(${r}, ${g}, ${b})`,
      r, g, b,
    });
  }, [onColorPick]);

  return (
    <div className="card">
      {!hasImage && (
        <div
          className={`upload-zone${isDragOver ? ' drag-over' : ''}`}
          onDragOver={(e) => { e.preventDefault(); setIsDragOver(true); }}
          onDragLeave={() => setIsDragOver(false)}
          onDrop={handleDrop}
        >
          <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <rect x="3" y="3" width="18" height="18" rx="2" />
            <circle cx="8.5" cy="8.5" r="1.5" />
            <polyline points="21 15 16 10 5 21" />
          </svg>
          <p>Drag &amp; drop an image here</p>
          <label>
            Browse file
            <input type="file" accept="image/*" onChange={handleFileInput} />
          </label>
        </div>
      )}

      <div className="canvas-wrapper">
        <canvas
          ref={canvasRef}
          onClick={hasImage ? handleCanvasClick : undefined}
          style={{ display: hasImage ? 'block' : 'none' }}
        />
      </div>

      {hasImage && (
        <p className="canvas-hint">Click anywhere on the image to pick a colour</p>
      )}

      {hasImage && (
        <div style={{ textAlign: 'center', marginTop: '0.75rem' }}>
          <label style={{ cursor: 'pointer', fontSize: '0.82rem', color: 'var(--color-text-secondary)' }}>
            Load a different image
            <input type="file" accept="image/*" onChange={handleFileInput} style={{ display: 'none' }} />
          </label>
        </div>
      )}
    </div>
  );
}
