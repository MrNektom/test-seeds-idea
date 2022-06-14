export interface ValueSignal<T = any> {
    (): T
    (value: T): void
    on(cb: ValueSignalUpdateHandler<T>): void
    off(cb: ValueSignalUpdateHandler<T>): void
}


export interface ValueSignalUpdateHandler<T> {
    (value: T): void
}

export function valueSignal<T>(initialValue: T): ValueSignal<T> {
    let _val = initialValue;
    const subscribers: ValueSignalUpdateHandler<T>[] = []

    const signal: any = function (_v: T | void): T | void {
        if (_v === undefined) {
            return _val
        } else {
            _val = _v
            subscribers.forEach((cb) => cb(_v))
        }
    }
    signal.on = function (cb: ValueSignalUpdateHandler<T>) {
        if (!subscribers.includes(cb)) {
            subscribers.push(cb)
        }
    }

    signal.off = function (cb: ValueSignalUpdateHandler<T>) {
        const index = subscribers.indexOf(cb)
        if (index > -1) {
            subscribers.splice(index, 1);
        }
    }

    return signal;
}