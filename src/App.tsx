import { useState, useEffect, MouseEvent } from "react";
import { v4 as uuidv4 } from "uuid";
import { CustomSystem } from "./database/customsystem";
import { Jobs, NumberedJobs } from "./database/job";
import RouteLinkedList from "./lib/routeLinkedList";
import ElanBox from "./components/ElanBox";
import ElanButton from "./components/ElanButton";
import JobSelector from "./components/JobSelector";
import PointAdjuster from "./components/PointAdjuster";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./components/ui/table";

function getJobNameFromSelect(event: MouseEvent) {
  return (event.target as HTMLButtonElement).textContent as Jobs;
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

// {/* <section className="mb-6 disable-double-tap">
//           <div className="p-2">
//             {/* 전사 계열 직업 */}
//             <div className="mb-4 pb-4 border-b border-gray-600">
//               {/* 1차 직업 */}
//               <div className="mb-3">
//                 <div className="flex flex-wrap gap-2">
//                   {[
//                     "무도가",
//                     "투사",
//                     "전사",
//                     "검사",
//                     "검객",
//                     "자객",
//                     "궁사",
//                     "악사",
//                     "네크로멘서",
//                   ].map((jobName) => (
//                     <button
//                       key={jobName}
//                       className="text-sm px-3 py-2 bg-gray-700 hover:bg-red-600 text-red-300 hover:text-white rounded border border-red-500 transition-all duration-200 hover:border-red-400 shadow-[inset_1px_1px_1px_rgba(255,255,255,0.1),_inset_-1px_-1px_1px_rgba(0,0,0,0.3)]"
//                       onClick={addNewJob}
//                     >
//                       {jobName}
//                     </button>
//                   ))}
//                 </div>
//               </div>

//               {/* 2차 직업 */}
//               <div className="mb-1">
//                 <div className="flex flex-wrap gap-2">
//                   {[
//                     "순수기사",
//                     "빛의기사",
//                     "어둠의기사",
//                     "순수마법사",
//                     "빛의마법사",
//                     "어둠의마법사",
//                   ].map((jobName) => (
//                     <button
//                       key={jobName}
//                       className="text-sm px-3 py-2 bg-gray-700 hover:bg-orange-600 text-orange-300 hover:text-white rounded border border-orange-500 transition-all duration-200 hover:border-orange-400 shadow-[inset_1px_1px_1px_rgba(255,255,255,0.1),_inset_-1px_-1px_1px_rgba(0,0,0,0.3)]"
//                       onClick={addNewJob}
//                     >
//                       {jobName}
//                     </button>
//                   ))}
//                 </div>
//               </div>
//             </div>

//             {/* 모험가 계열 직업 */}
//             <div className="mb-4 pb-4 border-b border-gray-600">
//               <div className="flex flex-wrap items-center gap-2">
//                 {/* 1차 직업 */}
//                 <button
//                   className="text-sm px-3 py-2 bg-gray-700 hover:bg-green-600 text-green-300 hover:text-white rounded border border-green-500 transition-all duration-200 hover:border-green-400 shadow-[inset_1px_1px_1px_rgba(255,255,255,0.1),_inset_-1px_-1px_1px_rgba(0,0,0,0.3)]"
//                   onClick={addNewJob}
//                 >
//                   모험가
//                 </button>

//                 {/* 세로 구분선 */}
//                 <div className="h-8 w-px bg-gray-600"></div>

//                 {/* 2차 직업 */}
//                 {["탐색가", "자연인", "음유시인"].map((jobName) => (
//                   <button
//                     key={jobName}
//                     className="text-sm px-3 py-2 bg-gray-700 hover:bg-blue-600 text-blue-300 hover:text-white rounded border border-blue-500 transition-all duration-200 hover:border-blue-400 shadow-[inset_1px_1px_1px_rgba(255,255,255,0.1),_inset_-1px_-1px_1px_rgba(0,0,0,0.3)]"
//                     onClick={addNewJob}
//                   >
//                     {jobName}
//                   </button>
//                 ))}

//                 {/* 세로 구분선 */}
//                 <div className="h-8 w-px bg-gray-600"></div>

//                 {/* 3차 직업 */}
//                 <button
//                   className="text-sm px-3 py-2 bg-gray-700 hover:bg-purple-600 text-purple-300 hover:text-white rounded border border-purple-500 transition-all duration-200 hover:border-purple-400 shadow-[inset_1px_1px_1px_rgba(255,255,255,0.1),_inset_-1px_-1px_1px_rgba(0,0,0,0.3)]"
//                   onClick={addNewJob}
//                 >
//                   정령술사
//                 </button>
//               </div>
//             </div>

//             {/* 상인 계열 직업 */}
//             <div>
//               <div className="flex flex-wrap gap-2">
//                 <button
//                   className="text-sm px-3 py-2 bg-gray-700 hover:bg-yellow-600 text-yellow-300 hover:text-white rounded border border-yellow-500 transition-all duration-200 hover:border-yellow-400 shadow-[inset_1px_1px_1px_rgba(255,255,255,0.1),_inset_-1px_-1px_1px_rgba(0,0,0,0.3)]"
//                   onClick={addNewJob}
//                 >
//                   상인
//                 </button>
//               </div>
//             </div>
//           </div>
//         </section> */}

export default function App() {
  const [rLL, setRLL] = useState(new RouteLinkedList());
  const [tableLength, setTableLength] = useState(1); // 테이블 표시 길이
  // Currently selected row index for point adjustment
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  // Bottom panel open state (was drawer)
  const [isPanelOpen, setIsPanelOpen] = useState(false);
  // Bottom panel mode: 'job-select' | 'point-adjust'
  const [panelMode, setPanelMode] = useState<"job-select" | "point-adjust">(
    "job-select"
  );
  const openPanel = () => {
    setIsPanelOpen(true);
    setPanelMode("job-select");
  };
  const closePanel = () => setIsPanelOpen(false);

  const adjustJobPoint = (event: MouseEvent) => {
    const buttonValue = (event.target as HTMLButtonElement).textContent;
    if (!buttonValue) return;

    const adjustment = parseInt(buttonValue);
    if (selectedIndex !== null) {
      const targetNode = rLL.get(selectedIndex);
      if (targetNode) {
        targetNode.adjustJobPoint(adjustment);
      }
      setRLL(Object.assign(Object.create(Object.getPrototypeOf(rLL)), rLL)); // force re-render
    }
  };

  // 빈 row가 이미 있으면 추가하지 않음
  const hasEmptyRow = () => {
    const nodes = rLL.getAllNodes();
    return nodes.length < tableLength;
  };

  // 직업을 선택해야만 row가 추가됨
  const addNewJob = (event: MouseEvent) => {
    const jobName = getJobNameFromSelect(event);
    // 이미 마지막 row가 직업이 없는 빈 row라면, 그 자리에 직업을 할당
    if (hasEmptyRow()) {
      // 마지막 노드와 동일 직업이면 무시 (연속 추가 방지)
      if (rLL.tail?.job === jobName) {
        closePanel();
        return;
      }
      rLL.add(jobName);
      setPanelMode("point-adjust");
      setSelectedIndex(rLL.length - 1);
      return;
    }
    // 마지막 직업과 동일하면 추가하지 않음
    if (rLL.tail?.job === jobName) {
      closePanel();
      return;
    }
    rLL.add(jobName);
    setTableLength((prev) => Math.max(prev, rLL.length));
    setPanelMode("point-adjust");
    setSelectedIndex(rLL.length - 1);
  };

  // 빈 row가 없을 때만 추가
  const addEmptyRow = () => {
    if (hasEmptyRow()) return;
    const newLength = tableLength + 1;
    setTableLength(newLength);
    setTimeout(() => {
      setSelectedIndex(newLength - 1); // 새로 추가된 row의 인덱스
    }, 0);
    openPanel();
  };

  const scrollToRow = (index: number) => {
    const element = document.getElementById(`${index}`);
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  };

  const reset = () => {
    setRLL(() => {
      const newRLL = new RouteLinkedList();

      return newRLL;
    });

    location.replace(`${location.origin}${location.pathname}`);
  };

  useEffect(() => {
    if (location.search.length === 0) return;
    setRLL(getCurrentJobsFromQuery(location));
  }, []);

  useEffect(() => {
    if (selectedIndex !== null) {
      scrollToRow(selectedIndex);
    }
  }, [selectedIndex]);

  return (
    <ElanBox className="pretendard h-screen relative pt-2">
      <ElanButton className="absolute top-[8px] left-3 pl-2 pr-3 py-0.5 flex items-center text-lg leading-none z-10">
        <img
          src="/src/img/faviconV2.png"
          alt="Elan Logo"
          className="inline-block w-4 h-4 mr-1 align-middle"
        />
        ROUTE CALCULATOR
      </ElanButton>
      {/* Utility Bar */}
      <div className="absolute right-2 top-[8px] flex">
        <ElanButton
          onClick={() => {
            const queryToSave = getCustomQueryFromRLL(rLL);
            const urlToSave = `${location.origin}${location.pathname}${
              queryToSave.length === 0 ? "" : `?${queryToSave}`
            }`;
            console.log(urlToSave);
          }}
        >
          save
        </ElanButton>
        <ElanButton onClick={reset}>reset</ElanButton>
      </div>

      <section>
        <Table
          containerClassName={`border border-neutral-700 rounded-lg text-neutral-100 font-bold ${
            isPanelOpen ? "overflow-y-auto" : ""
          }`}
          style={
            isPanelOpen
              ? { maxHeight: "calc(100vh - 120px - 45vh)" }
              : undefined
          }
        >
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
          <TableBody className="[&_tr:nth-child(even)]:bg-neutral-900">
            {Array.from(
              { length: Math.max(tableLength, rLL.getAllNodes().length) },
              (_, index) => {
                const routeNode = rLL.get(index);
                const isSelected = selectedIndex === index;
                return (
                  <TableRow
                    key={uuidv4()}
                    id={`${index}`}
                    className={
                      isSelected
                        ? "bg-neutral-800/40 hover:bg-neutral-800/50 relative"
                        : "relative"
                    }
                    onClick={() => {
                      if (routeNode) {
                        setSelectedIndex(index);
                        setPanelMode("point-adjust");
                        setIsPanelOpen(true);
                      } else {
                        // 빈 행 클릭: 새 직업 추가 모드
                        setSelectedIndex(null);
                        openPanel();
                      }
                    }}
                  >
                    <TableCell className="cursor-pointer relative">
                      {/* Selection indicator */}
                      {isSelected && (
                        <div className="absolute inset-y-0 left-0 w-[2px] bg-gradient-to-b from-[#B1C51A] via-[#839E3D] to-[#91671F] transition-opacity duration-200 z-10" 
                             style={{ opacity: isPanelOpen ? 1 : 0.9 }} />
                      )}
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
                    <TableCell className="text-center cursor-pointer text-gray-400">
                      {routeNode?.jobPo || ""}
                    </TableCell>
                  </TableRow>
                );
              }
            )}
          </TableBody>
        </Table>

        {/* Add Row Button */}
        <div className="flex justify-center mt-2">
          <button
            onClick={addEmptyRow}
            className="w-8 h-8 bg-white hover:bg-gray-100 border border-gray-300 rounded-md flex items-center justify-center transition-colors duration-200 shadow-sm hover:shadow-md"
            title="새 행 추가"
          >
            <span className="text-black text-lg font-bold leading-none">+</span>
          </button>
        </div>
      </section>

      {/* Point Adjustment Section */}
      {/* <section className="absolute bottom-2 left-2 right-2 px-1 pb-2 pt-3 border-t border-neutral-700 disable-double-tap">
        <div className="grid grid-cols-4 md:grid-cols-8 gap-4">
          {buttonsValues.map((buttonValue) => {
            const isPositive = !buttonValue.startsWith("-");
            const buttonClass = isPositive
              ? "bg-neutral-600 hover:bg-neutral-500 text-neutral-300 hover:text-white border border-neutral-500"
              : "bg-neutral-700 hover:bg-neutral-600 text-neutral-300 hover:text-white border border-neutral-600";

            return (
              <button
                className={`text-sm min-w-14 py-2 px-3 rounded border transition-all duration-200 font-medium ${buttonClass}`}
                onClick={adjustJobPoint}
                key={uuidv4()}
              >
                {buttonValue}
              </button>
            );
          })}
        </div>
      </section> */}
      {/* Bottom Panel (was drawer) */}
      {isPanelOpen && (
        <div
          className="absolute left-1.5 right-1.5 bottom-2 z-50 bg-neutral-900 overflow-hidden"
          style={{ height: "45vh" }}
        >
          <div className="h-8 flex items-center justify-end border-b border-neutral-800 px-1">
            <button
              aria-label="닫기"
              onClick={closePanel}
              className="w-7 h-7 flex items-center justify-center rounded hover:bg-neutral-800 text-neutral-400 hover:text-neutral-200 transition-colors"
            >
              <svg
                viewBox="0 0 24 24"
                width="18"
                height="18"
                stroke="currentColor"
                strokeWidth="2"
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
          </div>
          <div
            className="overflow-y-auto"
            style={{ height: "calc(45vh - 32px)" }}
          >
            {panelMode === "job-select" ? (
              <JobSelector onJobSelect={addNewJob} />
            ) : (
              <PointAdjuster onPointAdjust={adjustJobPoint} />
            )}
          </div>
        </div>
      )}
    </ElanBox>
  );
}
