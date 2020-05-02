import RouteLinkedList from "../src/lib/RouteLinkedList.js";

describe("rLL 기본 테스트", () => {
  let rLL;

  test("rLL을 만들 수 있다. RouteLinkedList의 인스턴스이다.", () => {
    rLL = new RouteLinkedList();
    expect(rLL instanceof RouteLinkedList).toBeTruthy();
  });

  test("rLL인스턴스가 생성되면 기본으로 무직 노드가 추가된다.", () => {
    expect(rLL.length).toBe(1);
    expect(rLL.tail.job).toBe("무직");
  });

  test("기본 잡포인트, 스탯, 누적잡포인트가 설정돼있다.", () => {
    expect(rLL.tail.jobPo).toBe(0);
    expect(rLL.tail.stats).toEqual({ STR: 5, INT: 5, AGI: 5, VIT: 5 });
    expect(rLL.tail.currentJobPos).toEqual({ 무직: 0 });
  });
});

describe("rLL add test", () => {
  const rLL = new RouteLinkedList();
  test("add로 노드를 더할 수 있다. (예시 : 무도가)", () => {
    rLL.add("무도가");
    expect(rLL.tail.job).toBe("무도가");
    expect(rLL.tail.jobPo).toBe(0);
    expect(rLL.tail.stats).toEqual({ STR: 5, INT: 5, AGI: 5, VIT: 5 });
    expect(rLL.tail.currentJobPos).toEqual({ 무직: 0, 무도가: 0 });
  });

  test("여러 직업을 추가할 수 있다.", () => {
    rLL.add("투사");
    expect(rLL.tail.job).toBe("투사");
    rLL.add("모험가");
    expect(rLL.tail.job).toBe("모험가");
    expect(rLL.tail.currentJobPos).toEqual({
      무직: 0,
      무도가: 0,
      투사: 0,
      모험가: 0,
    });
  });
});

describe("RouteNode adjustJobPo. 1개 노드 상황", () => {
  const rLL = new RouteLinkedList();
  rLL.add("무도가");
  test("잡포인트를 증가시킬 수 있다. adjustJobPo(1)", () => {
    rLL.tail.adjustJobPoint(1);
    expect(rLL.tail.jobPo).toBe(1);
    expect(rLL.tail.currentJobPos).toEqual({ 무직: 0, 무도가: 1 });
  });

  test("잡포인트를 일정이상 증가시키면 그에 맞춰 스탯이 변경된다., adjustJobPo(2)", () => {
    rLL.tail.adjustJobPoint(2);
    expect(rLL.tail.jobPo).toBe(3);
    expect(rLL.tail.currentJobPos).toEqual({ 무직: 0, 무도가: 3 });
    expect(rLL.tail.stats).toEqual({ STR: 5, INT: 5, AGI: 5, VIT: 6 });
  });

  test("잡포인트를 마스터할 수 있다.", () => {
    rLL.tail.adjustJobPoint(97);
    expect(rLL.tail.jobPo).toBe(100);
    expect(rLL.tail.currentJobPos).toEqual({ 무직: 0, 무도가: 100 });
    expect(rLL.tail.stats).toEqual({ STR: 5, INT: 5, AGI: 5, VIT: 30 });
  });

  test("잡포인트를 100 이상  올릴 수 없다.", () => {
    rLL.tail.adjustJobPoint(1);
    expect(rLL.tail.jobPo).toBe(100);
    expect(rLL.tail.currentJobPos).toEqual({ 무직: 0, 무도가: 100 });
    expect(rLL.tail.stats).toEqual({ STR: 5, INT: 5, AGI: 5, VIT: 30 });
  });

  test("잡포인트를 100 이상 올리려고 하면 100만 적용된다.", () => {
    const tempRLL = new RouteLinkedList();
    tempRLL.add("무도가");
    rLL.tail.adjustJobPoint(202);
    expect(rLL.tail.jobPo).toBe(100);
    expect(rLL.tail.currentJobPos).toEqual({ 무직: 0, 무도가: 100 });
    expect(rLL.tail.stats).toEqual({ STR: 5, INT: 5, AGI: 5, VIT: 30 });
  });

  test("잡포인트를 줄일 수 있다. adjustJobPo(-1)", () => {
    rLL.tail.adjustJobPoint(-1);
    expect(rLL.tail.jobPo).toBe(99);
    expect(rLL.tail.currentJobPos).toEqual({ 무직: 0, 무도가: 99 });
  });

  test("잡포인트를 일정 이상 줄이면 스탯이 그에 맞춰 변경된다.", () => {
    rLL.tail.adjustJobPoint(-2);
    expect(rLL.tail.jobPo).toBe(97);
    expect(rLL.tail.currentJobPos).toEqual({ 무직: 0, 무도가: 97 });
    expect(rLL.tail.stats).toEqual({ STR: 5, INT: 5, AGI: 5, VIT: 29 });
  });

  test("잡포인트를 0까지 줄일 수 있다.", () => {
    rLL.tail.adjustJobPoint(-97);
    expect(rLL.tail.jobPo).toBe(0);
    expect(rLL.tail.currentJobPos).toEqual({ 무직: 0, 무도가: 0 });
    expect(rLL.tail.stats).toEqual({ STR: 5, INT: 5, AGI: 5, VIT: 5 });
  });

  test("잡포인트를 0에서 0 미만으로 줄이려고 하면 0까지만 줄어든다.", () => {
    rLL.tail.adjustJobPoint(-1);
    expect(rLL.tail.jobPo).toBe(0);
    expect(rLL.tail.currentJobPos).toEqual({ 무직: 0, 무도가: 0 });
    expect(rLL.tail.stats).toEqual({ STR: 5, INT: 5, AGI: 5, VIT: 5 });
  });

  test("잡포인트를 0 초과에서 0 미만으로 줄이려고 하면 0까지만 줄어든다.", () => {
    rLL.tail.adjustJobPoint(10);
    expect(rLL.tail.jobPo).toBe(10);
    expect(rLL.tail.currentJobPos).toEqual({ 무직: 0, 무도가: 10 });
    expect(rLL.tail.stats).toEqual({ STR: 5, INT: 5, AGI: 5, VIT: 8 });
    rLL.tail.adjustJobPoint(-30);
    expect(rLL.tail.jobPo).toBe(0);
    expect(rLL.tail.currentJobPos).toEqual({ 무직: 0, 무도가: 0 });
    expect(rLL.tail.stats).toEqual({ STR: 5, INT: 5, AGI: 5, VIT: 5 });
  });
});

describe("RouteNode adjustJobPo & recalculate. 여러 노드 상황 & 이전 노드를 변경", () => {
  const rLL = new RouteLinkedList();
  rLL.add("무도가");
  const 무도가Node = rLL.tail;
  rLL.add("검사");
  const 검사Node = rLL.tail;
  rLL.add("검객");
  const 검객Node = rLL.tail;

  test("이전 노드를 선택할 수 있다.", () => {
    expect(rLL.get(1)).toBe(무도가Node);
    expect(rLL.get(2)).toBe(검사Node);
    expect(rLL.get(3)).toBe(검객Node);
  });

  test("이전 노드의 잡포인트 0에서 증가시키면 이후 노드에 반영된다. - 1", () => {
    무도가Node.adjustJobPoint(30);
    expect(무도가Node.jobPo).toBe(30);
    expect(rLL.tail.jobPo).toBe(0);
    expect(rLL.tail.currentJobPos).toEqual({
      무직: 0,
      무도가: 30,
      검사: 0,
      검객: 0,
    });
    expect(rLL.tail.stats).toEqual({ STR: 5, INT: 5, AGI: 5, VIT: 15 });
  });

  test("이전 노드의 잡포인트 0에서 증가시키면 이후 노드에 반영된다. - 2", () => {
    검사Node.adjustJobPoint(32);
    expect(rLL.tail.jobPo).toBe(0);
    expect(rLL.tail.currentJobPos).toEqual({
      무직: 0,
      무도가: 30,
      검사: 32,
      검객: 0,
    });
    expect(rLL.tail.stats).toEqual({ STR: 15, INT: 8, AGI: 5, VIT: 15 });
  });

  test("이전 노드의 잡포인트를 감소시키면 이후 노드에 반영된다.", () => {
    무도가Node.adjustJobPoint(-10);
    무도가Node.adjustJobPoint(-10);
    무도가Node.adjustJobPoint(-10);
    expect(rLL.tail.jobPo).toBe(0);
    expect(rLL.tail.currentJobPos).toEqual({
      무직: 0,
      무도가: 0,
      검사: 32,
      검객: 0,
    });
    expect(rLL.tail.stats).toEqual({ STR: 15, INT: 8, AGI: 5, VIT: 5 });
  });

  test("최종 잡포인트의 합계가 100이면 이전 노드의 잡포인트를 증가시킬 수 없다.", () => {
    rLL.add("무도가");
    rLL.tail?.adjustJobPoint(100);
    무도가Node.adjustJobPoint(10);
    expect(rLL.tail.jobPo).toBe(100);
    expect(무도가Node.jobPo).toBe(0);
    expect(rLL.tail.currentJobPos).toEqual({
      무직: 0,
      무도가: 100,
      검사: 32,
      검객: 0,
    });
    expect(rLL.tail.stats).toEqual({ STR: 15, INT: 8, AGI: 5, VIT: 30 });
  });

  test("최종 잡포인트의 합계가 100이고, 이전 노드의 잡포인트를 증가시키면 이후 노드의 잡포인트는 100에 맞춰 줄어든다.", () => {
    expect(rLL.tail.jobPo).toBe(90);
    expect(무도가Node.jobPo).toBe(10);
    expect(rLL.tail.currentJobPos).toEqual({
      무직: 0,
      무도가: 100,
      검사: 32,
      검객: 0,
    });
    expect(rLL.tail.stats).toEqual({ STR: 15, INT: 8, AGI: 5, VIT: 30 });
  });
});

// test("adjustJobPo를 통해 현재 노드의 잡포인트를 변경할 수 있다.", () => {});
