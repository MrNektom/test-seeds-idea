import { valueSignal, ValueSignal } from "./seeds/signals";
import { Seed, SeedNode } from "./seeds/seed";
import "./App.css";
import { If } from "./seeds/lib";

function App(): SeedNode[] {
  const class_ = valueSignal<(string | ValueSignal<string>)[]>(["white"]);
  const cond = valueSignal(!true);
  return [
    Seed("button", {
      children: [Seed(3, "toggle")],
      classes: class_,
      attrs: {
        "data-set": "set_data",
      },
      onclick() {
        cond(!cond());
      },
    }),
    Seed("br"),
    If({
      cond,
      then: () => Seed(3, "Yes"),
      else: () => Seed(3, "No"),
    }),
  ];
}

export { App };
