import { Jobs } from "../database/job";
/* 방식

직업 : {
    level당 : [STR변화, AGI변화, INT변화, VIT변화]
}

STR변화 = [-1, 20] // 레벨당 1감소, 최대 20까지 감소

*/

export enum Stat {
  STR = "STR",
  AGI = "AGI",
  INT = "INT",
  VIT = "VIT",
}

export interface Stats {
  STR: number;
  AGI: number;
  INT: number;
  VIT: number;
}

export type Intervals =
  | "1"
  | "2"
  | "3"
  | "4"
  | "5"
  | "6"
  | "7"
  | "8"
  | "9"
  | "10";

type Delta = 1 | -1;
type Limit = 10 | 20 | 30 | 40 | 50 | 60 | 70;

export type DeltaInfo = [Delta, Limit];

export type StatMap = {
  [stat in Stat]?: DeltaInfo;
};

export type EachJobPointMap = {
  [interval in Intervals]?: StatMap;
};

export type JobPointMap = {
  [Job in Jobs]?: EachJobPointMap;
};

const jobPointMap: JobPointMap = {};
jobPointMap[Jobs.무도가] = {
  "3": {
    INT: [-1, 10],
    VIT: [1, 30],
  },
  "5": {
    STR: [-1, 20],
  },
};

jobPointMap[Jobs.투사] = {
  "3": { STR: [1, 30] },
  "10": { AGI: [-1, 10], INT: [-1, 10], VIT: [1, 10] },
};

jobPointMap[Jobs.전사] = {
  "4": { STR: [1, 30] },
  "8": { INT: [-1, 10] },
  "9": { AGI: [-1, 10] },
  "10": { VIT: [1, 10] },
};

jobPointMap[Jobs.검사] = {
  "3": { STR: [1, 30] },
  "8": { AGI: [-1, 10] },
  "10": { INT: [1, 10] },
};

jobPointMap[Jobs.검객] = {
  "4": { AGI: [1, 30] },
  "10": { STR: [1, 10], INT: [-1, 10] },
};

jobPointMap[Jobs.악사] = {
  "1": { STR: [-1, 10] },
  "4": { INT: [1, 30], VIT: [-1, 10] },
  "10": { AGI: [1, 10] },
};

jobPointMap[Jobs.궁사] = {
  "3": { AGI: [1, 30] },
  "5": { INT: [-1, 10] },
  "8": { VIT: [-1, 10] },
  "10": { STR: [1, 10] },
};

jobPointMap[Jobs.자객] = {
  "5": { INT: [-1, 10] },
  "6": { AGI: [1, 20] },
  "7": { STR: [1, 20] },
};

jobPointMap[Jobs.네크로멘서] = {
  "1": { STR: [-1, 10], AGI: [-1, 10], INT: [1, 50], VIT: [-1, 10] },
};

jobPointMap[Jobs.모험가] = {
  "3": { VIT: [1, 30] },
  "10": { INT: [1, 10], STR: [1, 10], AGI: [1, 10] },
};

jobPointMap[Jobs.상인] = {
  "2": { STR: [-1, 10] },
  "4": { AGI: [1, 30] },
  "10": { VIT: [1, 10], INT: [1, 10] },
};

jobPointMap[Jobs.순수기사] = {
  "3": { STR: [1, 70], VIT: [1, 70] },
  "5": { INT: [-1, 20] },
  "9": { AGI: [1, 30] },
};

jobPointMap[Jobs.빛의기사] = {
  "5": { STR: [1, 60], VIT: [1, 60] },
  "6": { AGI: [-1, 20] },
  "10": { INT: [1, 40] },
};

jobPointMap[Jobs.어둠의기사] = {
  "5": { STR: [1, 60], VIT: [1, 60] },
  "6": { AGI: [-1, 20] },
  "10": { INT: [1, 40] },
};

jobPointMap[Jobs.순수마법사] = {
  "3": { INT: [1, 70] },
  "4": { AGI: [1, 60] },
  "5": { STR: [-1, 20], VIT: [-1, 20] },
};

jobPointMap[Jobs.빛의마법사] = {
  "5": { AGI: [1, 60], INT: [1, 60] },
  "6": { VIT: [-1, 20] },
  "10": { STR: [1, 40] },
};

jobPointMap[Jobs.어둠의마법사] = {
  "5": { AGI: [1, 60], INT: [1, 60] },
  "6": { VIT: [-1, 20] },
  "10": { STR: [1, 40] },
};

jobPointMap[Jobs.탐색가] = {
  "3": { AGI: [1, 70] },
  "8": { INT: [-1, 20] },
  "9": { VIT: [-1, 20] },
  "10": { STR: [1, 20] },
};

jobPointMap[Jobs.자연인] = {
  "3": { VIT: [1, 40] },
  "5": { INT: [-1, 20] },
  "7": { AGI: [1, 40] },
  "9": { STR: [1, 30] },
};

jobPointMap[Jobs.음유시인] = {
  "4": { AGI: [1, 50], VIT: [1, 50] },
  "5": { INT: [-1, 20] },
  "10": { STR: [1, 20] },
};

jobPointMap[Jobs.정령술사] = {
  "4": { AGI: [1, 50], VIT: [1, 50] },
  "5": { INT: [-1, 20] },
  "10": { STR: [1, 20] },
};

export default jobPointMap;
