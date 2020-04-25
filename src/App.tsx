import React, { useState, ChangeEvent } from "react";
import styled from "styled-components";
import jobList from "./database/job";
import jobLogic from "./lib/jobLogic";
import { Stats } from "./database/jobPointMap";

const CalculatorWrapper = styled.div`
  border: 1px solid black;
  width: 50%;
  min-width: 300px;
  height: 500px;
  margin-top: 200px;
  margin-left: 25%;
`;

export default function App() {
  const [accuStats, setAccuStats] = useState<Stats>({
    STR: 5,
    AGI: 5,
    INT: 5,
    VIT: 5,
  });
  const [selectedJob, setSelectedJob] = useState("무직");
  const changeSelectedJob = (evt: ChangeEvent) => {
    const selectedValue = (evt.target as HTMLSelectElement).value;
    setSelectedJob(selectedValue);
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
      <span>{selectedJob}</span>
    </CalculatorWrapper>
  );
}
