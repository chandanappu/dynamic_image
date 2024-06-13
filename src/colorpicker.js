import React, { useState } from 'react';
import { SketchPicker } from 'react-color';
import './App.css';

function ColorPicker() {
  const [color, setColor] = useState('#fff');

  const handleChangeComplete = (newColor) => {
    setColor(newColor.hex);
  };

  return (
    <div>
    <nav style={{ backgroundColor: color }} className='picker'>
      <SketchPicker color={color} onChangeComplete={handleChangeComplete} />
    </nav>
    </div>
  );
}

export default ColorPicker;