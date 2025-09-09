import React, { useState, useEffect, MouseEvent } from "react";
import { v4 as uuidv4 } from "uuid";
import { CustomSystem } from "./database/customsystem";
import { Jobs, NumberedJobs } from "./database/job";
import RouteLinkedList from "./lib/routeLinkedList";
import ElanBox from "./components/ElanBox";
import ElanButton from "./components/ElanButton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./components/ui/table";

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

export default function App() {
  const [rLL, setRLL] = useState(new RouteLinkedList());
  const [selectedNode, setSelectedNode] = useState(rLL.tail);

  const addNewJob = (event: MouseEvent) => {
    const jobName = getJobNameFromSelect(event);

    if (rLL.tail?.job === jobName) return;
    rLL.add(jobName);

    setSelectedNode(rLL.tail);
  };

  const adjustJobPoint = (event: MouseEvent) => {
    const adjustPoint = getAdjustPoint(event);
    selectedNode?.adjustJobPoint(adjustPoint);
  };

  const reset = () => {
    setRLL(() => {
      const newRLL = new RouteLinkedList();

      setSelectedNode(newRLL.tail);

      return newRLL;
    });

    location.replace(`${location.origin}${location.pathname}`);
  };

  useEffect(() => {
    if (location.search.length === 0) return;
    setRLL(getCurrentJobsFromQuery(location));
  }, []);

  return (
    <ElanBox className="pretendard">
      <ElanButton className="absolute top-[3px] left-3 pl-2 pr-3 py-0.5 flex items-center text-lg leading-none z-10">
        <img
          src="/src/img/faviconV2.png"
          alt="Elan Logo"
          className="inline-block w-4 h-4 mr-1 align-middle"
        />
        ROUTE CALCULATOR
      </ElanButton>
      <div className="max-w-4xl mx-auto min-h-screen">
        {/* Results Table Section */}
        <section>
          <div className="bg-stone-900 rounded-sm shadow-sm overflow-hidden border border-stone-700">
            <div className="overflow-x-auto">
              <Table className="dark w-full text-sm">
                <TableHeader>
                  <TableRow>
                    <TableHead>직업</TableHead>
                    <TableHead>STR</TableHead>
                    <TableHead>INT</TableHead>
                    <TableHead>AGI</TableHead>
                    <TableHead>VIT</TableHead>
                    <TableHead>잡포</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody className="divide-y divide-stone-700 [&_tr:nth-child(even)]:bg-stone-800">
                  {Array.from(
                    { length: Math.max(10, rLL.getAllNodes().length) },
                    (_, index) => {
                      const routeNode = rLL.get(index);
                      return (
                        <TableRow
                          key={uuidv4()}
                          id={`${index}`}
                          onClick={(event: MouseEvent) => {
                            if (routeNode) {
                              setSelectedNode(rLL.get(+event.currentTarget.id));
                            }
                          }}
                        >
                          <TableCell className="font-medium cursor-pointer">
                            {routeNode?.job || ""}
                          </TableCell>
                          <TableCell className="text-center cursor-pointer">
                            {routeNode?.stats.STR || ""}
                          </TableCell>
                          <TableCell className="text-center cursor-pointer">
                            {routeNode?.stats.INT || ""}
                          </TableCell>
                          <TableCell className="text-center cursor-pointer">
                            {routeNode?.stats.AGI || ""}
                          </TableCell>
                          <TableCell className="text-center cursor-pointer">
                            {routeNode?.stats.VIT || ""}
                          </TableCell>
                          <TableCell className="text-center cursor-pointer">
                            {routeNode?.jobPo || ""}
                          </TableCell>
                        </TableRow>
                      );
                    }
                  )}
                </TableBody>
              </Table>
              {/* <table className="w-full text-xs sm:text-sm">
                <thead className="bg-stone-800">
                  <tr>
                    <th className="px-2 sm:px-3 py-2 text-left font-medium text-stone-300 border-b border-stone-600 text-sm">
                      직업
                    </th>
                    <th className="px-1 sm:px-2 py-2 text-center font-medium text-stone-300 border-b border-stone-600 text-sm">
                      STR
                    </th>
                    <th className="px-1 sm:px-2 py-2 text-center font-medium text-stone-300 border-b border-stone-600 text-sm">
                      INT
                    </th>
                    <th className="px-1 sm:px-2 py-2 text-center font-medium text-stone-300 border-b border-stone-600 text-sm">
                      AGI
                    </th>
                    <th className="px-1 sm:px-2 py-2 text-center font-medium text-stone-300 border-b border-stone-600 text-sm">
                      VIT
                    </th>
                    <th className="px-1 sm:px-2 py-2 text-center font-medium text-stone-300 border-b border-stone-600 text-sm">
                      잡포
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {Array.from(
                    { length: Math.max(10, rLL.getAllNodes().length) },
                    (_, index) => {
                      const routeNode = rLL.get(index);
                      return (
                        <tr
                          key={uuidv4()}
                          className={
                            index % 2 === 0 ? "bg-stone-900" : "bg-stone-800"
                          }
                          id={`${index}`}
                          onClick={(event: MouseEvent) => {
                            if (routeNode) {
                              setSelectedNode(rLL.get(+event.currentTarget.id));
                            }
                          }}
                        >
                          <td className="px-2 sm:px-3 py-2 h-8 font-medium text-stone-200 border-b border-stone-600 text-sm whitespace-nowrap cursor-pointer">
                            {routeNode?.job || ""}
                          </td>
                          <td className="px-1 sm:px-2 py-2 h-8 text-center text-stone-300 border-b border-stone-600 text-sm cursor-pointer">
                            {routeNode?.stats.STR || ""}
                          </td>
                          <td className="px-1 sm:px-2 py-2 h-8 text-center text-stone-300 border-b border-stone-600 text-sm cursor-pointer">
                            {routeNode?.stats.INT || ""}
                          </td>
                          <td className="px-1 sm:px-2 py-2 h-8 text-center text-stone-300 border-b border-stone-600 text-sm cursor-pointer">
                            {routeNode?.stats.AGI || ""}
                          </td>
                          <td className="px-1 sm:px-2 py-2 h-8 text-center text-stone-300 border-b border-stone-600 text-sm cursor-pointer">
                            {routeNode?.stats.VIT || ""}
                          </td>
                          <td className="px-1 sm:px-2 py-2 h-8 text-center text-stone-300 border-b border-stone-600 text-sm cursor-pointer">
                            {routeNode?.jobPo || ""}
                          </td>
                        </tr>
                      );
                    }
                  )}
                </tbody>
              </table> */}
            </div>
          </div>
        </section>

        {/* Utility Bar */}
        <div className="absolute right-2 top-[3px] flex">
          <ElanButton
            onClick={() => {
              const queryToSave = getCustomQueryFromRLL(rLL);
              const urlToSave = `${location.origin}${location.pathname}${
                queryToSave.length === 0 ? "" : `?${queryToSave}`
              }`;
            }}
          >
            save
          </ElanButton>
          <ElanButton onClick={reset}>reset</ElanButton>
        </div>

        {/* Job Selection Section */}
        <section className="mb-6 disable-double-tap">
          <div className="p-2">
            {/* 전사 계열 직업 */}
            <div className="mb-4 pb-4 border-b border-gray-600">
              {/* 1차 직업 */}
              <div className="mb-3">
                <div className="flex flex-wrap gap-2">
                  {[
                    "무도가",
                    "투사",
                    "전사",
                    "검사",
                    "검객",
                    "자객",
                    "궁사",
                    "악사",
                    "네크로멘서",
                  ].map((jobName) => (
                    <button
                      key={jobName}
                      className="text-sm px-3 py-2 bg-gray-700 hover:bg-red-600 text-red-300 hover:text-white rounded border border-red-500 transition-all duration-200 hover:border-red-400 shadow-[inset_1px_1px_1px_rgba(255,255,255,0.1),_inset_-1px_-1px_1px_rgba(0,0,0,0.3)]"
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
                  {[
                    "순수기사",
                    "빛의기사",
                    "어둠의기사",
                    "순수마법사",
                    "빛의마법사",
                    "어둠의마법사",
                  ].map((jobName) => (
                    <button
                      key={jobName}
                      className="text-sm px-3 py-2 bg-gray-700 hover:bg-orange-600 text-orange-300 hover:text-white rounded border border-orange-500 transition-all duration-200 hover:border-orange-400 shadow-[inset_1px_1px_1px_rgba(255,255,255,0.1),_inset_-1px_-1px_1px_rgba(0,0,0,0.3)]"
                      onClick={addNewJob}
                    >
                      {jobName}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* 모험가 계열 직업 */}
            <div className="mb-4 pb-4 border-b border-gray-600">
              <div className="flex flex-wrap items-center gap-2">
                {/* 1차 직업 */}
                <button
                  className="text-sm px-3 py-2 bg-gray-700 hover:bg-green-600 text-green-300 hover:text-white rounded border border-green-500 transition-all duration-200 hover:border-green-400 shadow-[inset_1px_1px_1px_rgba(255,255,255,0.1),_inset_-1px_-1px_1px_rgba(0,0,0,0.3)]"
                  onClick={addNewJob}
                >
                  모험가
                </button>

                {/* 세로 구분선 */}
                <div className="h-8 w-px bg-gray-600"></div>

                {/* 2차 직업 */}
                {["탐색가", "자연인", "음유시인"].map((jobName) => (
                  <button
                    key={jobName}
                    className="text-sm px-3 py-2 bg-gray-700 hover:bg-blue-600 text-blue-300 hover:text-white rounded border border-blue-500 transition-all duration-200 hover:border-blue-400 shadow-[inset_1px_1px_1px_rgba(255,255,255,0.1),_inset_-1px_-1px_1px_rgba(0,0,0,0.3)]"
                    onClick={addNewJob}
                  >
                    {jobName}
                  </button>
                ))}

                {/* 세로 구분선 */}
                <div className="h-8 w-px bg-gray-600"></div>

                {/* 3차 직업 */}
                <button
                  className="text-sm px-3 py-2 bg-gray-700 hover:bg-purple-600 text-purple-300 hover:text-white rounded border border-purple-500 transition-all duration-200 hover:border-purple-400 shadow-[inset_1px_1px_1px_rgba(255,255,255,0.1),_inset_-1px_-1px_1px_rgba(0,0,0,0.3)]"
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
                  className="text-sm px-3 py-2 bg-gray-700 hover:bg-yellow-600 text-yellow-300 hover:text-white rounded border border-yellow-500 transition-all duration-200 hover:border-yellow-400 shadow-[inset_1px_1px_1px_rgba(255,255,255,0.1),_inset_-1px_-1px_1px_rgba(0,0,0,0.3)]"
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
          <h3 className="text-lg font-semibold text-gray-300 mb-3">
            포인트 조정
          </h3>
          <div className="p-4 border-t border-b border-gray-700">
            <div className="flex flex-wrap gap-2 justify-center">
              {buttonsValues.map((buttonValue) => {
                const isPositive = !buttonValue.startsWith("-");
                const buttonClass = isPositive
                  ? "bg-gray-700 hover:bg-green-600 text-green-300 hover:text-white border-green-500 hover:border-green-400"
                  : "bg-gray-700 hover:bg-red-600 text-red-300 hover:text-white border-red-500 hover:border-red-400";

                return (
                  <button
                    className={`text-sm px-4 py-2 rounded border transition-all duration-200 font-medium shadow-[inset_1px_1px_1px_rgba(255,255,255,0.1),_inset_-1px_-1px_1px_rgba(0,0,0,0.3)] ${buttonClass}`}
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
      </div>
    </ElanBox>
  );
}
