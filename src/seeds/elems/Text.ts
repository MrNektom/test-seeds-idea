import { Seed } from "../seed";
import { ValueSignal } from "../signals";


export class Text extends Seed<globalThis.Text> {
    private data: string | ValueSignal = "";

    constructor(text: string | ValueSignal) {
        super();

        if (typeof text === "function") {
            text.on((value) => {
                if (this.node) {
                    this.node.data = String(value);
                }
            });
        } else {
            this.data = text;

        }
    }

    build(doc: Document) {
        this.node = doc.createTextNode(typeof this.data === "string" ? this.data : this.data());

        return this.node;
    }
}

export function text(text: string | ValueSignal) {
    return new Text(text);
}
