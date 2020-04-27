import React, { useState, useEffect, ChangeEvent, MouseEvent } from "react";
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

type ButtonState =
  | "1"
  | "-1"
  | "5"
  | "-5"
  | "10"
  | "-10"
  | "100"
  | "-100"
  | "reset";

const buttonStates: ButtonState[] = [
  "1",
  "-1",
  "5",
  "-5",
  "10",
  "-10",
  "100",
  "-100",
  "reset",
];

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
  // const statsCache: Stats[] = [];

  const newToThisJob = (job: Jobs): boolean => !(job in currentJobPos);
  const assignFirstTimeToCurrentJobPos = (job: Jobs): void => {
    setCurrentJobPo(0);
    currentJobPos[job] = 0;
    // statsCache[0] = { ...accuStats };
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

  const changeJobPointByOne = (delta: number) => {
    console.log("change Job Po By One", delta);
    // const delta = numberedState > 0 ? 1 : -1;
    // const nextJobPo = currentJobPo + ();
    setCurrentJobPo((_currentJobPo) => {
      const nextJobPo = _currentJobPo + delta;
      if (!isValidJobPo(nextJobPo)) return _currentJobPo;
      setCurrentJobPos((_currentJobPos) => {
        _currentJobPos[selectedJob] = nextJobPo;
        if (shouldChangeStat(_currentJobPo, delta))
          applyStatsChange(_currentJobPo, delta);
        return { ..._currentJobPos };
      });
      return nextJobPo;
    });
    // currentJobPos[selectedJob] = nextJobPo;
    // setCurrentJobPos({ ...currentJobPos });
  };

  const addJobPoint = (numberedChangeState: number) => {
    const actualChange =
      currentJobPo + numberedChangeState > 100
        ? 100 - currentJobPo
        : numberedChangeState;
    // 증가할 때
    /*
    1. 실질변화량을 구한다.
    2. 실질변화량때까지 1씩 증가하면서 스탯의 캐시를 남긴다.
    */
    // 증가할 때
    /*
    1. 잡포인트는 100까지만
    2. 실질변화량이 interval을 지날때마다 해당 스탯이 변경된다.
    3. 스탯마다 리미트까지는 증가 혹 감소하지 않는다.
    4. 리미트이하일때도 감소하지 않는다.
    */
    // 감소할 때
    // 캐시를 쓰자, 증가할때 기록
  };

  const changeJobPoint = (event: MouseEvent) => {
    const changeState = (event.target as HTMLButtonElement)
      .textContent as ButtonState;
    const numberedChangeState = changeState === "reset" ? 4040 : +changeState;

    // for (let i = 0; i < Math.abs(numberedState); i++) {
    //   const delta = numberedState > 0 ? 1 : -1;
    //   changeJobPointByOne(delta);
    // }
  };

  const shouldChangeStat = (currentJobPo: number, delta: number): boolean => {
    const nextJobPo = currentJobPo + delta;
    // const nextJobPo = currentJobPo + numberedState;
    return Object.keys(jobPointMap[selectedJob] || {}).some((interval) => {
      if (delta < 0 && currentJobPo % +interval === 0) return true;
      console.log("shouldCHangeStat", nextJobPo % +interval);
      return nextJobPo % +interval === 0;
    });
  };

  const applyStatsChange = (
    nextJobPo: number,
    deltaDirection: number
  ): void => {
    // const nextJobPo = currentJobPo + numberedState;
    setAccuStats((_accuStats) => {
      const currentAccuStats = JSON.parse(JSON.stringify(_accuStats));
      const intervals: Intervals[] = [];
      Object.keys(jobPointMap[selectedJob] as EachJobPointMap).forEach(
        (interval) => {
          if (nextJobPo % +interval === 0)
            intervals.push(interval as Intervals);
        }
      );

      intervals.forEach((interval) => {
        Object.entries(
          (jobPointMap[selectedJob] as EachJobPointMap)[interval] as StatMap
        ).forEach(([stat, deltaInfo]) => {
          const [delta, limit] = deltaInfo as DeltaInfo;
          if (deltaDirection > 0) {
            if (
              (delta < 0 && _accuStats[stat as Stat] > limit) ||
              (delta > 0 && _accuStats[stat as Stat] < limit)
            )
              _accuStats[stat as Stat] += delta;
          } else {
            if (
              (delta < 0 && _accuStats[stat as Stat] > limit) ||
              (delta > 0 && _accuStats[stat as Stat] < limit)
            )
              if (
                currentAccuStats[stat as Stat] !==
                  _accuStats[stat as Stat] - delta ||
                _accuStats[stat as Stat] - delta === 5
              )
                _accuStats[stat as Stat] -= delta;
          }
        });
      });
      return { ..._accuStats };
      // setAccuStats({ ...accuStats });
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
      {buttonStates.map((buttonState, idx) => {
        return (
          <button onClick={changeJobPoint} key={idx}>
            {buttonState}
          </button>
        );
      })}
      <div>
        <span>{`${selectedJob} | `}</span>
        <span>{` 잡포인트 : ${currentJobPo}`}</span>
      </div>
      <div>{JSON.stringify(currentJobPos, null, 2)}</div>
      <div>{JSON.stringify(accuStats, null, 2)}</div>
    </CalculatorWrapper>
  );
}
