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

  it.each([Jobs.세공사, Jobs.대장장이, Jobs.연금술사])(
    "요리 25레벨로 상인이 된 후, 배달+흥정 15레벨 추가해서 %s가 되는 상황",
    (job) => {
      const rll = new RouteLinkedList();

      // 1. 상인 추가
      rll.add(Jobs.상인);
      let currentStats = rll.tail!.stats;

      /**
       * 2. 상인 잡포 7 추가 후 스탯 검증 (배달+흥정 15레벨 / 2 = 7 잡포)
       * 주의: 요리 25레벨은 상인 전직 조건이라 잡포에 미포함
       *
       * 상인 잡포 7:
       * - 2당: STR -1 [limit 10] → 7/2 = 3 → STR -3 (이미 5라 유지)
       * - 4당: AGI +1 [limit 30] → 7/4 = 1 → AGI +1 → 6
       * - 10당: VIT +1, INT +1 [limit 10] → 7/10 = 0 → VIT +0, INT +0
       */
      currentStats = rll.tail!.stats;
      rll.tail!.adjustJobPoint(7);

      expect(currentStats.STR).toBe(5);
      expect(currentStats.INT).toBe(5);
      expect(currentStats.AGI).toBe(6);
      expect(currentStats.VIT).toBe(5);

      // 3. 2차 직업으로 전직
      rll.add(job);

      expect(currentStats.STR).toBe(5);
      expect(currentStats.INT).toBe(5);
      expect(currentStats.AGI).toBe(6);
      expect(currentStats.VIT).toBe(5);
    }
  );

  it("요리 25레벨로 상인이 된 후, 배달+흥정 5레벨 추가해서 목공사가 되는 상황", () => {
    const rll = new RouteLinkedList();

    // 1. 상인 추가
    rll.add(Jobs.상인);
    let currentStats = rll.tail!.stats;

    /**
     * 2. 상인 잡포 5 추가 후 스탯 검증 (요리25 + 배달+흥정5 = 30)
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
});

describe("2차 직업 전환 후 스탯 적용 테스트", () => {
  it("요리 25레벨로 상인, 배달 + 흥정 5레벨로 미용사, 이후 미용 잡포 100", () => {
    const rll = new RouteLinkedList();

    // 1. 상인 추가
    rll.add(Jobs.상인);
    let currentStats = rll.tail!.stats;

    // 2. 배달 + 흥정 5레벨로 미용사
    rll.tail!.adjustJobPoint(2);
    expect(currentStats.STR).toBe(5);
    expect(currentStats.INT).toBe(5);
    expect(currentStats.AGI).toBe(5);
    expect(currentStats.VIT).toBe(5);

    rll.add(Jobs.미용사);

    /**
     * 3. 미용 잡포 100
     *
     * - STR: -0
     * - INT: -0
     * - AGI: +33
     * - VIT: +12
     */
    rll.tail!.adjustJobPoint(100);
    currentStats = rll.tail!.stats;

    expect(currentStats.STR).toBe(5);
    expect(currentStats.INT).toBe(5);
    expect(currentStats.AGI).toBe(38);
    expect(currentStats.VIT).toBe(17);
  });

  it("요리 25레벨로 상인, 재단 15레벨로 재단사, 이후 재단사 잡포 100", () => {
    const rll = new RouteLinkedList();

    // 1. 상인 추가
    rll.add(Jobs.상인);
    let currentStats = rll.tail!.stats;

    // 2. 재단 15레벨로 상인 잡포 7
    rll.tail!.adjustJobPoint(7);
    expect(currentStats.STR).toBe(5);
    expect(currentStats.INT).toBe(5);
    expect(currentStats.AGI).toBe(6);
    expect(currentStats.VIT).toBe(5);

    rll.add(Jobs.재단사);

    /**
     * 3. 재단사 잡포 100
     *
     * - 3당 AGI +1 (limit 70): 100/3 = 33 → AGI +33
     * - 4당 STR -1 (limit 20): 100/4 = 25, limit 20 → 이미 5라서 유지
     * - 5당 VIT +1 (limit 30): 100/5 = 20 → VIT +20
     * - 8당 INT -1 (limit 20): 100/8 = 12 → 이미 5라서 유지
     */
    rll.tail!.adjustJobPoint(100);
    currentStats = rll.tail!.stats;

    expect(currentStats.STR).toBe(5);
    expect(currentStats.INT).toBe(5);
    expect(currentStats.AGI).toBe(39); // 6 + 33 = 39
    expect(currentStats.VIT).toBe(25); // 5 + 20 = 25
  });

  it("요리 25레벨로 상인, 배달+흥정 15레벨로 세공사, 이후 세공사 잡포 100", () => {
    const rll = new RouteLinkedList();

    // 1. 상인 추가
    rll.add(Jobs.상인);
    let currentStats = rll.tail!.stats;

    // 2. 배달+흥정 15레벨로 상인 잡포 7 (요리는 전직 조건이라 미포함)
    rll.tail!.adjustJobPoint(7);
    expect(currentStats.STR).toBe(5);
    expect(currentStats.INT).toBe(5);
    expect(currentStats.AGI).toBe(6);
    expect(currentStats.VIT).toBe(5);

    rll.add(Jobs.세공사);

    /**
     * 3. 세공사 잡포 100
     *
     * - 4당 STR -1 (limit 20), AGI +1 (limit 60): 100/4 = 25 → STR 이미 5, AGI +25
     * - 6당 INT -1 (limit 20): 100/6 = 16 → INT 이미 5라서 유지
     * - 9당 VIT +1 (limit 40): 100/9 = 11 → VIT +11
     */
    rll.tail!.adjustJobPoint(100);
    currentStats = rll.tail!.stats;

    expect(currentStats.STR).toBe(5);
    expect(currentStats.INT).toBe(5); // Changed from 6
    expect(currentStats.AGI).toBe(31); // 6 + 25 = 31 (was 8 + 25 = 33)
    expect(currentStats.VIT).toBe(16); // 5 + 11 = 16 (was 6 + 11 = 17)
  });

  it("요리 25레벨로 상인, 배달+흥정 15레벨로 대장장이, 이후 대장장이 잡포 100", () => {
    const rll = new RouteLinkedList();

    // 1. 상인 추가
    rll.add(Jobs.상인);
    let currentStats = rll.tail!.stats;

    // 2. 배달+흥정 15레벨로 상인 잡포 7 (요리는 전직 조건이라 미포함)
    rll.tail!.adjustJobPoint(7);
    expect(currentStats.STR).toBe(5);
    expect(currentStats.INT).toBe(5);
    expect(currentStats.AGI).toBe(6);
    expect(currentStats.VIT).toBe(5);

    rll.add(Jobs.대장장이);

    /**
     * 3. 대장장이 잡포 100
     *
     * - 4당 AGI +1 (limit 60): 100/4 = 25 → AGI +25
     * - 6당 INT -1 (limit 20): 100/6 = 16 → INT 이미 5라서 유지
     * - 7당 VIT +1 (limit 30): 100/7 = 14 → VIT +14
     * - 10당 STR +1 (limit 20): 100/10 = 10 → STR +10
     */
    rll.tail!.adjustJobPoint(100);
    currentStats = rll.tail!.stats;

    expect(currentStats.STR).toBe(15); // 5 + 10 = 15
    expect(currentStats.INT).toBe(5); // Changed from 6
    expect(currentStats.AGI).toBe(31); // 6 + 25 = 31 (was 8 + 25 = 33)
    expect(currentStats.VIT).toBe(19); // 5 + 14 = 19 (was 6 + 14 = 20)
  });

  it("요리 25레벨로 상인, 배달+흥정 5레벨로 목공사, 이후 목공사 잡포 100", () => {
    const rll = new RouteLinkedList();

    // 1. 상인 추가
    rll.add(Jobs.상인);
    let currentStats = rll.tail!.stats;

    // 2. 배달+흥정 5레벨로 상인 잡포 5 (요리25 + 배달+흥정5 = 30)
    rll.tail!.adjustJobPoint(5);
    expect(currentStats.STR).toBe(5);
    expect(currentStats.INT).toBe(5);
    expect(currentStats.AGI).toBe(6);
    expect(currentStats.VIT).toBe(5);

    rll.add(Jobs.목공사);

    /**
     * 3. 목공사 잡포 100
     *
     * - 4당 AGI +1 (limit 50): 100/4 = 25 → AGI +25
     * - 6당 INT -1 (limit 20): 100/6 = 16 → INT 이미 5라서 유지
     * - 9당 VIT +1 (limit 40): 100/9 = 11 → VIT +11
     * - 10당 STR +1 (limit 20): 100/10 = 10 → STR +10
     */
    rll.tail!.adjustJobPoint(100);
    currentStats = rll.tail!.stats;

    expect(currentStats.STR).toBe(15); // 5 + 10 = 15
    expect(currentStats.INT).toBe(5);
    expect(currentStats.AGI).toBe(31); // 6 + 25 = 31
    expect(currentStats.VIT).toBe(16); // 5 + 11 = 16
  });

  it("요리 25레벨로 상인, 배달+흥정 15레벨로 연금술사, 이후 연금술사 잡포 100", () => {
    const rll = new RouteLinkedList();

    // 1. 상인 추가
    rll.add(Jobs.상인);
    let currentStats = rll.tail!.stats;

    // 2. 배달+흥정 15레벨로 상인 잡포 7 (요리는 전직 조건이라 미포함)
    rll.tail!.adjustJobPoint(7);
    expect(currentStats.STR).toBe(5);
    expect(currentStats.INT).toBe(5);
    expect(currentStats.AGI).toBe(6);
    expect(currentStats.VIT).toBe(5);

    rll.add(Jobs.연금술사);

    /**
     * 3. 연금술사 잡포 100
     *
     * - 5당 AGI +1 (limit 50), STR -1 (limit 20): 100/5 = 20 → AGI +20, STR 이미 5라서 유지
     * - 8당 VIT +1 (limit 30): 100/8 = 12 → VIT +12
     * - 10당 INT +1 (limit 20): 100/10 = 10 → INT +10
     */
    rll.tail!.adjustJobPoint(100);
    currentStats = rll.tail!.stats;

    expect(currentStats.STR).toBe(5);
    expect(currentStats.INT).toBe(15); // 5 + 10 = 15
    expect(currentStats.AGI).toBe(26); // 6 + 20 = 26
    expect(currentStats.VIT).toBe(17); // 5 + 12 = 17
  });
});
