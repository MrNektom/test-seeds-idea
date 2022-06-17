import { ValueSignal, effect } from "./signals";
import { Seed, SeedNode } from "./seed";

export interface IfProps {
  cond: ValueSignal<boolean>;
  then: () => SeedNode;
  else?: () => SeedNode;
}

interface IfNode extends SeedNode {
  then_node?: Node;
  else_node?: Node;
}

export function If(props: IfProps): IfNode {
  return {
    render(doc) {
      let n: Node;
      if (props.cond()) {
        n = props.then().render(doc);
        this.then_node = n;
      } else {
        n = (props.else || (() => Seed(8, " else ")))().render(doc);
        this.else_node = n;
      }
      this.node = n;
      effect(() => {
        if (!this.node) {
          return;
        }
        console.log(this.node);

        if (props.cond()) {
          if (!this.then_node) {
            this.then_node = props.then().render(doc);
          }
          this.node.parentNode?.replaceChild(this.then_node, this.node);
          this.node = this.then_node;
        } else {
          if (!this.else_node) {
            this.else_node = props.then().render(doc);
          }
          this.node.parentNode?.replaceChild(this.else_node, this.node);
          this.node = this.else_node;
        }
      }, [props.cond]);
      return n;
    },
  };
}
