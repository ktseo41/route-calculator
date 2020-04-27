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
    if (!this.tail) return -1;
  }

  search(position: number) {
    if (position < 0 || position >= this.length) return -1;

    let current = this.head;
    let count: number = 0;
    while (count < position && current) {
      current = current.next;
      count += 1;
    }
    return current;
  }

  removeAt(position: number) {
    if (position < 0 && position >= this.length) return -1;

    let current = this.head;
    let before;
    let remove: RouteNode | null;
    let count = 0;
    if (position === 0) {
      remove = this.head;
      this.head = this.head?.next;
      this.length -= 1;
    }
  }
}

class RouteNode {
  constructor(job: Jobs) {
    this.job = job;
  }
  job: Jobs;
  next: this | null = null;
}
