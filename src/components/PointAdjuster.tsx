import React, { useState } from "react";

interface PointAdjusterProps {
  onPointAdjust: (adjustment: number) => void;
}

const PointAdjuster: React.FC<PointAdjusterProps> = ({ onPointAdjust }) => {
  const positiveButtons = [1, 5, 10, 100];
  const negativeButtons = [-1, -5, -10, -100];
  const [customValue, setCustomValue] = useState<string>("");

  const handleCustomAdjust = (delta: number) => {
    const value = parseInt(customValue) || 0;
    const newValue = value + delta;
    setCustomValue(newValue.toString());
  };

  const handleCustomInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    // 빈 문자열이거나 음수를 포함한 숫자만 허용
    if (value === "" || value === "-" || /^-?\d+$/.test(value)) {
      setCustomValue(value);
    }
  };

  const handleApplyCustomValue = () => {
    const value = parseInt(customValue);
    if (!isNaN(value) && value !== 0) {
      onPointAdjust(value);
      setCustomValue(""); // Optional: clear after apply
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleApplyCustomValue();
    }
  };

  return (
    <div className="p-4 disable-double-tap flex flex-col gap-5">
      {/* Preset Buttons Section */}
      <div className="space-y-3">
        <div className="grid grid-cols-4 gap-2">
          {positiveButtons.map((val) => (
            <button
              key={val}
              onClick={() => onPointAdjust(val)}
              className="h-10 flex items-center justify-center text-sm font-bold rounded bg-neutral-700 hover:bg-neutral-600 text-neutral-300 hover:text-white border border-neutral-600 hover:border-neutral-500 active:bg-neutral-500 transition-all duration-200 shadow-[inset_1px_1px_1px_rgba(255,255,255,0.1),_inset_-1px_-1px_1px_rgba(0,0,0,0.3)]"
            >
              +{val}
            </button>
          ))}
        </div>
        <div className="grid grid-cols-4 gap-2">
          {negativeButtons.map((val) => (
            <button
              key={val}
              onClick={() => onPointAdjust(val)}
              className="h-10 flex items-center justify-center text-sm font-bold rounded bg-neutral-800 hover:bg-neutral-700 text-neutral-400 hover:text-white border border-neutral-700 hover:border-neutral-600 active:bg-neutral-600 transition-all duration-200 shadow-[inset_1px_1px_1px_rgba(255,255,255,0.1),_inset_-1px_-1px_1px_rgba(0,0,0,0.3)]"
            >
              {val}
            </button>
          ))}
        </div>
      </div>

      {/* Divider */}
      <div className="h-px bg-neutral-700/50 w-full" />

      {/* Custom Input Section */}
      <div className="space-y-2">
        <label className="text-xs font-medium text-neutral-400 ml-1">
          직접 입력
        </label>
        <div className="flex gap-2">
          <div className="flex-1 flex items-center bg-neutral-800 rounded border border-neutral-700 overflow-hidden focus-within:border-neutral-500 transition-colors">
            <button
              onClick={() => handleCustomAdjust(-1)}
              className="w-10 h-full bg-neutral-700/50 hover:bg-neutral-600 text-neutral-300 active:bg-neutral-500 transition-colors flex items-center justify-center border-r border-neutral-700"
            >
              -
            </button>
            <input
              type="text"
              value={customValue}
              onChange={handleCustomInputChange}
              onKeyPress={handleKeyPress}
              placeholder="0"
              className="flex-1 bg-transparent text-center text-white text-sm font-medium focus:outline-none py-2.5 min-w-0"
            />
            <button
              onClick={() => handleCustomAdjust(1)}
              className="w-10 h-full bg-neutral-700/50 hover:bg-neutral-600 text-neutral-300 active:bg-neutral-500 transition-colors flex items-center justify-center border-l border-neutral-700"
            >
              +
            </button>
          </div>
          <button
            onClick={handleApplyCustomValue}
            className="px-4 bg-neutral-200 hover:bg-white text-neutral-900 text-sm font-bold rounded shadow-lg active:scale-95 transition-all duration-200 whitespace-nowrap"
          >
            적용
          </button>
        </div>
      </div>
    </div>
  );
};

export default PointAdjuster;
