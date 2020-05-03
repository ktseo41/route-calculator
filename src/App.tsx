import React, { useState, useEffect, ChangeEvent, MouseEvent } from "react";
import styled from "styled-components";
import jobList from "./database/job";
import { Jobs } from "./database/job";
import RouteLinkedList, { RouteNode } from "./lib/RouteLinkedList";
import { Stats, Stat } from "./database/jobPointMap";

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

const AccusTable = styled.table`
  border-collapse: collapse;
  text-align: center;
  width: 100%;

  & tr {
    padding: 0 5px;
  }

  & tr.selected {
    background-color: #ffbb00 !important;
  }

  & tr:nth-child(even) {
    background-color: #efefef;
  }
`;

const H5Div = styled.div`
  display: inline;
  font-weight: bold;
  margin: 0px 10px;
`;

const SelectedNodeDiv = styled.div`
  display: flex;
  justify-content: flex-start;
`;

const SelectedInsideDiv = styled.div`
  display: flex;
  justify-content: space-around;

  & span {
    margin: 0px 10px;
  }
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
  const [selectedNodeIdx, setSelectedNodeIdx] = useState(0);
  const [job, setJob] = useState(selectedNode?.job);
  const [jobPo, setJobPo] = useState(selectedNode?.jobPo);
  const [stats, setStats] = useState(selectedNode?.stats);

  const addNewJob = (event: MouseEvent) => {
    const selectedValue = (event.target as HTMLButtonElement)
      .textContent as Jobs;
    if (rLL.tail?.job === selectedValue) return;
    rLL.add(selectedValue);

    setSelectedNode(rLL.tail);
    setSelectedNodeIdx(rLL.length - 1);

    setJob(selectedNode?.job);
    setJobPo(selectedNode?.jobPo);
    setStats(selectedNode?.stats);
  };

  const adjustJobPoint = (event: MouseEvent) => {
    const changeState = (event.target as HTMLButtonElement)
      .textContent as ButtonState;
    if (changeState === "reset") {
      setRLL(() => {
        const newRLL = new RouteLinkedList();
        setSelectedNode(newRLL.tail);
        setSelectedNodeIdx(0);
        return newRLL;
      });
      return;
    }
    const numberedChangeState = +changeState;
    selectedNode?.adjustJobPoint(numberedChangeState);

    setJobPo(selectedNode?.jobPo);
    setStats(selectedNode?.stats);
  };

  useEffect(() => {
    setJob(selectedNode?.job);
    setJobPo(selectedNode?.jobPo);
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
        <SelectedNodeDiv>
          <H5Div>선택 노드</H5Div>
          <SelectedInsideDiv>
            <span>{`직업 : ${job}`}</span>
            <span>{` 잡포인트 : ${jobPo}`}</span>
          </SelectedInsideDiv>
        </SelectedNodeDiv>
        {/* <div>
          <h5>선택 노드 스탯</h5>
          <table>
            <thead>
              <tr>
                <th>STR</th>
                <th>INT</th>
                <th>AGI</th>
                <th>VIT</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                {Object.values(stats || {}).map((statValue, statIdx) => {
                  return <td key={statIdx}>{statValue}</td>;
                })}
              </tr>
            </tbody>
          </table>
        </div> */}
      </section>
      <section>
        <AccusTable>
          <thead>
            <tr>
              <th>직업</th>
              <th>STR</th>
              <th>INT</th>
              <th>AGI</th>
              <th>VIT</th>
              <th>잡포인트</th>
            </tr>
          </thead>
          <tbody>
            {rLL.getAllNodes().map((routeNode, index) => {
              return (
                <tr
                  id={`${index}`}
                  key={index}
                  className={index === selectedNodeIdx ? "selected" : ""}
                  onClick={(event: MouseEvent) => {
                    setSelectedNode(rLL.get(+event.currentTarget.id));
                    setSelectedNodeIdx(+event.currentTarget.id);
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
          </tbody>
        </AccusTable>
      </section>
    </CalculatorWrapper>
  );
}
