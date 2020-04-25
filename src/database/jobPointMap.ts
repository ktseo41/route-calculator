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

const jobPointMap: any = {};
jobPointMap["무도가"] = {
  "3": {
    INT: [-1, 10],
    VIT: [1, 30],
  },
  "5": {
    STR: [-1, 20],
  },
};
jobPointMap["투사"] = {
  "3": { STR: [1, 30] },
  "10": { AGI: [-1, 10], INT: [-1, 10], VIT: [1, 10] },
};

export default jobPointMap;
