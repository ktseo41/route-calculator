import React, { useState, useEffect, MouseEvent } from "react";
import styled from "styled-components";
import jobList from "./database/job";
import { Jobs } from "./database/job";
import RouteLinkedList from "./lib/RouteLinkedList";
import RemoveIcon from "./img/RemoveIcon";

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
  /* border: 1px solid black;
  width: 50%;
  min-width: 300px; */
`;

const AccusTable = styled.table`
  /* border-collapse: collapse; */
  /* text-align: center; */
  /* width: 100%; */

  /* & tr {
    padding: 0 5px;
  }

  & tr.selected {
    background-color: #ffbb00 !important;
  }

  & tr:nth-child(even) {
    background-color: #efefef;
  } */
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

export default function App() {
  const [rLL, setRLL] = useState(new RouteLinkedList());
  const [selectedNode, setSelectedNode] = useState(rLL.tail);
  const [selectedNodeIdx, setSelectedNodeIdx] = useState(0);
  const [job, setJob] = useState(selectedNode?.job);
  const [jobPo, setJobPo] = useState(selectedNode?.jobPo);

  const addNewJob = (event: MouseEvent) => {
    const selectedValue = (event.target as HTMLButtonElement)
      .textContent as Jobs;
    if (rLL.tail?.job === selectedValue) return;
    rLL.add(selectedValue);

    setSelectedNode(rLL.tail);
    setSelectedNodeIdx(rLL.length - 1);
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
    setJob(selectedNode?.job);
    setJobPo(selectedNode?.jobPo);
  };

  const deleteNode = () => {
    if (rLL.length === 1) return;
    rLL.removeAt(selectedNodeIdx);
    setSelectedNode(rLL.get(selectedNodeIdx - 1));
    setSelectedNodeIdx(selectedNodeIdx - 1);
  };

  useEffect(() => {
    setJob(selectedNode?.job);
    setJobPo(selectedNode?.jobPo);
  }, [rLL, selectedNode]);

  return (
    <CalculatorWrapper className="container column is-two-thirds">
      <nav className="navbar">
        <div className="container has-text-centered">
          <a className="navbar-item has-text-dark title is-5">
            일랜시아 루트 계산기
          </a>
        </div>
      </nav>
      <section className="jobs">
        <div className="buttons are-small">
          {jobList.reduce(
            (
              jobButtons: JSX.Element[],
              jobName: string,
              idx: number
            ): JSX.Element[] => {
              jobButtons.push(
                <button
                  className="button is-primary"
                  onClick={addNewJob}
                  key={idx}
                >
                  {jobName}
                </button>
              );
              return jobButtons;
            },
            []
          )}
        </div>
      </section>
      <section className="adjust">
        <div className="buttons are-small">
          {buttonStates.map((buttonState, idx) => {
            return (
              <button className="button" onClick={adjustJobPoint} key={idx}>
                {buttonState}
              </button>
            );
          })}
          <button className="button" onClick={deleteNode}>
            remove
          </button>
        </div>
      </section>
      {/* <section className="selectedNode box">
        <SelectedNodeDiv>
          <H5Div>선택 노드</H5Div>
          <SelectedInsideDiv>
            <span>{`직업 : ${job}`}</span>
            <span>{` 잡포인트 : ${jobPo}`}</span>
          </SelectedInsideDiv>
        </SelectedNodeDiv>
      </section> */}
      <section className="currentStates is-two-thirds">
        <AccusTable className="table is-fullwidth is-narrow is-hoverable">
          <thead>
            <tr>
              <th className="has-text-centered">직업</th>
              <th className="has-text-centered">STR</th>
              <th className="has-text-centered">INT</th>
              <th className="has-text-centered">AGI</th>
              <th className="has-text-centered">VIT</th>
              <th className="has-text-centered">잡포</th>
            </tr>
          </thead>
          <tbody>
            {rLL.getAllNodes().map((routeNode, index) => {
              return (
                <tr
                  id={`${index}`}
                  key={index}
                  className={
                    index === selectedNodeIdx ? "has-background-light" : ""
                  }
                  onClick={(event: MouseEvent) => {
                    setSelectedNode(rLL.get(+event.currentTarget.id));
                    setSelectedNodeIdx(+event.currentTarget.id);
                  }}
                >
                  <td className="has-text-centered">{routeNode?.job}</td>
                  <td className="has-text-centered">{routeNode?.stats.STR}</td>
                  <td className="has-text-centered">{routeNode?.stats.INT}</td>
                  <td className="has-text-centered">{routeNode?.stats.AGI}</td>
                  <td className="has-text-centered">{routeNode?.stats.VIT}</td>
                  <td className="has-text-centered">{routeNode?.jobPo}</td>
                </tr>
              );
            })}
          </tbody>
        </AccusTable>
      </section>
    </CalculatorWrapper>
  );
}
