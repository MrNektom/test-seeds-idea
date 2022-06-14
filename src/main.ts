import { SeedRoot } from './seeds'
import { button } from './seeds/elems/Button'
import { div } from "./seeds/elems/Div"
import { valueSignal } from './seeds/signals'
import './style.css'

const app = document.querySelector<HTMLDivElement>('#app')!


const bgColor = valueSignal("black")
const color = valueSignal("white")


new SeedRoot({
  el: app,
  children: [
    div({
      children: [
        button({
          text: "Button",
          style: {
            backgroundColor: bgColor,
            color,
          },
          onClick(this, _ev) {
            bgColor(bgColor() == "black" ? "white" : "black")
            color(color() == "green" ? "white" : "green")
          },
        }),
        div(),
      ]
    }),
  ],
})