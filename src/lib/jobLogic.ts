import { Jobs } from "../database/job";
import jobPointMap, { Stat } from "../database/jobPointMap";

export type CurrentJobPoints = {
  [job in Jobs]?: number;
};

/*
{
  '무도가': 0,
  '투사': 0,
  '전사': 0,
  '검사': 0,
  '검객': 0,
  '악사': 0,
  '궁사': 0,
  '자객': 0,
  '네크로멘서': 0,
  '모험가': 0,
  '상인': 0,
  '순수기사': 0,
  '빛의기사': 0,
  '어둠의기사': 0,
  '순수마법사': 0,
  '빛의마법사': 0,
  '어둠의마법사': 0,
  '탐색가': 0,
  '자연인': 0,
  '음유시인': 0,
  '정령술사': 0
}
*/

export default function (job: Jobs, jobPoint: number) {
  const statResult = {
    STR: 0,
    AGI: 0,
    INT: 0,
    VIT: 0,
  };

  Object.keys(jobPointMap[job]).forEach((interval) => {
    if (jobPoint < +interval) return;

    for (const key in jobPointMap[job][interval]) {
      if (jobPointMap[job][interval].hasOwnProperty(key) && isStat(key)) {
        // statResult[key] += 1;
        const element = jobPointMap[job][interval][key];
      }
    }
  });
}

function isStat(key: string) {
  return key in Stat;
}
