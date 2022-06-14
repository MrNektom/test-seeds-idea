import { SeedElement, SeedElementProps } from "../seed";
import { ValueSignal } from "../signals";


export interface ButtonProps extends SeedElementProps {
    text?: string | ValueSignal
}

export function button(props: ButtonProps) {
    return new Button(props);
}

export class Button extends SeedElement<HTMLButtonElement> {

    private data?: string | ValueSignal;

    constructor({ text }: ButtonProps = {}) {
        super(arguments[0]);

        this.data = text;

    }

    build(doc: Document) {
        const btn = doc.createElement("button");
        if (typeof this.data === "function") {
            this.data.on((value) => {
                btn.innerText = String(value);
            });
        } else {
            btn.innerText = String(this.data);
        }
        return btn;
    }
}
