export interface ValueSignalGetter<T = any> {
  (): T;
}

export interface ValueSignalSetter<T> {
  (value: T): void;
}

export interface ValueSignal<T = any>
  extends ValueSignalGetter<T>,
    ValueSignalSetter<T> {
  getter: ValueSignalGetter<T>;
  setter: ValueSignalSetter<T>;
  get key(): string;
}

export interface ValueSignalUpdateHandler<T> {
  (value: T): void;
}

export function valueSignal<T>(initialValue: T): ValueSignal<T> {
  let _val = initialValue;
  const id = idGenerator.next().value;
  const signal: any = function (_v: T | void): T | void {
    if (_v === undefined) {
      return _val;
    } else {
      _val = _v;
      events.dispatchEvent(new CustomEvent(id, { detail: _v }));
    }
  };
  Object.defineProperty(signal, "key", {
    get() {
      return id;
    },
  });
  events.addEventListener;

  return signal;
}

export function effect(cb: () => void, deps: ValueSignal[]) {
  function handler() {
    cb();
  }
  deps.forEach((dep) => {
    events.addEventListener(dep.key, handler);
  });
}

export const events = new EventTarget();
const idGenerator = idGen();

function* idGen(): Generator<string, string> {
  let id = 0;
  while (true) {
    yield (id++).toString(36);
  }
}
