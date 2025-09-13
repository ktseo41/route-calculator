import React, { MouseEvent } from "react";
import { classifiedJobs } from "../database/job";

interface JobSelectorProps {
  onJobSelect: (event: MouseEvent) => void;
}

const JobSelector: React.FC<JobSelectorProps> = ({ onJobSelect }) => {
  const getColorClass = (jobName: string): string => {
    // 1차 직업 (전사 계열)
    if (classifiedJobs[0].includes(jobName)) {
      return "bg-gray-700 hover:bg-red-600 text-red-300 hover:text-white border border-red-500 hover:border-red-400";
    }
    // 2차 직업 (기사/마법사)
    if (classifiedJobs[1].includes(jobName)) {
      return "bg-gray-700 hover:bg-orange-600 text-orange-300 hover:text-white border border-orange-500 hover:border-orange-400";
    }
    // 모험가 계열
    if (jobName === "모험가") {
      return "bg-gray-700 hover:bg-green-600 text-green-300 hover:text-white border border-green-500 hover:border-green-400";
    }
    // 탐색가, 자연인, 음유시인
    if (["탐색가", "자연인", "음유시인"].includes(jobName)) {
      return "bg-gray-700 hover:bg-blue-600 text-blue-300 hover:text-white border border-blue-500 hover:border-blue-400";
    }
    // 정령술사
    if (jobName === "정령술사") {
      return "bg-gray-700 hover:bg-purple-600 text-purple-300 hover:text-white border border-purple-500 hover:border-purple-400";
    }
    // 상인
    if (jobName === "상인") {
      return "bg-gray-700 hover:bg-yellow-600 text-yellow-300 hover:text-white border border-yellow-500 hover:border-yellow-400";
    }
    // 네크로멘서
    if (jobName === "네크로멘서") {
      return "bg-gray-700 hover:bg-indigo-600 text-indigo-300 hover:text-white border border-indigo-500 hover:border-indigo-400";
    }

    // 기본 스타일
    return "bg-gray-700 hover:bg-gray-600 text-gray-300 hover:text-white border border-gray-500 hover:border-gray-400";
  };

  return (
    <div className="p-4 disable-double-tap">
      {/* 전사 계열 직업 */}
      <div className="mb-4 pb-4 border-b border-gray-600">
        <h3 className="text-sm font-medium text-gray-400 mb-3">전사 계열</h3>
        {/* 1차 직업 */}
        <div className="mb-3">
          <div className="flex flex-wrap gap-2">
            {classifiedJobs[0].map((jobName) => (
              <button
                key={jobName}
                className={`text-sm px-3 py-2 rounded transition-all duration-200 shadow-[inset_1px_1px_1px_rgba(255,255,255,0.1),_inset_-1px_-1px_1px_rgba(0,0,0,0.3)] ${getColorClass(
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
                className={`text-sm px-3 py-2 rounded transition-all duration-200 shadow-[inset_1px_1px_1px_rgba(255,255,255,0.1),_inset_-1px_-1px_1px_rgba(0,0,0,0.3)] ${getColorClass(
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
      <div className="mb-4 pb-4 border-b border-gray-600">
        <h3 className="text-sm font-medium text-gray-400 mb-3">모험가 계열</h3>
        <div className="flex flex-wrap items-center gap-2">
          {/* 1차 직업 */}
          <button
            className={`text-sm px-3 py-2 rounded transition-all duration-200 shadow-[inset_1px_1px_1px_rgba(255,255,255,0.1),_inset_-1px_-1px_1px_rgba(0,0,0,0.3)] ${getColorClass(
              "모험가"
            )}`}
            onClick={onJobSelect}
          >
            모험가
          </button>

          {/* 세로 구분선 */}
          <div className="h-8 w-px bg-gray-600"></div>

          {/* 2차 직업 */}
          {["탐색가", "자연인", "음유시인"].map((jobName) => (
            <button
              key={jobName}
              className={`text-sm px-3 py-2 rounded transition-all duration-200 shadow-[inset_1px_1px_1px_rgba(255,255,255,0.1),_inset_-1px_-1px_1px_rgba(0,0,0,0.3)] ${getColorClass(
                jobName
              )}`}
              onClick={onJobSelect}
            >
              {jobName}
            </button>
          ))}

          {/* 세로 구분선 */}
          <div className="h-8 w-px bg-gray-600"></div>

          {/* 3차 직업 */}
          <button
            className={`text-sm px-3 py-2 rounded transition-all duration-200 shadow-[inset_1px_1px_1px_rgba(255,255,255,0.1),_inset_-1px_-1px_1px_rgba(0,0,0,0.3)] ${getColorClass(
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
        <h3 className="text-sm font-medium text-gray-400 mb-3">기타</h3>
        <div className="flex flex-wrap gap-2">
          <button
            className={`text-sm px-3 py-2 rounded transition-all duration-200 shadow-[inset_1px_1px_1px_rgba(255,255,255,0.1),_inset_-1px_-1px_1px_rgba(0,0,0,0.3)] ${getColorClass(
              "상인"
            )}`}
            onClick={onJobSelect}
          >
            상인
          </button>
          <button
            className={`text-sm px-3 py-2 rounded transition-all duration-200 shadow-[inset_1px_1px_1px_rgba(255,255,255,0.1),_inset_-1px_-1px_1px_rgba(0,0,0,0.3)] ${getColorClass(
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
