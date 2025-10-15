import { MouseEvent } from "react";
import { CustomSystem } from "@/database/customsystem";
import { Jobs, NumberedJobs } from "@/database/job";
import RouteLinkedList from "@/lib/routeLinkedList";

/**
 * 버튼 클릭 이벤트에서 직업 이름을 추출합니다.
 *
 * @param event - 마우스 클릭 이벤트
 * @returns 선택된 직업 이름
 */
export function getJobNameFromSelect(event: MouseEvent): Jobs {
  return (event.target as HTMLButtonElement).textContent as Jobs;
}

/**
 * 직업 추가가 가능한지 검증합니다.
 *
 * @param jobName - 추가하려는 직업
 * @param rLL - RouteLinkedList 인스턴스
 * @returns 에러 메시지 또는 null (추가 가능한 경우)
 */
export function validateJobAddition(
  jobName: Jobs,
  rLL: RouteLinkedList
): string | null {
  if (!rLL.tail) return null; // 첫 직업 추가는 항상 가능

  if (rLL.tail.job === jobName) {
    return "같은 직업을 연속으로 선택할 수 없습니다.";
  }

  if (rLL.tail.currentJobPos[jobName] === 100) {
    return "해당 직업은 이미 잡포인트 100입니다. 더 추가할 수 없습니다.";
  }

  return null;
}

/**
 * RouteLinkedList를 커스텀 쿼리 문자열로 변환합니다.
 * URL에 저장할 수 있는 형식으로 인코딩합니다.
 *
 * @param rLL - RouteLinkedList 인스턴스
 * @returns 커스텀 인코딩된 쿼리 문자열
 */
export function getCustomQueryFromRLL(rLL: RouteLinkedList): string {
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

/**
 * URL 쿼리 문자열에서 RouteLinkedList를 복원합니다.
 *
 * @param location - Location 객체 (search 속성 포함)
 * @returns 복원된 RouteLinkedList
 */
export function getCurrentJobsFromQuery({
  search,
}: Location | { search: string }): RouteLinkedList {
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

/**
 * 잡포인트가 57을 초과하는지 확인하는 헬퍼 함수
 *
 * @param restString - 확인할 문자열의 나머지 부분
 * @returns 57 초과 여부
 */
function isOverFiftySeven(restString: string): boolean {
  const nextFiftySevenIndex = restString.indexOf("_");
  if (nextFiftySevenIndex === -1) {
    return restString.length % 2 === 1;
  }
  return nextFiftySevenIndex % 2 === 0;
}
