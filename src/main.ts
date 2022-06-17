import { App } from './App'
import { SeedRoot } from './seeds'
import './style.css'

const app = document.querySelector<HTMLDivElement>('#app')!

new SeedRoot({
  el: app,
  children: App(),
})