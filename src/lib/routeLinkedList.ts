import { Jobs } from "../database/job";
import { Stats } from "../database/jobPointMap";

// https://www.zerocho.com/category/Algorithm/post/58008a628475ed00152d6c4d
// https://dev.to/miku86/javascript-data-structures-singly-linked-list-remove-fai
export default class RouteLinkedList {
  length: number = 0;
  head: RouteNode | null = null;
  tail: RouteNode | null = null;

  add(job: Jobs) {
    const routeNode = new RouteNode(job);
    if (!this.tail) {
      this.head = routeNode;
      this.tail = routeNode;
      this.length += 1;
    } else {
      this.tail.next = routeNode;
      this.length += 1;
    }
    return routeNode;
  }

  insertAt(routeNode: RouteNode, position: number) {}

  shift() {
    if (!this.head) return -1;

    let current = this.head;
    if (current.next) {
      this.head = current.next;
    } else {
      this.head = null;
    }
    this.length -= 1;
    return current;
  }

  pop() {
    if (!this.tail) {
      return -1;
    } else {
      let current = this.head;
      let preTail = this.head;
      while (current?.next) {
        preTail = current;
        current = current.next;
      }
      this.tail = preTail;
      (this.tail as RouteNode).next = null;
      this.length -= 1;
      if (!this.length) {
        this.head = null;
        this.tail = null;
      }
      return current;
    }
  }

  get(index: number) {
    if (index < 0 || index >= this.length) return -1;

    let current = this.head;
    let count = 0;
    while (count < index) {
      current = (current as RouteNode).next; // this.length를 통해서 routenode가 존재함을 알기 때문에 가능
      count += 1;
    }
    return current;
  }

  // index가 tail일때
  removeAt(index: number) {
    if (index < 0 && index >= this.length) return -1;
    if (index === 0) return this.shift();
    if (index === this.length - 1) return this.pop();

    const preNodeToRemove = this.get(index - 1);
    const nodeToRemove = this.get(index);

    (preNodeToRemove as RouteNode).next = (nodeToRemove as RouteNode).next;
    this.length -= 1;
    return nodeToRemove;
  }
}

class RouteNode {
  constructor(job: Jobs) {
    this.job = job;
  }
  job: Jobs;
  next: this | null = null;
}
