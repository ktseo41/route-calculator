import React, { useState, useEffect, MouseEvent } from "react";
import { v4 as uuidv4 } from "uuid";
import styled from "styled-components";
import { CustomSystem } from "./database/customsystem";
import { Jobs, classifiedJobs, NumberedJobs } from "./database/job";
import RouteLinkedList from "./lib/routeLinkedList";
import { NotiTitle, NotiMessage } from "./components/NotiMessage";
import { SaveTitle, SaveContent } from "./components/Save";
import { LoadTitle, LoadContent } from "./components/Load";
import Modal from "./components/Modal";

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

function save(rLL: RouteLinkedList) {
  const queryToSave = getCustomQueryFromRLL(rLL);
  if (queryToSave.length === 0) return;
  location.replace(location.origin + "/?" + queryToSave);
}

export default function App() {
  const [rLL, setRLL] = useState(new RouteLinkedList());
  const [selectedNode, setSelectedNode] = useState(rLL.tail);
  const [selectedNodeIdx, setSelectedNodeIdx] = useState(0);
  const [job, setJob] = useState(selectedNode?.job);
  const [jobPo, setJobPo] = useState(selectedNode?.jobPo);
  const [isModalActive, setIsModalActive] = useState(false);
  const [modalTitle, setModalTitle] = useState(<></>);
  const [modalContent, setModalContent] = useState(<></>);

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

    location.replace(`${location.origin}${location.pathname}`);
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
      setModalTitle(
        <div>
          Internet Explorer 11이하는 지원하지 않습니다. 엣지브라우저,
          크롬브라우저, 네이버웨일, 파이어폭스, 오페라브라우저 등을
          사용해주세요!
        </div>
      );
      setIsModalActive(!isModalActive);
    }
  }, []);

  useEffect(() => {
    setJob(selectedNode?.job);
    setJobPo(selectedNode?.jobPo);
  }, [rLL, selectedNode]);

  return (
    <div className="max-w-4xl mx-auto p-2 bg-gray-50 min-h-screen">
      {/* Header Section */}
      <section className="mb-6">
        <div className="pt-4">
          <div>
            <span
              className="text-xl font-bold text-gray-800 cursor-pointer hover:text-blue-600 transition-colors"
              onClick={() => {
                location.reload();
              }}
            >
              ✔️ 일랜시아 루트 계산기
            </span>
          </div>
        </div>
      </section>

      {/* Utility Bar */}
      <section className="flex justify-between items-center mb-6 px-2 py-3 bg-white rounded-lg shadow-sm">
        <div className="flex gap-4">
          <button
            className="px-3 py-1 text-sm text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded transition-colors"
            onClick={() => {
              setModalTitle(<NotiTitle />);
              setModalContent(<NotiMessage />);
              setIsModalActive(true);
            }}
          >
            info
          </button>
        </div>
        <div className="flex gap-4">
          <button
            className="px-3 py-1 text-sm text-green-600 hover:text-green-800 hover:bg-green-50 rounded transition-colors"
            onClick={() => {
              const queryToSave = getCustomQueryFromRLL(rLL);
              const urlToSave = `${location.origin}${location.pathname}${queryToSave.length === 0 ? "" : `?${queryToSave}`
                }`;

              setModalTitle(<SaveTitle />);
              setModalContent(
                <SaveContent urlToSave={urlToSave} />
              );
              setIsModalActive(true);
            }}
          >
            save
          </button>
          <button
            className="px-3 py-1 text-sm text-purple-600 hover:text-purple-800 hover:bg-purple-50 rounded transition-colors"
            onClick={() => {
              setModalTitle(<LoadTitle />);
              setModalContent(<LoadContent />);
              setIsModalActive(true);
            }}
          >
            load
          </button>
          <button
            className="px-3 py-1 text-sm text-red-600 hover:text-red-800 hover:bg-red-50 rounded transition-colors"
            onClick={reset}
          >
            reset
          </button>
        </div>
      </section>

      {/* Job Selection Section */}
      <section className="mb-6 disable-double-tap">
        <h3 className="text-lg font-semibold text-gray-700 mb-2">직업 선택</h3>
        <div className="bg-white p-3 rounded-lg shadow-sm">
          {/* 전사 계열 직업 */}
          <div className="mb-4 pb-4 border-b border-gray-100">
            {/* 1차 직업 */}
            <div className="mb-3">
              <div className="flex flex-wrap gap-2">
                {["무도가", "투사", "전사", "검사", "검객", "자객", "궁사", "악사", "네크로멘서"].map((jobName) => (
                  <button
                    key={jobName}
                    className="text-sm px-3 py-2 bg-red-50 hover:bg-red-100 hover:text-red-700 rounded border border-red-200 transition-all duration-200 hover:border-red-300"
                    onClick={addNewJob}
                  >
                    {jobName}
                  </button>
                ))}
              </div>
            </div>

            {/* 2차 직업 */}
            <div className="mb-1">
              <div className="flex flex-wrap gap-2">
                {["순수기사", "빛의기사", "어둠의기사", "순수마법사", "빛의마법사", "어둠의마법사"].map((jobName) => (
                  <button
                    key={jobName}
                    className="text-sm px-3 py-2 bg-orange-50 hover:bg-orange-100 hover:text-orange-700 rounded border border-orange-200 transition-all duration-200 hover:border-orange-300"
                    onClick={addNewJob}
                  >
                    {jobName}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* 모험가 계열 직업 */}
          <div className="mb-4 pb-4 border-b border-gray-100">
            <div className="flex flex-wrap items-center gap-2">
              {/* 1차 직업 */}
              <button
                className="text-sm px-3 py-2 bg-green-50 hover:bg-green-100 hover:text-green-700 rounded border border-green-200 transition-all duration-200 hover:border-green-300"
                onClick={addNewJob}
              >
                모험가
              </button>
              
              {/* 세로 구분선 */}
              <div className="h-8 w-px bg-gray-200"></div>
              
              {/* 2차 직업 */}
              {["탐색가", "자연인", "음유시인"].map((jobName) => (
                <button
                  key={jobName}
                  className="text-sm px-3 py-2 bg-blue-50 hover:bg-blue-100 hover:text-blue-700 rounded border border-blue-200 transition-all duration-200 hover:border-blue-300"
                  onClick={addNewJob}
                >
                  {jobName}
                </button>
              ))}
              
              {/* 세로 구분선 */}
              <div className="h-8 w-px bg-gray-200"></div>
              
              {/* 3차 직업 */}
              <button
                className="text-sm px-3 py-2 bg-purple-50 hover:bg-purple-100 hover:text-purple-700 rounded border border-purple-200 transition-all duration-200 hover:border-purple-300"
                onClick={addNewJob}
              >
                정령술사
              </button>
            </div>
          </div>

          {/* 상인 계열 직업 */}
          <div>
            <div className="flex flex-wrap gap-2">
              <button
                className="text-sm px-3 py-2 bg-yellow-50 hover:bg-yellow-100 hover:text-yellow-700 rounded border border-yellow-200 transition-all duration-200 hover:border-yellow-300"
                onClick={addNewJob}
              >
                상인
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Point Adjustment Section */}
      <section className="mb-6 disable-double-tap">
        <h3 className="text-lg font-semibold text-gray-700 mb-3">포인트 조정</h3>
        <div className="bg-white p-4 rounded-lg shadow-sm">
          <div className="flex flex-wrap gap-2 justify-center">
            {buttonsValues.map((buttonValue) => {
              const isPositive = !buttonValue.startsWith('-');
              const buttonClass = isPositive
                ? "bg-green-100 hover:bg-green-200 text-green-700 border-green-300"
                : "bg-red-100 hover:bg-red-200 text-red-700 border-red-300";

              return (
                <button
                  className={`text-sm px-4 py-2 rounded border transition-all duration-200 font-medium ${buttonClass}`}
                  onClick={adjustJobPoint}
                  key={uuidv4()}
                >
                  {buttonValue}
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* Results Table Section */}
      {/* Results Table */}
      <section>
        <h3 className="text-lg font-semibold text-gray-700 mb-3">현재 상태</h3>
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-xs sm:text-sm">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-2 sm:px-3 py-2 text-left font-medium text-gray-600 border-b">직업</th>
                  <th className="px-1 sm:px-2 py-2 text-center font-medium text-gray-600 border-b">STR</th>
                  <th className="px-1 sm:px-2 py-2 text-center font-medium text-gray-600 border-b">INT</th>
                  <th className="px-1 sm:px-2 py-2 text-center font-medium text-gray-600 border-b">AGI</th>
                  <th className="px-1 sm:px-2 py-2 text-center font-medium text-gray-600 border-b">VIT</th>
                  <th className="px-1 sm:px-2 py-2 text-center font-medium text-gray-600 border-b">잡포</th>
                </tr>
              </thead>
              <tbody>
                {rLL.getAllNodes().map((routeNode, index) => {
                  return (
                    <tr
                      key={uuidv4()}
                      className={index % 2 === 0 ? "bg-white" : "bg-gray-50"}
                      id={`${index}`}
                      onClick={(event: MouseEvent) => {
                        setSelectedNode(rLL.get(+event.currentTarget.id));
                        setSelectedNodeIdx(+event.currentTarget.id);
                      }}
                    >
                      <td className="px-2 sm:px-3 py-2 font-medium text-gray-800 border-b text-xs sm:text-sm whitespace-nowrap cursor-pointer">
                        {routeNode?.job}
                      </td>
                      <td className="px-1 sm:px-2 py-2 text-center text-gray-600 border-b cursor-pointer">
                        {routeNode?.stats.STR}
                      </td>
                      <td className="px-1 sm:px-2 py-2 text-center text-gray-600 border-b cursor-pointer">
                        {routeNode?.stats.INT}
                      </td>
                      <td className="px-1 sm:px-2 py-2 text-center text-gray-600 border-b cursor-pointer">
                        {routeNode?.stats.AGI}
                      </td>
                      <td className="px-1 sm:px-2 py-2 text-center text-gray-600 border-b cursor-pointer">
                        {routeNode?.stats.VIT}
                      </td>
                      <td className="px-1 sm:px-2 py-2 text-center text-gray-600 border-b cursor-pointer">
                        {routeNode?.jobPo}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      <Modal
        isActive={isModalActive}
        setIsActive={setIsModalActive}
        title={modalTitle}
        content={modalContent}
      />
    </div>
  );
}
