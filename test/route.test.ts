
import { describe, it, expect } from 'vitest';
import { Jobs } from '../src/database/job';
import RouteLinkedList from '../src/lib/routeLinkedList';
import { getCustomQueryFromRLL } from '../src/lib/routeUtils';

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

const routeSequence: RouteStep[] = [
  {
    "jobName": "모험가",
    "individualPoint": 100,
    "expectedStats": {
      "STR": 10,
      "INT": 10,
      "AGI": 10,
      "VIT": 30
    }
  },
  {
    "jobName": "자연인",
    "individualPoint": 11,
    "expectedStats": {
      "STR": 11,
      "INT": 10,
      "AGI": 11,
      "VIT": 33
    }
  },
  {
    "jobName": "궁사",
    "individualPoint": 100,
    "expectedStats": {
      "STR": 11,
      "INT": 10,
      "AGI": 30,
      "VIT": 21
    }
  },
  {
    "jobName": "투사",
    "individualPoint": 100,
    "expectedStats": {
      "STR": 30,
      "INT": 10,
      "AGI": 20,
      "VIT": 21
    }
  },
  {
    "jobName": "상인",
    "individualPoint": 100,
    "expectedStats": {
      "STR": 10,
      "INT": 10,
      "AGI": 30,
      "VIT": 21
    }
  },
  {
    "jobName": "자객",
    "individualPoint": 100,
    "expectedStats": {
      "STR": 20,
      "INT": 10,
      "AGI": 30,
      "VIT": 21
    }
  },
  {
    "jobName": "전사",
    "individualPoint": 100,
    "expectedStats": {
      "STR": 30,
      "INT": 10,
      "AGI": 19,
      "VIT": 21
    }
  },
  {
    "jobName": "검객",
    "individualPoint": 100,
    "expectedStats": {
      "STR": 30,
      "INT": 10,
      "AGI": 30,
      "VIT": 21
    }
  },
  {
    "jobName": "무도가",
    "individualPoint": 100,
    "expectedStats": {
      "STR": 20,
      "INT": 10,
      "AGI": 30,
      "VIT": 30
    }
  },
  {
    "jobName": "악사",
    "individualPoint": 100,
    "expectedStats": {
      "STR": 10,
      "INT": 30,
      "AGI": 30,
      "VIT": 10
    }
  },
  {
    "jobName": "검사",
    "individualPoint": 100,
    "expectedStats": {
      "STR": 30,
      "INT": 30,
      "AGI": 18,
      "VIT": 10
    }
  },
  {
    "jobName": "탐색가",
    "individualPoint": 69,
    "expectedStats": {
      "STR": 30,
      "INT": 22,
      "AGI": 41,
      "VIT": 10
    }
  },
  {
    "jobName": "음유시인",
    "individualPoint": 100,
    "expectedStats": {
      "STR": 30,
      "INT": 20,
      "AGI": 50,
      "VIT": 35
    }
  },
  {
    "jobName": "정령술사",
    "individualPoint": 100,
    "expectedStats": {
      "STR": 30,
      "INT": 20,
      "AGI": 50,
      "VIT": 50
    }
  },
  {
    "jobName": "자연인",
    "individualPoint": 39,
    "expectedStats": {
      "STR": 30,
      "INT": 20,
      "AGI": 50,
      "VIT": 50
    }
  },
  {
    "jobName": "빛의마법사",
    "individualPoint": 100,
    "expectedStats": {
      "STR": 40,
      "INT": 40,
      "AGI": 60,
      "VIT": 34
    }
  },
  {
    "jobName": "자연인",
    "individualPoint": 50,
    "expectedStats": {
      "STR": 40,
      "INT": 30,
      "AGI": 60,
      "VIT": 40
    }
  },
  {
    "jobName": "어둠의기사",
    "individualPoint": 100,
    "expectedStats": {
      "STR": 60,
      "INT": 40,
      "AGI": 44,
      "VIT": 60
    }
  },
  {
    "jobName": "어둠의마법사",
    "individualPoint": 100,
    "expectedStats": {
      "STR": 60,
      "INT": 60,
      "AGI": 60,
      "VIT": 44
    }
  },
  {
    "jobName": "빛의기사",
    "individualPoint": 99,
    "expectedStats": {
      "STR": 60,
      "INT": 60,
      "AGI": 44,
      "VIT": 60
    }
  },
  {
    "jobName": "순수마법사",
    "individualPoint": 30,
    "expectedStats": {
      "STR": 54,
      "INT": 70,
      "AGI": 51,
      "VIT": 54
    }
  },
  {
    "jobName": "빛의기사",
    "individualPoint": 1,
    "expectedStats": {
      "STR": 55,
      "INT": 70,
      "AGI": 51,
      "VIT": 55
    }
  },
  {
    "jobName": "순수기사",
    "individualPoint": 45,
    "expectedStats": {
      "STR": 70,
      "INT": 61,
      "AGI": 51,
      "VIT": 70
    }
  },
  {
    "jobName": "순수마법사",
    "individualPoint": 27,
    "expectedStats": {
      "STR": 65,
      "INT": 70,
      "AGI": 58,
      "VIT": 65
    }
  },
  {
    "jobName": "순수기사",
    "individualPoint": 10,
    "expectedStats": {
      "STR": 68,
      "INT": 68,
      "AGI": 58,
      "VIT": 68
    }
  },
  {
    "jobName": "순수마법사",
    "individualPoint": 7,
    "expectedStats": {
      "STR": 67,
      "INT": 70,
      "AGI": 60,
      "VIT": 67
    }
  },
  {
    "jobName": "탐색가",
    "individualPoint": 31,
    "expectedStats": {
      "STR": 67,
      "INT": 66,
      "AGI": 70,
      "VIT": 63
    }
  },
  {
    "jobName": "순수기사",
    "individualPoint": 14,
    "expectedStats": {
      "STR": 70,
      "INT": 64,
      "AGI": 70,
      "VIT": 68
    }
  },
  {
    "jobName": "순수마법사",
    "individualPoint": 17,
    "expectedStats": {
      "STR": 66,
      "INT": 70,
      "AGI": 70,
      "VIT": 64
    }
  },
  {
    "jobName": "순수기사",
    "individualPoint": 12,
    "expectedStats": {
      "STR": 70,
      "INT": 67,
      "AGI": 70,
      "VIT": 68
    }
  },
  {
    "jobName": "순수마법사",
    "individualPoint": 9,
    "expectedStats": {
      "STR": 68,
      "INT": 70,
      "AGI": 70,
      "VIT": 66
    }
  },
  {
    "jobName": "순수기사",
    "individualPoint": 9,
    "expectedStats": {
      "STR": 70,
      "INT": 68,
      "AGI": 70,
      "VIT": 69
    }
  },
  {
    "jobName": "순수마법사",
    "individualPoint": 6,
    "expectedStats": {
      "STR": 69,
      "INT": 70,
      "AGI": 70,
      "VIT": 68
    }
  },
  {
    "jobName": "순수기사",
    "individualPoint": 6,
    "expectedStats": {
      "STR": 70,
      "INT": 69,
      "AGI": 70,
      "VIT": 70
    }
  },
  {
    "jobName": "순수마법사",
    "individualPoint": 4,
    "expectedStats": {
      "STR": 69,
      "INT": 70,
      "AGI": 70,
      "VIT": 69
    }
  },
  {
    "jobName": "순수기사",
    "individualPoint": 3,
    "expectedStats": {
      "STR": 70,
      "INT": 70,
      "AGI": 70,
      "VIT": 70
    }
  }
];

describe('7777 루트를 테스트한다', () => {
  it('7777루트 테스트', () => {
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
        console.error(`Stats mismatch at Step ${index + 1} (${jobName})`);
        console.error(`Expected:`, expectedStats);
        console.error(`Actual:`, currentStats);
        throw e;
      }
    });

    // const queryString = getCustomQueryFromRLL(rll);
    // console.log('Full Query String:', queryString);

    // expect(queryString).not.toContain('undefined');
  });
});
