import React, { useState, ChangeEvent } from "react";
import styled from "styled-components";
import jobList from "./database/job";
import { Jobs } from "./database/job";
import jobLogic, { CurrentJobPoints } from "./lib/jobLogic";
import { Stats } from "./database/jobPointMap";

type buttonState = 1 | -1;

const CalculatorWrapper = styled.div`
  border: 1px solid black;
  width: 50%;
  min-width: 300px;
  height: 500px;
  margin-top: 200px;
  margin-left: 25%;
`;

const isValidJob = (selectedValue: string): boolean => selectedValue in Jobs;

export default function App() {
  const [accuStats, setAccuStats] = useState<Stats>({
    STR: 5,
    AGI: 5,
    INT: 5,
    VIT: 5,
  });
  const [currentJobPos, setCurrentJobPos] = useState<CurrentJobPoints>({
    무직: 0,
  });
  const [selectedJob, setSelectedJob] = useState(Jobs.무직);
  const [currentJobPo, setCurrentJobPo] = useState(0);
  const newToThisJob = (job: Jobs): boolean => !(job in currentJobPos);
  const assignToCurrentJobPos = (job: Jobs): void => {
    currentJobPos[job] = 0;
    setCurrentJobPos(currentJobPos);
  };
  const changeSelectedJob = (evt: ChangeEvent) => {
    const selectedValue = (evt.target as HTMLSelectElement).value;
    if (!isValidJob(selectedValue)) return;
    setSelectedJob(selectedValue as Jobs);
    newToThisJob(selectedValue as Jobs) &&
      assignToCurrentJobPos(selectedValue as Jobs);
  };

  const changeJobPoint = (state: buttonState) => {
    newToThisJob(selectedJob) && assignToCurrentJobPos(selectedJob);
    (currentJobPos[selectedJob] as number) += state;
    setCurrentJobPos({ ...currentJobPos });
  };

  return (
    <CalculatorWrapper>
      <label htmlFor="job-select"></label>
      <select id="job-select" onChange={changeSelectedJob}>
        <option value="">{selectedJob}</option>
        {jobList.reduce(
          (accu: JSX.Element[], curr: string, idx: number): JSX.Element[] => {
            accu.push(<option key={idx}>{curr}</option>);
            return accu;
          },
          []
        )}
      </select>
      <button onClick={() => changeJobPoint(1)}>+</button>
      <button onClick={() => changeJobPoint(-1)}>-</button>
      <span>{selectedJob}</span>
      <div>{JSON.stringify(currentJobPos)}</div>
      <div>{JSON.stringify(accuStats)}</div>
    </CalculatorWrapper>
  );
}
