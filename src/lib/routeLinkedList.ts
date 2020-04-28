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

    nextNodeToRemove.getPrevs();

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
   */
  constructor(job: Jobs) {
    this.job = job;
    this.jobPointMap = jobPointMap[this.job] as EachJobPointMap;
  }
  job: Jobs;
  jobPo: number = 0;
  Stats: Stats = { STR: 5, AGI: 5, INT: 5, VIT: 5 };
  currentJobPos: CurrentJobPoints = { [Jobs.무직]: 0 };
  jobPointMap: EachJobPointMap;
  prev: this | null = null;
  next: this | null = null;

  getActualChange(jobPoDelta: number): number {
    if (jobPoDelta > 0) {
      return this.jobPo + jobPoDelta > 100 ? 100 - this.jobPo : jobPoDelta;
    } else {
      return this.jobPo + jobPoDelta < 0 ? this.jobPo - 0 : jobPoDelta;
    }
  }

  adjustJobPoint(jobPoDelta: number) {
    const actualChange = this.getActualChange(jobPoDelta);
    console.log(`jobPoDelta : ${jobPoDelta}`, `actualChange: ${actualChange}`);
    this.shouldChangeStats(actualChange) && this.changeStats(actualChange);
    this.jobPo += actualChange;
    this.currentJobPos[this.job] = this.jobPo;
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
    const expectStat = this.Stats[stat] + delta * quotient;

    if ((quotient > 0 && delta > 0) || (quotient < 0 && delta < 0)) {
      this.Stats[stat] = expectStat > limit ? limit : expectStat;
    }

    if (
      ((quotient > 0 && delta < 0) || (quotient < 0 && delta > 0)) &&
      this.Stats[stat] > 10
    ) {
      this.Stats[stat] = expectStat < limit ? limit : expectStat;
    }
    console.log(`stat changed!`, JSON.stringify(this.Stats));
  }

  getPrevs(): void {
    if (this.prev) {
      console.log("my job", this.job, "getPrev prev is ", this.prev);
      this.Stats = { ...this.prev.Stats };
      this.currentJobPos = { ...this.prev.currentJobPos };
      if (this.currentJobPos[this.job] === undefined)
        this.currentJobPos[this.job] = 0;
      // jobPo는 현재 node의 jobPo 변경양을 뜻하기 때문에
      // 바로 반영하지 않도록 했다.
    }
  }

  recalculateJobPo(): number {
    return this.currentJobPos[this.job]
      ? this.jobPo - (this.currentJobPos[this.job] as number)
      : this.jobPo;
  }

  recalculate() {
    // 잡포는 변경이 안됐는데 이전 스탯이 변경될 수도 있는 상황
    // 그러므로 이전 노드 스탯과 잡포를 바탕으로 현재 잡포와 스탯을 변경해야 한다.
    // 조건 : this.getPrev()가 실행된 뒤 실행돼야한다.

    // 이전에 직업을 가지지 않았을 수도 있어서
    const newJobPo = this.recalculateJobPo();
    this.jobPo = 0; // 초기화한 후
    this.currentJobPos[this.job] = this.jobPo;
    this.adjustJobPoint(newJobPo);
  }
}
