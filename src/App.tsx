import { useState, useEffect, MouseEvent } from "react";
import { v4 as uuidv4 } from "uuid";
import { useRouteLinkedList } from "./hooks/useRouteLinkedList";
import {
  getJobNameFromSelect,
  validateJobAddition,
  getCustomQueryFromRLL,
  getCurrentJobsFromQuery,
} from "./lib/routeUtils";
import { shareTableAsImage, handleShareError } from "./lib/shareUtils";
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

export default function App() {
  const {
    rLL,
    version,
    addJob,
    adjustPoint,
    reset: resetRLL,
    setRLL,
  } = useRouteLinkedList();
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
  // Loading state for share functionality
  const [isSharing, setIsSharing] = useState(false);
  const openPanel = () => {
    setIsPanelOpen(true);
    setPanelMode("job-select");
  };
  const closePanel = () => {
    setIsPanelOpen(false);
    // 패널을 닫을 때 빈 row가 있으면 삭제
    if (hasEmptyRow()) {
      setTableLength((prev) => Math.max(1, prev - 1));
      setSelectedIndex(null);
    }
  };

  const adjustJobPoint = (event: MouseEvent) => {
    const buttonValue = (event.target as HTMLButtonElement).textContent;
    if (!buttonValue) return;

    const adjustment = parseInt(buttonValue);
    if (selectedIndex !== null) {
      adjustPoint(selectedIndex, adjustment);
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

    // 단일 검증 함수로 중복 제거
    const error = validateJobAddition(jobName, rLL);
    if (error) {
      setErrorMessage(error);
      return;
    }

    addJob(jobName);

    // 이미 마지막 row가 직업이 없는 빈 row라면 tableLength는 변경하지 않음
    if (!hasEmptyRow()) {
      setTableLength((prev) => Math.max(prev, rLL.length));
    }

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
    resetRLL(); // 훅의 reset 메서드 사용
    setTableLength(1); // 테이블 길이도 초기화
    setSelectedIndex(null); // 선택 해제
    setIsPanelOpen(false); // 패널 닫기
    location.replace(`${location.origin}${location.pathname}`);
  };

  const handleShare = async () => {
    if (isSharing) return; // 이미 공유 중이면 중복 실행 방지

    setIsSharing(true);
    try {
      await shareTableAsImage(rLL);
    } catch (error: any) {
      await handleShareError(error, rLL);
    } finally {
      setIsSharing(false);
    }
  };

  useEffect(() => {
    if (location.search.length > 0) {
      const newRLL = getCurrentJobsFromQuery(location);
      setRLL(newRLL);
      setTableLength(Math.max(1, newRLL.length));
      return;
    }

    const savedData = sessionStorage.getItem("elan-route-save");
    if (savedData) {
      const fakeLocation = { search: `?${savedData}` };
      const newRLL = getCurrentJobsFromQuery(fakeLocation as Location);
      setRLL(newRLL);
      setTableLength(Math.max(1, newRLL.length));
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

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

  useEffect(() => {
    const queryToSave = getCustomQueryFromRLL(rLL);
    if (rLL.length > 0) {
      sessionStorage.setItem("elan-route-save", queryToSave);
    } else {
      sessionStorage.removeItem("elan-route-save");
    }
  }, [rLL, version]); // version 의존성 추가로 모든 변경사항 감지

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
              onClick={handleShare}
              disabled={isSharing}
              className={isSharing ? "opacity-75 cursor-not-allowed" : ""}
            >
              {isSharing ? (
                <span className="flex items-center gap-1">
                  <svg
                    className="animate-spin w-3 h-3"
                    viewBox="0 0 24 24"
                    fill="none"
                  >
                    <circle
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                      className="opacity-25"
                    />
                    <path
                      fill="currentColor"
                      d="m4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      className="opacity-75"
                    />
                  </svg>
                  share
                </span>
              ) : (
                "share"
              )}
            </ElanButton>
            <ElanButton onClick={reset}>reset</ElanButton>
          </div>

          <section className="px-2 pt-10">
            <Table.Container
              className="table-container rounded-xs border border-[#444746] overflow-y-auto"
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
            {(!isPanelOpen || panelMode === "point-adjust") && (
              <div className="flex justify-center mt-2">
                <button
                  onClick={() => {
                    if (hasEmptyRow()) {
                      // 빈 row가 있으면 패널을 열어서 직업 선택 모드로 진입
                      setPanelMode("job-select");
                      setIsPanelOpen(true);
                    } else {
                      addEmptyRow();
                    }
                  }}
                  className={`${
                    hasEmptyRow() ? "px-3 py-1.5 text-sm" : "w-8 h-8"
                  } bg-white hover:bg-gray-100 border border-gray-300 rounded-md flex items-center justify-center transition-colors duration-200 shadow-sm hover:shadow-md`}
                  title={hasEmptyRow() ? "직업 선택 계속하기" : "새 행 추가"}
                >
                  <span
                    className={`text-black leading-none ${
                      hasEmptyRow() ? "font-medium" : "font-bold"
                    }`}
                  >
                    {hasEmptyRow() ? "직업 선택 계속하기" : "+"}
                  </span>
                </button>
              </div>
            )}
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
          <div className="absolute left-3 bottom-2 pl-1 flex gap-x-2 justify-end">
            <a className="text-sm text-neutral-400 font-bold">about</a>
          </div>
        </ElanBox.ContentArea>
      </ElanBox.Border>
    </ElanBox.OuterFrame>
  );
}
