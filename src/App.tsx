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
`;

const Timer = () => {
  const [nowStr, setNowStr] = useState(new Date().toLocaleTimeString());

  useEffect(() => {
    let count = 0;

    const intervalID = setInterval(() => {
      if (count >= 680) {
        clearInterval(intervalID);
        alert("15분 경과");
      }
      setNowStr(new Date().toLocaleTimeString());
      count += 1;
    }, 1000);
  }, []);

  return <span>{nowStr}</span>;
};

export default function App() {
  const [rLL, setRLL] = useState(new RouteLinkedList());
  const [selectedNode, setSelectedNode] = useState(rLL.tail);
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
          <h5>현재 노드</h5>
          <div>{`직업 : ${job}`}</div>
          <span>{` 잡포인트 : ${jobPo}`}</span>
        </div>
        <div>
          <h5>누적 잡포인트, 스탯</h5>
          <div>{JSON.stringify(currentJobPos, null, 2)}</div>
          <div>{JSON.stringify(stats, null, 2)}</div>
        </div>
      </section>
      <section>
        <table>
          <tr>
            <th>직업</th>
            <th>STR</th>
            <th>INT</th>
            <th>AGI</th>
            <th>VIT</th>
            <th>잡포인트</th>
          </tr>
          {rLL.getAllNodes().map((routeNode, index) => {
            return (
              <tr
                key={index}
                onClick={(event: MouseEvent) => {
                  console.log(event.target);
                }}
              >
                <td>{routeNode?.job}</td>
                <td>{routeNode?.stats.STR}</td>
                <td>{routeNode?.stats.INT}</td>
                <td>{routeNode?.stats.AGI}</td>
                <td>{routeNode?.stats.VIT}</td>
                <td>{routeNode?.jobPo}</td>
              </tr>
            );
          })}
        </table>
      </section>
    </CalculatorWrapper>
  );
}
