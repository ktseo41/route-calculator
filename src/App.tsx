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
import favicon from "./img/faviconV2.png";

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
  // Error message for invalid job selection
  const [errorMessage, setErrorMessage] = useState<string>("");
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
        setErrorMessage("같은 직업을 연속으로 선택할 수 없습니다.");
        return;
      }
      // 마지막 노드의 currentJobPos에서 해당 직업이 이미 100인지 확인
      if (rLL.tail && rLL.tail.currentJobPos[jobName] === 100) {
        setErrorMessage(
          "해당 직업은 이미 잡포인트 100입니다. 더 추가할 수 없습니다."
        );
        return;
      }
      rLL.add(jobName);
      setPanelMode("point-adjust");
      setSelectedIndex(rLL.length - 1);
      setErrorMessage("");
      return;
    }
    // 마지막 직업과 동일하면 추가하지 않음
    if (rLL.tail?.job === jobName) {
      setErrorMessage("같은 직업을 연속으로 선택할 수 없습니다.");
      return;
    }
    if (rLL.tail && rLL.tail.currentJobPos[jobName] === 100) {
      setErrorMessage(
        "해당 직업은 이미 잡포인트 100입니다. 더 추가할 수 없습니다."
      );
      return;
    }
    rLL.add(jobName);
    setTableLength((prev) => Math.max(prev, rLL.length));
    setPanelMode("point-adjust");
    setSelectedIndex(rLL.length - 1);
    setErrorMessage("");
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

  useEffect(() => {
    if (!errorMessage) return;
    const timeout = setTimeout(() => {
      setErrorMessage("");
    }, 2500);
    return () => clearTimeout(timeout);
  }, [errorMessage]);

  return (
    <ElanBox.OuterFrame className="pretendard h-dvh relative pt-2 bg-[#131314] text-[#e3e3e3]">
      <ElanBox.Border>
        <ElanBox.ContentArea>
          <ElanButton className="absolute top-[8px] left-3 pl-2 pr-3 py-0.5 flex items-center text-lg leading-none z-10">
            <img
              src={favicon}
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

          <section className="px-2 pt-10">
            <Table.Container
              className="rounded-xs border border-[#444746] overflow-y-auto"
              style={{
                maxHeight: isPanelOpen
                  ? "calc(100dvh - 100px - 45dvh)"
                  : "calc(100dvh - 100px)",
                WebkitOverflowScrolling: "touch",
              }}
            >
              <Table className="text-md">
                <TableHeader className="bg-[#131314] shadow-[0_1px_0_#444746] [&_th]:font-bold">
                  <TableRow>
                    <TableHead>직업</TableHead>
                    <TableHead>STR</TableHead>
                    <TableHead>INT</TableHead>
                    <TableHead>AGI</TableHead>
                    <TableHead>VIT</TableHead>
                    <TableHead>잡포</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {Array.from(
                    {
                      length: Math.max(tableLength, rLL.getAllNodes().length),
                    },
                    (_, index) => {
                      const routeNode = rLL.get(index);
                      const isSelected = selectedIndex === index;
                      return (
                        <TableRow
                          key={uuidv4()}
                          id={`${index}`}
                          className="relative odd:bg-[#131314] even:bg-[#232321]"
                          onClick={() => {
                            if (routeNode) {
                              setSelectedIndex(index);
                              setPanelMode("point-adjust");
                              setIsPanelOpen(true);
                            } else {
                              // 빈 행 클릭: 새 직업 추가 모드 (선택 표시 유지)
                              setSelectedIndex(index);
                              setPanelMode("job-select");
                              setIsPanelOpen(true);
                            }
                          }}
                        >
                          <TableCell className="cursor-pointer relative">
                            {/* Selection indicator */}
                            {isSelected && (
                              <div
                                className="absolute inset-y-0 left-0 w-[2px] bg-gradient-to-b from-[#B1C51A] via-[#839E3D] to-[#91671F] transition-opacity duration-200 z-10"
                                style={{ opacity: isPanelOpen ? 1 : 0.9 }}
                              />
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
                          <TableCell className="text-center cursor-pointer">
                            {routeNode?.jobPo || ""}
                          </TableCell>
                        </TableRow>
                      );
                    }
                  )}
                </TableBody>
              </Table>
            </Table.Container>

            {/* Add Row Button */}
            <div className="flex justify-center mt-2">
              <button
                onClick={addEmptyRow}
                className="w-8 h-8 bg-white hover:bg-gray-100 border border-gray-300 rounded-md flex items-center justify-center transition-colors duration-200 shadow-sm hover:shadow-md"
                title="새 행 추가"
              >
                <span className="text-black text-lg font-bold leading-none">
                  +
                </span>
              </button>
            </div>
          </section>

          {/* Bottom Panel (was drawer) */}
          {isPanelOpen && (
            <div
              className="absolute left-1.5 right-1.5 bottom-2 z-50 bg-neutral-900 overflow-hidden"
              style={{ height: "45dvh" }}
            >
              <div className="h-8 flex items-center border-b border-neutral-800 pl-2 pr-1 relative">
                {errorMessage && (
                  <div className="flex-1 text-[11px] text-red-400 font-medium leading-tight break-keep pr-7">
                    {errorMessage}
                  </div>
                )}
                <button
                  aria-label="닫기"
                  onClick={closePanel}
                  className="w-7 h-7 flex items-center justify-center rounded hover:bg-neutral-800 text-neutral-400 hover:text-neutral-200 transition-colors absolute right-1 top-1/2 -translate-y-1/2"
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
        </ElanBox.ContentArea>
      </ElanBox.Border>
    </ElanBox.OuterFrame>
  );
}
