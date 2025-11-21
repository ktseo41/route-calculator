import React, { useState } from "react";

interface PointAdjusterProps {
  onPointAdjust: (adjustment: number) => void;
}

const PointAdjuster: React.FC<PointAdjusterProps> = ({ onPointAdjust }) => {
  const buttonsValues = [1, 5, 10, 100, -1, -5, -10, -100];
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
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleApplyCustomValue();
    }
  };

  return (
    <div className="p-3 disable-double-tap">
      <div className="mb-3">
        <h3 className="text-sm font-semibold text-neutral-300 mb-2">포인트 조정</h3>
        <div className="grid grid-cols-4 gap-2">
          {buttonsValues.map((buttonValue) => {
            const isPositive = buttonValue > 0;
            const buttonClass = isPositive
              ? "bg-neutral-600 hover:bg-neutral-500 active:bg-neutral-400 text-neutral-300 hover:text-white border border-neutral-500"
              : "bg-neutral-700 hover:bg-neutral-600 active:bg-neutral-500 text-neutral-300 hover:text-white border border-neutral-600";

            return (
              <button
                className={`text-sm w-full py-1.5 px-2.5 rounded border transition-all duration-200 font-medium ${buttonClass}`}
                onClick={() => onPointAdjust(buttonValue)}
                key={buttonValue}
              >
                {buttonValue > 0 ? `+${buttonValue}` : buttonValue}
              </button>
            );
          })}
        </div>
      </div>

      <div className="mb-3">
        <h3 className="text-sm font-semibold text-neutral-300 mb-2">직접 입력</h3>
        <div className="flex flex-col gap-2">
          <div className="flex gap-2 items-center">
            <button
              className="bg-neutral-700 hover:bg-neutral-600 active:bg-neutral-500 text-neutral-300 hover:text-white border border-neutral-600 rounded px-3 py-2 text-sm font-medium transition-all duration-200 shrink-0"
              onClick={() => handleCustomAdjust(-1)}
            >
              -
            </button>
            <input
              type="text"
              value={customValue}
              onChange={handleCustomInputChange}
              onKeyPress={handleKeyPress}
              placeholder="0"
              className="flex-1 min-w-0 bg-neutral-800 border border-neutral-600 rounded px-3 py-2 text-sm text-white placeholder-neutral-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
            />
            <button
              className="bg-neutral-700 hover:bg-neutral-600 active:bg-neutral-500 text-neutral-300 hover:text-white border border-neutral-600 rounded px-3 py-2 text-sm font-medium transition-all duration-200 shrink-0"
              onClick={() => handleCustomAdjust(1)}
            >
              +
            </button>
          </div>
          <button
            className="w-full bg-neutral-600 hover:bg-neutral-500 active:bg-neutral-400 text-neutral-300 hover:text-white border border-neutral-500 rounded px-3 py-2 text-sm font-medium transition-all duration-200"
            onClick={handleApplyCustomValue}
          >
            적용
          </button>
        </div>
      </div>

      {/* 완료 버튼 제거: panel은 닫기 아이콘으로만 닫힘 */}
    </div>
  );
};

export default PointAdjuster;
