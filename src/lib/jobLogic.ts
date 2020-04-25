import { Jobs } from "../database/job";
import jobPointMap, { Stat } from "../database/jobPointMap";

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
