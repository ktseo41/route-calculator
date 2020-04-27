import RouteLinkedList from "./src/lib/routeLinkedList";
import { Jobs } from "./src/database/job";
const r1 = new RouteLinkedList();

r1.add(Jobs.무도가);
r1.add(Jobs.투사);
r1.add(Jobs.검사);
r1.add(Jobs.검객);
r1.removeAt(2);
console.log(r1);
console.log(r1.get(1).accuStats);
r1.get(1).adjustJobPoint(2);
r1.get(1).adjustJobPoint(1);
