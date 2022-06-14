import { Seed } from "./seed";

interface SeedRootProps {
    el?: HTMLElement
    children?: Seed | Seed[]
}


export class SeedRoot {
    private root?: HTMLElement;
    private children?: Seed | Seed[];
    constructor({ el, children }: SeedRootProps) {
        this.children = children;
        if (el) {
            this.mount(el);
        }
    }

    mount(el: HTMLElement) {
        this.root = el;
        const doc = ((el: Node) => {
            while (el.parentNode) {
                el = el.parentNode
            }
            return el as Document
        })(this.root);
        this.root.innerHTML = ""
        if (this.children) {

            if (Array.isArray(this.children)) {
                this.root.append(...this.children.flatMap((child) => child.render(doc)))
            } else {
                this.root.append(this.children.render(doc))
            }
        }
    }
}