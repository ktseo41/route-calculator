import { Jobs } from "../database/job";
import { RouteNode } from "./routeNode";
import type { CurrentJobPoints } from "./routeNode";

// https://www.zerocho.com/category/Algorithm/post/58008a628475ed00152d6c4d
// https://dev.to/miku86/javascript-data-structures-singly-linked-list-remove-fai

export default class RouteLinkedList {
  constructor() {
    this.add(Jobs.무직);
  }
  length: number = 0;
  head: RouteNode | null = null;
  tail: RouteNode | null = null;

  // = push
  // 추가조건 1. 이전 jobPo가 100이면 추가할 수 없게 한다.
  add(job: Jobs): RouteNode | null {
    if (this.tail && this.tail.currentJobPos[job] === 100) return null;

    const routeNode = new RouteNode(job);

    if (!this.tail) {
      this.head = routeNode;
      this.tail = routeNode;
    } else {
      this.tail.next = routeNode;
      routeNode.prev = this.tail;
      this.tail = routeNode;
      routeNode.getPrevs();
    }

    this.length += 1;
    return routeNode;
  }

  // 추가 조건 1. currentJobPo에서 현재 jobPo가 100이면 추가 못함
  insertAt(job: Jobs, index: number): RouteNode | null {
    if (index < 0 || index > this.length) return null;
    if (index === 0) return this.unshift(job);
    if (index === this.length) return this.add(job);

    const routeNode = new RouteNode(job);

    const prevRouteNode = this.get(index - 1) as RouteNode;

    if (prevRouteNode.currentJobPos[job] === 100) return null;

    const nextRouteNode = prevRouteNode.next as RouteNode;

    routeNode.prev = prevRouteNode;
    prevRouteNode.next = routeNode;

    routeNode.next = nextRouteNode;
    nextRouteNode.prev = routeNode;

    this.length -= 1;

    routeNode.getPrevs();
    // routeNode.next.recalculate()가 필요 없는 이유는
    // 추가만한 상황이라서 어떤 변화도 없을 것이기 때문이다.

    return routeNode;
  }

  // 추가 조건 마지막 노드의 jobpo가 100이면 추가 못하게
  unshift(job: Jobs): RouteNode | null {
    if (this.tail && this.tail.currentJobPos[job] === 100) return null;
    const routeNode = new RouteNode(job);

    if (!this.length) {
      this.head = routeNode;
      this.tail = routeNode;
    } else {
      routeNode.next = this.head as RouteNode;
      (this.head as RouteNode).prev = routeNode;
      this.head = routeNode;
      // routeNode.next.getPrevs();
      routeNode.next.recalculate();
    }

    this.length += 1;

    return routeNode;
  }

  shift(): RouteNode | null {
    if (!this.length) return null;

    const nodeToRemove = this.head as RouteNode;

    if (this.length === 1) {
      this.head = null;
      this.tail = null;
    } else {
      this.head = nodeToRemove.next as RouteNode;

      this.head.prev = null;
      nodeToRemove.next = null;

      // this.head.next?.getPrevs();
      this.head.next?.recalculate();
    }

    this.length -= 1;

    return nodeToRemove;
  }

  pop(): RouteNode | null {
    if (!this.length) {
      return null;
    } else {
      const nodeToRemove = this.tail;

      if (this.length === 1) {
        this.head = null;
        this.tail = null;
      } else {
        this.tail = (this.tail as RouteNode).prev as RouteNode;
        this.tail.next = null;
        (nodeToRemove as RouteNode).prev = null;
      }

      this.length -= 1;

      return nodeToRemove;
    }
  }

  get(index: number): RouteNode | null {
    if (!this.length || index < 0 || index >= this.length) return null;

    let current: RouteNode;

    if (index < this.length / 2) {
      let counter = 0;

      current = this.head as RouteNode;

      while (counter < index) {
        current = current.next as RouteNode;
        counter += 1;
      }
    } else {
      let counter = this.length - 1;

      current = this.tail as RouteNode;

      while (counter > index) {
        current = current.prev as RouteNode;
        counter -= 1;
      }
    }
    return current;
  }

  // index가 tail일때
  removeAt(index: number) {
    if (index < 0 && index >= this.length) return null;
    if (index === 0) return this.shift();
    if (index === this.length - 1) return this.pop();

    const nodeToRemove = this.get(index) as RouteNode;
    const prevNodeToRemove = nodeToRemove.prev as RouteNode;
    const nextNodeToRemove = nodeToRemove.next as RouteNode;

    nodeToRemove.next = null;
    nodeToRemove.prev = null;

    prevNodeToRemove.next = nextNodeToRemove;
    nextNodeToRemove.prev = prevNodeToRemove;

    this.length -= 1;

    // nextNodeToRemove.getPrevs();
    nextNodeToRemove.recalculate();

    return nodeToRemove;
  }

  public getAllNodes(): (RouteNode | null)[] {
    const allNodes = [];
    let count = 0;

    while (count < this.length) {
      allNodes.push(this.get(count));
      count += 1;
    }

    return allNodes;
  }

  public move(fromIndex: number, toIndex: number): boolean {
    if (fromIndex === toIndex) return false;
    // 0번 인덱스(무직)는 이동하거나 그 자리에 다른 것을 넣을 수 없음
    if (fromIndex <= 0 || toIndex <= 0) return false;
    if (fromIndex >= this.length || toIndex >= this.length) return false;

    const nodeToMove = this.get(fromIndex);
    if (!nodeToMove) return false;

    // Validation: Check if moving the node results in consecutive identical jobs
    // We need to determine the new prev and next nodes at toIndex.
    
    // Temporarily remove the node to simulate the state after removal
    // But we can't just remove it because we might need to revert if validation fails.
    // Instead, let's calculate the target neighbors based on indices.
    
    // If we move from 1 to 3:
    // 0(A) -> 1(B) -> 2(C) -> 3(D)
    // Remove 1: 0(A) -> 2(C) -> 3(D)
    // Insert at 3: 0(A) -> 2(C) -> 3(D) -> 1(B)
    // New neighbors for B: prev=D, next=null
    
    // If we move from 3 to 1:
    // 0(A) -> 1(B) -> 2(C) -> 3(D)
    // Remove 3: 0(A) -> 1(B) -> 2(C)
    // Insert at 1: 0(A) -> 3(D) -> 1(B) -> 2(C)
    // New neighbors for D: prev=A, next=B

    // Let's use a simpler approach:
    // 1. Identify the node to be moved.
    // 2. Identify the target position's new previous and next nodes.
    
    let newPrevNode: RouteNode | null = null;
    let newNextNode: RouteNode | null = null;

    if (fromIndex < toIndex) {
      // Moving forward (e.g., 1 -> 3)
      // The node will be inserted AFTER the node currently at toIndex.
      // Wait, insertNodeAt(node, index) inserts *at* that index, shifting current node at index to next.
      // But in move(), we remove first.
      
      // Example: 0:A, 1:B, 2:C, 3:D. Move 1 to 3.
      // remove(1) -> 0:A, 1:C, 2:D. Length is now 3.
      // insertAt(3) -> 0:A, 1:C, 2:D, 3:B.
      // So B is after D.
      
      // When removing fromIndex, indices > fromIndex shift down by 1.
      // So the original toIndex becomes toIndex - 1 if toIndex > fromIndex?
      // No, let's look at the implementation of move:
      // const nodeToMove = this.removeAt(fromIndex);
      // this.insertNodeAt(nodeToMove, toIndex);
      
      // If I remove fromIndex, the node at toIndex (if toIndex > fromIndex) shifts to toIndex-1.
      // Then I insert at toIndex.
      // So the node that WAS at toIndex is now at toIndex-1.
      // The node that WAS at toIndex+1 is now at toIndex.
      // Inserting at toIndex puts the new node BEFORE the node currently at toIndex (which was at toIndex+1).
      // And AFTER the node at toIndex-1 (which was at toIndex).
      
      // Let's trace: 0:A, 1:B, 2:C, 3:D. Move 1 to 3.
      // remove(1): 0:A, 1:C, 2:D. (C was 2, D was 3).
      // insertAt(3): 0:A, 1:C, 2:D, 3:B.
      // B's prev is D (index 2). B's next is null.
      
      // General logic for insertNodeAt(index):
      // Inserts at `index`. Node at `index` becomes `next`. Node at `index-1` becomes `prev`.
      
      // So we need to check the node at `toIndex-1` (new prev) and `toIndex` (new next) *after removal*.
      
      // Since we can't easily peek "after removal" without modifying state, let's calculate based on current state.
      
      // Case 1: Moving forward (fromIndex < toIndex)
      // We are moving `node` to `toIndex`.
      // After removal, the node at `toIndex` in the *original* list will shift to `toIndex-1`.
      // So we will be inserting AFTER the node originally at `toIndex`.
      // And BEFORE the node originally at `toIndex+1`.
      
      // Wait, let's verify `insertNodeAt` behavior.
      // If I have [A, C, D] and insert at 3.
      // index=3. length=3.
      // It appends. Tail (D) becomes prev.
      
      // Back to 0:A, 1:B, 2:C, 3:D. Move 1 to 3.
      // Target: A, C, D, B.
      // B is after D (original 3).
      // B is before nothing.
      
      // So newPrev = original node at toIndex.
      // newNext = original node at toIndex + 1.
      
      newPrevNode = this.get(toIndex);
      newNextNode = this.get(toIndex + 1);
      
    } else {
      // Moving backward (e.g., 3 -> 1)
      // 0:A, 1:B, 2:C, 3:D. Move 3 to 1.
      // remove(3): 0:A, 1:B, 2:C.
      // insertAt(1): 0:A, 1:D, 2:B, 3:C.
      
      // D is inserted at 1.
      // D's prev is A (original 0, which is toIndex - 1).
      // D's next is B (original 1, which is toIndex).
      
      newPrevNode = this.get(toIndex - 1);
      newNextNode = this.get(toIndex);
    }

    if (newPrevNode && newPrevNode.job === nodeToMove.job) return false;
    if (newNextNode && newNextNode.job === nodeToMove.job) return false;

    // 1. Remove the node from the current position
    const removedNode = this.removeAt(fromIndex);
    if (!removedNode) return false;

    // 2. Insert the node at the new position
    this.insertNodeAt(removedNode, toIndex);

    // 3. Recalculate from the earliest affected point
    const startIndex = Math.min(fromIndex, toIndex);
    const startNode = this.get(startIndex);
    if (startNode) {
      startNode.recalculate();
    }
    
    return true;
  }

  private insertNodeAt(node: RouteNode, index: number): void {
    if (index < 0 || index > this.length) return;

    if (index === 0) {
      // This case is technically blocked by move() validation, but for completeness:
      node.next = this.head;
      if (this.head) this.head.prev = node;
      this.head = node;
      if (!this.tail) this.tail = node;
    } else if (index === this.length) {
      // Append to end
      if (this.tail) {
        this.tail.next = node;
        node.prev = this.tail;
        this.tail = node;
      } else {
        this.head = node;
        this.tail = node;
      }
    } else {
      // Insert in middle
      const nextNode = this.get(index);
      const prevNode = nextNode?.prev;

      if (prevNode) {
        prevNode.next = node;
        node.prev = prevNode;
      }

      if (nextNode) {
        nextNode.prev = node;
        node.next = nextNode;
      }
    }

    this.length += 1;
    
    // We need to establish the links for the inserted node's internal state
    // (e.g., stats based on prev)
    node.getPrevs();
  }
}

export { RouteNode };
export type { CurrentJobPoints };
