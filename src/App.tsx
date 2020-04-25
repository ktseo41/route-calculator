import React, { useState, ChangeEvent } from "react";
import styled from "styled-components";
import jobList from "./database/job";
import { Jobs } from "./database/job";
import jobPointMap, {
  Stats,
  Intervals,
  Stat,
  EachJobPointMap,
  DeltaInfo,
  StatMap,
} from "./database/jobPointMap";

type CurrentJobPoints = {
  [job in Jobs]?: number;
};

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
const isValidJobPo = (nextJobPo: number): boolean =>
  nextJobPo >= 0 && nextJobPo <= 100;

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
  const assignFirstTimeToCurrentJobPos = (job: Jobs): void => {
    setCurrentJobPo(0);
    currentJobPos[job] = 0;
    setCurrentJobPos({ ...currentJobPos });
  };
  const changeSelectedJob = (evt: ChangeEvent) => {
    const selectedValue = (evt.target as HTMLSelectElement).value;
    if (!isValidJob(selectedValue)) return;
    setSelectedJob(selectedValue as Jobs);
    newToThisJob(selectedValue as Jobs) &&
      assignFirstTimeToCurrentJobPos(selectedValue as Jobs);
    setCurrentJobPo(currentJobPos[selectedValue as Jobs] as number);
  };

  const changeJobPoint = (state: buttonState) => {
    newToThisJob(selectedJob) && assignFirstTimeToCurrentJobPos(selectedJob);
    const nextJobPo = currentJobPo + state;
    if (!isValidJobPo(nextJobPo)) return;
    setCurrentJobPo(nextJobPo);
    currentJobPos[selectedJob] = nextJobPo;
    setCurrentJobPos({ ...currentJobPos });
    if (shouldChangeStat(state)) applyStatsChange(state);
  };

  const shouldChangeStat = (state: buttonState): boolean => {
    const nextJobPo = currentJobPo + state;
    return Object.keys(jobPointMap[selectedJob] || {}).some((interval) => {
      return nextJobPo % +interval === 0;
    });
  };

  const applyStatsChange = (state: buttonState): void => {
    const nextJobPo = currentJobPo + state;
    const currentAccuStats = JSON.parse(JSON.stringify(accuStats));
    const intervals: Intervals[] = [];
    Object.keys(jobPointMap[selectedJob] as EachJobPointMap).forEach(
      (interval) => {
        if (nextJobPo % +interval === 0) intervals.push(interval as Intervals);
      }
    );

    intervals.forEach((interval) => {
      Object.entries(
        (jobPointMap[selectedJob] as EachJobPointMap)[interval] as StatMap
      ).forEach(([stat, deltaInfo]) => {
        const [delta, limit] = deltaInfo as DeltaInfo;
        if (state > 0) {
          if (
            (delta < 0 && accuStats[stat as Stat] > limit) ||
            (delta > 0 && accuStats[stat as Stat] < limit)
          )
            accuStats[stat as Stat] += delta;
        } else {
          if (
            (delta < 0 && accuStats[stat as Stat] > limit) ||
            (delta > 0 && accuStats[stat as Stat] < limit)
          )
            if (
              currentAccuStats[stat as Stat] !==
                accuStats[stat as Stat] - delta ||
              accuStats[stat as Stat] - delta === 5
            )
              accuStats[stat as Stat] -= delta;
        }
      });
      setAccuStats({ ...accuStats });
    });
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
      <span>{` 잡포인트는 : ${currentJobPo}`}</span>
      <div>{JSON.stringify(currentJobPos)}</div>
      <div>{JSON.stringify(accuStats)}</div>
    </CalculatorWrapper>
  );
}
