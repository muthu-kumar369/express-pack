import {
  get,
  set,
  merge,
  cloneDeep,
  isEmpty,
  omit,
  pick,
  uniqBy,
  debounce,
  DebouncedFunc,
} from "lodash-es";

import type { AnyObject, DebounceOptions } from "../types";

export class LodashHelper {
  static get<T = any>(obj: AnyObject, path: string, defaultVal?: T): T {
    return get(obj, path, defaultVal);
  }

  static set(obj: AnyObject, path: string, value: any): AnyObject {
    return set(obj, path, value);
  }

  static merge(target: AnyObject, ...sources: AnyObject[]): AnyObject {
    return merge(target, ...sources);
  }

  static cloneDeep<T = any>(value: T): T {
    return cloneDeep(value);
  }

  static isEmpty(value: any): boolean {
    return isEmpty(value);
  }

  static omit(obj: AnyObject, keys: string[]): AnyObject {
    return omit(obj, keys);
  }

  static pick(obj: AnyObject, keys: string[]): AnyObject {
    return pick(obj, keys);
  }

  static uniqBy<T = any>(array: T[], key: string): T[] {
    return uniqBy(array, key);
  }

  static debounce<T extends (...args: any[]) => any>(
    func: T,
    wait: number,
    options: DebounceOptions = {}
  ): DebouncedFunc<T> {
    return debounce(func, wait, options);
  }

  static getOrDefault<T = any>(
    obj: AnyObject,
    path: string,
    defaultVal: T = null as any
  ): T {
    return get(obj, path, defaultVal);
  }

  static hasNestedKeys(obj: AnyObject, paths: string[] = []): boolean {
    return paths.every((p) => get(obj, p) !== undefined);
  }

  static deepCloneAndSet(obj: AnyObject, path: string, value: any): AnyObject {
    const cloned = cloneDeep(obj);
    set(cloned, path, value);
    return cloned;
  }

  static compactObject(obj: AnyObject): AnyObject {
    return Object.fromEntries(
      Object.entries(obj).filter(
        ([, val]) => val !== null && val !== undefined && val !== ""
      )
    );
  }
}
