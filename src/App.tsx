import React, { useState, useEffect, MouseEvent } from "react";
import { v4 as uuidv4 } from "uuid";
import styled from "styled-components";
import { CustomSystem } from "./database/customsystem";
import { Jobs, classifiedJobs, NumberedJobs } from "./database/job";
import RouteLinkedList from "./lib/RouteLinkedList";
import NotiMessage from "./components/NotiMessage";

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

const Title = styled.div`
  padding-top: 10px;
`;

const NotiButton = styled.span`
  border-style: solid;
  border-width: 1px;
  border-color: #dbdbdb;
  color: #818181;
  border-radius: 50%;
  font-size: 0.7em;
  padding: 0 3.8px;
  position: relative;
  margin-bottom: 3px;
  margin-left: 10px;
  cursor: pointer;
`;

const UtilBarSection = styled.section`
  display: flex;
  justify-content: space-between;
  padding: 0px 10px 10px 0px;
`;

const UtilBarLeft = styled.div`
  display: flex;
`;

const UtilBarRight = styled.div`
  display: flex;
`;

const UtilBarItem = styled.div`
  margin-left: 10px;
  cursor: pointer;
`;

const CustomButton = styled.div`
  font-size: 0.8rem;
  padding: calc(0.5em - 1px) 1em;
`;

const CalculatorWrapper = styled.div``;

function getJobNameFromSelect(event: MouseEvent) {
  return (event.target as HTMLButtonElement).textContent as Jobs;
}

function getAdjustPoint(event: MouseEvent): number {
  return +((event.target as HTMLButtonElement).textContent as ButtonState);
}

function getCustomQueryFromRLL(rLL: RouteLinkedList): string {
  let result = "";
  let point = rLL.head?.next;

  while (point) {
    result += CustomSystem[NumberedJobs[point.job]];
    if (point.jobPo > 57 && point.jobPo !== 100) {
      result += CustomSystem[57];
      result += CustomSystem[point.jobPo - 57];
    } else {
      result += CustomSystem[point.jobPo];
    }
    point = point.next;
  }

  return result;
}

function getCurrentJobsFromQuery({ search }: Location): RouteLinkedList {
  /*
  _가 발견되면 다음 _가 있는지 탐색한다.
   */
  let isJob: boolean = true;
  const newRLL = new RouteLinkedList();
  for (let index = 1; index < search.length; index++) {
    const charCustom = search[index] as keyof typeof CustomSystem;
    let decimalNumber = CustomSystem[charCustom];

    if (isJob) {
      const job = NumberedJobs[decimalNumber];
      newRLL.add(job as Jobs);
      isJob = !isJob;
    } else {
      if (decimalNumber === 57) {
        if (isOverFiftySeven(search.slice(index + 1))) {
          const nextCharCustom = search[index + 1] as keyof typeof CustomSystem;
          const nextDecimal = CustomSystem[nextCharCustom];

          decimalNumber += nextDecimal;
          index += 1;
        }
      }
      newRLL.tail?.adjustJobPoint(decimalNumber);
      isJob = !isJob;
    }
  }

  return newRLL;
}

function isOverFiftySeven(restString: string): boolean {
  const nextFiftySevenIndex = restString.indexOf("_");
  if (nextFiftySevenIndex === -1) {
    return restString.length % 2 === 1;
  }
  return nextFiftySevenIndex % 2 === 0;
}

export default function App() {
  const [rLL, setRLL] = useState(new RouteLinkedList());
  const [selectedNode, setSelectedNode] = useState(rLL.tail);
  const [selectedNodeIdx, setSelectedNodeIdx] = useState(0);
  const [job, setJob] = useState(selectedNode?.job);
  const [jobPo, setJobPo] = useState(selectedNode?.jobPo);
  const [isNotiOn, setIsNotiOn] = useState(false);
  const [iE11Message, setIE11Message] = useState("");

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

    location.replace(location.origin);
  };

  useEffect(() => {
    if (location.search.length === 0) return;
    setRLL(getCurrentJobsFromQuery(location));
  }, []);

  useEffect(() => {
    interface Document {
      documentMode?: any;
    }

    var isIE11 = /*@cc_on!@*/ false || !!(document as Document).documentMode;
    if (isIE11) {
      setIE11Message(
        "Internet Explorer 11이하는 지원하지 않습니다. 엣지브라우저, 크롬브라우저, 네이버웨일, 파이어폭스, 오페라브라우저 등을 사용해주세요!"
      );
      setIsNotiOn(!isNotiOn);
    }
  }, []);

  useEffect(() => {
    setJob(selectedNode?.job);
    setJobPo(selectedNode?.jobPo);
  }, [rLL, selectedNode]);

  return (
    <CalculatorWrapper className="container">
      <section>
        <Title className="has-text-centered is-size-5 has-text-weight-semibold">
          <div>
            <span
              style={{ cursor: "pointer" }}
              onClick={() => {
                location.reload();
              }}
            >
              ✔️ 루트 계산기
            </span>
          </div>

          {
            <NotiMessage
              isNotiOn={isNotiOn}
              setIsNotiOn={setIsNotiOn}
              iE11Message={iE11Message}
            />
          }
        </Title>
      </section>
      <UtilBarSection className="util-bar container column is-two-thirds-desktop is-two-thirds-tablet">
        <UtilBarLeft>
          <UtilBarItem
            onClick={() => {
              setIsNotiOn(!isNotiOn);
            }}
          >
            info
          </UtilBarItem>
        </UtilBarLeft>
        <UtilBarRight>
          <UtilBarItem
            onClick={() => {
              const queryToSave = getCustomQueryFromRLL(rLL);
              if (queryToSave.length === 0) return;
              location.replace(location.origin + "/?" + queryToSave);
            }}
          >
            save
          </UtilBarItem>
          <UtilBarItem>load</UtilBarItem>
          <UtilBarItem onClick={reset}>reset</UtilBarItem>
        </UtilBarRight>
      </UtilBarSection>
      <section
        style={{ marginBottom: "10px" }}
        className="jobs disable-double-tap container column is-two-thirds-desktop is-two-thirds-tablet"
      >
        <div className="container">
          {classifiedJobs.reduce((jobGroups: JSX.Element[], group) => {
            const groupedJobButtons = group.reduce(
              (jobButtons: JSX.Element[], jobName: string) => {
                jobButtons.push(
                  <CustomButton
                    className="button column is-outlined"
                    onClick={addNewJob}
                    key={uuidv4()}
                  >
                    {jobName}
                  </CustomButton>
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
              <CustomButton
                className="button column is-outlined is-mobile"
                onClick={adjustJobPoint}
                key={uuidv4()}
              >
                {buttonValue}
              </CustomButton>
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
