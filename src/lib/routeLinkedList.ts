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
}

export class RouteNode {
  constructor(job: Jobs) {
    this.job = job;
    this.jobPointMap = jobPointMap[this.job] as EachJobPointMap;
  }
  job: Jobs;
  jobPo: number = 0;
  stats: Stats = { STR: 5, INT: 5, AGI: 5, VIT: 5 };
  fisrtStats: Stats | undefined;
  currentJobPos: CurrentJobPoints = { [Jobs.무직]: 0 };
  prev: this | null = null;
  next: this | null = null;
  private jobPointMap: EachJobPointMap;

  public adjustJobPoint(jobPoDelta: number, isRecalculating?: boolean): void {
    let actualChange;
    if (isRecalculating) {
      this.jobPo = 0;
      actualChange = jobPoDelta;
    } else {
      actualChange = this.getActualChange(jobPoDelta);
    }

    this.shouldChangeStats(actualChange, isRecalculating) &&
      this.changeStats(actualChange, isRecalculating);
    this.jobPo += actualChange;
    (this.currentJobPos[this.job] as number) += actualChange;

    if (this.next) this.next.recalculate();
  }

  private getActualChange(jobPoDelta: number): number {
    if (jobPoDelta > 0) {
      if (
        (this.jobPo + (this.prev?.currentJobPos[this.job] as number) || 0) ===
        100
      ) {
        return 0;
      }

      return this.jobPo +
        jobPoDelta +
        ((this.prev?.currentJobPos[this.job] as number) || 0) >
        100
        ? 100 - this.jobPo - (this.prev?.currentJobPos[this.job] || 0)
        : jobPoDelta;
    } else {
      return this.jobPo + jobPoDelta < 0 ? -this.jobPo : jobPoDelta;
    }
  }

  private shouldChangeStats(actualChange: number, isRecalculating?: boolean) {
    const currentJobpo = isRecalculating
      ? 0
      : this.currentJobPos[this.job] || 0;

    return Object.keys(this.jobPointMap).some((interval) => {
      return (
        Math.abs(
          Math.trunc((currentJobpo + actualChange) / +interval) -
            Math.trunc(currentJobpo / +interval)
        ) >= 1
      );
    });
  }

  private changeStats(actualChange: number, isRecalculating?: boolean) {
    const currentJobpo = isRecalculating
      ? 0
      : this.currentJobPos[this.job] || 0;

    for (const interval in this.jobPointMap) {
      if (this.jobPointMap.hasOwnProperty(interval)) {
        const quotient =
          Math.trunc((currentJobpo + actualChange) / +interval) -
          Math.trunc(currentJobpo / +interval);
        if (quotient === 0) continue;
        Object.entries(
          this.jobPointMap[interval as Intervals] as StatMap
        ).forEach(([stat, deltaInfo]) => {
          const [delta, limit] = deltaInfo;
          this.applyStatDelta(quotient, stat as Stat, delta, limit);
        });
      }
    }
  }

  private applyStatDelta(
    quotient: number,
    stat: Stat,
    delta: number,
    limit: number
  ) {
    if ((quotient > 0 && delta > 0) || (quotient < 0 && delta < 0)) {
      this.increaseStats(quotient, stat, delta, limit);
    }

    if ((quotient > 0 && delta < 0) || (quotient < 0 && delta > 0)) {
      this.decreaseStats(quotient, stat, delta, limit);
    }
  }

  increaseStats(quotient: number, stat: Stat, delta: number, limit: number) {
    const prevStats = this.getPrevStats();
    const expectStat = this.stats[stat] + delta * quotient;
    if (delta > 0) {
      if (this.stats[stat] > limit) return;
      this.stats[stat] = expectStat > limit ? limit : expectStat;
    } else {
      if (prevStats[stat] >= expectStat) {
        this.stats[stat] = expectStat;
      } else {
        this.stats[stat] = prevStats[stat];
      }
    }
  }

  decreaseStats(quotient: number, stat: Stat, delta: number, limit: number) {
    const prevStats = this.getPrevStats();
    const expectStat = this.stats[stat] + delta * quotient;
    if (delta > 0) {
      this.stats[stat] =
        expectStat <= prevStats[stat] ? prevStats[stat] : expectStat;
    } else {
      /*
      잡포인트를 증가시켜서 스탯이 감소하는 경우
      1. 이전 스탯이 10 이하인 경우 --> 변경할 필요 없음
      2. 이전 스탯이 limit 이하인 경우 --> 변경할 필요 없음
      3. 이전 스탯이 limit 초과인 경우
        1. 기대 스탯이 limit 미만인 경우
        2. 기대 스탯이 limit 이상인 경우
      */
      if (prevStats[stat] > limit) {
        this.stats[stat] = expectStat < limit ? limit : expectStat;
      }
    }
  }

  getPrevStats(): Stats {
    // !this.prev 조건을 사실 검사해주지 않아도 되기 때문에 코드 개선이 필요할 것 같다.
    if (!this.prev) return { STR: 5, INT: 5, AGI: 5, VIT: 5 };
    if (this.prev.job === Jobs.네크로멘서)
      return { ...this.prev.stats, INT: 5 };

    return { ...this.prev.stats };
  }

  public getPrevs(): void {
    this.stats = this.getPrevStats();
    this.currentJobPos = this.prev
      ? {
          ...this.prev.currentJobPos,
        }
      : { [Jobs.무직]: 0 };
    if (this.currentJobPos[this.job] === undefined)
      this.currentJobPos[this.job] = 0;
  }

  recalculateJobPo(): number {
    if ((this.prev?.currentJobPos[this.job] || 0) + this.jobPo > 100) {
      return 100 - (this.prev?.currentJobPos[this.job] || 0);
    }

    return this.jobPo;
  }

  public recalculate(): void {
    const isRecalculating = true;
    this.getPrevs();
    const newJobPo = this.recalculateJobPo();
    this.adjustJobPoint(newJobPo, isRecalculating);
    if (this.next) this.next.recalculate();
  }
}
