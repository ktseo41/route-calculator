import React, { useState } from "react";

interface PointAdjusterProps {
  onPointAdjust: (adjustment: number) => void;
  onPointSet?: (value: number) => void;
  currentPoint?: number;
}

const PointAdjuster: React.FC<PointAdjusterProps> = ({ onPointAdjust, onPointSet, currentPoint = 0 }) => {
  const positiveButtons = [1, 5, 10, 100];
  const negativeButtons = [-1, -5, -10, -100];
  const [customValue, setCustomValue] = useState<string>("");

  const handleCustomAdjust = (delta: number) => {
    const value = parseInt(customValue) || 0;
    const newValue = Math.max(0, value + delta); // Prevent negative values
    setCustomValue(newValue.toString());
  };

  const handleCustomInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    // Allow only positive integers
    if (value === "" || /^\d+$/.test(value)) {
      setCustomValue(value);
    }
  };

  const handleApplyCustomValue = () => {
    const value = parseInt(customValue);
    if (!isNaN(value)) {
      if (onPointSet) {
        onPointSet(value);
      } else {
        // Fallback for backward compatibility if onPointSet is not provided
        onPointAdjust(value);
      }
      setCustomValue("");
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleApplyCustomValue();
    }
  };

  return (
    <div className="point-adjuster">
      <div className="point-display">
        <div className="point-value">{currentPoint}</div>
        <div className="point-label">현재 잡포인트</div>
      </div>

      <div className="adjust-controls">
        {positiveButtons.map((val) => (
          <button
            key={val}
            onClick={() => onPointAdjust(val)}
            className="adjust-btn positive"
          >
            +{val}
          </button>
        ))}
        {negativeButtons.map((val) => (
          <button
            key={val}
            onClick={() => onPointAdjust(val)}
            className="adjust-btn negative"
          >
            {val}
          </button>
        ))}
      </div>

      {/* Custom Input Section - Styled to match theme */}
      <div style={{ marginTop: 'var(--space-md)' }}>
        <div className="point-label" style={{ marginBottom: 'var(--space-sm)', textAlign: 'left' }}>직접 입력</div>
        <div style={{ display: 'flex', gap: 'var(--space-sm)' }}>
          <div style={{ 
            flex: 1, 
            display: 'flex', 
            backgroundColor: 'var(--bg-tertiary)', 
            borderRadius: 'var(--radius-md)',
            border: '1px solid var(--border-color)',
            overflow: 'hidden'
          }}>
            <button
              onClick={() => handleCustomAdjust(-1)}
              style={{ width: '40px', color: 'var(--text-secondary)' }}
              className="adjust-btn"
            >
              -
            </button>
            <input
              type="text"
              value={customValue}
              onChange={handleCustomInputChange}
              onKeyPress={handleKeyPress}
              placeholder="0"
              style={{
                flex: 1,
                background: 'transparent',
                border: 'none',
                color: 'var(--text-primary)',
                textAlign: 'center',
                fontWeight: 600,
                outline: 'none'
              }}
            />
            <button
              onClick={() => handleCustomAdjust(1)}
              style={{ width: '40px', color: 'var(--text-secondary)' }}
              className="adjust-btn"
            >
              +
            </button>
          </div>
          <button
            onClick={handleApplyCustomValue}
            className="adjust-btn"
            style={{ 
              width: '80px', 
              backgroundColor: 'var(--text-primary)', 
              color: 'var(--bg-primary)'
            }}
          >
            적용
          </button>
        </div>
      </div>
    </div>
  );
};

export default PointAdjuster;
