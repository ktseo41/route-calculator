import { describe, it, expect } from "vitest";
import { Jobs } from "../src/database/job";
import RouteLinkedList from "../src/lib/routeLinkedList";

interface RouteStep {
  jobName: string;
  individualPoint: number;
  expectedStats: {
    STR: number;
    INT: number;
    AGI: number;
    VIT: number;
  };
}

describe("상인 선행 후 2차 생산직 전환 스탯 테스트", () => {
  /**
   * 시나리오:
   * 1. 요리 25레벨 → 상인
   * 2. 배달 + 흥정 5레벨 추가 → 미용사 전직 가능
   *
   * 상인 잡포 2:
   * - 2당: STR -1 [limit 10] → 2/2 = 6 → STR -1 (5 → 5, limit이 10이므로 5까지는 내려갈 수 있음, 단 5 미만은 안됨)
   * - 4당: AGI +1 [limit 30] → 2/4 = 0.5 → AGI +0
   * - 10당: VIT +1, INT +1 [limit 10] → 2/10 = 0.2 → VIT +0, INT +0
   */
  it("요리 25레벨로 상인이 된 후, 배달 + 흥정을 5레벨 추가해서 미용사가 되는 상황", () => {
    const rll = new RouteLinkedList();

    // 1. 상인 추가
    rll.add(Jobs.상인);
    let currentStats = rll.tail!.stats;

    // 2. 상인 잡포 2 후 스탯 검증 (배달 + 흥정 5레벨 추가)
    currentStats = rll.tail!.stats;
    rll.tail!.adjustJobPoint(2);

    expect(currentStats.STR).toBe(5);
    expect(currentStats.INT).toBe(5);
    expect(currentStats.AGI).toBe(5);
    expect(currentStats.VIT).toBe(5);

    // 3. 미용사로 전직
    rll.add(Jobs.미용사);

    expect(currentStats.STR).toBe(5);
    expect(currentStats.INT).toBe(5);
    expect(currentStats.AGI).toBe(5);
    expect(currentStats.VIT).toBe(5);
  });

  it("요리 25레벨로 상인이 된 후, 재단 15레벨 추가해서 재단사가 되는 상황", () => {
    const rll = new RouteLinkedList();

    // 1. 상인 추가
    rll.add(Jobs.상인);
    let currentStats = rll.tail!.stats;

    /**
     * 2. 상인 잡포 7 추가 후 스탯 검증 (재단 15레벨 추가)
     *
     * 상인 잡포 7:
     * - STR: -3 -> 10이하라 유지 -> 5
     * - AGI: +1 -> 6
     * - VIT, INT: 0
     */
    currentStats = rll.tail!.stats;
    rll.tail!.adjustJobPoint(7);

    expect(currentStats.STR).toBe(5);
    expect(currentStats.INT).toBe(5);
    expect(currentStats.AGI).toBe(6);
    expect(currentStats.VIT).toBe(5);

    // 3. 재단사로 전직
    rll.add(Jobs.재단사);

    expect(currentStats.STR).toBe(5);
    expect(currentStats.INT).toBe(5);
    expect(currentStats.AGI).toBe(6);
    expect(currentStats.VIT).toBe(5);
  });

  it("요리 25레벨로 상인이 된 후, 세공 10레벨 추가해서 세공사가 되는 상황", () => {
    const rll = new RouteLinkedList();

    // 1. 상인 추가
    rll.add(Jobs.상인);
    let currentStats = rll.tail!.stats;

    /**
     * 2. 상인 잡포 5 추가 후 스탯 검증 (세공 10레벨 추가)
     *
     * 상인 잡포 5:
     * - 2당: STR -1 [limit 10] → 5/2 = 2 → STR -2 (5 → 5, limit이 10이므로 5까지는 내려갈 수 있으나 이미 5)
     * - 4당: AGI +1 [limit 30] → 5/4 = 1 → AGI +1 → 6
     * - 10당: VIT +1, INT +1 [limit 10] → 5/10 = 0 → VIT +0, INT +0
     */
    currentStats = rll.tail!.stats;
    rll.tail!.adjustJobPoint(5);

    expect(currentStats.STR).toBe(5);
    expect(currentStats.INT).toBe(5);
    expect(currentStats.AGI).toBe(6);
    expect(currentStats.VIT).toBe(5);

    // 3. 세공사로 전직
    rll.add(Jobs.세공사);

    expect(currentStats.STR).toBe(5);
    expect(currentStats.INT).toBe(5);
    expect(currentStats.AGI).toBe(6);
    expect(currentStats.VIT).toBe(5);
  });

  it("요리 25레벨로 상인이 된 후, 제련 10레벨 추가해서 대장장이가 되는 상황", () => {
    const rll = new RouteLinkedList();

    // 1. 상인 추가
    rll.add(Jobs.상인);
    let currentStats = rll.tail!.stats;

    /**
     * 2. 상인 잡포 5 추가 후 스탯 검증 (제련 10레벨 추가)
     *
     * 상인 잡포 5:
     * - 2당: STR -1 [limit 10] → 5/2 = 2 → STR -2 (5 → 5, 이미 limit 10 이하라 유지)
     * - 4당: AGI +1 [limit 30] → 5/4 = 1 → AGI +1 → 6
     * - 10당: VIT +1, INT +1 [limit 10] → 5/10 = 0 → VIT +0, INT +0
     */
    currentStats = rll.tail!.stats;
    rll.tail!.adjustJobPoint(5);

    expect(currentStats.STR).toBe(5);
    expect(currentStats.INT).toBe(5);
    expect(currentStats.AGI).toBe(6);
    expect(currentStats.VIT).toBe(5);

    // 3. 대장장이로 전직
    rll.add(Jobs.대장장이);

    expect(currentStats.STR).toBe(5);
    expect(currentStats.INT).toBe(5);
    expect(currentStats.AGI).toBe(6);
    expect(currentStats.VIT).toBe(5);
  });

  it("요리 25레벨로 상인이 된 후, 벌목 10레벨 추가해서 목공사가 되는 상황", () => {
    const rll = new RouteLinkedList();

    // 1. 상인 추가
    rll.add(Jobs.상인);
    let currentStats = rll.tail!.stats;

    /**
     * 2. 상인 잡포 5 추가 후 스탯 검증 (벌목 10레벨 추가)
     *
     * 상인 잡포 5:
     * - 2당: STR -1 [limit 10] → 5/2 = 2 → STR -2 (5 → 5)
     * - 4당: AGI +1 [limit 30] → 5/4 = 1 → AGI +1 → 6
     * - 10당: VIT +1, INT +1 [limit 10] → 5/10 = 0 → VIT +0, INT +0
     */
    currentStats = rll.tail!.stats;
    rll.tail!.adjustJobPoint(5);

    expect(currentStats.STR).toBe(5);
    expect(currentStats.INT).toBe(5);
    expect(currentStats.AGI).toBe(6);
    expect(currentStats.VIT).toBe(5);

    // 3. 목공사로 전직
    rll.add(Jobs.목공사);

    expect(currentStats.STR).toBe(5);
    expect(currentStats.INT).toBe(5);
    expect(currentStats.AGI).toBe(6);
    expect(currentStats.VIT).toBe(5);
  });

  it("요리 25레벨로 상인이 된 후, 조제 10레벨 추가해서 연금술사가 되는 상황", () => {
    const rll = new RouteLinkedList();

    // 1. 상인 추가
    rll.add(Jobs.상인);
    let currentStats = rll.tail!.stats;

    /**
     * 2. 상인 잡포 5 추가 후 스탯 검증 (조제 10레벨 추가)
     *
     * 상인 잡포 5:
     * - 2당: STR -1 [limit 10] → 5/2 = 2 → STR -2 (5 → 5)
     * - 4당: AGI +1 [limit 30] → 5/4 = 1 → AGI +1 → 6
     * - 10당: VIT +1, INT +1 [limit 10] → 5/10 = 0 → VIT +0, INT +0
     */
    currentStats = rll.tail!.stats;
    rll.tail!.adjustJobPoint(5);

    expect(currentStats.STR).toBe(5);
    expect(currentStats.INT).toBe(5);
    expect(currentStats.AGI).toBe(6);
    expect(currentStats.VIT).toBe(5);

    // 3. 연금술사로 전직
    rll.add(Jobs.연금술사);

    expect(currentStats.STR).toBe(5);
    expect(currentStats.INT).toBe(5);
    expect(currentStats.AGI).toBe(6);
    expect(currentStats.VIT).toBe(5);
  });
});
