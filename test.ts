import RouteLinkedList from "./src/lib/routeLinkedList";
import { Jobs } from "./src/database/job";
const r1 = new RouteLinkedList();

r1.add(Jobs.무도가);
r1.get(1).adjustJobPoint(2);
r1.get(1).adjustJobPoint(1);
r1.get(1).adjustJobPoint(97);
r1.add(Jobs.투사);
console.log("prevstats", r1.get(2).prev.Stats);
console.log("stats", r1.get(2).Stats);
r1.removeAt(2);
r1.add(Jobs.검객);
r1.get(2).adjustJobPoint(100);
r1.add(Jobs.검사);
r1.get(3).adjustJobPoint(100);
r1.add(Jobs.순수마법사);
r1.get(4).adjustJobPoint(100);
console.log(r1);
