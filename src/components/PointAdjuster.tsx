import React, { useState, useRef, useEffect } from "react";
import ToggleSwitch from "./ToggleSwitch";

interface PointAdjusterProps {
  onPointAdjust: (adjustment: number) => void;
  onPointSet?: (value: number) => void;
  currentPoint?: number;
  selectedIndex?: number | null;
  jobName?: string;
  isCumulative?: boolean;
  onCumulativeToggle?: () => void;
}

const PointAdjuster: React.FC<PointAdjusterProps> = ({
  onPointAdjust,
  onPointSet,
  currentPoint = 0,
  selectedIndex,
  jobName,
  isCumulative = false,
  onCumulativeToggle,
}) => {
  const positiveButtons = [1, 5, 10, 100];
  const negativeButtons = [-1, -5, -10, -100];
  const [customValue, setCustomValue] = useState<string>("");

  // Track the last valid selected index to detect job changes
  const lastSelectedIndex = useRef<number | null>(null);

  useEffect(() => {
    // If selectedIndex is null (modal closed), do nothing (preserve state)
    if (selectedIndex === null || selectedIndex === undefined) return;

    // If we have a previous index and it's different from current one
    if (
      lastSelectedIndex.current !== null &&
      lastSelectedIndex.current !== selectedIndex
    ) {
      setCustomValue(""); // Reset input
    }

    // Update last known index
    lastSelectedIndex.current = selectedIndex;
  }, [selectedIndex]);

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
      <div className="point-display mobile-only">
        {/* Header: Job Name & Toggle */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          {jobName && (
            <div
              style={{
                fontSize: "1.1rem",
                fontWeight: 700,
                color: "var(--text-primary)",
              }}
            >
              {jobName}
            </div>
          )}
          {onCumulativeToggle && (
            <ToggleSwitch
              checked={isCumulative}
              onChange={onCumulativeToggle}
              label="누적"
            />
          )}
        </div>

        {/* Stepper: [-] [Value] [+] */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "12px",
            marginTop: "12px",
          }}
        >
          <button
            onClick={() => onPointAdjust(-1)}
            style={{
              width: "44px",
              height: "44px",
              borderRadius: "8px",
              background: "var(--bg-tertiary)",
              border: "none",
              color: "var(--text-primary)",
              fontSize: "1.25rem",
              fontWeight: 700,
              cursor: "pointer",
            }}
          >
            −
          </button>
          <div
            style={{
              fontSize: "2rem",
              fontWeight: 700,
              color: "var(--text-primary)",
              minWidth: "80px",
              textAlign: "center",
            }}
          >
            {currentPoint}
          </div>
          <button
            onClick={() => onPointAdjust(1)}
            style={{
              width: "44px",
              height: "44px",
              borderRadius: "8px",
              background: "var(--bg-tertiary)",
              border: "none",
              color: "var(--text-primary)",
              fontSize: "1.25rem",
              fontWeight: 700,
              cursor: "pointer",
            }}
          >
            +
          </button>
        </div>

        {/* Quick Adjustment Buttons Grid - 3 columns */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(3, 1fr)",
            gap: "6px",
            marginTop: "12px",
          }}
        >
          {[5, 10, 100].map((val) => (
            <button
              key={`+${val}`}
              onClick={() => onPointAdjust(val)}
              style={{
                height: "32px",
                borderRadius: "8px",
                background: "var(--bg-tertiary)",
                border: "none",
                color: "var(--text-primary)",
                fontSize: "0.75rem",
                fontWeight: 600,
                cursor: "pointer",
              }}
            >
              +{val}
            </button>
          ))}
          {[-5, -10, -100].map((val) => (
            <button
              key={val}
              onClick={() => onPointAdjust(val)}
              style={{
                height: "32px",
                borderRadius: "8px",
                background: "var(--bg-tertiary)",
                border: "none",
                color: "var(--text-secondary)",
                fontSize: "0.75rem",
                fontWeight: 600,
                cursor: "pointer",
              }}
            >
              {val}
            </button>
          ))}
        </div>
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
      <div className="custom-input-section">
        <div className="point-label point-label--left">직접 입력</div>
        <div className="custom-input-container">
          <div className="custom-input-group">
            <button
              onClick={() => handleCustomAdjust(-1)}
              className="adjust-btn custom-adjust-btn"
            >
              -
            </button>
            <input
              type="text"
              value={customValue}
              onChange={handleCustomInputChange}
              onKeyPress={handleKeyPress}
              placeholder="0"
              className="custom-input-field"
            />
            <button
              onClick={() => handleCustomAdjust(1)}
              className="adjust-btn custom-adjust-btn"
            >
              +
            </button>
          </div>
          <button
            onClick={handleApplyCustomValue}
            className="adjust-btn custom-apply-btn"
          >
            적용
          </button>
        </div>
      </div>
    </div>
  );
};

export default PointAdjuster;
