import { useState, useCallback } from "react";
import RouteLinkedList from "@/lib/routeLinkedList";
import { Jobs } from "@/database/job";

/**
 * RouteLinkedList의 반응성을 관리하는 커스텀 훅
 *
 * RouteLinkedList는 클래스 인스턴스이므로 내부 상태가 변경되어도
 * React가 자동으로 감지하지 못합니다. 이 훅은 version 카운터를 통해
 * 모든 변경사항을 추적하고 컴포넌트 리렌더링을 보장합니다.
 *
 * @param initialRLL - 초기 RouteLinkedList 인스턴스 (선택사항)
 * @returns rLL 인스턴스, version 카운터, 그리고 반응성을 보장하는 메서드들
 *
 * @example
 * ```tsx
 * const { rLL, version, addJob, adjustPoint, removeAt, reset, setRLL } = useRouteLinkedList();
 *
 * // 직업 추가 (자동으로 리렌더링)
 * addJob(Jobs.전사);
 *
 * // 포인트 조정 (자동으로 리렌더링)
 * adjustPoint(0, 30);
 *
 * // 전체 교체 (URL에서 로드 등)
 * setRLL(newRouteLinkedList);
 * ```
 */
export function useRouteLinkedList(initialRLL?: RouteLinkedList) {
  const [rLL, setRLLState] = useState(initialRLL || new RouteLinkedList());
  const [version, setVersion] = useState(0);

  /**
   * version 카운터를 증가시켜 리렌더링을 트리거합니다.
   */
  const forceUpdate = useCallback(() => {
    setVersion((v) => v + 1);
  }, []);

  /**
   * 새로운 직업을 루트의 마지막에 추가합니다.
   *
   * @param job - 추가할 직업
   * @returns 생성된 RouteNode 또는 null (이미 100 포인트인 경우)
   */
  const addJob = useCallback(
    (job: Jobs) => {
      const result = rLL.add(job);
      forceUpdate();
      return result;
    },
    [rLL, forceUpdate]
  );

  /**
   * 특정 인덱스의 노드에 포인트를 조정합니다.
   *
   * @param index - 대상 노드의 인덱스
   * @param delta - 조정할 포인트 (양수 또는 음수)
   */
  const adjustPoint = useCallback(
    (index: number, delta: number) => {
      const node = rLL.get(index);
      if (node) {
        node.adjustJobPoint(delta);
        forceUpdate();
      }
    },
    [rLL, forceUpdate]
  );

  /**
   * 특정 인덱스의 노드를 제거합니다.
   *
   * @param index - 제거할 노드의 인덱스
   * @returns 제거된 RouteNode 또는 null
   */
  const removeAt = useCallback(
    (index: number) => {
      const result = rLL.removeAt(index);
      forceUpdate();
      return result;
    },
    [rLL, forceUpdate]
  );

  /**
   * RouteLinkedList를 초기 상태로 리셋합니다.
   */
  const reset = useCallback(() => {
    const newRLL = new RouteLinkedList();
    setRLLState(newRLL);
    setVersion(0);
  }, []);

  /**
   * RouteLinkedList를 새로운 인스턴스로 교체합니다.
   * URL에서 데이터를 로드하거나 전체 상태를 교체할 때 사용합니다.
   *
   * @param newRLL - 새로운 RouteLinkedList 인스턴스
   */
  const setRLL = useCallback((newRLL: RouteLinkedList) => {
    setRLLState(newRLL);
    setVersion(0);
  }, []);

  /**
   * 직업의 순서를 변경합니다.
   * 
   * @param fromIndex - 이동할 노드의 현재 인덱스
   * @param toIndex - 이동할 위치의 인덱스
   */
  const moveJob = useCallback(
    (fromIndex: number, toIndex: number) => {
      const result = rLL.move(fromIndex, toIndex);
      forceUpdate();
      return result;
    },
    [rLL, forceUpdate]
  );

  return {
    rLL,
    version,
    addJob,
    adjustPoint,
    removeAt,
    reset,
    setRLL,
    moveJob,
    forceUpdate, // 필요시 직접 호출할 수 있도록 노출
  };
}
