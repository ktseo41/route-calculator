import RouteLinkedList from "../src/lib/RouteLinkedList";

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

  // https://m.blog.naver.com/PostView.nhn?blogId=pear1030&logNo=220741000360&proxyReferer=https:%2F%2Fwww.google.com%2F
  test("잡포인트 증가에 따른 스탯 변화가 제대로 적용되는지. (7277 최단 루트)", () => {
    rLL.tail.adjustJobPoint(100);
    expect(rLL.tail.jobPo).toBe(100);
    expect(rLL.tail.currentJobPos).toEqual({ 무직: 0, 무도가: 100 });
    expect(rLL.tail.stats).toEqual({ STR: 5, INT: 5, AGI: 5, VIT: 30 });
    rLL.add("검사");
    rLL.tail.adjustJobPoint(100);
    expect(rLL.tail.jobPo).toBe(100);
    expect(rLL.tail.currentJobPos).toEqual({ 무직: 0, 무도가: 100, 검사: 100 });
    expect(rLL.tail.stats).toEqual({ STR: 30, INT: 10, AGI: 5, VIT: 30 });
    rLL.add("검객");
    rLL.tail.adjustJobPoint(100);
    expect(rLL.tail.jobPo).toBe(100);
    expect(rLL.tail.currentJobPos).toEqual({
      무직: 0,
      무도가: 100,
      검사: 100,
      검객: 100,
    });
    expect(rLL.tail.stats).toEqual({ STR: 30, INT: 10, AGI: 30, VIT: 30 });
    rLL.add("순수마법사");
    rLL.tail.adjustJobPoint(100);
    expect(rLL.tail.jobPo).toBe(100);
    expect(rLL.tail.currentJobPos).toEqual({
      무직: 0,
      무도가: 100,
      검사: 100,
      검객: 100,
      순수마법사: 100,
    });
    expect(rLL.tail.stats).toEqual({ STR: 20, INT: 43, AGI: 55, VIT: 20 });
    rLL.add("모험가");
    rLL.tail.adjustJobPoint(30);
    expect(rLL.tail.jobPo).toBe(30);
    expect(rLL.tail.currentJobPos).toEqual({
      무직: 0,
      무도가: 100,
      검사: 100,
      검객: 100,
      순수마법사: 100,
      모험가: 30,
    });
    expect(rLL.tail.stats).toEqual({ STR: 20, INT: 43, AGI: 55, VIT: 30 });
    rLL.add("어둠의기사");
    rLL.tail.adjustJobPoint(100);
    expect(rLL.tail.jobPo).toBe(100);
    expect(rLL.tail.currentJobPos).toEqual({
      무직: 0,
      무도가: 100,
      검사: 100,
      검객: 100,
      순수마법사: 100,
      모험가: 30,
      어둠의기사: 100,
    });
    expect(rLL.tail.stats).toEqual({ STR: 40, INT: 43, AGI: 39, VIT: 50 });
    rLL.add("탐색가");
    rLL.tail.adjustJobPoint(93);
    expect(rLL.tail.jobPo).toBe(93);
    expect(rLL.tail.currentJobPos).toEqual({
      무직: 0,
      무도가: 100,
      검사: 100,
      검객: 100,
      순수마법사: 100,
      모험가: 30,
      어둠의기사: 100,
      탐색가: 93,
    });
    expect(rLL.tail.stats).toEqual({ STR: 40, INT: 32, AGI: 70, VIT: 40 });
    rLL.add("순수기사");
    rLL.tail.adjustJobPoint(100);
    expect(rLL.tail.jobPo).toBe(100);
    expect(rLL.tail.currentJobPos).toEqual({
      무직: 0,
      무도가: 100,
      검사: 100,
      검객: 100,
      순수마법사: 100,
      모험가: 30,
      어둠의기사: 100,
      탐색가: 93,
      순수기사: 100,
    });
    expect(rLL.tail.stats).toEqual({ STR: 70, INT: 20, AGI: 70, VIT: 70 });
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

  test("이전 노드의 잡포인트 0에서 증가시키면 이후 노드에 반영된다. - 1번 노드", () => {
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

  test("이전 노드의 잡포인트 0에서 증가시키면 이후 노드에 반영된다. - 2번 노드", () => {
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

  test("이전 노드의 잡포인트를 감소시키면 이후 노드에 반영된다. - 1번 노드", () => {
    무도가Node.adjustJobPoint(-10);
    expect(무도가Node.jobPo).toBe(20);
    무도가Node.adjustJobPoint(-10);
    expect(무도가Node.jobPo).toBe(10);
    무도가Node.adjustJobPoint(-10);
    expect(무도가Node.jobPo).toBe(0);
    expect(rLL.tail.currentJobPos).toEqual({
      무직: 0,
      무도가: 0,
      검사: 32,
      검객: 0,
    });
    expect(rLL.tail.stats).toEqual({ STR: 15, INT: 8, AGI: 5, VIT: 5 });
  });

  test("이전 노드의 잡포인트를 0에서 더 감소시키면 감소되지 않는다. - 1번 노드", () => {
    무도가Node.adjustJobPoint(-10);
    expect(rLL.tail.currentJobPos).toEqual({
      무직: 0,
      무도가: 0,
      검사: 32,
      검객: 0,
    });
    expect(rLL.tail.stats).toEqual({ STR: 15, INT: 8, AGI: 5, VIT: 5 });
  });

  test("이전 노드의 잡포인트를 감소시키면 이후 노드에 반영된다. - 2번 노드", () => {
    검사Node.adjustJobPoint(-10);
    expect(검사Node.jobPo).toBe(22);
    검사Node.adjustJobPoint(-10);
    expect(검사Node.jobPo).toBe(12);
    검사Node.adjustJobPoint(-10);
    expect(검사Node.jobPo).toBe(2);
    검사Node.adjustJobPoint(-2);
    expect(검사Node.jobPo).toBe(0);
    expect(rLL.tail.currentJobPos).toEqual({
      무직: 0,
      무도가: 0,
      검사: 0,
      검객: 0,
    });
    expect(rLL.tail.stats).toEqual({ STR: 5, INT: 5, AGI: 5, VIT: 5 });
  });

  /* 선태의 문제로 남기기로함
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
    expect(rLL.tail.stats).toEqual({ STR: 10, INT: 8, AGI: 5, VIT: 30 });
  });
*/

  test("이전 노드의 잡포인트를 증가시키면 이후 노드의 잡포인트는 100에 맞춰 줄어든다. (같은 직업일 때)", () => {
    rLL.add("무도가");
    rLL.tail?.adjustJobPoint(100);
    무도가Node.adjustJobPoint(30);
    expect(rLL.tail.jobPo).toBe(70);
    expect(무도가Node.jobPo).toBe(30);
    expect(rLL.tail.currentJobPos).toEqual({
      무직: 0,
      무도가: 100,
      검사: 0,
      검객: 0,
    });
    expect(rLL.tail.stats).toEqual({ STR: 5, INT: 5, AGI: 5, VIT: 30 });
  });

  test("이후 노드의 잡포인트를 증가시키면 총합 100까지만 증가한다. (로직 선택의 여지가 있음 .. )", () => {
    rLL.tail.adjustJobPoint(10);
    expect(rLL.tail.jobPo).toBe(70);
  });
});

describe("노드를 삭제할 수 있다.", () => {
  const rLL = new RouteLinkedList();
  rLL.add("무도가");
  rLL.tail.adjustJobPoint(100);
  rLL.add("자객");
  rLL.tail.adjustJobPoint(100);
  rLL.add("투사");
  rLL.add("모험가");
  test("이전 노드 중 선택해서 삭제를 할 수 있다.", () => {
    rLL.removeAt(1);
    expect(rLL.tail.currentJobPos).toEqual({
      무직: 0,
      자객: 100,
      투사: 0,
      모험가: 0,
    });
  });
});

describe("bug : 특정 상황에서 잡포인트를 늘렸다가 줄일 때 스탯이 이전 상태로 돌아가지않는다.", () => {
  const rLL = new RouteLinkedList();
  rLL.add("무도가");
  rLL.tail.adjustJobPoint(100);
  rLL.add("검사");
  rLL.tail.adjustJobPoint(100);
  rLL.add("검객");
  rLL.tail.adjustJobPoint(100);
  rLL.add("순수마법사");
  rLL.tail.adjustJobPoint(100);
  rLL.add("모험가");
  rLL.tail.adjustJobPoint(30);
  rLL.add("네크로멘서");
  test("0에서부터 늘리기만 하면 제대로 적용된다.", () => {
    rLL.tail.adjustJobPoint(50);
    expect(rLL.tail.currentJobPos).toEqual({
      무직: 0,
      무도가: 100,
      검사: 100,
      검객: 100,
      순수마법사: 100,
      모험가: 30,
      네크로멘서: 50,
    });
    expect(rLL.tail.stats).toEqual({
      STR: 10,
      INT: 50,
      AGI: 10,
      VIT: 10,
    });
  });
  test("순차를 나눠서 돌아가면 이전 스탯으로 돌아가지 않는 것이 돌아가야 한다.", () => {
    rLL.tail.adjustJobPoint(-10);
    rLL.tail.adjustJobPoint(-10);
    rLL.tail.adjustJobPoint(-10);
    rLL.tail.adjustJobPoint(-10);
    rLL.tail.adjustJobPoint(-10);
    expect(rLL.tail.stats).toEqual({
      STR: 20,
      INT: 43,
      AGI: 55,
      VIT: 30,
    });
  });
});

describe("bug : 1씩 증가시킬 때 오류 발생", () => {
  const rLL1 = new RouteLinkedList();
  const rLL2 = new RouteLinkedList();

  rLL1.add("순수마법사");
  rLL1.tail.adjustJobPoint(100);
  rLL2.add("순수마법사");
  for (let i = 0; i < 100; i++) {
    rLL2.tail.adjustJobPoint(1);
  }
  test("1씩 증가시켰을 때와 100씩 증가시켰을 때 스탯량이 같아야 한다.", () => {
    expect(rLL1.tail.stats).toEqual(rLL2.tail.stats);
  });
});

describe("bug : 스탯이 하한치 이상이고 잡포인트를 1씩 감소 시켜 스탯을 감소시킬 때 오류 발생", () => {
  const rLL = new RouteLinkedList();

  rLL.add("무도가");
  rLL.tail.adjustJobPoint(100);
  rLL.add("검사");
  rLL.tail.adjustJobPoint(100);
  rLL.add("순수마법사");
  rLL.tail.adjustJobPoint(100);
  for (let i = 0; i < 2; i++) {
    rLL.tail.adjustJobPoint(-1);
  }
  test("해당 스탯이 하한치 (10)으로 감소해버린다.", () => {
    expect(rLL.tail.stats).toEqual({ STR: 21, INT: 42, AGI: 29, VIT: 21 });
  });
});

describe("bug : 이전 잡포인트가 있음에도 +100을 누르면 적용되는 문제", () => {
  const rLL1 = new RouteLinkedList();
  const rLL2 = new RouteLinkedList();

  rLL1.add("무도가");
  rLL1.tail.adjustJobPoint(100);
  rLL1.add("검사");
  rLL1.tail.adjustJobPoint(100);
  rLL1.add("순수마법사");
  rLL1.tail.adjustJobPoint(50);
  rLL1.add("악사");
  rLL1.tail.adjustJobPoint(100);
  rLL1.add("순수마법사");
  rLL1.tail.adjustJobPoint(50);
  rLL2.add("무도가");
  rLL2.tail.adjustJobPoint(100);
  rLL2.add("검사");
  rLL2.tail.adjustJobPoint(100);
  rLL2.add("순수마법사");
  rLL2.tail.adjustJobPoint(50);
  rLL2.add("악사");
  rLL2.tail.adjustJobPoint(100);
  rLL2.add("순수마법사");
  rLL2.tail.adjustJobPoint(100);
  test("100만큼 증가시켰어도 이전 잡포인트 포함 총 100까지만 증가해야한다.", () => {
    expect(rLL1.tail.currentJobPos).toEqual(rLL2.tail.currentJobPos);
    expect(rLL1.tail.stats).toEqual(rLL2.tail.stats);
  });
});

describe("버튼이 아니라 직접 입력해서 잡포인트를 변경할 수 있다.", () => {});
