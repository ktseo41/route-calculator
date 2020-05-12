import React, { useState, useEffect, MouseEvent } from "react";
import styled from "styled-components";
import jobList from "./database/job";
import { Jobs } from "./database/job";
import RouteLinkedList, { RouteNode } from "./lib/RouteLinkedList";
import "bulma/css/bulma.css";

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
    <CalculatorWrapper>
      <section className="hero">
        <div className="hero-body">
          <div className="container">
            <h1 className="title">일랜시아 루트 계산기</h1>
            <h2 className="subtitle">by L삼계인</h2>
          </div>
        </div>
      </section>
      <section>
        <div className=" buttons">
          {jobList.reduce(
            (
              jobButtons: JSX.Element[],
              jobName: string,
              idx: number
            ): JSX.Element[] => {
              jobButtons.push(
                <button className="button" onClick={addNewJob} key={idx}>
                  {jobName}
                </button>
              );
              return jobButtons;
            },
            []
          )}
        </div>
      </section>
      <section className="buttons ">
        {buttonStates.map((buttonState, idx) => {
          return (
            <button className="button " onClick={adjustJobPoint} key={idx}>
              {buttonState}
            </button>
          );
        })}
        <button className="button column" onClick={deleteNode}>
          remove
        </button>
      </section>
      <section>
        <SelectedNodeDiv>
          <H5Div>선택 노드</H5Div>
          <SelectedInsideDiv>
            <span>{`직업 : ${job}`}</span>
            <span>{` 잡포인트 : ${jobPo}`}</span>
          </SelectedInsideDiv>
        </SelectedNodeDiv>
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
