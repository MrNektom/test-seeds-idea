import { Seed, SeedProps } from "../seed";


export interface DivProps extends SeedProps { }

export class Div extends Seed {

    private children: Seed[];

    constructor({ children }: DivProps = {}) {
        super();
        if (children) {
            if (!Array.isArray(children)) {
                this.children = [children];
            } else {
                this.children = children;
            }
        } else {
            this.children = [];
        }
    }

    build(doc: Document): Node {
        const elem = doc.createElement("div");
        const r_c = this.children.flatMap((child) => child.render(doc));
        elem.append(...r_c);
        return elem;
    }
}

export function div(props: DivProps = {}) {
    return new Div(props);
}
