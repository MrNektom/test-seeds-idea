import { ValueSignal } from "./signals"

export interface SeedProps {
    children?: Seed | Seed[]
    onClick?: GlobalEventHandlers["onclick"]
    onMouseDown?: GlobalEventHandlers["onmousedown"]
    onMouseUp?: GlobalEventHandlers["onmouseup"]
    onMouseMove?: GlobalEventHandlers["onmousemove"]

    [k: string]: any
}

export abstract class Seed<T extends Node = Node> {
    node?: T
    props: SeedProps
    constructor(props: SeedProps = {}) {
        this.props = props;
    }
    render(doc: Document) {
        if (!this.node) {
            this.node = this.build(doc);

            Object.keys(this.props).forEach((key) => {
                if (key.startsWith("on")) {

                    this.node?.addEventListener(key.slice(2).toLowerCase(), this.props[key])
                }
            })
        }
        return this.node;
    }
    abstract build(doc: Document): T;
}




export interface SeedElementProps extends SeedProps {
    style?: CSSStyleMap
}

export abstract class SeedElement<T extends (HTMLElement | SVGElement)> extends Seed<T> {
    style?: CSSStyleDeclaration

    declare props: SeedElementProps;
    constructor(props: SeedElementProps = {}) {
        super(props)
    }
    render(doc: Document): T {
        const elem = super.render(doc);
        this.style = elem.style;
        if (this.props.style) {
            (Object.keys(this.props.style) as CSSStyleMapKeys[]).forEach((key) => {
                if (!this.props.style || !this.style) {
                    return
                }
                const prop = this.props.style[key];
                if (typeof prop === "string") {
                    this.style[key] = prop
                } else if (typeof prop === "function") {
                    this.style[key] = prop();
                    prop.on((value) => { if (this.style) this.style[key] = value })
                }
            })

        }
        return elem
    }
}



type CSSStyleMapKeys = keyof Omit<CSSStyleDeclaration, number | "length" | "parentRule" | "getPropertyPriority" | "getPropertyValue" | "getPropertyValue" | "item" | "removeProperty" | "setProperty">

type CSSStyleMap = {
    [Property in CSSStyleMapKeys]?: string | ValueSignal<string>
}