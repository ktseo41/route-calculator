# 코드 개선점 종합 분석 보고서

> 작성일: 2025-10-14  
> 분석 대상: route-calculator 프로젝트 전체 코드베이스

## 목차

- [1. RouteLinkedList 반응성 문제 (Critical)](#1-routelinkedlist-반응성-문제-critical)
- [2. 불필요한 상태 관리 (Medium)](#2-불필요한-상태-관리-medium)
- [3. 함수 중복 및 복잡도 (Medium)](#3-함수-중복-및-복잡도-medium)
- [4. useEffect 최적화 (Low-Medium)](#4-useeffect-최적화-low-medium)
- [5. RouteLinkedList 클래스 내부 개선 (Medium)](#5-routelinkedlist-클래스-내부-개선-medium)
- [6. 컴포넌트 분리 및 재사용성 (Low)](#6-컴포넌트-분리-및-재사용성-low)
- [7. 타입 안정성 개선 (Low-Medium)](#7-타입-안정성-개선-low-medium)
- [8. 성능 최적화 (Low)](#8-성능-최적화-low)
- [우선순위 요약](#우선순위-요약)
- [추가 제안](#추가-제안)

---

## 🔴 1. RouteLinkedList 반응성 문제 (Critical)

### 현재 문제점

`RouteLinkedList`는 객체의 내부 상태만 변경하므로 React가 변경을 감지하지 못합니다.

**App.tsx 115번째 줄:**

```tsx
setRLL(Object.assign(Object.create(Object.getPrototypeOf(rLL)), rLL)); // force re-render
```

**문제:**
- 이 방식은 **임시방편**이며, 다른 곳에서는 적용되지 않아 일관성이 없습니다.
- `addNewJob`, `addEmptyRow` 등에서는 강제 re-render가 없습니다.
- 상태 변경이 누락될 위험이 높습니다.

### 제안하는 해결방법

#### 방안 1: useRouteLinkedList 커스텀 훅 (권장 ⭐)

```tsx
// src/hooks/useRouteLinkedList.ts
import { useState, useCallback } from 'react';
import RouteLinkedList from '@/lib/routeLinkedList';
import { Jobs } from '@/database/job';

export function useRouteLinkedList(initialRLL?: RouteLinkedList) {
  const [rLL, setRLL] = useState(initialRLL || new RouteLinkedList());
  const [version, setVersion] = useState(0);
  
  const forceUpdate = useCallback(() => {
    setVersion(v => v + 1);
  }, []);
  
  const addJob = useCallback((job: Jobs) => {
    const result = rLL.add(job);
    forceUpdate();
    return result;
  }, [rLL, forceUpdate]);
  
  const adjustPoint = useCallback((index: number, delta: number) => {
    const node = rLL.get(index);
    if (node) {
      node.adjustJobPoint(delta);
      forceUpdate();
    }
  }, [rLL, forceUpdate]);
  
  const removeAt = useCallback((index: number) => {
    const result = rLL.removeAt(index);
    forceUpdate();
    return result;
  }, [rLL, forceUpdate]);
  
  const reset = useCallback(() => {
    setRLL(new RouteLinkedList());
    setVersion(0);
  }, []);
  
  return { 
    rLL, 
    version, 
    addJob, 
    adjustPoint, 
    removeAt, 
    reset 
  };
}
```

**사용 예시:**

```tsx
// App.tsx
function App() {
  const { rLL, version, addJob, adjustPoint, reset } = useRouteLinkedList();
  
  const addNewJob = (event: MouseEvent) => {
    const jobName = getJobNameFromSelect(event);
    addJob(jobName); // 자동으로 re-render 트리거
  };
  
  const adjustJobPoint = (event: MouseEvent) => {
    const adjustment = parseInt(buttonValue);
    if (selectedIndex !== null) {
      adjustPoint(selectedIndex, adjustment); // 자동으로 re-render 트리거
    }
  };
}
```

**장점:**
- ✅ 반응성 로직을 한 곳에 집중
- ✅ rLL 조작 시 항상 반응성 보장
- ✅ 테스트 용이
- ✅ 일관된 인터페이스

#### 방안 2: Immer 사용

```tsx
import produce from 'immer';

const adjustJobPoint = (event: MouseEvent) => {
  setRLL(produce(draft => {
    const targetNode = draft.get(selectedIndex);
    if (targetNode) {
      targetNode.adjustJobPoint(adjustment);
    }
  }));
};
```

**장점:**
- ✅ 불변성 자동 처리
- ✅ 코드가 더 직관적

**단점:**
- ⚠️ 추가 의존성 필요
- ⚠️ 클래스 인스턴스와 호환성 문제 가능

---

## 🟠 2. 불필요한 상태 관리 (Medium)

### 2.1 `tableLength` 상태의 모호함

**현재 코드:**

```tsx
const [tableLength, setTableLength] = useState(1); // 테이블 표시 길이
```

**문제점:**
- `rLL.length`와 `tableLength`가 항상 동기화되는지 불명확
- "빈 row"를 표시하기 위한 용도이지만, `hasEmptyRow()`로 계산 가능
- 상태 동기화 실수 가능성

**개선안:**

```tsx
// tableLength 상태 제거하고 computed value로 대체
const displayLength = useMemo(() => {
  const baseLength = rLL.length;
  // 패널이 열려있고 job-select 모드면 빈 row 하나 추가 표시
  const hasEmptyRow = isPanelOpen && panelMode === 'job-select' && rLL.length === rLL.getAllNodes().length;
  return Math.max(1, baseLength + (hasEmptyRow ? 1 : 0));
}, [rLL.length, isPanelOpen, panelMode, version]); // version 의존성 추가

// 렌더링 시
Array.from({ length: displayLength }, (_, index) => {
  const routeNode = rLL.get(index);
  // ...
})
```

**효과:**
- ✅ 상태 하나 제거
- ✅ 동기화 문제 제거
- ✅ 더 명확한 의도

### 2.2 `selectedIndex`와 `isPanelOpen` 중복

**문제점:**
- `selectedIndex !== null` 과 `isPanelOpen`이 거의 항상 같은 의미
- 두 상태를 따로 관리하면 불일치 가능성

**현재 상태:**

```tsx
const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
const [isPanelOpen, setIsPanelOpen] = useState(false);
const [panelMode, setPanelMode] = useState<"job-select" | "point-adjust">("job-select");
```

**개선안 1: selectedIndex로 isPanelOpen 유도**

```tsx
const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
const [panelMode, setPanelMode] = useState<"job-select" | "point-adjust">("job-select");

// computed value
const isPanelOpen = selectedIndex !== null;

const closePanel = () => {
  setSelectedIndex(null);
  // 패널을 닫을 때 빈 row 정리 로직
};
```

**개선안 2: 단일 상태 객체로 통합 (더 명확 ⭐)**

```tsx
type PanelState = {
  index: number;
  mode: 'job-select' | 'point-adjust';
} | null;

const [panelState, setPanelState] = useState<PanelState>(null);

// 사용
const isPanelOpen = panelState !== null;
const selectedIndex = panelState?.index ?? null;
const panelMode = panelState?.mode ?? 'job-select';

// 패널 열기
setPanelState({ index: 5, mode: 'point-adjust' });

// 패널 닫기
setPanelState(null);
```

**효과:**
- ✅ 상태 일관성 보장
- ✅ 불가능한 상태 조합 제거
- ✅ 더 명확한 의도

---

## 🟡 3. 함수 중복 및 복잡도 (Medium)

### 3.1 `hasEmptyRow()` 로직의 복잡성

**현재 코드:**

```tsx
const hasEmptyRow = () => {
  const nodes = rLL.getAllNodes();
  return nodes.length < tableLength;
};
```

**문제점:**
- `tableLength` 상태에 의존
- 함수 이름과 실제 동작의 관계가 불명확
- 매번 `getAllNodes()` 호출

**개선안:**

```tsx
// tableLength 제거 후
const hasIncompleteLastRow = useMemo(() => {
  return isPanelOpen && 
         panelMode === 'job-select' && 
         (selectedIndex === rLL.length); // 마지막 row가 빈 row
}, [isPanelOpen, panelMode, selectedIndex, rLL.length, version]);
```

### 3.2 `addNewJob`의 중복 검증 로직

**현재 코드 (중복된 검증):**

```tsx
const addNewJob = (event: MouseEvent) => {
  const jobName = getJobNameFromSelect(event);
  
  // 첫 번째 검증 블록
  if (hasEmptyRow()) {
    if (rLL.tail?.job === jobName) {
      setErrorMessage("같은 직업을 연속으로 선택할 수 없습니다.");
      return;
    }
    if (rLL.tail && rLL.tail.currentJobPos[jobName] === 100) {
      setErrorMessage("해당 직업은 이미 잡포인트 100입니다. 더 추가할 수 없습니다.");
      return;
    }
    // ... 추가 로직
  }
  
  // 두 번째 검증 블록 (동일한 검증 반복!)
  if (rLL.tail?.job === jobName) {
    setErrorMessage("같은 직업을 연속으로 선택할 수 없습니다.");
    return;
  }
  if (rLL.tail && rLL.tail.currentJobPos[jobName] === 100) {
    setErrorMessage("해당 직업은 이미 잡포인트 100입니다. 더 추가할 수 없습니다.");
    return;
  }
  // ... 추가 로직
};
```

**개선안:**

```tsx
// 검증 로직 분리
const validateJobAddition = (jobName: Jobs): string | null => {
  if (!rLL.tail) return null; // 첫 직업 추가는 항상 가능
  
  if (rLL.tail.job === jobName) {
    return "같은 직업을 연속으로 선택할 수 없습니다.";
  }
  
  if (rLL.tail.currentJobPos[jobName] === 100) {
    return "해당 직업은 이미 잡포인트 100입니다. 더 추가할 수 없습니다.";
  }
  
  return null;
};

const addNewJob = useCallback((event: MouseEvent) => {
  const jobName = getJobNameFromSelect(event);
  
  // 단일 검증
  const error = validateJobAddition(jobName);
  if (error) {
    setErrorMessage(error);
    return;
  }
  
  // 추가 로직
  addJob(jobName); // useRouteLinkedList 훅 사용
  setPanelMode("point-adjust");
  setSelectedIndex(rLL.length - 1);
  setErrorMessage("");
}, [rLL, addJob, setSelectedIndex, setPanelMode, setErrorMessage]);
```

**효과:**
- ✅ 중복 코드 제거
- ✅ 단일 책임 원칙
- ✅ 테스트 가능한 순수 함수
- ✅ 재사용 가능

---

## 🟢 4. useEffect 최적화 (Low-Medium)

### 4.1 불필요한 useEffect 호출

**현재 코드:**

```tsx
useEffect(() => {
  const queryToSave = getCustomQueryFromRLL(rLL);
  if (rLL.length > 0) {
    sessionStorage.setItem("elan-route-save", queryToSave);
  } else {
    sessionStorage.removeItem("elan-route-save");
  }
}, [rLL]); // rLL 객체 참조가 변경되지 않으면 실행 안됨!
```

**문제점:**
- `rLL` 객체 참조가 변경되지 않으면 내부 상태가 변해도 실행되지 않음
- 반응성 문제와 직접 연결됨

**개선안:**

```tsx
// useRouteLinkedList 훅의 version을 의존성으로 추가
useEffect(() => {
  const queryToSave = getCustomQueryFromRLL(rLL);
  if (rLL.length > 0) {
    sessionStorage.setItem("elan-route-save", queryToSave);
  } else {
    sessionStorage.removeItem("elan-route-save");
  }
}, [rLL, version]); // version 추가로 모든 변경사항 감지
```

### 4.2 `scrollToRow` 최적화

**현재 코드:**

```tsx
const scrollToRow = (index: number) => {
  const element = document.getElementById(`${index}`);
  if (element) {
    element.scrollIntoView({ behavior: "smooth", block: "center" });
  }
};

useEffect(() => {
  if (selectedIndex !== null) {
    scrollToRow(selectedIndex);
  }
}, [selectedIndex]);
```

**문제점:**
- 빠르게 여러 row를 선택하면 불필요한 스크롤이 여러 번 발생
- 성능 낭비

**개선안:**

```tsx
import { debounce } from 'lodash'; // 또는 직접 구현

const scrollToRow = (index: number) => {
  const element = document.getElementById(`${index}`);
  if (element) {
    element.scrollIntoView({ behavior: "smooth", block: "center" });
  }
};

// debounce 적용
const debouncedScrollToRow = useMemo(
  () => debounce(scrollToRow, 100),
  []
);

useEffect(() => {
  if (selectedIndex !== null) {
    debouncedScrollToRow(selectedIndex);
  }
  
  // cleanup
  return () => {
    debouncedScrollToRow.cancel();
  };
}, [selectedIndex, debouncedScrollToRow]);
```

**효과:**
- ✅ 불필요한 스크롤 애니메이션 방지
- ✅ 부드러운 UX

---

## 🔵 5. RouteLinkedList 클래스 내부 개선 (Medium)

### 5.1 `recalculate()` 재귀 호출의 성능 문제

**현재 코드:**

```tsx
// RouteNode 클래스
public recalculate(): void {
  const isRecalculating = true;
  this.getPrevs();
  const newJobPo = this.recalculateJobPo();
  this.adjustJobPoint(newJobPo, isRecalculating);
  if (this.next) this.next.recalculate(); // 재귀 호출
}
```

**문제점:**
- 노드 N개 있을 때 O(N) 복잡도는 정상이지만, 재귀는 스택 메모리 사용
- 깊은 연결 리스트(100+ 노드)에서 스택 오버플로우 가능성
- 디버깅이 어려움

**개선안:**

```tsx
// RouteLinkedList 클래스에 메서드 추가
public recalculateFrom(startNode: RouteNode): void {
  let current: RouteNode | null = startNode;
  
  while (current) {
    const isRecalculating = true;
    current.getPrevs();
    const newJobPo = current.recalculateJobPo();
    
    // adjustJobPoint를 재귀 없이 실행하도록 수정
    current.adjustJobPointWithoutPropagate(newJobPo, isRecalculating);
    current = current.next;
  }
}

// RouteNode 클래스
public adjustJobPointWithoutPropagate(jobPoDelta: number, isRecalculating?: boolean): void {
  let actualChange;
  if (isRecalculating) {
    this.jobPo = 0;
    actualChange = jobPoDelta;
  } else {
    actualChange = this.getActualChange(jobPoDelta);
  }

  this.shouldChangeStats(actualChange, isRecalculating) &&
    this.changeStats(actualChange, isRecalculating);
  this.jobPo += actualChange;
  (this.currentJobPos[this.job] as number) += actualChange;
  
  // 재귀 호출 제거!
}

public adjustJobPoint(jobPoDelta: number, isRecalculating?: boolean): void {
  this.adjustJobPointWithoutPropagate(jobPoDelta, isRecalculating);
  
  // 이후 노드들 재계산
  if (this.next && !isRecalculating) {
    // RouteLinkedList의 recalculateFrom 사용
    const list = this.getParentList(); // 부모 리스트 참조 필요
    list.recalculateFrom(this.next);
  }
}
```

**효과:**
- ✅ 스택 오버플로우 방지
- ✅ 더 나은 성능
- ✅ 디버깅 용이

### 5.2 `getPrevStats()` 로직 단순화

**현재 코드:**

```tsx
getPrevStats(): Stats {
  // !this.prev 조건을 사실 검사해주지 않아도 되기 때문에 코드 개선이 필요할 것 같다.
  if (!this.prev) return { STR: 5, INT: 5, AGI: 5, VIT: 5 };
  if (this.prev.job === Jobs.네크로멘서)
    return { ...this.prev.stats, INT: 5 };

  return { ...this.prev.stats };
}
```

**개선안:**

```tsx
// 상수를 파일 상단 또는 별도 constants 파일에 정의
const DEFAULT_STATS: Stats = { STR: 5, INT: 5, AGI: 5, VIT: 5 };

getPrevStats(): Stats {
  // 첫 노드 (무직)
  if (!this.prev) return { ...DEFAULT_STATS };
  
  // 이전 스탯 복사
  const prevStats = { ...this.prev.stats };
  
  // 네크로멘서의 특수 룰: INT는 항상 5로 리셋
  if (this.prev.job === Jobs.네크로멘서) {
    prevStats.INT = DEFAULT_STATS.INT;
  }
  
  return prevStats;
}
```

**효과:**
- ✅ 매직 넘버 제거
- ✅ 의도가 더 명확
- ✅ 유지보수 용이

---

## 🟣 6. 컴포넌트 분리 및 재사용성 (Low)

### 6.1 App.tsx의 거대한 컴포넌트

**현재:**
- App.tsx: 약 400줄
- 모든 로직이 한 파일에 집중
- 가독성 저하

**개선안: 컴포넌트 분리**

```tsx
// src/components/RouteTable/RouteTable.tsx
interface RouteTableProps {
  rLL: RouteLinkedList;
  selectedIndex: number | null;
  isPanelOpen: boolean;
  onRowClick: (index: number, hasJob: boolean) => void;
}

export function RouteTable({ 
  rLL, 
  selectedIndex, 
  isPanelOpen, 
  onRowClick 
}: RouteTableProps) {
  const nodes = useMemo(() => rLL.getAllNodes(), [rLL, version]);
  
  return (
    <Table.Container className="table-container ...">
      <Table>
        <TableHeader>
          {/* 헤더 */}
        </TableHeader>
        <TableBody>
          {nodes.map((node, index) => (
            <RouteTableRow
              key={`row-${index}`}
              index={index}
              node={node}
              isSelected={selectedIndex === index}
              isPanelOpen={isPanelOpen}
              onClick={onRowClick}
            />
          ))}
        </TableBody>
      </Table>
    </Table.Container>
  );
}

// src/components/RouteTable/RouteTableRow.tsx
interface RouteTableRowProps {
  index: number;
  node: RouteNode | null;
  isSelected: boolean;
  isPanelOpen: boolean;
  onClick: (index: number, hasJob: boolean) => void;
}

function RouteTableRow({ 
  index, 
  node, 
  isSelected, 
  isPanelOpen, 
  onClick 
}: RouteTableRowProps) {
  return (
    <TableRow
      id={`${index}`}
      className="relative odd:bg-[#131314] even:bg-[#232321]"
      onClick={() => onClick(index, !!node)}
    >
      <TableCell className="cursor-pointer relative">
        {isSelected && <SelectionIndicator isPanelOpen={isPanelOpen} />}
        {node?.job || ""}
      </TableCell>
      {/* 나머지 셀들 */}
    </TableRow>
  );
}
```

```tsx
// src/components/BottomPanel/BottomPanel.tsx
interface BottomPanelProps {
  mode: 'job-select' | 'point-adjust';
  isOpen: boolean;
  errorMessage: string;
  onClose: () => void;
  onJobSelect: (event: MouseEvent) => void;
  onPointAdjust: (event: MouseEvent) => void;
}

export function BottomPanel({
  mode,
  isOpen,
  errorMessage,
  onClose,
  onJobSelect,
  onPointAdjust,
}: BottomPanelProps) {
  if (!isOpen) return null;
  
  return (
    <div className="absolute left-1.5 right-1.5 bottom-2 z-50 bg-neutral-900">
      <PanelHeader errorMessage={errorMessage} onClose={onClose} />
      <PanelContent>
        {mode === 'job-select' ? (
          <JobSelector onJobSelect={onJobSelect} />
        ) : (
          <PointAdjuster onPointAdjust={onPointAdjust} />
        )}
      </PanelContent>
    </div>
  );
}
```

```tsx
// src/App.tsx - 간결해진 메인 컴포넌트
export default function App() {
  const { rLL, version, addJob, adjustPoint, reset } = useRouteLinkedList();
  const { 
    selectedIndex, 
    panelMode, 
    isPanelOpen, 
    openPanel, 
    closePanel,
    selectRow 
  } = usePanelController();
  const { errorMessage, showError, clearError } = useErrorMessage();
  
  const handleJobSelect = useCallback((event: MouseEvent) => {
    const jobName = getJobNameFromSelect(event);
    const error = validateJobAddition(jobName, rLL);
    
    if (error) {
      showError(error);
      return;
    }
    
    addJob(jobName);
    selectRow(rLL.length - 1, 'point-adjust');
    clearError();
  }, [rLL, addJob, selectRow, showError, clearError]);
  
  const handlePointAdjust = useCallback((event: MouseEvent) => {
    const adjustment = getAdjustmentValue(event);
    if (selectedIndex !== null) {
      adjustPoint(selectedIndex, adjustment);
    }
  }, [selectedIndex, adjustPoint]);
  
  return (
    <ElanBox.OuterFrame className="...">
      <ElanBox.Border>
        <ElanBox.ContentArea>
          <Header />
          <UtilityBar onShare={shareTableAsImage} onReset={reset} />
          
          <RouteTable
            rLL={rLL}
            version={version}
            selectedIndex={selectedIndex}
            isPanelOpen={isPanelOpen}
            onRowClick={selectRow}
          />
          
          <AddRowButton 
            onAdd={openPanel} 
            hasEmptyRow={hasEmptyRow}
          />
          
          <BottomPanel
            mode={panelMode}
            isOpen={isPanelOpen}
            errorMessage={errorMessage}
            onClose={closePanel}
            onJobSelect={handleJobSelect}
            onPointAdjust={handlePointAdjust}
          />
          
          <Footer />
        </ElanBox.ContentArea>
      </ElanBox.Border>
    </ElanBox.OuterFrame>
  );
}
```

**효과:**
- ✅ 단일 책임 원칙
- ✅ 가독성 향상
- ✅ 테스트 용이
- ✅ 재사용 가능한 컴포넌트

### 6.2 사용되지 않는 코드 정리

#### Modal.tsx

**현재 상태:**
```tsx
export default ({ isActive, setIsActive, title, content }: ModalProps) => {
  return (
    <div className={isActive ? "" : ""}> {/* 빈 className */}
      <div className="" onClick={() => { setIsActive(false); }}></div>
      {/* 모든 className이 빈 문자열 */}
    </div>
  );
};
```

**문제:**
- 프로젝트 어디에서도 사용되지 않음
- 구현이 완료되지 않음 (빈 className들)

**권장 조치:**
1. 삭제 (사용하지 않는 경우)
2. 또는 실제로 사용할 계획이면 완성하기

#### useCopyToClipboard.ts

**현재 상태:**
```tsx
const useCopyToClipboard = () => {
  const [isCopied, setIsCopied] = useState(false);
  const copyToClipboard = async (text: string) => { ... };
  return { isCopied, copyToClipboard };
};
```

**문제:**
- `shareTableAsImage` 함수에서 직접 `navigator.clipboard` 사용
- 커스텀 훅이 사용되지 않음

**권장 조치:**
1. 삭제 (현재 사용하지 않음)
2. 또는 `shareTableAsImage`에서 이 훅 활용하도록 리팩토링

---

## 🟤 7. 타입 안정성 개선 (Low-Medium)

### 7.1 Event Handler 타입 개선

**현재 코드:**

```tsx
function getJobNameFromSelect(event: MouseEvent) {
  return (event.target as HTMLButtonElement).textContent as Jobs;
}
```

**문제점:**
1. `textContent`가 `null`일 수 있음 (타입: `string | null`)
2. `event.target`은 이벤트가 발생한 자식 요소일 수 있음
3. 타입 단언이 안전하지 않음

**개선안:**

```tsx
function getJobNameFromSelect(event: MouseEvent<HTMLButtonElement>): Jobs {
  // currentTarget은 이벤트 리스너가 부착된 요소 (항상 button)
  const text = event.currentTarget.textContent;
  
  if (!text) {
    throw new Error('Button text content is null');
  }
  
  if (!(text in Jobs)) {
    throw new Error(`Invalid job name: ${text}`);
  }
  
  return text as Jobs;
}

// 더 안전한 버전
function getJobNameFromSelect(event: MouseEvent<HTMLButtonElement>): Jobs | null {
  const text = event.currentTarget.textContent;
  
  if (!text || !(text in Jobs)) {
    console.error('Invalid job selection:', text);
    return null;
  }
  
  return text as Jobs;
}
```

### 7.2 RouteNode의 반복적인 null 체크

**현재 코드:**

```tsx
const adjustJobPoint = (event: MouseEvent) => {
  const buttonValue = (event.target as HTMLButtonElement).textContent;
  if (!buttonValue) return; // null 체크 1

  const adjustment = parseInt(buttonValue);
  if (selectedIndex !== null) { // null 체크 2
    const targetNode = rLL.get(selectedIndex);
    if (targetNode) { // null 체크 3
      targetNode.adjustJobPoint(adjustment);
    }
    setRLL(Object.assign(Object.create(Object.getPrototypeOf(rLL)), rLL));
  }
};
```

**개선안:**

```tsx
// 유틸리티 함수
function getNodeOrThrow(rLL: RouteLinkedList, index: number): RouteNode {
  const node = rLL.get(index);
  if (!node) {
    throw new Error(`Node at index ${index} not found`);
  }
  return node;
}

function parseAdjustmentValue(event: MouseEvent<HTMLButtonElement>): number {
  const text = event.currentTarget.textContent;
  if (!text) throw new Error('Button has no text content');
  
  const value = parseInt(text);
  if (isNaN(value)) throw new Error(`Invalid number: ${text}`);
  
  return value;
}

// 사용
const adjustJobPoint = useCallback((event: MouseEvent<HTMLButtonElement>) => {
  try {
    const adjustment = parseAdjustmentValue(event);
    
    if (selectedIndex === null) {
      console.warn('No row selected');
      return;
    }
    
    const targetNode = getNodeOrThrow(rLL, selectedIndex);
    adjustPoint(selectedIndex, adjustment); // 훅 사용
  } catch (error) {
    console.error('Failed to adjust job point:', error);
    showError('포인트 조정에 실패했습니다.');
  }
}, [selectedIndex, rLL, adjustPoint, showError]);
```

**효과:**
- ✅ 명시적인 에러 처리
- ✅ 타입 안정성 향상
- ✅ 디버깅 용이

---

## 📊 8. 성능 최적화 (Low)

### 8.1 불필요한 재렌더링 방지

**현재 코드:**

```tsx
Array.from(
  { length: Math.max(tableLength, rLL.getAllNodes().length) },
  (_, index) => {
    const routeNode = rLL.get(index);
    // ...
  }
)
```

**문제점:**
- 매 렌더링마다 `getAllNodes()` 호출
- 매 렌더링마다 새 배열 생성
- 각 row마다 `rLL.get(index)` 호출

**개선안:**

```tsx
// 노드 목록을 메모이제이션
const nodes = useMemo(() => {
  return rLL.getAllNodes();
}, [rLL, version]); // version으로 변경 감지

const displayLength = useMemo(() => {
  return Math.max(1, nodes.length);
}, [nodes]);

// 렌더링
{nodes.map((node, index) => (
  <RouteTableRow
    key={`row-${index}`}
    index={index}
    node={node}
    isSelected={selectedIndex === index}
    isPanelOpen={isPanelOpen}
    onClick={handleRowClick}
  />
))}
```

**효과:**
- ✅ 불필요한 배열 순회 제거
- ✅ 메모리 사용 최적화

### 8.2 콜백 메모이제이션

**현재 코드:**

```tsx
// 매 렌더링마다 새로운 함수 생성
const addNewJob = (event: MouseEvent) => {
  // ...
};

const adjustJobPoint = (event: MouseEvent) => {
  // ...
};
```

**문제점:**
- 매 렌더링마다 새 함수 생성
- 자식 컴포넌트에 props로 전달 시 불필요한 재렌더링 유발

**개선안:**

```tsx
const addNewJob = useCallback((event: MouseEvent<HTMLButtonElement>) => {
  const jobName = getJobNameFromSelect(event);
  const error = validateJobAddition(jobName, rLL);
  
  if (error) {
    setErrorMessage(error);
    return;
  }
  
  addJob(jobName);
  setPanelMode("point-adjust");
  setSelectedIndex(rLL.length - 1);
  setErrorMessage("");
}, [rLL, addJob]); // 필요한 의존성만

const adjustJobPoint = useCallback((event: MouseEvent<HTMLButtonElement>) => {
  try {
    const adjustment = parseAdjustmentValue(event);
    if (selectedIndex !== null) {
      adjustPoint(selectedIndex, adjustment);
    }
  } catch (error) {
    console.error('Failed to adjust:', error);
  }
}, [selectedIndex, adjustPoint]);

const handleRowClick = useCallback((index: number, hasJob: boolean) => {
  setSelectedIndex(index);
  setPanelMode(hasJob ? 'point-adjust' : 'job-select');
  setIsPanelOpen(true);
}, []);
```

**효과:**
- ✅ 불필요한 재렌더링 방지
- ✅ React.memo와 함께 사용 시 효과적

### 8.3 테이블 가상화 고려 (선택사항)

대량의 직업 루트(50개 이상)를 다룰 경우:

```tsx
import { useVirtualizer } from '@tanstack/react-virtual';

function RouteTable({ rLL, version }) {
  const parentRef = useRef<HTMLDivElement>(null);
  const nodes = useMemo(() => rLL.getAllNodes(), [rLL, version]);
  
  const virtualizer = useVirtualizer({
    count: nodes.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 48, // row 높이
    overscan: 5,
  });
  
  return (
    <div ref={parentRef} className="overflow-auto" style={{ height: '500px' }}>
      <div style={{ height: `${virtualizer.getTotalSize()}px` }}>
        {virtualizer.getVirtualItems().map((virtualRow) => {
          const node = nodes[virtualRow.index];
          return (
            <div
              key={virtualRow.key}
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: `${virtualRow.size}px`,
                transform: `translateY(${virtualRow.start}px)`,
              }}
            >
              <RouteTableRow node={node} index={virtualRow.index} />
            </div>
          );
        })}
      </div>
    </div>
  );
}
```

---

## 🎯 우선순위 요약

### 🔴 High Priority (즉시 개선 권장)

1. **RouteLinkedList 반응성 문제 해결**
   - `useRouteLinkedList` 커스텀 훅 생성
   - 모든 rLL 조작을 훅을 통해 수행
   - 예상 작업 시간: 2-3시간

2. **addNewJob 중복 로직 제거**
   - `validateJobAddition` 함수 추출
   - 중복된 검증 코드 제거
   - 예상 작업 시간: 30분

3. **tableLength 상태 제거**
   - computed value로 대체
   - 관련 로직 정리
   - 예상 작업 시간: 1시간

### 🟠 Medium Priority (점진적 개선)

4. **RouteNode.recalculate() 최적화**
   - 재귀를 반복문으로 변경
   - 예상 작업 시간: 2시간
   - 영향도: 중간 (대량 노드 처리 시 중요)

5. **selectedIndex/isPanelOpen 통합**
   - 단일 상태 객체로 관리
   - 예상 작업 시간: 1-2시간

6. **useEffect 의존성 수정**
   - version 의존성 추가
   - 예상 작업 시간: 30분

### 🟢 Low Priority (시간 여유 시)

7. **컴포넌트 분리**
   - `RouteTable`, `BottomPanel` 등 분리
   - 예상 작업 시간: 4-6시간

8. **사용하지 않는 코드 제거**
   - `Modal.tsx`, `useCopyToClipboard.ts` 정리
   - 예상 작업 시간: 30분

9. **타입 안정성 개선**
   - Event handler 타입 개선
   - null 체크 강화
   - 예상 작업 시간: 2시간

10. **성능 최적화**
    - `useMemo`, `useCallback` 적용
    - 예상 작업 시간: 2-3시간

---

## 💡 추가 제안

### 테스트 커버리지 확대

현재 `test/rLL.test.js`만 존재합니다. 추가 필요:

```tsx
// tests/RouteNode.test.ts - 스탯 계산 로직 테스트
describe('RouteNode', () => {
  describe('adjustJobPoint', () => {
    it('should increase stats correctly', () => {
      // 테스트 케이스
    });
    
    it('should respect stat limits', () => {
      // 테스트 케이스
    });
    
    it('should handle 네크로멘서 special rule', () => {
      // 테스트 케이스
    });
  });
});

// tests/App.test.tsx - 통합 테스트
describe('App', () => {
  it('should prevent adding same job consecutively', () => {
    // 테스트 케이스
  });
  
  it('should prevent adding job when already at 100 points', () => {
    // 테스트 케이스
  });
  
  it('should save to sessionStorage', () => {
    // 테스트 케이스
  });
});

// tests/validation.test.ts - 비즈니스 로직 테스트
describe('validateJobAddition', () => {
  it('should return error for duplicate job', () => {
    // 테스트 케이스
  });
  
  it('should return error when job point is 100', () => {
    // 테스트 케이스
  });
});
```

### 문서화 개선

```tsx
// src/lib/routeLinkedList.ts

/**
 * 일랜시아 직업 루트를 관리하는 연결 리스트
 * 
 * 각 노드는 직업과 해당 직업의 잡포인트, 스탯 정보를 포함합니다.
 * 직업 추가/변경 시 이후 노드들의 스탯이 자동으로 재계산됩니다.
 * 
 * @example
 * const rLL = new RouteLinkedList();
 * rLL.add(Jobs.무도가);
 * rLL.tail?.adjustJobPoint(30);
 */
export default class RouteLinkedList {
  /**
   * 새로운 직업을 루트의 마지막에 추가합니다.
   * 
   * @param job - 추가할 직업
   * @returns 생성된 RouteNode 또는 null (이미 100 포인트인 경우)
   * 
   * @example
   * rLL.add(Jobs.전사);
   */
  add(job: Jobs): RouteNode | null {
    // ...
  }
}
```

### 에러 바운더리 추가

```tsx
// src/components/ErrorBoundary.tsx
class ErrorBoundary extends React.Component<
  { children: ReactNode },
  { hasError: boolean; error: Error | null }
> {
  constructor(props: { children: ReactNode }) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="error-screen">
          <h1>문제가 발생했습니다</h1>
          <button onClick={() => window.location.reload()}>
            새로고침
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}
```

### 로깅 및 디버깅 개선

```tsx
// src/utils/logger.ts
const isDevelopment = import.meta.env.DEV;

export const logger = {
  debug: (...args: any[]) => {
    if (isDevelopment) {
      console.debug('[DEBUG]', ...args);
    }
  },
  
  info: (...args: any[]) => {
    console.info('[INFO]', ...args);
  },
  
  warn: (...args: any[]) => {
    console.warn('[WARN]', ...args);
  },
  
  error: (...args: any[]) => {
    console.error('[ERROR]', ...args);
    // 프로덕션에서는 에러 리포팅 서비스로 전송
  },
};

// 사용
logger.debug('Adding job:', jobName);
logger.error('Failed to adjust job point:', error);
```

---

## 📋 체크리스트

다음 개선 작업을 진행할 때 이 체크리스트를 활용하세요:

### Phase 1: 핵심 반응성 문제 해결

- [ ] `useRouteLinkedList` 훅 생성
- [ ] App.tsx에서 훅 사용하도록 변경
- [ ] 모든 rLL 조작을 훅을 통해 수행
- [ ] 테스트 실행 및 동작 확인

### Phase 2: 상태 관리 정리

- [ ] `tableLength` 제거 및 computed value로 대체
- [ ] `selectedIndex`/`isPanelOpen` 통합
- [ ] 중복 검증 로직 제거
- [ ] 테스트 실행 및 동작 확인

### Phase 3: 성능 및 안정성

- [ ] `recalculate()` 재귀를 반복문으로 변경
- [ ] `useMemo`, `useCallback` 적용
- [ ] 타입 안정성 개선
- [ ] 에러 처리 강화

### Phase 4: 구조 개선

- [ ] 컴포넌트 분리
- [ ] 사용하지 않는 코드 제거
- [ ] 문서화 추가
- [ ] 테스트 커버리지 확대

---

## 🔚 결론

이 문서에서 제안한 개선사항들은 다음과 같은 효과를 가져올 것입니다:

1. **안정성**: 반응성 문제 해결로 버그 감소
2. **가독성**: 코드 구조 개선으로 이해하기 쉬운 코드
3. **유지보수성**: 중복 제거와 책임 분리로 변경 용이
4. **성능**: 최적화로 더 부드러운 사용자 경험
5. **확장성**: 명확한 구조로 새 기능 추가 용이

우선순위에 따라 단계적으로 적용하시면 됩니다. 모든 개선사항을 한 번에 적용할 필요는 없으며, High Priority 항목부터 시작하는 것을 권장합니다.

---

**문서 버전**: 1.0  
**최종 수정일**: 2025-10-14  
**작성자**: GitHub Copilot
