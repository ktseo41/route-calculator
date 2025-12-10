import { Jobs } from "../database/job";
import jobPointMap, {
  Stats,
  Stat,
  Intervals,
  EachJobPointMap,
  StatMap,
} from "../database/jobPointMap";
import { v4 as uuidv4 } from "uuid";

export type CurrentJobPoints = {
  [job in Jobs]?: number;
};

export class RouteNode {
  constructor(job: Jobs) {
    this.id = uuidv4();
    this.job = job;
    this.jobPointMap = jobPointMap[this.job] as EachJobPointMap;
  }
  id: string;
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
      this.stats = this.getPrevStats();
      this.currentJobPos[this.job] = this.prev?.currentJobPos[this.job] || 0;
      actualChange = jobPoDelta;
    } else {
      actualChange = this.getActualChange(jobPoDelta);
      // 감소 시: 전체 재계산 방식 사용 (limit 처리로 인한 비대칭성 해결)
      if (actualChange < 0) {
        const newJobPo = this.jobPo + actualChange;
        this.resetAndRecalculateStats(newJobPo);
        if (this.next) this.next.recalculate();
        return;
      }
    }

    this.shouldChangeStats(actualChange, isRecalculating) &&
      this.changeStats(actualChange, isRecalculating);
    this.jobPo += actualChange;
    (this.currentJobPos[this.job] as number) += actualChange;

    if (this.next) this.next.recalculate();
  }

  /**
   * 잡포인트 감소 시 스탯을 리셋하고 처음부터 다시 계산
   * limit 처리로 인한 증가/감소 비대칭성 문제 해결
   */
  private resetAndRecalculateStats(targetJobPo: number): void {
    // 1. 스탯과 currentJobPos 리셋
    this.stats = this.getPrevStats();
    const prevJobPo = this.prev?.currentJobPos[this.job] || 0;
    this.currentJobPos[this.job] = prevJobPo;
    this.jobPo = 0;

    // 2. 0에서 targetJobPo까지 증가 로직 적용 (isRecalculating=true로 호출)
    if (targetJobPo > 0) {
      this.changeStats(targetJobPo, true);
    }
    this.jobPo = targetJobPo;
    (this.currentJobPos[this.job] as number) = prevJobPo + targetJobPo;
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
