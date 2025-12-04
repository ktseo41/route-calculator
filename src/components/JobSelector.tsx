import React, { MouseEvent } from "react";
import { classifiedJobs } from "../database/job";

interface JobSelectorProps {
  onJobSelect: (event: MouseEvent) => void;
}

const JobSelector: React.FC<JobSelectorProps> = ({ onJobSelect }) => {
  return (
    <div>
      {/* 전사 계열 직업 */}
      <div style={{ marginBottom: 'var(--space-md)', paddingBottom: 'var(--space-sm)' }}>
        <h4 style={{ marginBottom: 'var(--space-sm)', color: 'var(--text-tertiary)', fontSize: '0.75rem' }}>전사 계열</h4>
        {/* 1차 직업 */}
        <div className="job-grid" style={{ marginBottom: 'var(--space-sm)' }}>
          {classifiedJobs[0].map((jobName) => (
            <button
              key={jobName}
              className="job-btn"
              onClick={onJobSelect}
              value={jobName} // Ensure value is passed for getJobNameFromSelect
            >
              {jobName}
            </button>
          ))}
        </div>

        {/* 2차 직업 */}
        <div className="job-grid">
          {classifiedJobs[1].map((jobName) => (
            <button
              key={jobName}
              className="job-btn"
              onClick={onJobSelect}
              value={jobName}
            >
              {jobName}
            </button>
          ))}
        </div>
      </div>

      {/* 모험가 계열 직업 */}
      <div style={{ marginBottom: 'var(--space-md)', paddingBottom: 'var(--space-sm)' }}>
        <h4 style={{ marginBottom: 'var(--space-sm)', color: 'var(--text-tertiary)', fontSize: '0.75rem' }}>모험가 계열</h4>
        <div className="job-grid">
          {/* 1차 직업 */}
          <button
            className="job-btn"
            onClick={onJobSelect}
            value="모험가"
          >
            모험가
          </button>

          {/* 2차 직업 */}
          {["탐색가", "자연인", "음유시인"].map((jobName) => (
            <button
              key={jobName}
              className="job-btn"
              onClick={onJobSelect}
              value={jobName}
            >
              {jobName}
            </button>
          ))}

          {/* 3차 직업 */}
          <button
            className="job-btn"
            onClick={onJobSelect}
            value="정령술사"
          >
            정령술사
          </button>
        </div>
      </div>

      {/* 기타 직업 */}
      <div>
        <h4 style={{ marginBottom: 'var(--space-sm)', color: 'var(--text-tertiary)', fontSize: '0.75rem' }}>기타</h4>
        <div className="job-grid">
          <button
            className="job-btn"
            onClick={onJobSelect}
            value="상인"
          >
            상인
          </button>
          <button
            className="job-btn"
            onClick={onJobSelect}
            value="네크로멘서"
          >
            네크로멘서
          </button>
        </div>
      </div>
    </div>
  );
};

export default JobSelector;
