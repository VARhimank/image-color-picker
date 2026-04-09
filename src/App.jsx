import { useState } from 'react';
import { useTheme } from './hooks/useTheme';
import { useColorHistory } from './hooks/useColorHistory';
import { ThemeToggle } from './components/ThemeToggle';
import { ImageCanvas } from './components/ImageCanvas';
import { ColorDisplay } from './components/ColorDisplay';
import { ColorHistory } from './components/ColorHistory';

function App() {
  const { theme, toggle } = useTheme();
  const { history, addColor, clearHistory } = useColorHistory();
  const [pickedColor, setPickedColor] = useState(null);

  const handleColorPick = (color) => {
    setPickedColor(color);
    addColor(color);
  };

  return (
    <div className="app">
      <header>
        <h1>Image <span>Colour</span> Picker</h1>
        <ThemeToggle theme={theme} onToggle={toggle} />
      </header>

      <div className="main-grid">
        <ImageCanvas onColorPick={handleColorPick} />

        <div className="sidebar">
          <ColorDisplay color={pickedColor} />
          <ColorHistory
            history={history}
            onSelect={setPickedColor}
            onClear={clearHistory}
          />
        </div>
      </div>
    </div>
  );
}

export default App;
