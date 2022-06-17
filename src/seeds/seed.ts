import { events, ValueSignal, effect } from "./signals";

type GEHKeys = keyof Omit<
  GlobalEventHandlers,
  "removeEventListener" | "addEventListener"
>;

type CSSStyleMapKeys = keyof Omit<
  CSSStyleDeclaration,
  | number
  | "length"
  | "parentRule"
  | "getPropertyPriority"
  | "getPropertyValue"
  | "getPropertyValue"
  | "item"
  | "removeProperty"
  | "setProperty"
>;

export interface SeedFn {
  <T extends keyof HTMLElementTagNameMap>(
    tag: T,
    props?: SeedElementProps
  ): SeedElement<T>;
  <T extends keyof HTMLElementTagNameMap>(
    type: 1,
    tag: T,
    props?: SeedElementProps
  ): SeedElement<T>;
  (type: 3, text?: string): SeedText;
  (type: 8, comment: string): SeedNode;
}

function createSeedElement<K extends keyof HTMLElementTagNameMap>(
  tag: K,
  props: SeedElementProps = {}
): SeedElement<K> {
  return {
    style: props.style || {},
    render(this, doc: Document) {
      console.log(props);
      if (this.elem) {
        return this.elem;
      }
      this.elem = doc.createElement(tag);
      if (props && props.children) {
        if (!Array.isArray(props.children)) {
          props.children = [props.children];
        }
        this.elem.append(...props.children.map((child) => child.render(doc)));
      }
      (Object.keys(this.style) as CSSStyleMapKeys[]).forEach((key) => {
        const prop = this.style[key];
        if (prop !== undefined && this.elem) {
          if (typeof prop === "string") {
            this.elem.style[key] = prop;
          } else {
            this.elem.style[key] = prop();
            events.addEventListener(prop.key, () => {
              if (this.elem) this.elem.style[key] = prop();
            });
          }
        }
      });
      (Object.keys(props) as (keyof SeedElementProps)[]).forEach((key) => {
        const handler = props[key];

        if (startsWith(key, "on") && this.elem && handler) {
          console.log(key, handler);
          this.elem.addEventListener(key.slice(2), handler as EventListener);
        } else if (
          !startsWith(key, "on") &&
          key !== "style" &&
          key !== "children"
        ) {
          key;
        }
      });
      if (props.attrs) {
        (Object.keys(props.attrs) as (keyof SeedElementAttrs)[]).forEach(
          (key) => {
            if (!props.attrs || !this.elem) {
              return;
            }
            const attr = props.attrs[key];
            if (typeof attr === "string") {
              this.elem.setAttribute(String(key), attr);
            } else {
              effect(() => {
                if (!this.elem) {
                  return;
                }
                this.elem.setAttribute(String(key), attr());
              }, [attr]);
              this.elem.setAttribute(String(key), attr());
            }
          }
        );
      }
      if (props.classes) {
        const handleClasses = (classes: (string | ValueSignal)[]) => {
          classes.forEach((_class) => {
            if (this.elem) {
              this.elem.className = classes
                .map((clazz) => (typeof clazz === "string" ? clazz : clazz()))
                .join(" ");
            }
          });
        };
        const classes = props.classes;
        if (Array.isArray(classes)) {
          handleClasses(classes);
        } else {
          const handle = () => {
            const _classes = classes();
            handleClasses(_classes);
          };
          handle();
          effect(handle, [classes]);
        }
      }
      return this.elem;
    },
  };
}

function createTextNode(text: string = ""): SeedText {
  return {
    render(doc) {
      return doc.createTextNode(text);
    },
  };
}

export const Seed: SeedFn = function <T extends Tags>(
  type: T | number,
  tag?: SeedElementProps | T,
  props?: SeedElementProps
): any {
  if (typeof type === "string") {
    return createSeedElement(type, typeof tag === "object" ? tag : undefined);
  } else if (typeof type === "number") {
    if (type === 1 && tag !== undefined && typeof tag === "string") {
      return createSeedElement(tag, props);
    } else if (type === 3) {
      return createTextNode(typeof tag === "string" ? tag : "");
    } else if (type === 8) {
      return {
        render(doc: Document) {
          return doc.createComment(tag as string);
        },
      };
    }
  }
  return {
    render(doc: Document) {
      return doc.createComment("Method not inplemented");
    },
  };
};

function startsWith<T extends string>(
  str: string,
  match: T
): str is `${T}${string}` {
  return str.startsWith(match);
}
// function endsWith<T extends string>(str: string, match: T): str is `${string}${T}`  {
//     return str.endsWith(match)
// }

type Tags = keyof HTMLElementTagNameMap;

export interface SeedNode {
  node?: Node;
  render(doc: Document): Node;
}

export interface SeedText extends SeedNode {
  node?: Text;
}

export interface SeedElement<K extends keyof HTMLElementTagNameMap>
  extends SeedNode {
  style: CSSStyleMap;
  elem?: HTMLElementTagNameMap[K];
  render(doc: Document): HTMLElementTagNameMap[K];
}

export type CSSStyleMap = {
  [Property in CSSStyleMapKeys]?: string | ValueSignal<string>;
};

export interface SeedElementAttrs {
  [attr: string]: string | ValueSignal;
}

export type SeedProps = {
  [k in GEHKeys]?: GlobalEventHandlers[k];
} & {
  children?: SeedNode | SeedNode[];
  classes?: (string | ValueSignal)[] | ValueSignal<(string | ValueSignal)[]>;
};

export interface SeedElementProps extends SeedProps {
  style?: CSSStyleMap;
  attrs?: SeedElementAttrs;
}
