import { Jobs } from "../database/job";
import jobPointMap, {
  Stats,
  Stat,
  Intervals,
  EachJobPointMap,
  StatMap,
} from "../database/jobPointMap";

// https://www.zerocho.com/category/Algorithm/post/58008a628475ed00152d6c4d
// https://dev.to/miku86/javascript-data-structures-singly-linked-list-remove-fai
type CurrentJobPoints = {
  [job in Jobs]?: number;
};
export default class RouteLinkedList {
  constructor() {
    this.add(Jobs.무직);
  }
  length: number = 0;
  head: RouteNode | null = null;
  tail: RouteNode | null = null;

  // = push
  add(job: Jobs) {
    const routeNode = new RouteNode(job);
    if (!this.tail) {
      this.head = routeNode;
      this.tail = routeNode;
      this.length += 1;
    } else {
      routeNode.prevStats = { ...this.tail.Stats };
      this.tail.next = routeNode;
      this.tail = routeNode;
      this.tail.next = null;
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

  get(index: number): RouteNode {
    if (index < 0 || index >= this.length)
      throw new Error("해당 노드가 없습니다");

    let current = this.head;
    let count = 0;
    while (count < index) {
      current = (current as RouteNode).next; // this.length를 통해서 routenode가 존재함을 알기 때문에 가능
      count += 1;
    }
    return current as RouteNode;
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

/**
 * class RouteNode
 *
 *member
 * job
 * jobPo
 * prevStats
 * currentJobPos
 * intervals를 추가했다. 자주 사용하길래
 * adjustJobPos()
 */
class RouteNode {
  /**
   * 생성자
   * 1. 인자로 job과 이전 스탯을 받는다.
   *    초기화는 RouteLinkedList에서 할 것이므로
   *    RouteNode가 job이나 이전스탯을 안받는 상황은 생각하지 않는다.
   * @param job
   * @param prevStats
   */
  constructor(
    job: Jobs,
    jobPo?: number,
    prevStats?: Stats,
    currentJobPos?: CurrentJobPoints
  ) {
    this.job = job;
    this.jobPo = jobPo || 0;
    this.prevStats = prevStats || { STR: 5, AGI: 5, INT: 5, VIT: 5 };
    this.currentJobPos = currentJobPos || { [this.job]: 0 };
    this.jobPointMap = { ...jobPointMap[this.job] };
    this.Stats = { ...this.prevStats };
  }
  job: Jobs;
  jobPo: number;
  prevStats: Stats;
  Stats: Stats;
  currentJobPos: CurrentJobPoints;
  jobPointMap: EachJobPointMap;
  next: this | null = null;

  adjustJobPoint(jobPoDelta: number) {
    let actualChange: number;
    if (jobPoDelta > 0) {
      actualChange =
        this.jobPo + jobPoDelta > 100 ? 100 - this.jobPo : jobPoDelta;
    } else {
      actualChange = this.jobPo + jobPoDelta < 0 ? this.jobPo - 0 : jobPoDelta;
    }
    console.log(`jobPoDelta : ${jobPoDelta}`, `actualChange: ${actualChange}`);
    this.shouldChangeStats(actualChange) && this.changeStats(actualChange);
    this.jobPo += actualChange;
  }

  shouldChangeStats(actualChange: number) {
    return Object.keys(this.jobPointMap).some((interval) => {
      return (
        Math.trunc((this.jobPo + actualChange) / +interval) -
          Math.trunc(this.jobPo / +interval) >=
        1
      );
    });
  }

  changeStats(actualChange: number) {
    console.log("stat should be changed!");
    for (const interval in this.jobPointMap) {
      if (this.jobPointMap.hasOwnProperty(interval)) {
        const quotient =
          Math.trunc((this.jobPo + actualChange) / +interval) -
          Math.trunc(this.jobPo / +interval);
        if (quotient === 0) return;
        Object.entries(
          this.jobPointMap[interval as Intervals] as StatMap
        ).forEach(([stat, deltaInfo]) => {
          const [delta, limit] = deltaInfo;

          this.applyStatDelta(quotient, stat as Stat, delta, limit);
        });
      }
    }
  }

  applyStatDelta(quotient: number, stat: Stat, delta: number, limit: number) {
    const expectStat = this.prevStats[stat] + delta * quotient;

    if ((quotient > 0 && delta > 0) || (quotient < 0 && delta < 0)) {
      this.Stats[stat] = expectStat > limit ? limit : expectStat;
    }

    if (
      ((quotient > 0 && delta < 0) || (quotient < 0 && delta > 0)) &&
      this.prevStats[stat] > 10
    ) {
      this.Stats[stat] = expectStat < limit ? limit : expectStat;
    }
    console.log(`stat changed!`, this.Stats);
  }
}
