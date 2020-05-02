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
  /* height: 500px; */
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
  const [job, setJob] = useState(selectedNode?.job);
  const [jobPo, setJobPo] = useState(selectedNode?.jobPo);
  const [stats, setStats] = useState(selectedNode?.stats);
  const [currentJobPos, setCurrentJobPos] = useState(
    selectedNode?.currentJobPos
  );

  const addNewJob = (event: MouseEvent) => {
    const selectedValue = (event.target as HTMLButtonElement)
      .textContent as Jobs;
    rLL.add(selectedValue);

    setSelectedNode(rLL.tail);

    setJob(selectedNode?.job);
    setJobPo(selectedNode?.jobPo);
    setCurrentJobPos(selectedNode?.currentJobPos);
    setStats(selectedNode?.stats);
  };

  const adjustJobPoint = (event: MouseEvent) => {
    const changeState = (event.target as HTMLButtonElement)
      .textContent as ButtonState;
    if (changeState === "reset") {
      setRLL(() => {
        const newRLL = new RouteLinkedList();
        setSelectedNode(newRLL.tail);
        return newRLL;
      });
      return;
    }
    const numberedChangeState = +changeState;
    console.log(`in APP.tsx, adjustJobPoint, changeState ${changeState}`);
    selectedNode?.adjustJobPoint(numberedChangeState);

    setJobPo(selectedNode?.jobPo);
    setCurrentJobPos(selectedNode?.currentJobPos);
    setStats(selectedNode?.stats);
  };

  useEffect(() => {
    setJob(selectedNode?.job);
    setJobPo(selectedNode?.jobPo);
    setCurrentJobPos(selectedNode?.currentJobPos);
    setStats(selectedNode?.stats);
  }, [rLL, selectedNode]);

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
          <h5>누적 스탯</h5>
          <div>{JSON.stringify(stats, null, 2)}</div>
          <h5>누적 잡포</h5>
          <div>{JSON.stringify(currentJobPos, null, 2)}</div>
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
                id={`${index}`}
                key={index}
                onClick={(event: MouseEvent) => {
                  setSelectedNode(rLL.get(+event.currentTarget.id));
                  console.log(event.currentTarget);
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
