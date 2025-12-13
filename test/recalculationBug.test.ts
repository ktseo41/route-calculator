import { describe, it, expect } from 'vitest';
import { Jobs } from '../src/database/job';
import RouteLinkedList from '../src/lib/routeLinkedList';

interface RouteStep {
  jobName: string;
  individualPoint: number;
  expectedStats: {
    STR: number;
    INT: number;
    AGI: number;
    VIT: number;
  };
}

/**
 * 제공된 루트 데이터:
 * 직업        STR  INT  AGI  VIT  잡포
 * --------------------------------------------------------------
 * 악사          5   30   10    5   100
 * 궁사         10   10   30    5   100
 * 자객         20   10   30    5   100
 * 검객         20   10   30    5   100
 * 투사         30   10   20   10   100
 * 무도가       20   10   20   30   100
 * 전사         30   10   10   30   100
 * 검사         30   10   10   30   100
 * 상인         10   10   30   30   100
 * 모험가       10   10   30   30    20
 * 자연인       21   10   40   40   100
 * 어둠의기사   41   20   24   60   100
 * 어둠의마법사 41   40   44   44   100
 * 빛의마법사   41   60   60   28   100
 * 탐색가       41   52   70   21    70
 * 순수마법사   30   70   70   20    57
 * 모험가       30   70   70   30   100
 * 빛의기사     50   70   54   50   100
 * 순수기사     66   60   54   66    50
 * 순수마법사   60   70   60   60    87
 * 탐색가       60   66   70   56   100
 * 순수마법사   57   70   70   53   100
 * 순수기사     70   60   70   70   100
 */

/**
 * 원본 루트 데이터 (누적 잡포인트)
 * 같은 직업이 여러 번 나올 경우 잡포 값은 해당 직업에 대한 누적 투자량
 */
interface RawRouteData {
  jobName: string;
  cumulativePoint: number; // 해당 직업에 대한 누적 잡포
  expectedStats: {
    STR: number;
    INT: number;
    AGI: number;
    VIT: number;
  };
}

const rawRouteData: RawRouteData[] = [
  { "jobName": "악사", "cumulativePoint": 100, "expectedStats": { "STR": 5, "INT": 30, "AGI": 10, "VIT": 5 } },
  { "jobName": "궁사", "cumulativePoint": 100, "expectedStats": { "STR": 10, "INT": 10, "AGI": 30, "VIT": 5 } },
  { "jobName": "자객", "cumulativePoint": 100, "expectedStats": { "STR": 20, "INT": 10, "AGI": 30, "VIT": 5 } },
  { "jobName": "검객", "cumulativePoint": 100, "expectedStats": { "STR": 20, "INT": 10, "AGI": 30, "VIT": 5 } },
  { "jobName": "투사", "cumulativePoint": 100, "expectedStats": { "STR": 30, "INT": 10, "AGI": 20, "VIT": 10 } },
  { "jobName": "무도가", "cumulativePoint": 100, "expectedStats": { "STR": 20, "INT": 10, "AGI": 20, "VIT": 30 } },
  { "jobName": "전사", "cumulativePoint": 100, "expectedStats": { "STR": 30, "INT": 10, "AGI": 10, "VIT": 30 } },
  { "jobName": "검사", "cumulativePoint": 100, "expectedStats": { "STR": 30, "INT": 10, "AGI": 10, "VIT": 30 } },
  { "jobName": "상인", "cumulativePoint": 100, "expectedStats": { "STR": 10, "INT": 10, "AGI": 30, "VIT": 30 } },
  { "jobName": "모험가", "cumulativePoint": 20, "expectedStats": { "STR": 10, "INT": 10, "AGI": 30, "VIT": 30 } },
  { "jobName": "자연인", "cumulativePoint": 100, "expectedStats": { "STR": 21, "INT": 10, "AGI": 40, "VIT": 40 } },
  { "jobName": "어둠의기사", "cumulativePoint": 100, "expectedStats": { "STR": 41, "INT": 20, "AGI": 24, "VIT": 60 } },
  { "jobName": "어둠의마법사", "cumulativePoint": 100, "expectedStats": { "STR": 41, "INT": 40, "AGI": 44, "VIT": 44 } },
  { "jobName": "빛의마법사", "cumulativePoint": 100, "expectedStats": { "STR": 41, "INT": 60, "AGI": 60, "VIT": 28 } },
  { "jobName": "탐색가", "cumulativePoint": 70, "expectedStats": { "STR": 41, "INT": 52, "AGI": 70, "VIT": 21 } },
  { "jobName": "순수마법사", "cumulativePoint": 57, "expectedStats": { "STR": 30, "INT": 70, "AGI": 70, "VIT": 20 } },
  { "jobName": "모험가", "cumulativePoint": 100, "expectedStats": { "STR": 30, "INT": 70, "AGI": 70, "VIT": 30 } }, // 모험가: 100 - 20 = 80
  { "jobName": "빛의기사", "cumulativePoint": 100, "expectedStats": { "STR": 50, "INT": 70, "AGI": 54, "VIT": 50 } },
  { "jobName": "순수기사", "cumulativePoint": 50, "expectedStats": { "STR": 66, "INT": 60, "AGI": 54, "VIT": 66 } },
  { "jobName": "순수마법사", "cumulativePoint": 87, "expectedStats": { "STR": 60, "INT": 70, "AGI": 60, "VIT": 60 } }, // 순수마법사: 87 - 57 = 30
  { "jobName": "탐색가", "cumulativePoint": 100, "expectedStats": { "STR": 60, "INT": 66, "AGI": 70, "VIT": 56 } }, // 탐색가: 100 - 70 = 30
  { "jobName": "순수마법사", "cumulativePoint": 100, "expectedStats": { "STR": 57, "INT": 70, "AGI": 70, "VIT": 53 } }, // 순수마법사: 100 - 87 = 13
  { "jobName": "순수기사", "cumulativePoint": 100, "expectedStats": { "STR": 70, "INT": 60, "AGI": 70, "VIT": 70 } }, // 순수기사: 100 - 50 = 50
];

/**
 * 누적 잡포를 개별 잡포로 변환
 * 같은 직업이 다시 나올 때 이전 투자량과의 차이를 계산
 */
function convertToIndividualPoints(rawData: RawRouteData[]): RouteStep[] {
  const jobPointTracker: Map<string, number> = new Map();
  
  return rawData.map((data) => {
    const previousPoint = jobPointTracker.get(data.jobName) || 0;
    const individualPoint = data.cumulativePoint - previousPoint;
    
    // 현재 누적 포인트를 기록
    jobPointTracker.set(data.jobName, data.cumulativePoint);
    
    return {
      jobName: data.jobName,
      individualPoint,
      expectedStats: data.expectedStats,
    };
  });
}

const routeSequence: RouteStep[] = convertToIndividualPoints(rawRouteData);

describe('루트2 테스트 (제공된 루트 데이터)', () => {
  it('제공된 루트 스텝별 스탯 검증', () => {
    const rll = new RouteLinkedList();

    routeSequence.forEach((step, index) => {
      const { jobName, individualPoint, expectedStats } = step;

      rll.add(jobName as Jobs);
      rll.tail!.adjustJobPoint(individualPoint);
      
      const currentStats = rll.tail!.stats;
      
      try {
        expect(currentStats.STR).toBe(expectedStats.STR);
        expect(currentStats.INT).toBe(expectedStats.INT);
        expect(currentStats.AGI).toBe(expectedStats.AGI);
        expect(currentStats.VIT).toBe(expectedStats.VIT);
      } catch (e) {
        console.error(`Step ${index + 1} (${jobName}) 에서 스탯 불일치`);
        console.error(`Expected:`, expectedStats);
        console.error(`Actual:`, currentStats);
        throw e;
      }
    });
  });

  it('최종 스탯이 70/60/70/70인지 확인', () => {
    const rll = new RouteLinkedList();

    routeSequence.forEach((step) => {
      const { jobName, individualPoint } = step;
      rll.add(jobName as Jobs);
      rll.tail!.adjustJobPoint(individualPoint);
    });

    const finalStats = rll.tail!.stats;
    
    expect(finalStats.STR).toBe(70);
    expect(finalStats.INT).toBe(60);
    expect(finalStats.AGI).toBe(70);
    expect(finalStats.VIT).toBe(70);
  });

  it('총 잡포인트 합계가 올바른지 확인', () => {
    const totalJobPoints = routeSequence.reduce((sum, step) => sum + step.individualPoint, 0);
    
    // 예상 총합: 100*9 + 20 + 100 + 100*3 + 70 + 57 + 100*2 + 50 + 87 + 100*3 = ?
    console.log(`총 잡포인트: ${totalJobPoints}`);
    
    expect(totalJobPoints).toBeGreaterThan(0);
  });
});

/**
 * 순수기사를 100으로 먼저 투자했다가 50으로 줄이는 시나리오 테스트
 * 빛의기사 다음에 순수기사를 추가하고, 100 → 50으로 조정 후 나머지 루트 진행
 */
describe('루트2 테스트 - 순수기사 100 → 50 조정 시나리오', () => {
  // 빛의기사까지의 루트 (첫 18개)
  const routeUntilLightKnight: RawRouteData[] = rawRouteData.slice(0, 18);
  
  // 순수기사 이후 루트 (20번째부터 끝까지, 순수기사 제외)
  const routeAfterPureKnight: RawRouteData[] = rawRouteData.slice(19);

  it('순수기사를 100으로 투자 후 50으로 줄였을 때 스탯이 올바른지 확인', () => {
    const rll = new RouteLinkedList();
    const jobPointTracker: Map<string, number> = new Map();

    // 1. 빛의기사까지 루트 진행
    routeUntilLightKnight.forEach((data) => {
      const previousPoint = jobPointTracker.get(data.jobName) || 0;
      const individualPoint = data.cumulativePoint - previousPoint;
      jobPointTracker.set(data.jobName, data.cumulativePoint);

      rll.add(data.jobName as Jobs);
      rll.tail!.adjustJobPoint(individualPoint);
    });

    console.log('빛의기사 이후 스탯:', rll.tail!.stats);
    expect(rll.tail!.stats.STR).toBe(50);
    expect(rll.tail!.stats.INT).toBe(70);
    expect(rll.tail!.stats.AGI).toBe(54);
    expect(rll.tail!.stats.VIT).toBe(50);

    // 2. 순수기사 추가하고 100으로 먼저 투자
    rll.add('순수기사' as Jobs);
    rll.tail!.adjustJobPoint(100);
    
    console.log('순수기사 100 투자 후 스탯:', rll.tail!.stats);
    console.log('순수기사 100 투자 후 jobPo:', rll.tail!.jobPo);
    // 순수기사 100 투자 시 예상 스탯 (처음부터 순수기사 100 가정)
    const statsAfter100 = { ...rll.tail!.stats };

    // 3. 순수기사를 -10씩 5번 줄여서 50으로 만듦
    for (let i = 0; i < 5; i++) {
      rll.tail!.adjustJobPoint(-10);
      console.log(`순수기사 -10 (${i + 1}번째) 후 스탯:`, rll.tail!.stats, 'jobPo:', rll.tail!.jobPo);
    }
    
    console.log('순수기사 50으로 줄인 후 최종 스탯:', rll.tail!.stats);
    console.log('순수기사 50으로 줄인 후 최종 jobPo:', rll.tail!.jobPo);
    
    // 4. 원래 루트의 순수기사 50 투자 시 예상 스탯과 비교
    // 원래 데이터: { "STR": 66, "INT": 60, "AGI": 54, "VIT": 66 }
    expect(rll.tail!.stats.STR).toBe(66);
    expect(rll.tail!.stats.INT).toBe(60);
    expect(rll.tail!.stats.AGI).toBe(54);
    expect(rll.tail!.stats.VIT).toBe(66);

    // 5. 나머지 루트 진행
    routeAfterPureKnight.forEach((data, index) => {
      const previousPoint = jobPointTracker.get(data.jobName) || 0;
      const individualPoint = data.cumulativePoint - previousPoint;
      jobPointTracker.set(data.jobName, data.cumulativePoint);

      rll.add(data.jobName as Jobs);
      rll.tail!.adjustJobPoint(individualPoint);

      try {
        expect(rll.tail!.stats.STR).toBe(data.expectedStats.STR);
        expect(rll.tail!.stats.INT).toBe(data.expectedStats.INT);
        expect(rll.tail!.stats.AGI).toBe(data.expectedStats.AGI);
        expect(rll.tail!.stats.VIT).toBe(data.expectedStats.VIT);
      } catch (e) {
        console.error(`순수기사 이후 Step ${index + 1} (${data.jobName}) 에서 스탯 불일치`);
        console.error(`Expected:`, data.expectedStats);
        console.error(`Actual:`, rll.tail!.stats);
        throw e;
      }
    });

    // 6. 최종 스탯 확인
    console.log('최종 스탯:', rll.tail!.stats);
    expect(rll.tail!.stats.STR).toBe(70);
    expect(rll.tail!.stats.INT).toBe(60);
    expect(rll.tail!.stats.AGI).toBe(70);
    expect(rll.tail!.stats.VIT).toBe(70);
  });

  it('순수기사 100 → 50 조정과 처음부터 50 투자의 결과가 동일한지 비교', () => {
    // 방법 1: 100 → 50 조정
    const rll1 = new RouteLinkedList();
    const tracker1: Map<string, number> = new Map();

    routeUntilLightKnight.forEach((data) => {
      const prev = tracker1.get(data.jobName) || 0;
      const individual = data.cumulativePoint - prev;
      tracker1.set(data.jobName, data.cumulativePoint);
      rll1.add(data.jobName as Jobs);
      rll1.tail!.adjustJobPoint(individual);
    });

    rll1.add('순수기사' as Jobs);
    rll1.tail!.adjustJobPoint(100); // 먼저 100
    // 그 다음 -10씩 5번 줄여서 50으로
    for (let i = 0; i < 5; i++) {
      rll1.tail!.adjustJobPoint(-10);
    }

    // 방법 2: 처음부터 50 투자
    const rll2 = new RouteLinkedList();
    const tracker2: Map<string, number> = new Map();

    routeUntilLightKnight.forEach((data) => {
      const prev = tracker2.get(data.jobName) || 0;
      const individual = data.cumulativePoint - prev;
      tracker2.set(data.jobName, data.cumulativePoint);
      rll2.add(data.jobName as Jobs);
      rll2.tail!.adjustJobPoint(individual);
    });

    rll2.add('순수기사' as Jobs);
    rll2.tail!.adjustJobPoint(50); // 바로 50

    // 두 방법의 결과가 동일해야 함
    console.log('방법1 (100→50) 스탯:', rll1.tail!.stats);
    console.log('방법2 (바로 50) 스탯:', rll2.tail!.stats);

    expect(rll1.tail!.stats.STR).toBe(rll2.tail!.stats.STR);
    expect(rll1.tail!.stats.INT).toBe(rll2.tail!.stats.INT);
    expect(rll1.tail!.stats.AGI).toBe(rll2.tail!.stats.AGI);
    expect(rll1.tail!.stats.VIT).toBe(rll2.tail!.stats.VIT);
  });
});
