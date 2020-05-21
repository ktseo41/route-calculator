import React, { useState, useEffect, MouseEvent } from "react";
import styled from "styled-components";
import { Jobs, classifiedJobs } from "./database/job";
import RouteLinkedList from "./lib/RouteLinkedList";
import { v4 as uuidv4 } from "uuid";

type ButtonState = "1" | "-1" | "5" | "-5" | "10" | "-10" | "100" | "-100";

const buttonsValues: ButtonState[] = [
  "1",
  "-1",
  "5",
  "-5",
  "10",
  "-10",
  "100",
  "-100",
];

const CalculatorWrapper = styled.div``;

function getJobNameFromSelect(event: MouseEvent) {
  return (event.target as HTMLButtonElement).textContent as Jobs;
}

function getAdjustPoint(event: MouseEvent): number {
  return +((event.target as HTMLButtonElement).textContent as ButtonState);
}

export default function App() {
  const [rLL, setRLL] = useState(new RouteLinkedList());
  const [selectedNode, setSelectedNode] = useState(rLL.tail);
  const [selectedNodeIdx, setSelectedNodeIdx] = useState(0);
  const [job, setJob] = useState(selectedNode?.job);
  const [jobPo, setJobPo] = useState(selectedNode?.jobPo);

  const addNewJob = (event: MouseEvent) => {
    const jobName = getJobNameFromSelect(event);

    if (rLL.tail?.job === jobName) return;
    rLL.add(jobName);

    setSelectedNode(rLL.tail);
    setSelectedNodeIdx(rLL.length - 1);
  };

  const adjustJobPoint = (event: MouseEvent) => {
    const adjustPoint = getAdjustPoint(event);
    selectedNode?.adjustJobPoint(adjustPoint);
    setJob(selectedNode?.job);
    setJobPo(selectedNode?.jobPo);
  };

  const deleteNode = (selectedNodeIdx: string | undefined) => {
    if (selectedNodeIdx === undefined) return;
    if (rLL.length === 1) return;

    const numberedIndex = +selectedNodeIdx;
    rLL.removeAt(numberedIndex);
    setSelectedNode(rLL.get(numberedIndex - 1));
    setSelectedNodeIdx(numberedIndex - 1);
  };

  const reset = () => {
    setRLL(() => {
      const newRLL = new RouteLinkedList();

      setSelectedNode(newRLL.tail);
      setSelectedNodeIdx(0);

      return newRLL;
    });
  };

  useEffect(() => {
    setJob(selectedNode?.job);
    setJobPo(selectedNode?.jobPo);
  }, [rLL, selectedNode]);

  return (
    <CalculatorWrapper className="container">
      <nav>
        <div
          style={{ padding: "10px 0px" }}
          className="has-text-centered title is-5"
        >
          <span style={{ cursor: "pointer" }} onClick={reset}>
            일랜시아 루트 계산기
          </span>
        </div>
      </nav>
      <section
        style={{ marginBottom: "10px" }}
        className="jobs disable-double-tap container column is-two-thirds-desktop is-two-thirds-tablet"
      >
        <div className="container">
          {classifiedJobs.reduce((jobGroups: JSX.Element[], group) => {
            const groupedJobButtons = group.reduce(
              (jobButtons: JSX.Element[], jobName: string) => {
                jobButtons.push(
                  <button
                    style={{
                      fontSize: "0.8rem",
                      padding: "calc(0.5em - 1px) 1em",
                    }}
                    className="button column is-outlined"
                    onClick={addNewJob}
                    key={uuidv4()}
                  >
                    {jobName}
                  </button>
                );
                return jobButtons;
              },
              []
            );
            jobGroups.push(
              <div
                key={uuidv4()}
                className="container buttons is-small columns is-multiline"
              >
                {groupedJobButtons}
              </div>
            );
            return jobGroups;
          }, [])}
        </div>
      </section>
      <section className="adjust disable-double-tap column is-two-thirds-desktop is-two-thirds-tablet container">
        <div className="buttons columns is-multiline are-small">
          {buttonsValues.map((buttonValue) => {
            return (
              <button
                style={{ fontSize: "0.8rem", padding: "calc(0.5em - 1px) 1em" }}
                className="button column is-outlined is-mobile"
                onClick={adjustJobPoint}
                key={uuidv4()}
              >
                {buttonValue}
              </button>
            );
          })}
          {/* <button className="button is-primary" onClick={deleteNode}>
            remove
          </button> */}
        </div>
      </section>
      <section className="currentStates container is-two-thirds-desktop is-two-thirds-tablet disable-double-tap">
        <table className="table is-fullwidth is-narrow is-hoverable">
          <thead>
            <tr>
              <th style={{ minWidth: "104px" }} className="has-text-centered">
                직업
              </th>
              <th className="has-text-centered">STR</th>
              <th className="has-text-centered">INT</th>
              <th className="has-text-centered">AGI</th>
              <th className="has-text-centered">VIT</th>
              <th style={{ minWidth: "46.4px" }} className="has-text-centered">
                잡포
              </th>
              <th></th>
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
                  <td
                    style={{ minWidth: "37.6px" }}
                    key={uuidv4()}
                    className="has-text-centered"
                  >
                    {index !== 0 && (
                      <a
                        onClick={(event: MouseEvent) => {
                          deleteNode(
                            event.currentTarget.parentElement?.parentElement?.id
                          );
                        }}
                        className="delete"
                      ></a>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </section>
    </CalculatorWrapper>
  );
}
