import React, { MouseEvent } from "react";

interface PointAdjusterProps {
  onPointAdjust: (event: MouseEvent) => void;
  onComplete: () => void;
}

const PointAdjuster: React.FC<PointAdjusterProps> = ({
  onPointAdjust,
  onComplete,
}) => {
  const buttonsValues = ["+1", "+5", "+10", "+100", "-1", "-5", "-10", "-100"];

  return (
    <div className="p-4 disable-double-tap">
      <div className="mb-4">
        <h3 className="text-sm font-medium text-gray-400 mb-3">포인트 조정</h3>
        <div className="grid grid-cols-4 gap-3">
          {buttonsValues.map((buttonValue) => {
            const isPositive = !buttonValue.startsWith("-");
            const buttonClass = isPositive
              ? "bg-neutral-600 hover:bg-neutral-500 text-neutral-300 hover:text-white border border-neutral-500"
              : "bg-neutral-700 hover:bg-neutral-600 text-neutral-300 hover:text-white border border-neutral-600";

            return (
              <button
                className={`text-sm min-w-14 py-2 px-3 rounded border transition-all duration-200 font-medium ${buttonClass}`}
                onClick={onPointAdjust}
                key={buttonValue}
              >
                {buttonValue}
              </button>
            );
          })}
        </div>
      </div>

      <div className="flex justify-center pt-4 border-t border-gray-600">
        <button
          onClick={onComplete}
          className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded font-medium transition-colors duration-200"
        >
          완료
        </button>
      </div>
    </div>
  );
};

export default PointAdjuster;
