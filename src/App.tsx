import React, { useState, useEffect, ChangeEvent, MouseEvent } from "react";
import styled from "styled-components";
import jobList from "./database/job";
import { Jobs } from "./database/job";
import RouteLinkedList, { RouteNode } from "./lib/RouteLinkedList";

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

export default function App() {
  const [rLL, setRLL] = useState(new RouteLinkedList());
  const [job, setJob] = useState(rLL.tail?.job);
  const [jobPo, setJobPo] = useState(rLL.tail?.jobPo);
  const [stats, setStats] = useState(rLL.tail?.stats);
  const [currentJobPos, setCurrentJobPos] = useState(rLL.tail?.currentJobPos);

  const addNewJob = (event: MouseEvent) => {
    const selectedValue = (event.target as HTMLButtonElement)
      .textContent as Jobs;
    rLL.add(selectedValue);

    setJob(rLL.tail?.job);
    setJobPo(rLL.tail?.jobPo);
    setCurrentJobPos(rLL.tail?.currentJobPos);
    setStats(rLL.tail?.stats);
  };

  const adjustJobPoint = (event: MouseEvent) => {
    const changeState = (event.target as HTMLButtonElement)
      .textContent as ButtonState;
    if (changeState === "reset") {
      setRLL(new RouteLinkedList());
      return;
    }
    const numberedChangeState = +changeState;
    rLL.tail?.adjustJobPoint(numberedChangeState);

    setJobPo(rLL.tail?.jobPo);
    setCurrentJobPos(rLL.tail?.currentJobPos);
    setStats(rLL.tail?.stats);
  };

  useEffect(() => {
    setJob(rLL.tail?.job);
    setJobPo(rLL.tail?.jobPo);
    setCurrentJobPos(rLL.tail?.currentJobPos);
    setStats(rLL.tail?.stats);
  }, [rLL]);

  return (
    <CalculatorWrapper>
      <section>
        <label htmlFor="job-select"></label>
        {jobList.reduce(
          (
            jobButtons: JSX.Element[],
            jobName: string,
            idx: number
          ): JSX.Element[] => {
            jobButtons.push(
              <button onClick={addNewJob} key={idx}>
                {jobName}
              </button>
            );
            return jobButtons;
          },
          []
        )}
      </section>
      <section>
        {buttonStates.map((buttonState, idx) => {
          return (
            <button onClick={adjustJobPoint} key={idx}>
              {buttonState}
            </button>
          );
        })}
      </section>
      <section>
        <div>
          <div>{`직업 : ${job}`}</div>
          <span>{` 잡포인트 : ${jobPo}`}</span>
        </div>
        <div>{JSON.stringify(currentJobPos, null, 2)}</div>
        <div>{JSON.stringify(stats, null, 2)}</div>
      </section>
      <section>
        {rLL.getAllNodes().map((routeNode, index) => {
          return (
            <div key={index}>
              <span>{routeNode?.job}</span>
              <span>{routeNode?.jobPo}</span>
              <span>{JSON.stringify(routeNode?.stats)}</span>
            </div>
          );
        })}
      </section>
    </CalculatorWrapper>
  );
}
