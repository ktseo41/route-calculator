import React, { useState, useEffect, MouseEvent } from "react";
import styled from "styled-components";
import jobList from "./database/job";
import { Jobs, classifiedJobs } from "./database/job";
import RouteLinkedList from "./lib/RouteLinkedList";
import { v4 as uuidv4 } from "uuid";

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

// const H5Div = styled.div`
//   display: inline;
//   font-weight: bold;
//   margin: 0px 10px;
// `;

// const SelectedNodeDiv = styled.div`
//   display: flex;
//   justify-content: flex-start;
// `;

// const SelectedInsideDiv = styled.div`
//   display: flex;
//   justify-content: space-around;

//   & span {
//     margin: 0px 10px;
//   }
// `;

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
    <CalculatorWrapper className="container column is-two-thirds is-offset-2">
      <nav>
        <div
          style={{ padding: "10px 0px" }}
          className="has-text-centered title is-5"
        >
          일랜시아 루트 계산기
        </div>
      </nav>
      <section className="jobs box">
        <div className="buttons are-small">
          {classifiedJobs.reduce(
            (jobButtons2: JSX.Element[], classifieds, idx) => {
              const buttonedClassfiedJobs = classifieds.reduce(
                (jobButtons1: JSX.Element[], jobName: string, idx2: number) => {
                  jobButtons1.push(
                    <button
                      className="button is-primary"
                      onClick={addNewJob}
                      key={uuidv4()}
                    >
                      {jobName}
                    </button>
                  );
                  return jobButtons1;
                },
                []
              );
              jobButtons2.push(
                <div key={uuidv4()} className="container">
                  {buttonedClassfiedJobs}
                </div>
              );
              return jobButtons2;
            },
            []
          )}
        </div>
      </section>
      <section className="adjust box">
        <div className="buttons are-small">
          {buttonStates.map((buttonState, idx) => {
            return (
              <button
                className="button is-primary"
                onClick={adjustJobPoint}
                key={uuidv4()}
              >
                {buttonState}
              </button>
            );
          })}
          <button className="button is-primary" onClick={deleteNode}>
            remove
          </button>
        </div>
      </section>
      <section className="currentStates is-two-thirds">
        <AccusTable className="table is-fullwidth is-narrow is-hoverable">
          <thead>
            <tr>
              <th style={{ minWidth: "114.5px" }} className="has-text-centered">
                직업
              </th>
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
                  key={uuidv4()}
                  className={
                    index === selectedNodeIdx ? "has-background-light" : ""
                  }
                  onClick={(event: MouseEvent) => {
                    setSelectedNode(rLL.get(+event.currentTarget.id));
                    setSelectedNodeIdx(+event.currentTarget.id);
                  }}
                >
                  <td key={uuidv4()} className="has-text-centered">
                    {routeNode?.job}
                  </td>
                  <td key={uuidv4()} className="has-text-centered">
                    {routeNode?.stats.STR}
                  </td>
                  <td key={uuidv4()} className="has-text-centered">
                    {routeNode?.stats.INT}
                  </td>
                  <td key={uuidv4()} className="has-text-centered">
                    {routeNode?.stats.AGI}
                  </td>
                  <td key={uuidv4()} className="has-text-centered">
                    {routeNode?.stats.VIT}
                  </td>
                  <td key={uuidv4()} className="has-text-centered">
                    {routeNode?.jobPo}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </AccusTable>
      </section>
    </CalculatorWrapper>
  );
}
