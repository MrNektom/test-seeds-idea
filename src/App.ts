import { valueSignal, ValueSignal } from "./seeds/signals";
import { SeedNode } from "./seeds/seed";
import "./App.css";
import { button, If, text, br } from "./seeds/lib";

function App(): SeedNode[] {
  const class_ = valueSignal<(string | ValueSignal<string>)[]>(["white"]);
  const cond = valueSignal(!true);
  return [
    button({
      children: [text("toggle")],
      classes: class_,
      attrs: {
        "data-set": "set_data",
      },
      onclick() {
        cond(!cond());
      },
    }),
    br(),
    If({
      cond,
      then: () => text("Yes"),
      else: () => text("No"),
    }),
  ];
}

export { App };
