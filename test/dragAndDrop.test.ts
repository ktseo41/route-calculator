import { describe, test, expect } from 'vitest';
import RouteLinkedList from "../src/lib/routeLinkedList.ts";
import { Jobs } from "../src/database/job";

describe("RouteLinkedList move functionality", () => {
  test("노드를 뒤로 이동시킬 수 있다. (1 -> 3)", () => {
    const rLL = new RouteLinkedList();
    rLL.add(Jobs.무도가); // 1
    rLL.add(Jobs.검사);   // 2
    rLL.add(Jobs.검객);   // 3
    
    // Initial: 0:무직, 1:무도가, 2:검사, 3:검객
    
    rLL.move(1, 3);
    
    // Expected: 0:무직, 1:검사, 2:검객, 3:무도가
    expect(rLL.get(0)?.job).toBe(Jobs.무직);
    expect(rLL.get(1)?.job).toBe(Jobs.검사);
    expect(rLL.get(2)?.job).toBe(Jobs.검객);
    expect(rLL.get(3)?.job).toBe(Jobs.무도가);
    
    // Check links
    expect(rLL.get(1)?.prev?.job).toBe(Jobs.무직);
    expect(rLL.get(1)?.next?.job).toBe(Jobs.검객);
    expect(rLL.get(3)?.prev?.job).toBe(Jobs.검객);
    expect(rLL.get(3)?.next).toBeNull();
    expect(rLL.tail?.job).toBe(Jobs.무도가);
  });

  test("노드를 앞으로 이동시킬 수 있다. (3 -> 1)", () => {
    const rLL = new RouteLinkedList();
    rLL.add(Jobs.무도가); // 1
    rLL.add(Jobs.검사);   // 2
    rLL.add(Jobs.검객);   // 3
    
    // Initial: 0:무직, 1:무도가, 2:검사, 3:검객
    
    rLL.move(3, 1);
    
    // Expected: 0:무직, 1:검객, 2:무도가, 3:검사
    expect(rLL.get(0)?.job).toBe(Jobs.무직);
    expect(rLL.get(1)?.job).toBe(Jobs.검객);
    expect(rLL.get(2)?.job).toBe(Jobs.무도가);
    expect(rLL.get(3)?.job).toBe(Jobs.검사);
    
    // Check links
    expect(rLL.get(1)?.prev?.job).toBe(Jobs.무직);
    expect(rLL.get(1)?.next?.job).toBe(Jobs.무도가);
    expect(rLL.tail?.job).toBe(Jobs.검사);
  });

  test("이동 후 스탯이 재계산되어야 한다.", () => {
    const rLL = new RouteLinkedList();
    // Setup a scenario where order matters for stats/points
    // 무도가 (STR/VIT) -> 검사 (STR/INT)
    rLL.add(Jobs.무도가);
    rLL.tail?.adjustJobPoint(100); // Max out 무도가
    rLL.add(Jobs.검사);
    
    // Initial: 무직 -> 무도가(100) -> 검사(0)
    
    rLL.move(2, 1);
    
    expect(rLL.get(1)?.job).toBe(Jobs.검사);
    expect(rLL.get(2)?.job).toBe(Jobs.무도가);
    
    // 검사 is now at 1. It should have 0 points (as it had 0).
    // 무도가 is now at 2. It should have 100 points.
  });

  test("잘못된 인덱스로 이동 시도 시 무시한다.", () => {
    const rLL = new RouteLinkedList();
    rLL.add(Jobs.무도가);
    
    rLL.move(0, 5); // Invalid to
    expect(rLL.get(1)?.job).toBe(Jobs.무도가);
    
    rLL.move(5, 0); // Invalid from
    expect(rLL.get(1)?.job).toBe(Jobs.무도가);
  });
  
  test("0번 인덱스(무직)는 이동할 수 없다.", () => {
     const rLL = new RouteLinkedList();
     rLL.add(Jobs.무도가);
     
     // Try to move 무직 to end
     rLL.move(0, 1);
     
     expect(rLL.get(0)?.job).toBe(Jobs.무직);
     expect(rLL.get(1)?.job).toBe(Jobs.무도가);
  });
  
  test("다른 노드를 0번 인덱스로 이동할 수 없다.", () => {
     const rLL = new RouteLinkedList();
     rLL.add(Jobs.무도가);
     
     // Try to move 무도가 to 0
     rLL.move(1, 0);
     
     expect(rLL.get(0)?.job).toBe(Jobs.무직);
     expect(rLL.get(1)?.job).toBe(Jobs.무도가);
  });
});
