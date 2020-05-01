## elancia route calculator

### RouteNode interface

```ts
interface RouteNodeConstructor {
  new (job: Jobs);
}
interface RouteNode {
  job: Jobs;
  jobPo: number;
  stats: Stats;
  currentJobPos: CurrentJobPoints;
  prev: this | null;
  next: this | null;
  adjustJobPoint(jobPoDelta: number): void;
  getPrevs(): void;
  recalculate(): void;
}
```

### RouteNode

| RouteNode 멤버 변수 | 특징                                                                                                                                                                                                             |
| ------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| job                 | 해당 노드의 직업                                                                                                                                                                                                 |
| jobPo               | 해당 노드 고유의 잡포인트 변화량. currentJobPos는 이전 노드가 추가되거나 변경이 있을 때 변경을 반영하지만 jobPo는 일단 유지하는데 이전 노드의 변경에 따른 현재 노드의 잡포인트 변화량을 다시 계산할 때 사용한다. |
| stats               | 이전 노드가 있으면 이전 노드의 스탯을 가져왔다가, 스탯 변경이 있으면 변경사항에 맞춰 변경한다.                                                                                                                   |
| currentJobPos       | 이전 노드가 있으면 이전 노드까지의 잡포인트 누적을 가져왔다가, 잡포인트 변경사항이 있으면 변경을 반영한다.                                                                                                       |

### 디자인 참고

- figma
- happy hues
