export type AnyObject = Record<string, any>;

export type DebounceOptions = {
  leading?: boolean;
  maxWait?: number;
  trailing?: boolean;
};

export interface ILodashHelper {
  get<T = any>(obj: AnyObject, path: string, defaultVal?: T): T;
  set(obj: AnyObject, path: string, value: any): AnyObject;
  merge(target: AnyObject, ...sources: AnyObject[]): AnyObject;
  cloneDeep<T = any>(value: T): T;
  isEmpty(value: any): boolean;
  omit(obj: AnyObject, keys: string[]): AnyObject;
  pick(obj: AnyObject, keys: string[]): AnyObject;
  uniqBy<T = any>(array: T[], key: string): T[];
  debounce<T extends (...args: any[]) => any>(
    func: T,
    wait: number,
    options?: DebounceOptions
  ): (...args: Parameters<T>) => ReturnType<T>;
  getOrDefault<T = any>(obj: AnyObject, path: string, defaultVal?: T): T;
  hasNestedKeys(obj: AnyObject, paths: string[]): boolean;
  deepCloneAndSet(obj: AnyObject, path: string, value: any): AnyObject;
  compactObject(obj: AnyObject): AnyObject;
}
