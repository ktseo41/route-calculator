import React, { MouseEvent } from "react";
import { classifiedJobs } from "../database/job";

interface JobSelectorProps {
  onJobSelect: (event: MouseEvent) => void;
}

const JobSelector: React.FC<JobSelectorProps> = ({ onJobSelect }) => {
  const getColorClass = (jobName: string): string => {
    // 전사 계열 (1차 + 2차)
    if (classifiedJobs[0].includes(jobName) || classifiedJobs[1].includes(jobName)) {
      return "bg-gray-700 hover:bg-orange-600 active:bg-orange-700 text-orange-300 hover:text-white border border-orange-500 hover:border-orange-400";
    }
    // 모험가 계열
    if (jobName === "모험가" || ["탐색가", "자연인", "음유시인"].includes(jobName) || jobName === "정령술사") {
      return "bg-gray-700 hover:bg-teal-600 active:bg-teal-700 text-teal-300 hover:text-white border border-teal-500 hover:border-teal-400";
    }
    // 기타 (상인, 네크로멘서)
    return "bg-gray-700 hover:bg-gray-600 active:bg-gray-800 text-gray-300 hover:text-white border border-gray-500 hover:border-gray-400";
  };

  return (
    <div className="p-3 disable-double-tap">
      {/* 전사 계열 직업 */}
      <div className="mb-3 pb-2 border-b border-neutral-700">
        {/* 1차 직업 */}
        <div className="mb-2">
          <div className="flex flex-wrap gap-2">
            {classifiedJobs[0].map((jobName) => (
              <button
                key={jobName}
                className={`text-[clamp(9px,2.5vw,12px)] px-2 py-2 rounded transition-all duration-200 shadow-[inset_1px_1px_1px_rgba(255,255,255,0.1),_inset_-1px_-1px_1px_rgba(0,0,0,0.3)] min-w-[70px] flex-1 whitespace-nowrap ${getColorClass(
                  jobName
                )}`}
                onClick={onJobSelect}
              >
                {jobName}
              </button>
            ))}
          </div>
        </div>

        {/* 2차 직업 */}
        <div className="mb-1">
          <div className="flex flex-wrap gap-2">
            {classifiedJobs[1].map((jobName) => (
              <button
                key={jobName}
                className={`text-[clamp(9px,2.5vw,12px)] px-2 py-2 rounded transition-all duration-200 shadow-[inset_1px_1px_1px_rgba(255,255,255,0.1),_inset_-1px_-1px_1px_rgba(0,0,0,0.3)] min-w-[70px] flex-1 whitespace-nowrap ${getColorClass(
                  jobName
                )}`}
                onClick={onJobSelect}
              >
                {jobName}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* 모험가 계열 직업 */}
      <div className="mb-3 pb-2 border-b border-neutral-700">
        <div className="flex flex-wrap gap-2">
          {/* 1차 직업 */}
          <button
            className={`text-[clamp(9px,2.5vw,12px)] px-2 py-2 rounded transition-all duration-200 shadow-[inset_1px_1px_1px_rgba(255,255,255,0.1),_inset_-1px_-1px_1px_rgba(0,0,0,0.3)] min-w-[70px] flex-1 whitespace-nowrap ${getColorClass(
              "모험가"
            )}`}
            onClick={onJobSelect}
          >
            모험가
          </button>

          {/* 2차 직업 */}
          {["탐색가", "자연인", "음유시인"].map((jobName) => (
            <button
              key={jobName}
              className={`text-[clamp(9px,2.5vw,12px)] px-2 py-2 rounded transition-all duration-200 shadow-[inset_1px_1px_1px_rgba(255,255,255,0.1),_inset_-1px_-1px_1px_rgba(0,0,0,0.3)] min-w-[70px] flex-1 whitespace-nowrap ${getColorClass(
                jobName
              )}`}
              onClick={onJobSelect}
            >
              {jobName}
            </button>
          ))}

          {/* 3차 직업 */}
          <button
            className={`text-[clamp(9px,2.5vw,12px)] px-2 py-2 rounded transition-all duration-200 shadow-[inset_1px_1px_1px_rgba(255,255,255,0.1),_inset_-1px_-1px_1px_rgba(0,0,0,0.3)] min-w-[70px] flex-1 whitespace-nowrap ${getColorClass(
              "정령술사"
            )}`}
            onClick={onJobSelect}
          >
            정령술사
          </button>
        </div>
      </div>

      {/* 기타 직업 */}
      <div>
        <div className="flex flex-wrap gap-2">
          <button
            className={`text-[clamp(9px,2.5vw,12px)] px-2 py-2 rounded transition-all duration-200 shadow-[inset_1px_1px_1px_rgba(255,255,255,0.1),_inset_-1px_-1px_1px_rgba(0,0,0,0.3)] min-w-[70px] flex-1 whitespace-nowrap ${getColorClass(
              "상인"
            )}`}
            onClick={onJobSelect}
          >
            상인
          </button>
          <button
            className={`text-[clamp(9px,2.5vw,12px)] px-2 py-2 rounded transition-all duration-200 shadow-[inset_1px_1px_1px_rgba(255,255,255,0.1),_inset_-1px_-1px_1px_rgba(0,0,0,0.3)] min-w-[70px] flex-1 whitespace-nowrap ${getColorClass(
              "네크로멘서"
            )}`}
            onClick={onJobSelect}
          >
            네크로멘서
          </button>
        </div>
      </div>
    </div>
  );
};

export default JobSelector;
