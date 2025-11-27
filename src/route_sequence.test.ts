
import { describe, it, expect } from 'vitest';
import { NumberedJobs, Jobs } from './database/job';
import { CustomSystem } from './database/customsystem';
import RouteLinkedList from './lib/routeLinkedList';
import { getCustomQueryFromRLL } from './lib/routeUtils';

// Extracted from docs/route.html
// Format: [JobName, CumulativeJobPoint]
const routeSequence: [string, string][] = [
  ['상인', '100'],
  ['자객', '100'],
  ['투사', '100'],
  ['궁사', '100'],
  ['무도가', '100'],
  ['모험가', '30'], 
  ['자연인', '69'], 
  ['전사', '100'],
  ['악사', '100'],
  ['검사', '100'],
  ['탐색가', '69'], 
  ['어둠의마법사', '100'],
  ['모험가', '75'], 
  ['자연인', '100'],
  ['빛의기사', '100'],
  ['빛의마법사', '100'],
  ['어둠의기사', '99'], 
  ['순수마법사', '30'],
  ['어둠의기사', '100'],
  ['순수기사', '45'],
  ['순수마법사', '57'],
  ['순수기사', '55'],
  ['순수마법사', '64'],
  ['탐색가', '100'],
  ['순수기사', '69'],
  ['탐색가', '100'],
  ['순수기사', '69'],
  ['순수마법사', '81'],
  ['순수기사', '69'],
  ['순수마법사', '81'],
  ['순수기사', '81'],
  ['순수마법사', '90'],
  ['순수기사', '90'],
  ['순수마법사', '96'],
  ['순수기사', '96'],
  ['순수마법사', '100'],
  ['순수기사', '100'],
];

describe('Full Route Sequence Verification', () => {
  it('should successfully generate URL and verify final stats', () => {
    const rll = new RouteLinkedList();
    const cumulativePoints: Record<string, number> = {};

    routeSequence.forEach(([jobName, cumulativePointStr], index) => {
      const targetCumulativePoint = parseInt(cumulativePointStr, 10);
      const currentCumulativePoint = cumulativePoints[jobName] || 0;
      
      // Calculate incremental point
      let incrementalPoint = targetCumulativePoint - currentCumulativePoint;
      
      // If incremental point is 0 or negative, it might mean the user just visited the node without adding points?
      // Or maybe the data in HTML is just reporting the state at that row.
      // But RouteLinkedList.add creates a NEW node.
      // If we add a node with 0 points, it's just a job change without points?
      // But usually we add points.
      
      // However, looking at the data:
      // ['순수기사', '69'] -> ['순수기사', '69'] (next one)
      // This implies 0 increase.
      
      if (incrementalPoint < 0) {
          console.warn(`Warning: Negative incremental point for ${jobName} at index ${index}. Target: ${targetCumulativePoint}, Current: ${currentCumulativePoint}`);
          incrementalPoint = 0; // Should not happen based on logic, but safety.
      }

      console.log(`Step ${index + 1}: Adding ${jobName} with incremental point ${incrementalPoint} (Total: ${targetCumulativePoint})`);

      rll.add(jobName as Jobs);
      rll.tail!.adjustJobPoint(incrementalPoint);
      
      // Update cumulative points
      cumulativePoints[jobName] = targetCumulativePoint;
    });

    const queryString = getCustomQueryFromRLL(rll);
    console.log('Full Query String:', queryString);

    expect(queryString).not.toContain('undefined');
    
    // Verify Final Stats
    // Expected: STR 70, INT 69, DEX 70, VIT 70
    // Based on user input: "순수기사 ... 100 ... 잡포 100 이면 인트 69됨"
    const finalStats = rll.tail!.stats;
    console.log('Final Stats:', finalStats);
    
    expect(finalStats.STR).toBe(70);
    expect(finalStats.INT).toBe(69);
    expect(finalStats.AGI).toBe(70); // DEX is mapped to AGI in the code? Let's check jobPointMap.ts or just assume AGI based on standard RPG stats usually being STR/AGI/VIT/INT or STR/DEX/INT/VIT.
    // In jobPointMap.ts (viewed earlier), Stats interface has STR, INT, AGI, VIT.
    // User said "민첩" (Agility/Dexterity).
    expect(finalStats.VIT).toBe(70);
  });
});
